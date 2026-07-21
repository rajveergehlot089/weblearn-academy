// Consolidated Progress API — handles all /api/progress/* routes
const db = require('./lib/db');
const { requireAuth, setCorsHeaders, handleOptions } = require('./lib/auth');
const { getCourseTopics } = require('./lib/content');

module.exports = async (req, res) => {
  setCorsHeaders(res);
  if (handleOptions(req, res)) return res.status(200).end();

  await db.initSchema();

  const user = await requireAuth(req, res);
  if (!user) return;

  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace(/^\/api\/progress/, '');

  try {
    // ============================================
    // GET /api/progress/summary
    // ============================================
    if (req.method === 'GET' && path === '/summary') {
      const courseId = url.searchParams.get('courseId')
        || await getActiveCourse(user.id)
        || 'web-development';
      const topics = getCourseTopics(courseId);
      const mode = user.mode || 'fast-track';

      const allProgress = await db.query(
        'SELECT * FROM topic_progress WHERE "userId"=$1 AND "courseId"=$2',
        [user.id, courseId]
      );
      const progressMap = {};
      allProgress.forEach(p => { progressMap[p.topicId] = p; });

      const totalTopics = topics.length;
      const completedTopics = topics.filter(t => {
        const p = progressMap[t.id];
        return p && p.quickDone && p.deepDone;
      }).length;
      const percentComplete = totalTopics > 0
        ? Math.round((completedTopics / totalTopics) * 100)
        : 0;

      const currentTopicId = allProgress.length > 0
        ? allProgress
            .sort((a, b) => (b.lastAccessed || '').localeCompare(a.lastAccessed || ''))[0]
            ?.topicId
        : (topics[0]?.id || '');
      const currentTopic = topics.find(t => t.id === currentTopicId);
      const currentDay = currentTopic
        ? (mode === 'fast-track'
            ? currentTopic.day_fast_track
            : currentTopic.day_full_course) || 1
        : 1;

      const totalDays = topics.length > 0
        ? (mode === 'fast-track'
            ? Math.max(...topics.map(t => t.day_fast_track || 1))
            : Math.max(...topics.map(t => t.day_full_course || 1)))
        : (mode === 'fast-track' ? 10 : 20);

      const dailyLogs = await db.query(
        'SELECT date FROM daily_log WHERE "userId"=$1',
        [user.id]
      );
      const logDates = new Set(dailyLogs.map(d => d.date));
      let streak = 0;
      let checkDate = new Date();
      while (true) {
        const ds = checkDate.toISOString().split('T')[0];
        if (logDates.has(ds)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else break;
      }

      const typingScoresList = await db.query(
        'SELECT * FROM typing_scores WHERE "userId"=$1 AND "courseId"=$2',
        [user.id, courseId]
      );
      const typingScores = {};
      typingScoresList.forEach(s => { typingScores[s.topicId] = s; });

      const topicsFormatted = {};
      allProgress.forEach(p => {
        topicsFormatted[p.topicId] = {
          quickDone: !!p.quickDone,
          deepDone: !!p.deepDone,
          ...JSON.parse(p.extraData || '{}'),
        };
      });

      return res.json({
        mode, courseId, currentDay, totalDays,
        percentComplete, completedTopics, totalTopics,
        streak, topics: topicsFormatted,
        currentTopicId, typingScores,
      });
    }

    // ============================================
    // POST /api/progress/topic/:id
    // ============================================
    const topicMatch = path.match(/^\/topic\/([^/]+)$/);
    if (req.method === 'POST' && topicMatch) {
      const topicId = topicMatch[1];
      const { courseId, quickDone, deepDone, ...rest } = req.body;
      const cid = courseId || await getActiveCourse(user.id) || 'web-development';
      const extraData = { ...rest };

      const existing = await db.one(
        'SELECT * FROM topic_progress WHERE "userId"=$1 AND "courseId"=$2 AND "topicId"=$3',
        [user.id, cid, topicId]
      );

      if (existing) {
        const mergedExtra = { ...JSON.parse(existing.extraData || '{}'), ...extraData };
        const updates = [];
        const params = [];
        let i = 1;

        if (quickDone !== undefined) {
          updates.push(`"quickDone"=$${i++}`);
          params.push(quickDone);
        }
        if (deepDone !== undefined) {
          updates.push(`"deepDone"=$${i++}`);
          params.push(deepDone);
        }
        updates.push(`"extraData"=$${i++}`);
        params.push(JSON.stringify(mergedExtra));
        updates.push(`"lastAccessed"=$${i++}`);
        params.push(new Date().toISOString());
        params.push(user.id, cid, topicId);
        await db.run(
          `UPDATE topic_progress SET ${updates.join(', ')} WHERE "userId"=$${i - 2} AND "courseId"=$${i - 1} AND "topicId"=$${i}`,
          params
        );
      } else {
        await db.run(
          'INSERT INTO topic_progress ("userId","courseId","topicId","quickDone","deepDone","extraData","lastAccessed") VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [user.id, cid, topicId, quickDone || false, deepDone || false, JSON.stringify(extraData), new Date().toISOString()]
        );
      }

      const today = new Date().toISOString().split('T')[0];
      await logDailyActivity(user.id, today, 0, topicId);
      return res.json({ ok: true });
    }

    // ============================================
    // POST /api/progress/typing-score
    // ============================================
    if (req.method === 'POST' && path === '/typing-score') {
      const { courseId, topicId, wpm, accuracy, timeLimit } = req.body;
      if (!courseId || wpm == null)
        return res.status(400).json({ error: 'courseId and wpm required' });
      const tid = topicId || 'overall';
      const now = new Date().toISOString();

      const existing = await db.one(
        'SELECT "topicId" FROM typing_scores WHERE "userId"=$1 AND "courseId"=$2 AND "topicId"=$3',
        [user.id, courseId, tid]
      );
      if (existing) {
        await db.run(
          'UPDATE typing_scores SET "bestWpm"=GREATEST("bestWpm",$1),"bestAccuracy"=GREATEST("bestAccuracy",$2),"lastWpm"=$1,"lastAccuracy"=$2,attempts=attempts+1,"lastAttempt"=$3,"timeLimit"=$4 WHERE "userId"=$5 AND "courseId"=$6 AND "topicId"=$7',
          [wpm, accuracy || 0, now, timeLimit || 60, user.id, courseId, tid]
        );
      } else {
        await db.run(
          'INSERT INTO typing_scores ("userId","courseId","topicId","bestWpm","bestAccuracy","lastWpm","lastAccuracy",attempts,"timeLimit","lastAttempt") VALUES ($1,$2,$3,$4,$5,$6,$7,1,$8,$9)',
          [user.id, courseId, tid, wpm, accuracy || 0, wpm, accuracy || 0, timeLimit || 60, now]
        );
      }
      return res.json({ ok: true });
    }

    // ============================================
    // POST /api/progress/topic/:id/interview
    // ============================================
    const interviewMatch = path.match(/^\/topic\/([^/]+)\/interview$/);
    if (req.method === 'POST' && interviewMatch) {
      const topicId = interviewMatch[1];
      const { questionIndex, correct, courseId } = req.body;
      const cid = courseId || await getActiveCourse(user.id) || 'web-development';
      await db.run(
        'INSERT INTO interview_progress ("userId","courseId","topicId","questionIndex",correct) VALUES ($1,$2,$3,$4,$5) ON CONFLICT ("userId","courseId","topicId","questionIndex") DO UPDATE SET correct=$5',
        [user.id, cid, topicId, questionIndex, correct]
      );
      return res.json({ ok: true });
    }

    // ============================================
    // POST /api/progress/topic/:id/exercise
    // ============================================
    const exerciseMatch = path.match(/^\/topic\/([^/]+)\/exercise$/);
    if (req.method === 'POST' && exerciseMatch) {
      const topicId = exerciseMatch[1];
      const { exerciseIndex, correct, courseId } = req.body;
      const cid = courseId || await getActiveCourse(user.id) || 'web-development';
      await db.run(
        'INSERT INTO exercise_progress ("userId","courseId","topicId","exerciseIndex",correct) VALUES ($1,$2,$3,$4,$5) ON CONFLICT ("userId","courseId","topicId","exerciseIndex") DO UPDATE SET correct=$5',
        [user.id, cid, topicId, exerciseIndex, correct]
      );
      return res.json({ ok: true });
    }

    // ============================================
    // POST /api/progress/log
    // ============================================
    if (req.method === 'POST' && path === '/log') {
      const { minutes, topicId } = req.body;
      const today = new Date().toISOString().split('T')[0];
      await logDailyActivity(user.id, today, minutes || 0, topicId);
      return res.json({ ok: true });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).json({ error: 'Failed' });
  }
};

// ============================================
// Helpers
// ============================================

async function getActiveCourse(userId) {
  const row = await db.one(
    'SELECT "activeCourse" FROM enrollments WHERE "userId" = $1',
    [userId]
  );
  return row?.activeCourse || null;
}

async function logDailyActivity(userId, date, minutes = 0, topicId) {
  const existing = await db.one(
    'SELECT "topicsVisited" FROM daily_log WHERE "userId"=$1 AND date=$2',
    [userId, date]
  );
  const visited = existing ? JSON.parse(existing.topicsVisited || '[]') : [];
  if (topicId && !visited.includes(topicId)) visited.push(topicId);

  if (existing) {
    await db.run(
      'UPDATE daily_log SET "minutesSpent" = "minutesSpent" + $1, "topicsVisited"=$2 WHERE "userId"=$3 AND date=$4',
      [minutes, JSON.stringify(visited), userId, date]
    );
  } else {
    await db.run(
      'INSERT INTO daily_log ("userId",date,"minutesSpent","topicsVisited") VALUES ($1,$2,$3,$4)',
      [userId, date, minutes, JSON.stringify(visited)]
    );
  }
}

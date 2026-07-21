// ============================================
// Topics Routes (PostgreSQL-backed)
// ============================================
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

const coursesContent = require('../content/index');
const topics = Object.values(coursesContent).flat();
const modes = require('../content/modes');

function readContentJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

// GET /api/topics
router.get('/', auth, (req, res) => {
  const mode = req.user.mode || 'fast-track';
  const modeConfig = modes[mode];

  const topicList = topics.map(t => ({
    id: t.id,
    title: t.title,
    description: t.description,
    icon: t.icon,
    dayNumber: mode === 'fast-track' ? t.day_fast_track : t.day_full_course,
    group: t.group
  }));

  topicList.sort((a, b) => a.dayNumber - b.dayNumber);

  res.json({
    mode: modeConfig,
    topics: topicList,
    totalDays: modeConfig.totalDays
  });
});

// GET /api/topics/:id
router.get('/:id', auth, (req, res) => {
  const topic = topics.find(t => t.id === req.params.id);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });

  const contentDir = path.join(__dirname, '..', 'content', topic.id);

  try {
    const content = {
      meta: topic,
      quick: readContentJSON(path.join(contentDir, 'quick.json')),
      deep: readContentJSON(path.join(contentDir, 'deep.json')),
      comparison: readContentJSON(path.join(contentDir, 'comparison.json')),
      interview: readContentJSON(path.join(contentDir, 'interview.json')),
      exercises: readContentJSON(path.join(contentDir, 'exercises.json'))
    };

    if (topic.id === 'capstone') {
      content.capstoneOverview = readContentJSON(path.join(contentDir, 'overview.json'));
      content.capstoneMilestones = readContentJSON(path.join(contentDir, 'milestones.json'));
    }

    res.json(content);
  } catch (error) {
    console.error('Error loading topic:', error);
    res.status(500).json({ error: 'Failed to load topic content' });
  }
});

module.exports = router;

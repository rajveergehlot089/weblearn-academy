// ============================================
// Content Bundle Helper — Load pre-built content
// ============================================
const fs = require('fs');
const path = require('path');

let bundle = null;

function buildBundle() {
  const CONTENT_DIR = path.join(__dirname, '..', 'content');
  const coursesContent = loadCourses(CONTENT_DIR);
  const coursesMetadata = buildMetadata(coursesContent);
  const contentBundle = loadContent(CONTENT_DIR, coursesContent);
  return { coursesMetadata, coursesContent, content: contentBundle, builtAt: new Date().toISOString() };
}

function loadCourses(contentDir) {
  const result = {};
  const dirs = fs.readdirSync(contentDir).filter((d) => {
    const full = path.join(contentDir, d);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'index.js'));
  });
  for (const dir of dirs) {
    try {
      const indexPath = path.join(contentDir, dir, 'index.js');
      delete require.cache[require.resolve(indexPath)];
      result[dir] = require(indexPath);
    } catch (err) {
      console.error('Failed to load course ' + dir + ': ' + err.message);
    }
  }
  return result;
}

function buildMetadata(coursesContent) {
  const result = {};
  for (const [courseId, topics] of Object.entries(coursesContent)) {
    if (!Array.isArray(topics) || topics.length === 0) continue;
    const maxFast = Math.max(...topics.map((t) => t.day_fast_track || 1));
    const maxFull = Math.max(...topics.map((t) => t.day_full_course || 1));
    let category = 'technology';
    if (courseId.includes('hindi') || courseId.includes('english')) category = 'language';
    if (courseId.includes('typing')) category = 'typing';
    if (courseId.includes('self-awareness') || courseId.includes('communication') || courseId.includes('productivity') || courseId.includes('leadership') || courseId.includes('career') || courseId.includes('personality'))
      category = 'soft-skills';
    const isTyping = courseId.includes('typing');
    result[courseId] = {
      id: courseId,
      title: courseId.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      description: topics.length + ' learning topics',
      icon: isTyping ? 'fas fa-keyboard' : 'fas fa-book',
      emoji: isTyping ? '\u2328\ufe0f' : '\ud83d\udcda',
      category, difficulty: 'beginner', color: '#667eea',
      contentDir: courseId, hasTypingPractice: isTyping,
      typingLayout: courseId.includes('hindi') ? 'remington' : 'qwerty',
      modes: ['fast-track', 'full-course'],
      totalDays: { 'fast-track': maxFast, 'full-course': maxFull },
      isActive: true, createdAt: new Date().toISOString(),
    };
  }
  return result;
}

function loadContent(contentDir, coursesContent) {
  const result = {};
  const sectionFiles = ['quick.json', 'deep.json', 'comparison.json', 'interview.json', 'exercises.json'];
  for (const [courseId, topics] of Object.entries(coursesContent)) {
    if (!Array.isArray(topics)) continue;
    result[courseId] = {};
    for (const topic of topics) {
      const topicDir = path.join(contentDir, courseId, topic.id);
      if (!fs.existsSync(topicDir)) continue;
      result[courseId][topic.id] = {};
      for (const file of sectionFiles) {
        const filePath = path.join(topicDir, file);
        if (fs.existsSync(filePath)) {
          try {
            result[courseId][topic.id][file.replace('.json', '')] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          } catch (err) {
            console.error('Failed to parse ' + filePath + ': ' + err.message);
          }
        }
      }
    }
  }
  return result;
}

function getBundle() {
  if (!bundle) {
    const bundlePath = path.join(__dirname, 'content-bundle.json');
    if (fs.existsSync(bundlePath)) {
      try {
        bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf-8'));
        return bundle;
      } catch (err) {
        console.error('Failed to load pre-built content bundle: ' + err.message);
      }
    }
    bundle = buildBundle();
  }
  return bundle;
}

function getCoursesMetadata() {
  return getBundle().coursesMetadata;
}

function getCourseTopics(courseId) {
  return getBundle().coursesContent[courseId] || [];
}

function getTopicContent(courseId, topicId) {
  return getBundle().content[courseId]?.[topicId] || null;
}

function getCourseMetadata(courseId) {
  return getBundle().coursesMetadata[courseId] || null;
}

module.exports = { getBundle, getCoursesMetadata, getCourseTopics, getTopicContent, getCourseMetadata };

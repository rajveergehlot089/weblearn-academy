// ============================================
// Content Bundle Helper — Load pre-built content
// ============================================
const fs = require('fs');
const path = require('path');

let bundle = null;

function getBundle() {
  if (!bundle) {
    try {
      const bundlePath = path.join(__dirname, 'content-bundle.json');
      bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf-8'));
    } catch (err) {
      console.error('Failed to load content bundle:', err.message);
      bundle = { coursesMetadata: {}, coursesContent: {}, content: {} };
    }
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

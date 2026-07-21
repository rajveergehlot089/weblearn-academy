// ============================================
// generate-all-courses.js
// Generates all course content JSON files from content-data modules
// Run: node generate-all-courses.js
// ============================================

const fs = require('fs');
const path = require('path');

function writeJSON(dir, filename, data) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 2));
}

function generateCourseContent(courseId, courseData) {
  const baseDir = path.join(__dirname, 'content', courseId);
  fs.mkdirSync(baseDir, { recursive: true });

  // Write index.js
  fs.writeFileSync(path.join(baseDir, 'index.js'), `module.exports = ${JSON.stringify(courseData.topics, null, 2)};\n`);

  let filesWritten = 0;
  for (const topic of courseData.topics) {
    const tc = courseData.content[topic.id];
    if (!tc) { console.warn(`  ⚠ No content for ${topic.id}`); continue; }
    const td = path.join(baseDir, topic.id);
    if (tc.quick) { writeJSON(td, 'quick.json', tc.quick); filesWritten++; }
    if (tc.deep) { writeJSON(td, 'deep.json', tc.deep); filesWritten++; }
    if (tc.comparison) { writeJSON(td, 'comparison.json', tc.comparison); filesWritten++; }
    if (tc.interview) { writeJSON(td, 'interview.json', tc.interview); filesWritten++; }
    if (tc.exercises) { writeJSON(td, 'exercises.json', tc.exercises); filesWritten++; }
  }
  return filesWritten;
}

console.log('🎓 WebLearn Academy — Content Generator\n');
const dataDir = path.join(__dirname, 'content-data');
let total = 0, courses = 0;

if (fs.existsSync(dataDir)) {
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.js'));
  for (const f of files) {
    console.log(`📂 ${f}...`);
    const data = require(path.join(dataDir, f));
    for (const [id, cd] of Object.entries(data)) {
      if (!cd.topics || !cd.content) continue;
      const n = generateCourseContent(id, cd);
      total += n; courses++;
      console.log(`  ✅ ${id}: ${n} files`);
    }
  }
}

console.log(`\n✅ Done! ${total} files for ${courses} courses.`);
console.log('Restart: node server.js → http://localhost:2007');

#!/usr/bin/env node
// ============================================
// Build Content Bundle for Vercel
// Reads all course content and generates JSON bundles
// ============================================
const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const OUTPUT_DIR = path.join(__dirname, '..', 'serverless-lib');

console.log('Building content bundle...');

// 1. Load course topic listings from content directories
const coursesContent = {};
const courseDirs = fs.readdirSync(CONTENT_DIR).filter(d => {
  const full = path.join(CONTENT_DIR, d);
  return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'index.js'));
});

for (const dir of courseDirs) {
  try {
    const indexPath = path.join(CONTENT_DIR, dir, 'index.js');
    delete require.cache[require.resolve(indexPath)];
    coursesContent[dir] = require(indexPath);
  } catch (err) {
    console.warn(`  Warning: Could not load course ${dir}: ${err.message}`);
  }
}
console.log(`  Loaded topic listings for ${Object.keys(coursesContent).length} courses`);

// 2. Generate course metadata from content (no dependency on data/courses.json)
const coursesMetadata = {};
for (const [courseId, topics] of Object.entries(coursesContent)) {
  if (!Array.isArray(topics) || topics.length === 0) continue;
  const maxFast = Math.max(...topics.map(t => t.day_fast_track || 1));
  const maxFull = Math.max(...topics.map(t => t.day_full_course || 1));

  let category = 'technology';
  if (courseId.includes('hindi') || courseId.includes('english')) category = 'language';
  if (courseId.includes('typing')) category = 'typing';
  if (courseId.includes('self-awareness') || courseId.includes('communication') || courseId.includes('productivity') || courseId.includes('leadership') || courseId.includes('career') || courseId.includes('personality')) category = 'soft-skills';

  const isTyping = courseId.includes('typing');

  coursesMetadata[courseId] = {
    id: courseId,
    title: courseId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: `${topics.length} learning topics`,
    icon: isTyping ? 'fas fa-keyboard' : 'fas fa-book',
    emoji: isTyping ? '\u2328\ufe0f' : '\ud83d\udcda',
    category,
    difficulty: 'beginner',
    color: '#667eea',
    contentDir: courseId,
    hasTypingPractice: isTyping,
    typingLayout: courseId.includes('hindi') ? 'remington' : 'qwerty',
    modes: ['fast-track', 'full-course'],
    totalDays: { 'fast-track': maxFast, 'full-course': maxFull },
    isActive: true,
    createdAt: new Date().toISOString(),
  };
}
console.log(`  Generated metadata for ${Object.keys(coursesMetadata).length} courses`);

// 3. Load all topic content files
const contentBundle = {};
let totalTopics = 0;
let totalFiles = 0;

const sectionFiles = ['quick.json', 'deep.json', 'comparison.json', 'interview.json', 'exercises.json'];

for (const [courseId, topics] of Object.entries(coursesContent)) {
  if (!Array.isArray(topics)) continue;
  contentBundle[courseId] = {};

  for (const topic of topics) {
    const topicDir = path.join(CONTENT_DIR, courseId, topic.id);
    if (!fs.existsSync(topicDir)) continue;

    contentBundle[courseId][topic.id] = {};
    totalTopics++;

    for (const file of sectionFiles) {
      const filePath = path.join(topicDir, file);
      if (fs.existsSync(filePath)) {
        try {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const key = file.replace('.json', '');
          contentBundle[courseId][topic.id][key] = data;
          totalFiles++;
        } catch (err) {
          console.warn(`  Warning: Could not parse ${filePath}: ${err.message}`);
        }
      }
    }
  }
}
console.log(`  Loaded ${totalFiles} content files for ${totalTopics} topics`);

// 4. Build the final bundle
const bundle = {
  coursesMetadata,
  coursesContent,
  content: contentBundle,
  builtAt: new Date().toISOString(),
};

// 5. Write to api/lib/content-bundle.json (for API routes to require)
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const outputPath = path.join(OUTPUT_DIR, 'content-bundle.json');
fs.writeFileSync(outputPath, JSON.stringify(bundle));
console.log(`  Written to ${outputPath} (${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB)`);

// 6. Also write a smaller courses-metadata.json to public/ (for client-side)
const publicOutput = path.join(__dirname, '..', 'public', 'courses-metadata.json');
fs.mkdirSync(path.dirname(publicOutput), { recursive: true });
fs.writeFileSync(publicOutput, JSON.stringify({ courses: coursesMetadata }));
console.log(`  Written courses metadata to ${publicOutput}`);

console.log('\nContent bundle built successfully!');

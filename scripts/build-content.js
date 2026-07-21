#!/usr/bin/env node
// ============================================
// Build Content Bundle for Vercel
// Reads all course content and generates JSON bundles
// ============================================
const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_DIR = path.join(__dirname, '..', 'api', 'lib');

console.log('Building content bundle...');

// 1. Load course metadata from data/courses.json
const coursesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'courses.json'), 'utf-8'));
console.log(`  Loaded ${Object.keys(coursesData.courses).length} courses from courses.json`);

// 2. Load all course topic listings
const coursesContent = {};
const courseDirs = fs.readdirSync(CONTENT_DIR).filter(d => {
  const full = path.join(CONTENT_DIR, d);
  return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'index.js'));
});

for (const dir of courseDirs) {
  try {
    // Clear require cache to avoid stale data
    const indexPath = path.join(CONTENT_DIR, dir, 'index.js');
    delete require.cache[require.resolve(indexPath)];
    coursesContent[dir] = require(indexPath);
  } catch (err) {
    console.warn(`  Warning: Could not load course ${dir}: ${err.message}`);
  }
}
console.log(`  Loaded topic listings for ${Object.keys(coursesContent).length} courses`);

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
  coursesMetadata: coursesData.courses,
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
fs.writeFileSync(publicOutput, JSON.stringify(coursesData));
console.log(`  Written courses metadata to ${publicOutput}`);

console.log('\nContent bundle built successfully!');

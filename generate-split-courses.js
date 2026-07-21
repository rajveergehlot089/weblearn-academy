const fs = require('fs');
const path = require('path');

// ============================================
// WebLearn Academy - Course Splitter Generator
// Splits 5 courses into 23 comprehensive courses
// ~1150 content files (23 courses × ~10 topics × 5 JSON files)
// ============================================

const CONTENT_DIR = path.join(__dirname, 'content');
const DATA_DIR = path.join(__dirname, 'data');

// ============================================
// Helper functions
// ============================================

function writeJSON(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function writeJS(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}

// ============================================
// ALL 23 COURSE DEFINITIONS
// ============================================

const COURSES = {
  // ──────────────────────────────────────────
  // WEB DEVELOPMENT → 8 courses
  // ──────────────────────────────────────────
  "html-fundamentals": {
    id: "html-fundamentals",
    title: "HTML Fundamentals",
    description: "Master the building blocks of every webpage. Learn HTML tags, forms, tables, semantic elements, and accessibility.",
    icon: "fas fa-file-code",
    emoji: "📄",
    category: "technology",
    difficulty: "beginner",
    color: "#e44d26",
    contentDir: "html-fundamentals",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 10, "full-course": 20 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "css-mastery": {
    id: "css-mastery",
    title: "CSS Mastery",
    description: "From basic styling to advanced layouts. Master Flexbox, Grid, animations, responsive design, and CSS variables.",
    icon: "fas fa-palette",
    emoji: "🎨",
    category: "technology",
    difficulty: "beginner",
    color: "#264de4",
    contentDir: "css-mastery",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 10, "full-course": 20 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "javascript-essentials": {
    id: "javascript-essentials",
    title: "JavaScript Essentials",
    description: "From variables to async/await. Master JavaScript fundamentals, DOM manipulation, ES6+, and modern patterns.",
    icon: "fas fa-bolt",
    emoji: "⚡",
    category: "technology",
    difficulty: "intermediate",
    color: "#f7df1e",
    contentDir: "javascript-essentials",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 10, "full-course": 20 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "web-networking": {
    id: "web-networking",
    title: "Web Networking & APIs",
    description: "Understand HTTP/HTTPS, REST APIs, GraphQL, API gateways, and how the web communicates.",
    icon: "fas fa-globe",
    emoji: "🌐",
    category: "technology",
    difficulty: "intermediate",
    color: "#0ea5e9",
    contentDir: "web-networking",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 10, "full-course": 20 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "backend-development": {
    id: "backend-development",
    title: "Backend Development",
    description: "Build server-side applications with Node.js, Express, databases, CRUD operations, and error handling.",
    icon: "fas fa-server",
    emoji: "🖥️",
    category: "technology",
    difficulty: "intermediate",
    color: "#68a063",
    contentDir: "backend-development",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 10, "full-course": 20 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "web-security": {
    id: "web-security",
    title: "Web Security & Authentication",
    description: "JWT, sessions, OAuth, cookies, local storage, CORS, and protecting your applications from attacks.",
    icon: "fas fa-shield-halved",
    emoji: "🔐",
    category: "technology",
    difficulty: "intermediate",
    color: "#dc2626",
    contentDir: "web-security",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 10, "full-course": 20 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "web-performance": {
    id: "web-performance",
    title: "Web Performance & Caching",
    description: "Loading states, caching strategies, lazy loading, optimization techniques, and error handling best practices.",
    icon: "fas fa-gauge-high",
    emoji: "⚡",
    category: "technology",
    difficulty: "advanced",
    color: "#8b5cf6",
    contentDir: "web-performance",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 10, "full-course": 20 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "web-deployment": {
    id: "web-deployment",
    title: "Deployment & DevOps",
    description: "Ship your apps to production. Git, CI/CD, hosting platforms, domains, SSL, and the capstone project.",
    icon: "fas fa-rocket",
    emoji: "🚀",
    category: "technology",
    difficulty: "advanced",
    color: "#f97316",
    contentDir: "web-deployment",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 10, "full-course": 20 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },

  // ──────────────────────────────────────────
  // HINDI TYPING → 3 courses
  // ──────────────────────────────────────────
  "hindi-keyboard-basics": {
    id: "hindi-keyboard-basics",
    title: "Hindi Keyboard Basics",
    description: "Learn Hindi keyboard layout, finger positioning, and home row keys. Build a solid typing foundation.",
    icon: "fas fa-keyboard",
    emoji: "ह",
    category: "typing",
    difficulty: "beginner",
    color: "#f59e0b",
    contentDir: "hindi-keyboard-basics",
    hasTypingPractice: true,
    typingLayout: "remington",
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 7, "full-course": 14 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "hindi-word-building": {
    id: "hindi-word-building",
    title: "Hindi Word Building",
    description: "Master upper and lower rows, common Hindi words, numbers, and symbols.",
    icon: "fas fa-spell-check",
    emoji: "📝",
    category: "typing",
    difficulty: "beginner",
    color: "#d97706",
    contentDir: "hindi-word-building",
    hasTypingPractice: true,
    typingLayout: "remington",
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 7, "full-course": 14 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "hindi-speed-fluency": {
    id: "hindi-speed-fluency",
    title: "Hindi Speed & Fluency",
    description: "Type Hindi sentences fluently, build speed, and master advanced typing drills.",
    icon: "fas fa-tachometer-alt",
    emoji: "⚡",
    category: "typing",
    difficulty: "intermediate",
    color: "#b45309",
    contentDir: "hindi-speed-fluency",
    hasTypingPractice: true,
    typingLayout: "remington",
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 6, "full-course": 12 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },

  // ──────────────────────────────────────────
  // ENGLISH TYPING → 3 courses
  // ──────────────────────────────────────────
  "english-typing-foundations": {
    id: "english-typing-foundations",
    title: "English Typing Foundations",
    description: "Introduction to touch typing, home row keys ASDF and JKL. Build proper finger placement habits.",
    icon: "fas fa-keyboard",
    emoji: "⌨️",
    category: "typing",
    difficulty: "beginner",
    color: "#10b981",
    contentDir: "english-typing-foundations",
    hasTypingPractice: true,
    typingLayout: "qwerty",
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 7, "full-course": 14 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "english-typing-mastery": {
    id: "english-typing-mastery",
    title: "English Keyboard Mastery",
    description: "Master upper row, lower row, shift keys, and all keyboard sections for complete coverage.",
    icon: "fas fa-hand-pointer",
    emoji: "🤚",
    category: "typing",
    difficulty: "beginner",
    color: "#059669",
    contentDir: "english-typing-mastery",
    hasTypingPractice: true,
    typingLayout: "qwerty",
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 7, "full-course": 14 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "english-typing-advanced": {
    id: "english-typing-advanced",
    title: "English Typing Speed & Accuracy",
    description: "Common words, sentences, paragraphs, and timed speed drills. Reach 60+ WPM.",
    icon: "fas fa-bolt",
    emoji: "⚡",
    category: "typing",
    difficulty: "intermediate",
    color: "#047857",
    contentDir: "english-typing-advanced",
    hasTypingPractice: true,
    typingLayout: "qwerty",
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 6, "full-course": 12 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },

  // ──────────────────────────────────────────
  // ENGLISH LEARNING → 4 courses
  // ──────────────────────────────────────────
  "english-grammar-basics": {
    id: "english-grammar-basics",
    title: "English Grammar Basics",
    description: "Alphabet, pronunciation, nouns, pronouns, articles, verbs, and present tense. Build a grammar foundation.",
    icon: "fas fa-font",
    emoji: "🔤",
    category: "language",
    difficulty: "beginner",
    color: "#3b82f6",
    contentDir: "english-grammar-basics",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 8, "full-course": 16 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "english-tenses-structure": {
    id: "english-tenses-structure",
    title: "English Tenses & Sentence Structure",
    description: "Past and future tenses, sentence structure (SVO), questions, negation, and prepositions.",
    icon: "fas fa-layer-group",
    emoji: "📦",
    category: "language",
    difficulty: "beginner",
    color: "#2563eb",
    contentDir: "english-tenses-structure",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 8, "full-course": 16 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "english-vocabulary-grammar": {
    id: "english-vocabulary-grammar",
    title: "Vocabulary & Advanced Grammar",
    description: "Vocabulary building techniques, active/passive voice, conjunctions, and advanced grammar patterns.",
    icon: "fas fa-book-open",
    emoji: "📖",
    category: "language",
    difficulty: "intermediate",
    color: "#1d4ed8",
    contentDir: "english-vocabulary-grammar",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 8, "full-course": 16 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "english-professional": {
    id: "english-professional",
    title: "Professional English & Communication",
    description: "Daily conversations, essay writing, paragraph structure, and interview-ready professional English.",
    icon: "fas fa-briefcase",
    emoji: "💼",
    category: "language",
    difficulty: "intermediate",
    color: "#1e40af",
    contentDir: "english-professional",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 6, "full-course": 12 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },

  // ──────────────────────────────────────────
  // PERSONALITY DEVELOPMENT → 5 courses
  // ──────────────────────────────────────────
  "self-awareness-mindset": {
    id: "self-awareness-mindset",
    title: "Self-Awareness & Mindset",
    description: "Emotional intelligence, self-awareness, confidence building, and developing a growth mindset.",
    icon: "fas fa-brain",
    emoji: "🧠",
    category: "soft-skills",
    difficulty: "beginner",
    color: "#8b5cf6",
    contentDir: "self-awareness-mindset",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 7, "full-course": 14 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "communication-skills": {
    id: "communication-skills",
    title: "Communication Skills",
    description: "Effective speaking, active listening, body language, non-verbal cues, and the art of clear communication.",
    icon: "fas fa-comments",
    emoji: "🗣️",
    category: "soft-skills",
    difficulty: "beginner",
    color: "#7c3aed",
    contentDir: "communication-skills",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 7, "full-course": 14 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "productivity-wellness": {
    id: "productivity-wellness",
    title: "Productivity & Wellness",
    description: "Time management, stress management, work-life balance, and mental health strategies.",
    icon: "fas fa-clock",
    emoji: "⏰",
    category: "soft-skills",
    difficulty: "beginner",
    color: "#6d28d9",
    contentDir: "productivity-wellness",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 7, "full-course": 14 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "leadership-teamwork": {
    id: "leadership-teamwork",
    title: "Leadership & Teamwork",
    description: "Lead teams, make decisions, resolve conflicts, delegate effectively, and inspire others.",
    icon: "fas fa-users",
    emoji: "👥",
    category: "soft-skills",
    difficulty: "intermediate",
    color: "#5b21b6",
    contentDir: "leadership-teamwork",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 6, "full-course": 12 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  },
  "career-development": {
    id: "career-development",
    title: "Career Development & Networking",
    description: "Public speaking, professional networking, personal branding, goal setting, and career planning.",
    icon: "fas fa-chart-line",
    emoji: "🎯",
    category: "soft-skills",
    difficulty: "intermediate",
    color: "#4c1d95",
    contentDir: "career-development",
    hasTypingPractice: false,
    modes: ["fast-track", "full-course"],
    totalDays: { "fast-track": 6, "full-course": 12 },
    isActive: true,
    createdAt: "2026-07-18T00:00:00Z"
  }
};

// ============================================
// ALL 230 TOPICS (10 per course)
// ============================================

const TOPICS = {
  // ── html-fundamentals (10 topics) ──
  "html-fundamentals": [
    { id: "01-html-basics", title: "HTML Basics — Your First Page", group: "fundamentals", day_fast_track: 1, day_full_course: 1, icon: "📄", description: "Learn HTML structure, DOCTYPE, head, body, and essential tags.", prerequisites: [] },
    { id: "02-text-elements", title: "Text Elements — Headings, Paragraphs, Links", group: "fundamentals", day_fast_track: 2, day_full_course: 2, icon: "📝", description: "Master headings, paragraphs, links, emphasis, and text formatting.", prerequisites: ["01-html-basics"] },
    { id: "03-images-media", title: "Images, Audio & Video", group: "media", day_fast_track: 3, day_full_course: 4, icon: "🖼️", description: "Embed images, audio, video, and other media into your pages.", prerequisites: ["01-html-basics"] },
    { id: "04-lists-tables", title: "Lists & Tables", group: "fundamentals", day_fast_track: 4, day_full_course: 5, icon: "📊", description: "Organize content with ordered lists, unordered lists, and tables.", prerequisites: ["02-text-elements"] },
    { id: "05-forms-inputs", title: "Forms & Input Elements", group: "interactive", day_fast_track: 5, day_full_course: 7, icon: "📋", description: "Build forms with text fields, dropdowns, checkboxes, and submit buttons.", prerequisites: ["02-text-elements"] },
    { id: "06-form-validation", title: "Form Validation & Attributes", group: "interactive", day_fast_track: 6, day_full_course: 9, icon: "✅", description: "Use HTML5 validation, required fields, patterns, and input types.", prerequisites: ["05-forms-inputs"] },
    { id: "07-semantic-html", title: "Semantic HTML — Meaningful Markup", group: "best-practices", day_fast_track: 7, day_full_course: 11, icon: "🏗️", description: "Use header, nav, main, article, section, footer for accessible HTML.", prerequisites: ["01-html-basics"] },
    { id: "08-divs-layout", title: "Divs, Spans & Page Layout", group: "layout", day_fast_track: 8, day_full_course: 13, icon: "📦", description: "Container elements for structuring page layout before CSS.", prerequisites: ["02-text-elements"] },
    { id: "09-accessibility", title: "Accessibility & ARIA", group: "best-practices", day_fast_track: 9, day_full_course: 15, icon: "♿", description: "Make your pages usable by everyone with ARIA labels and roles.", prerequisites: ["07-semantic-html"] },
    { id: "10-html-templates", title: "HTML Templates & Meta Tags", group: "advanced", day_fast_track: 10, day_full_course: 18, icon: "🔧", description: "Template tags, meta tags, Open Graph, and SEO fundamentals.", prerequisites: ["01-html-basics"] }
  ],

  // ── css-mastery (10 topics) ──
  "css-mastery": [
    { id: "01-css-intro", title: "CSS Introduction & Selectors", group: "fundamentals", day_fast_track: 1, day_full_course: 1, icon: "🎨", description: "How CSS works, selectors, specificity, and the cascade.", prerequisites: [] },
    { id: "02-box-model", title: "The Box Model — Spacing & Borders", group: "fundamentals", day_fast_track: 2, day_full_course: 3, icon: "📦", description: "Margin, padding, border, box-sizing, and element dimensions.", prerequisites: ["01-css-intro"] },
    { id: "03-typography-colors", title: "Typography, Colors & Units", group: "fundamentals", day_fast_track: 3, day_full_course: 5, icon: "🔤", description: "Font properties, color systems (hex, RGB, HSL), and CSS units.", prerequisites: ["01-css-intro"] },
    { id: "04-flexbox", title: "Flexbox — One-Dimensional Layouts", group: "layout", day_fast_track: 4, day_full_course: 7, icon: "↔️", description: "Master flex containers, items, alignment, wrapping, and ordering.", prerequisites: ["02-box-model"] },
    { id: "05-css-grid", title: "CSS Grid — Two-Dimensional Layouts", group: "layout", day_fast_track: 5, day_full_course: 9, icon: "🔲", description: "Grid containers, areas, template columns/rows, and responsive grids.", prerequisites: ["04-flexbox"] },
    { id: "06-responsive-design", title: "Responsive Design & Media Queries", group: "layout", day_fast_track: 6, day_full_course: 11, icon: "📱", description: "Build pages that work on every screen size with breakpoints.", prerequisites: ["05-css-grid"] },
    { id: "07-positioning", title: "Positioning & Stacking", group: "layout", day_fast_track: 7, day_full_course: 13, icon: "📍", description: "Static, relative, absolute, fixed, sticky positioning and z-index.", prerequisites: ["02-box-model"] },
    { id: "08-pseudo-classes", title: "Pseudo-Classes & Pseudo-Elements", group: "advanced", day_fast_track: 8, day_full_course: 15, icon: "🎯", description: "Hover, focus, nth-child, ::before, ::after, and dynamic states.", prerequisites: ["01-css-intro"] },
    { id: "09-animations", title: "Transitions & Animations", group: "advanced", day_fast_track: 9, day_full_course: 17, icon: "✨", description: "Smooth transitions, keyframe animations, and transform effects.", prerequisites: ["01-css-intro"] },
    { id: "10-css-variables", title: "CSS Variables & Custom Properties", group: "modern", day_fast_track: 10, day_full_course: 19, icon: "🔧", description: "Reusable values, theming, and dynamic styles with custom properties.", prerequisites: ["01-css-intro"] }
  ],

  // ── javascript-essentials (10 topics) ──
  "javascript-essentials": [
    { id: "01-js-basics", title: "JavaScript Basics — Variables & Data Types", group: "fundamentals", day_fast_track: 1, day_full_course: 1, icon: "⚡", description: "let, const, var, strings, numbers, booleans, null, undefined.", prerequisites: [] },
    { id: "02-operators", title: "Operators & Expressions", group: "fundamentals", day_fast_track: 2, day_full_course: 2, icon: "🔢", description: "Arithmetic, comparison, logical, and assignment operators.", prerequisites: ["01-js-basics"] },
    { id: "03-conditionals", title: "Conditionals — Making Decisions", group: "fundamentals", day_fast_track: 3, day_full_course: 4, icon: "🔀", description: "if/else, switch, ternary operator, and truthy/falsy values.", prerequisites: ["02-operators"] },
    { id: "04-loops", title: "Loops — Repeating Actions", group: "fundamentals", day_fast_track: 4, day_full_course: 6, icon: "🔄", description: "for, while, for...of, for...in, break, continue, and iteration patterns.", prerequisites: ["03-conditionals"] },
    { id: "05-functions", title: "Functions — Reusable Code", group: "fundamentals", day_fast_track: 5, day_full_course: 7, icon: "📦", description: "Function declarations, expressions, arrow functions, and parameters.", prerequisites: ["03-conditionals"] },
    { id: "06-arrays", title: "Arrays — Ordered Collections", group: "data-structures", day_fast_track: 6, day_full_course: 9, icon: "📋", description: "push, pop, map, filter, reduce, find, and array iteration methods.", prerequisites: ["05-functions"] },
    { id: "07-objects", title: "Objects — Key-Value Pairs", group: "data-structures", day_fast_track: 7, day_full_course: 11, icon: "🗂️", description: "Object creation, properties, methods, destructuring, and spread.", prerequisites: ["05-functions"] },
    { id: "08-dom-manipulation", title: "DOM Manipulation — Changing Pages", group: "browser", day_fast_track: 8, day_full_course: 13, icon: "🖱️", description: "getElementById, querySelector, creating elements, and event listeners.", prerequisites: ["06-arrays"] },
    { id: "09-es6-features", title: "ES6+ Modern JavaScript", group: "modern", day_fast_track: 9, day_full_course: 16, icon: "🚀", description: "Template literals, destructuring, spread/rest, modules, and classes.", prerequisites: ["07-objects"] },
    { id: "10-error-handling", title: "Error Handling & Debugging", group: "best-practices", day_fast_track: 10, day_full_course: 18, icon: "🛡️", description: "try/catch, error types, console methods, and debugging techniques.", prerequisites: ["05-functions"] }
  ],

  // ── web-networking (10 topics) ──
  "web-networking": [
    { id: "01-internet-basics", title: "How the Internet Works", group: "fundamentals", day_fast_track: 1, day_full_course: 1, icon: "🌐", description: "DNS, TCP/IP, packets, and the journey of a web request.", prerequisites: [] },
    { id: "02-http-fundamentals", title: "HTTP Fundamentals", group: "fundamentals", day_fast_track: 2, day_full_course: 2, icon: "📤", description: "Requests, responses, headers, methods, and status codes.", prerequisites: ["01-internet-basics"] },
    { id: "03-http-methods", title: "HTTP Methods — CRUD Operations", group: "fundamentals", day_fast_track: 3, day_full_course: 4, icon: "🔧", description: "GET, POST, PUT, DELETE, PATCH and when to use each.", prerequisites: ["02-http-fundamentals"] },
    { id: "04-status-codes", title: "HTTP Status Codes Deep Dive", group: "fundamentals", day_fast_track: 4, day_full_course: 6, icon: "📊", description: "2xx, 3xx, 4xx, 5xx codes and what they mean for your apps.", prerequisites: ["02-http-fundamentals"] },
    { id: "05-https-security", title: "HTTPS & TLS Encryption", group: "security", day_fast_track: 5, day_full_course: 7, icon: "🔒", description: "SSL certificates, TLS handshakes, and why HTTPS matters.", prerequisites: ["02-http-fundamentals"] },
    { id: "06-rest-api-design", title: "REST API Design", group: "api-design", day_fast_track: 6, day_full_course: 9, icon: "🗺️", description: "RESTful conventions, resource naming, versioning, and best practices.", prerequisites: ["03-http-methods"] },
    { id: "07-fetch-api", title: "Fetch API & AJAX", group: "client-side", day_fast_track: 7, day_full_course: 11, icon: "📡", description: "Making HTTP requests from JavaScript with fetch() and async/await.", prerequisites: ["06-rest-api-design"] },
    { id: "08-graphql-intro", title: "GraphQL Introduction", group: "api-design", day_fast_track: 8, day_full_course: 13, icon: "◆", description: "Queries, mutations, schemas, and when to choose GraphQL over REST.", prerequisites: ["06-rest-api-design"] },
    { id: "09-api-gateway", title: "API Gateway & Rate Limiting", group: "infrastructure", day_fast_track: 9, day_full_course: 16, icon: "🚪", description: "Request routing, rate limiting, throttling, and API management.", prerequisites: ["06-rest-api-design"] },
    { id: "10-cors-errors", title: "CORS, Errors & Debugging APIs", group: "best-practices", day_fast_track: 10, day_full_course: 18, icon: "🐛", description: "Cross-origin requests, CORS headers, error handling, and API debugging.", prerequisites: ["07-fetch-api"] }
  ],

  // ── backend-development (10 topics) ──
  "backend-development": [
    { id: "01-node-intro", title: "Node.js Introduction", group: "fundamentals", day_fast_track: 1, day_full_course: 1, icon: "🟢", description: "What is Node.js, how it works, and your first server.", prerequisites: [] },
    { id: "02-express-basics", title: "Express.js Basics", group: "fundamentals", day_fast_track: 2, day_full_course: 3, icon: "🚂", description: "Routes, middleware, request/response, and building APIs.", prerequisites: ["01-node-intro"] },
    { id: "03-rest-routing", title: "RESTful Routing in Express", group: "fundamentals", day_fast_track: 3, day_full_course: 5, icon: "🗺️", description: "Organize routes, handle parameters, and build RESTful endpoints.", prerequisites: ["02-express-basics"] },
    { id: "04-middleware", title: "Middleware Patterns", group: "patterns", day_fast_track: 4, day_full_course: 7, icon: "🔗", description: "Custom middleware, error handling middleware, and the middleware chain.", prerequisites: ["02-express-basics"] },
    { id: "05-mongodb-intro", title: "MongoDB & Mongoose", group: "database", day_fast_track: 5, day_full_course: 9, icon: "🍃", description: "Document databases, schemas, models, and CRUD with Mongoose.", prerequisites: ["03-rest-routing"] },
    { id: "06-crud-operations", title: "CRUD Operations Deep Dive", group: "database", day_fast_track: 6, day_full_course: 11, icon: "🗄️", description: "Create, Read, Update, Delete with validation and error handling.", prerequisites: ["05-mongodb-intro"] },
    { id: "07-data-validation", title: "Data Validation & Sanitization", group: "best-practices", day_fast_track: 7, day_full_course: 13, icon: "✅", description: "Validate user input, sanitize data, and prevent injection attacks.", prerequisites: ["06-crud-operations"] },
    { id: "08-file-uploads", title: "File Uploads & Storage", group: "features", day_fast_track: 8, day_full_course: 15, icon: "📤", description: "Handle file uploads with Multer, store files, and serve them back.", prerequisites: ["02-express-basics"] },
    { id: "09-api-testing", title: "API Testing & Documentation", group: "best-practices", day_fast_track: 9, day_full_course: 17, icon: "🧪", description: "Test APIs with tools, document endpoints, and ensure reliability.", prerequisites: ["06-crud-operations"] },
    { id: "10-server-optimization", title: "Server Optimization", group: "advanced", day_fast_track: 10, day_full_course: 19, icon: "⚙️", description: "Compression, clustering, caching, and performance tuning for Node.js.", prerequisites: ["01-node-intro"] }
  ],

  // ── web-security (10 topics) ──
  "web-security": [
    { id: "01-security-overview", title: "Web Security Fundamentals", group: "fundamentals", day_fast_track: 1, day_full_course: 1, icon: "🛡️", description: "OWASP Top 10, common vulnerabilities, and security mindset.", prerequisites: [] },
    { id: "02-auth-intro", title: "Authentication Fundamentals", group: "auth", day_fast_track: 2, day_full_course: 3, icon: "🔐", description: "What is authentication, why it matters, and different approaches.", prerequisites: ["01-security-overview"] },
    { id: "03-sessions-cookies", title: "Sessions & Cookies", group: "auth", day_fast_track: 3, day_full_course: 5, icon: "🍪", description: "Server-side sessions, cookies, and session-based authentication.", prerequisites: ["02-auth-intro"] },
    { id: "04-jwt-deep-dive", title: "JWT — JSON Web Tokens", group: "auth", day_fast_track: 4, day_full_course: 7, icon: "🎫", description: "Token structure, signing, verification, refresh tokens, and best practices.", prerequisites: ["02-auth-intro"] },
    { id: "05-oauth-social", title: "OAuth & Social Login", group: "auth", day_fast_track: 5, day_full_course: 9, icon: "🔑", description: "OAuth 2.0 flow, Google/GitHub login, and third-party authentication.", prerequisites: ["04-jwt-deep-dive"] },
    { id: "06-localstorage", title: "LocalStorage, SessionStorage & Security", group: "storage", day_fast_track: 6, day_full_course: 11, icon: "💾", description: "Client-side storage options, security implications, and when to use each.", prerequisites: ["04-jwt-deep-dive"] },
    { id: "07-password-security", title: "Password Hashing & Storage", group: "security", day_fast_track: 7, day_full_course: 13, icon: "🗝️", description: "bcrypt, argon2, salting, and why you never store plain passwords.", prerequisites: ["02-auth-intro"] },
    { id: "08-cors-security", title: "CORS & Cross-Site Attacks", group: "security", day_fast_track: 8, day_full_course: 15, icon: "🚫", description: "CORS configuration, CSRF, XSS, and preventing cross-site attacks.", prerequisites: ["01-security-overview"] },
    { id: "09-rate-limiting", title: "Rate Limiting & Brute Force Protection", group: "security", day_fast_track: 9, day_full_course: 17, icon: "⏱️", description: "Protect APIs from abuse with rate limiting and throttling.", prerequisites: ["01-security-overview"] },
    { id: "10-security-audit", title: "Security Audit & Best Practices", group: "best-practices", day_fast_track: 10, day_full_course: 19, icon: "📋", description: "Checklist-based security audit and production security hardening.", prerequisites: ["01-security-overview"] }
  ],

  // ── web-performance (10 topics) ──
  "web-performance": [
    { id: "01-performance-intro", title: "Web Performance Fundamentals", group: "fundamentals", day_fast_track: 1, day_full_course: 1, icon: "⚡", description: "Why performance matters, Core Web Vitals, and measuring speed.", prerequisites: [] },
    { id: "02-loading-states", title: "Loading States & UX", group: "user-experience", day_fast_track: 2, day_full_course: 3, icon: "⏳", description: "Spinners, skeleton screens, progress bars, and keeping users informed.", prerequisites: ["01-performance-intro"] },
    { id: "03-error-handling", title: "Error Handling Best Practices", group: "reliability", day_fast_track: 3, day_full_course: 5, icon: "🛡️", description: "Try/catch patterns, error boundaries, user-friendly error messages.", prerequisites: ["01-performance-intro"] },
    { id: "04-caching-browser", title: "Browser Caching Strategies", group: "caching", day_fast_track: 4, day_full_course: 7, icon: "💾", description: "HTTP caching, Cache-Control headers, ETags, and service workers.", prerequisites: ["01-performance-intro"] },
    { id: "05-lazy-loading", title: "Lazy Loading & Code Splitting", group: "optimization", day_fast_track: 5, day_full_course: 9, icon: "📦", description: "Load resources on demand, dynamic imports, and intersection observer.", prerequisites: ["04-caching-browser"] },
    { id: "06-image-optimization", title: "Image Optimization", group: "optimization", day_fast_track: 6, day_full_course: 11, icon: "🖼️", description: "Formats, compression, responsive images, srcset, and WebP/AVIF.", prerequisites: ["01-performance-intro"] },
    { id: "07-minification", title: "Minification & Bundle Optimization", group: "optimization", day_fast_track: 7, day_full_course: 13, icon: "🔧", description: "Minify CSS/JS, tree shaking, and reducing bundle sizes.", prerequisites: ["01-performance-intro"] },
    { id: "08-caching-server", title: "Server-Side Caching", group: "caching", day_fast_track: 8, day_full_course: 15, icon: "🗄️", description: "Redis, Memcached, in-memory caching, and cache invalidation.", prerequisites: ["04-caching-browser"] },
    { id: "09-performance-monitoring", title: "Performance Monitoring & Metrics", group: "tools", day_fast_track: 9, day_full_course: 17, icon: "📊", description: "Lighthouse, Web Vitals, performance budgets, and monitoring tools.", prerequisites: ["01-performance-intro"] },
    { id: "10-optimization-checklist", title: "Optimization Checklist & Case Studies", group: "best-practices", day_fast_track: 10, day_full_course: 19, icon: "✅", description: "Complete optimization checklist and real-world performance case studies.", prerequisites: ["01-performance-intro"] }
  ],

  // ── web-deployment (10 topics) ──
  "web-deployment": [
    { id: "01-git-fundamentals", title: "Git Fundamentals", group: "version-control", day_fast_track: 1, day_full_course: 1, icon: "📦", description: "Git init, add, commit, branches, merge, and collaboration basics.", prerequisites: [] },
    { id: "02-github-workflow", title: "GitHub & Collaboration", group: "version-control", day_fast_track: 2, day_full_course: 3, icon: "🐙", description: "Repositories, pull requests, code review, and GitHub workflows.", prerequisites: ["01-git-fundamentals"] },
    { id: "03-hosting-platforms", title: "Hosting Platforms Overview", group: "deployment", day_fast_track: 3, day_full_course: 5, icon: "☁️", description: "Vercel, Netlify, Heroku, Railway, and choosing the right platform.", prerequisites: ["02-github-workflow"] },
    { id: "04-frontend-deploy", title: "Frontend Deployment", group: "deployment", day_fast_track: 4, day_full_course: 7, icon: "🌐", description: "Deploy static sites and SPAs with custom domains and SSL.", prerequisites: ["03-hosting-platforms"] },
    { id: "05-backend-deploy", title: "Backend Deployment", group: "deployment", day_fast_track: 5, day_full_course: 9, icon: "🖥️", description: "Deploy Node.js servers, environment variables, and database connections.", prerequisites: ["03-hosting-platforms"] },
    { id: "06-domains-ssl", title: "Domains, DNS & SSL Certificates", group: "devops", day_fast_track: 6, day_full_course: 11, icon: "🔒", description: "Buy domains, configure DNS, and set up HTTPS with free SSL.", prerequisites: ["04-frontend-deploy"] },
    { id: "07-ci-cd", title: "CI/CD Pipelines", group: "devops", day_fast_track: 7, day_full_course: 13, icon: "🔄", description: "Automated testing, building, and deployment with GitHub Actions.", prerequisites: ["02-github-workflow"] },
    { id: "08-environment-config", title: "Environment Variables & Config", group: "devops", day_fast_track: 8, day_full_course: 15, icon: "⚙️", description: "Manage secrets, configs for dev/staging/production, and .env files.", prerequisites: ["05-backend-deploy"] },
    { id: "09-monitoring-logs", title: "Monitoring & Logging", group: "devops", day_fast_track: 9, day_full_course: 17, icon: "📊", description: "Application monitoring, error tracking, logging, and uptime checks.", prerequisites: ["05-backend-deploy"] },
    { id: "10-capstone-project", title: "Capstone — Full Stack Project", group: "project", day_fast_track: 10, day_full_course: 20, icon: "🏆", description: "Build and deploy a complete full-stack application from scratch.", prerequisites: ["05-backend-deploy", "07-ci-cd"] }
  ],

  // ── hindi-keyboard-basics (10 topics) ──
  "hindi-keyboard-basics": [
    { id: "01-keyboard-overview", title: "Hindi Keyboard Layout Overview", group: "basics", day_fast_track: 1, day_full_course: 1, icon: "🔐", description: "Understanding the Hindi keyboard layout and Remington system.", prerequisites: [] },
    { id: "02-finger-positioning", title: "Finger Positioning & Home Row", group: "basics", day_fast_track: 2, day_full_course: 2, icon: "🤟", description: "Proper finger placement on the home row keys.", prerequisites: ["01-keyboard-overview"] },
    { id: "03-home-row-left", title: "Home Row — Left Hand Keys", group: "home-row", day_fast_track: 3, day_full_course: 4, icon: "👈", description: "Master left hand home row: fa, ka, gha, tha, cha.", prerequisites: ["02-finger-positioning"] },
    { id: "04-home-row-right", title: "Home Row — Right Hand Keys", group: "home-row", day_fast_track: 4, day_full_course: 5, icon: "👉", description: "Master right hand home row: ja, da, ga, ma, na.", prerequisites: ["02-finger-positioning"] },
    { id: "05-home-row-combined", title: "Home Row Combined Practice", group: "home-row", day_fast_track: 5, day_full_course: 7, icon: "✋", description: "Practice both hands on home row together for fluency.", prerequisites: ["03-home-row-left", "04-home-row-right"] },
    { id: "06-basic-letters", title: "Basic Hindi Letters & Sounds", group: "fundamentals", day_fast_track: 6, day_full_course: 8, icon: "🔤", description: "Learn the basic Hindi consonants and their sounds.", prerequisites: ["05-home-row-combined"] },
    { id: "07-vowels-matra", title: "Vowels & Matra System", group: "fundamentals", day_fast_track: 7, day_full_course: 10, icon: "📝", description: "Hindi vowels and how matras change consonant sounds.", prerequisites: ["06-basic-letters"] },
    { id: "08-joining-letters", title: "Joining Letters into Words", group: "practice", day_fast_track: 8, day_full_course: 11, icon: "🔗", description: "Combine letters to form simple Hindi words.", prerequisites: ["07-vowels-matra"] },
    { id: "09-common-syllables", title: "Common Syllables Practice", group: "practice", day_fast_track: 9, day_full_course: 12, icon: "📖", description: "Practice frequently used Hindi syllable combinations.", prerequisites: ["08-joining-letters"] },
    { id: "10-home-row-test", title: "Home Row Speed Test", group: "assessment", day_fast_track: 10, day_full_course: 14, icon: "⏱️", description: "Timed test to verify home row mastery before advancing.", prerequisites: ["08-joining-letters"] }
  ],

  // ── hindi-word-building (10 topics) ──
  "hindi-word-building": [
    { id: "01-upper-row-intro", title: "Upper Row Introduction", group: "rows", day_fast_track: 1, day_full_course: 1, icon: "⬆️", description: "Learn the upper row keys and their Hindi equivalents.", prerequisites: [] },
    { id: "02-upper-row-practice", title: "Upper Row Practice Drills", group: "rows", day_fast_track: 2, day_full_course: 2, icon: "🏋️", description: "Practice upper row keys with repetition drills.", prerequisites: ["01-upper-row-intro"] },
    { id: "03-lower-row-intro", title: "Lower Row Introduction", group: "rows", day_fast_track: 3, day_full_course: 4, icon: "⬇️", description: "Learn the lower row keys and their Hindi equivalents.", prerequisites: ["01-upper-row-intro"] },
    { id: "04-lower-row-practice", title: "Lower Row Practice Drills", group: "rows", day_fast_track: 4, day_full_course: 5, icon: "🏋️", description: "Practice lower row keys with repetition drills.", prerequisites: ["03-lower-row-intro"] },
    { id: "05-common-words-1", title: "Common Hindi Words — Set 1", group: "words", day_fast_track: 5, day_full_course: 7, icon: "📝", description: "Most frequently used Hindi words for daily conversation.", prerequisites: ["02-upper-row-practice", "04-lower-row-practice"] },
    { id: "06-common-words-2", title: "Common Hindi Words — Set 2", group: "words", day_fast_track: 6, day_full_course: 8, icon: "📝", description: "Expand vocabulary with more everyday words.", prerequisites: ["05-common-words-1"] },
    { id: "07-numbers", title: "Hindi Numbers", group: "practice", day_fast_track: 7, day_full_course: 10, icon: "🔢", description: "Type Hindi numbers from 0-100 and common numerals.", prerequisites: ["06-common-words-2"] },
    { id: "08-symbols-punctuation", title: "Symbols & Punctuation", group: "practice", day_fast_track: 8, day_full_course: 11, icon: "❗", description: "Hindi punctuation marks and special symbols.", prerequisites: ["07-numbers"] },
    { id: "09-word-combinations", title: "Word Combination Drills", group: "practice", day_fast_track: 9, day_full_course: 12, icon: "🔗", description: "Combine known words into two-word and three-word phrases.", prerequisites: ["06-common-words-2"] },
    { id: "10-word-speed-test", title: "Word Building Speed Test", group: "assessment", day_fast_track: 10, day_full_course: 14, icon: "⏱️", description: "Timed test of word-building skills before advancing.", prerequisites: ["09-word-combinations"] }
  ],

  // ── hindi-speed-fluency (10 topics) ──
  "hindi-speed-fluency": [
    { id: "01-sentence-intro", title: "Hindi Sentences Introduction", group: "sentences", day_fast_track: 1, day_full_course: 1, icon: "📝", description: "Type complete Hindi sentences with proper word order.", prerequisites: [] },
    { id: "02-simple-sentences", title: "Simple Sentence Practice", group: "sentences", day_fast_track: 2, day_full_course: 2, icon: "✍️", description: "Practice 3-5 word Hindi sentences.", prerequisites: ["01-sentence-intro"] },
    { id: "03-conversation-sentences", title: "Conversation Sentences", group: "sentences", day_fast_track: 3, day_full_course: 4, icon: "🗣️", description: "Common Hindi conversation phrases and sentences.", prerequisites: ["02-simple-sentences"] },
    { id: "04-paragraph-practice", title: "Paragraph Typing Practice", group: "fluency", day_fast_track: 4, day_full_course: 5, icon: "📄", description: "Type full paragraphs of Hindi text for fluency.", prerequisites: ["03-conversation-sentences"] },
    { id: "05-speed-drill-1", title: "Speed Drill — Short Passages", group: "speed", day_fast_track: 5, day_full_course: 7, icon: "⚡", description: "Timed drills with short Hindi passages.", prerequisites: ["04-paragraph-practice"] },
    { id: "06-mixed-content", title: "Mixed Content Typing", group: "fluency", day_fast_track: 6, day_full_course: 8, icon: "🔀", description: "Type mixed Hindi text with numbers, words, and punctuation.", prerequisites: ["05-speed-drill-1"] },
    { id: "07-speed-drill-2", title: "Speed Drill — Long Passages", group: "speed", day_fast_track: 7, day_full_course: 10, icon: "⚡", description: "Extended timed typing sessions.", prerequisites: ["06-mixed-content"] },
    { id: "08-accuracy-focus", title: "Accuracy-Focused Practice", group: "fluency", day_fast_track: 8, day_full_course: 11, icon: "🎯", description: "Type accurately first, then build speed.", prerequisites: ["07-speed-drill-2"] },
    { id: "09-real-world-text", title: "Real-World Hindi Text", group: "fluency", day_fast_track: 9, day_full_course: 12, icon: "📰", description: "Type from real Hindi articles, messages, and documents.", prerequisites: ["08-accuracy-focus"] },
    { id: "10-final-speed-test", title: "Final Speed Assessment", group: "assessment", day_fast_track: 10, day_full_course: 14, icon: "🏆", description: "Comprehensive speed and accuracy assessment.", prerequisites: ["09-real-world-text"] }
  ],

  // ── english-typing-foundations (10 topics) ──
  "english-typing-foundations": [
    { id: "01-touch-typing-intro", title: "Introduction to Touch Typing", group: "basics", day_fast_track: 1, day_full_course: 1, icon: "🔑", description: "What is touch typing, why it matters, and setting up your posture.", prerequisites: [] },
    { id: "02-keyboard-layout", title: "Keyboard Layout & Finger Maps", group: "basics", day_fast_track: 2, day_full_course: 2, icon: "🗺️", description: "QWERTY layout, finger assignments, and home row markers.", prerequisites: ["01-touch-typing-intro"] },
    { id: "03-home-row-asdf", title: "Home Row — ASDF (Left Hand)", group: "home-row", day_fast_track: 3, day_full_course: 4, icon: "🤟", description: "Master left hand home row keys with drills.", prerequisites: ["02-keyboard-layout"] },
    { id: "04-home-row-jkl", title: "Home Row — JKL (Right Hand)", group: "home-row", day_fast_track: 4, day_full_course: 5, icon: "🤞", description: "Master right hand home row keys with drills.", prerequisites: ["02-keyboard-layout"] },
    { id: "05-home-row-combined", title: "Home Row Combined Practice", group: "home-row", day_fast_track: 5, day_full_course: 7, icon: "✋", description: "Practice both hands on home row for speed and accuracy.", prerequisites: ["03-home-row-asdf", "04-home-row-jkl"] },
    { id: "06-eyes-on-screen", title: "Typing Without Looking", group: "technique", day_fast_track: 6, day_full_course: 8, icon: "👀", description: "Build muscle memory and stop looking at the keyboard.", prerequisites: ["05-home-row-combined"] },
    { id: "07-finger-exercises", title: "Finger Strength Exercises", group: "technique", day_fast_track: 7, day_full_course: 10, icon: "💪", description: "Strengthen individual fingers for faster typing.", prerequisites: ["05-home-row-combined"] },
    { id: "08-accuracy-drills", title: "Accuracy-First Drills", group: "practice", day_fast_track: 8, day_full_course: 11, icon: "🎯", description: "Slow, accurate typing to build correct habits.", prerequisites: ["06-eyes-on-screen"] },
    { id: "09-home-row-test", title: "Home Row Mastery Test", group: "assessment", day_fast_track: 9, day_full_course: 12, icon: "⏱️", description: "Test your home row speed and accuracy.", prerequisites: ["08-accuracy-drills"] },
    { id: "10-foundations-recap", title: "Foundations Recap & Practice", group: "review", day_fast_track: 10, day_full_course: 14, icon: "🔄", description: "Review all home row skills and prepare for the next course.", prerequisites: ["09-home-row-test"] }
  ],

  // ── english-typing-mastery (10 topics) ──
  "english-typing-mastery": [
    { id: "01-upper-row-intro", title: "Upper Row — QWERTY Keys", group: "rows", day_fast_track: 1, day_full_course: 1, icon: "⬆️", description: "Learn keys above the home row: Q, W, E, R, T, Y, U, I, O, P.", prerequisites: [] },
    { id: "02-upper-row-drills", title: "Upper Row Practice Drills", group: "rows", day_fast_track: 2, day_full_course: 3, icon: "🏋️", description: "Repetitive drills to master upper row reach.", prerequisites: ["01-upper-row-intro"] },
    { id: "03-lower-row-intro", title: "Lower Row — ZXCVB Keys", group: "rows", day_fast_track: 3, day_full_course: 4, icon: "⬇️", description: "Learn keys below the home row: Z, X, C, V, B, N, M.", prerequisites: ["01-upper-row-intro"] },
    { id: "04-lower-row-drills", title: "Lower Row Practice Drills", group: "rows", day_fast_track: 4, day_full_course: 6, icon: "🏋️", description: "Repetitive drills to master lower row reach.", prerequisites: ["03-lower-row-intro"] },
    { id: "05-shift-caps", title: "Shift Keys & Capital Letters", group: "rows", day_fast_track: 5, day_full_course: 7, icon: "⇧", description: "Using shift for capitals and the Caps Lock key.", prerequisites: ["02-upper-row-drills", "04-lower-row-drills"] },
    { id: "06-all-keys-combined", title: "All Keys Combined Practice", group: "integration", day_fast_track: 6, day_full_course: 9, icon: "🎹", description: "Practice using all keyboard sections together.", prerequisites: ["05-shift-caps"] },
    { id: "07-reach-patterns", title: "Finger Reach Patterns", group: "technique", day_fast_track: 7, day_full_course: 10, icon: "🔄", description: "Common finger movement patterns for efficiency.", prerequisites: ["06-all-keys-combined"] },
    { id: "08-word-typing", title: "Typing Real Words", group: "practice", day_fast_track: 8, day_full_course: 12, icon: "📝", description: "Type complete English words using all keys.", prerequisites: ["06-all-keys-combined"] },
    { id: "09-row-mastery-test", title: "Full Keyboard Mastery Test", group: "assessment", day_fast_track: 9, day_full_course: 13, icon: "⏱️", description: "Test mastery of all keyboard rows.", prerequisites: ["08-word-typing"] },
    { id: "10-mastery-recap", title: "Keyboard Mastery Recap", group: "review", day_fast_track: 10, day_full_course: 14, icon: "🏆", description: "Review all skills and prepare for advanced practice.", prerequisites: ["09-row-mastery-test"] }
  ],

  // ── english-typing-advanced (10 topics) ──
  "english-typing-advanced": [
    { id: "01-common-words", title: "Most Common English Words", group: "practice", day_fast_track: 1, day_full_course: 1, icon: "📝", description: "The 100 most frequently used English words for fast typing.", prerequisites: [] },
    { id: "02-sentence-practice", title: "Sentence Typing Practice", group: "practice", day_fast_track: 2, day_full_course: 2, icon: "✍️", description: "Type complete English sentences with proper punctuation.", prerequisites: ["01-common-words"] },
    { id: "03-paragraph-practice", title: "Paragraph Typing Practice", group: "fluency", day_fast_track: 3, day_full_course: 4, icon: "📄", description: "Type multi-sentence paragraphs for sustained speed.", prerequisites: ["02-sentence-practice"] },
    { id: "04-punctuation-mastery", title: "Punctuation & Special Characters", group: "technique", day_fast_track: 4, day_full_course: 5, icon: "❗", description: "Commas, periods, question marks, quotes, and numbers.", prerequisites: ["02-sentence-practice"] },
    { id: "05-speed-drill-basic", title: "Speed Drill — Basic", group: "speed", day_fast_track: 5, day_full_course: 7, icon: "⚡", description: "Timed typing tests at comfortable speed.", prerequisites: ["03-paragraph-practice"] },
    { id: "06-code-typing", title: "Code & Technical Typing", group: "specialized", day_fast_track: 6, day_full_course: 8, icon: "💻", description: "Type programming code, symbols, and technical text.", prerequisites: ["04-punctuation-mastery"] },
    { id: "07-speed-drill-medium", title: "Speed Drill — Medium", group: "speed", day_fast_track: 7, day_full_course: 10, icon: "⚡", description: "Increase target speed with accuracy focus.", prerequisites: ["05-speed-drill-basic"] },
    { id: "08-real-world-text", title: "Real-World Text Typing", group: "fluency", day_fast_track: 8, day_full_course: 11, icon: "📰", description: "Type from articles, emails, and documents.", prerequisites: ["06-code-typing"] },
    { id: "09-speed-drill-advanced", title: "Speed Drill — Advanced", group: "speed", day_fast_track: 9, day_full_course: 13, icon: "🚀", description: "Push for 60+ WPM with timed tests.", prerequisites: ["07-speed-drill-medium"] },
    { id: "10-final-assessment", title: "Final Speed & Accuracy Assessment", group: "assessment", day_fast_track: 10, day_full_course: 14, icon: "🏆", description: "Comprehensive test of all typing skills.", prerequisites: ["09-speed-drill-advanced"] }
  ],

  // ── english-grammar-basics (10 topics) ──
  "english-grammar-basics": [
    { id: "01-alphabet", title: "English Alphabet & Sounds", group: "basics", day_fast_track: 1, day_full_course: 1, icon: "🔤", description: "26 letters, vowel sounds, consonant sounds, and basic pronunciation.", prerequisites: [] },
    { id: "02-nouns", title: "Nouns — People, Places, Things", group: "grammar", day_fast_track: 2, day_full_course: 2, icon: "📝", description: "Common nouns, proper nouns, plural forms, and noun usage.", prerequisites: ["01-alphabet"] },
    { id: "03-pronouns", title: "Pronouns — Replacing Nouns", group: "grammar", day_fast_track: 3, day_full_course: 3, icon: "👤", description: "Personal, possessive, reflexive, and demonstrative pronouns.", prerequisites: ["02-nouns"] },
    { id: "04-articles", title: "Articles — A, An, The", group: "grammar", day_fast_track: 4, day_full_course: 4, icon: "📰", description: "Definite and indefinite articles and when to use each.", prerequisites: ["02-nouns"] },
    { id: "05-verbs-intro", title: "Verbs — Action Words", group: "grammar", day_fast_track: 5, day_full_course: 5, icon: "⚙️", description: "What are verbs, action vs linking verbs, and verb basics.", prerequisites: ["02-nouns"] },
    { id: "06-present-tense", title: "Present Tense", group: "grammar", day_fast_track: 6, day_full_course: 7, icon: "🔄", description: "Simple present, present continuous, present perfect.", prerequisites: ["05-verbs-intro"] },
    { id: "07-adjectives", title: "Adjectives — Describing Words", group: "grammar", day_fast_track: 7, day_full_course: 8, icon: "🎨", description: "Types of adjectives, comparison degrees, and placement.", prerequisites: ["02-nouns"] },
    { id: "08-adverbs", title: "Adverbs — Describing Actions", group: "grammar", day_fast_track: 8, day_full_course: 9, icon: "💨", description: "Adverbs of manner, time, place, and frequency.", prerequisites: ["05-verbs-intro"] },
    { id: "09-basic-sentences", title: "Building Basic Sentences", group: "grammar", day_fast_track: 9, day_full_course: 11, icon: "🏗️", description: "Put nouns, verbs, and adjectives together into sentences.", prerequisites: ["02-nouns", "05-verbs-intro"] },
    { id: "10-pronunciation", title: "Common Pronunciation Guide", group: "speaking", day_fast_track: 10, day_full_course: 12, icon: "🗣️", description: "Commonly mispronounced words and pronunciation tips.", prerequisites: ["01-alphabet"] }
  ],

  // ── english-tenses-structure (10 topics) ──
  "english-tenses-structure": [
    { id: "01-past-tense", title: "Simple Past Tense", group: "tenses", day_fast_track: 1, day_full_course: 1, icon: "⏮️", description: "Regular and irregular past tense verbs.", prerequisites: [] },
    { id: "02-past-continuous", title: "Past Continuous & Perfect", group: "tenses", day_fast_track: 2, day_full_course: 2, icon: "🔄", description: "Actions in progress in the past and completed past actions.", prerequisites: ["01-past-tense"] },
    { id: "03-future-tense", title: "Future Tenses", group: "tenses", day_fast_track: 3, day_full_course: 4, icon: "⏭️", description: "Will, going to, and future continuous.", prerequisites: ["01-past-tense"] },
    { id: "04-svo-structure", title: "SVO — Subject Verb Object", group: "structure", day_fast_track: 4, day_full_course: 5, icon: "📦", description: "The backbone of English sentence structure.", prerequisites: [] },
    { id: "05-questions", title: "Forming Questions", group: "structure", day_fast_track: 5, day_full_course: 7, icon: "❓", description: "Yes/No questions, Wh- questions, and question word order.", prerequisites: ["04-svo-structure"] },
    { id: "06-negation", title: "Negation — Making Things Negative", group: "structure", day_fast_track: 6, day_full_course: 8, icon: "🚫", description: "Negative sentences with not, don't, doesn't, and didn't.", prerequisites: ["04-svo-structure"] },
    { id: "07-prepositions", title: "Prepositions of Time & Place", group: "connecting", day_fast_track: 7, day_full_course: 10, icon: "📍", description: "In, on, at, to, for, with, and their correct usage.", prerequisites: ["04-svo-structure"] },
    { id: "08-conjunctions", title: "Conjunctions — Connecting Ideas", group: "connecting", day_fast_track: 8, day_full_course: 11, icon: "🔗", description: "And, but, or, because, so, although.", prerequisites: ["04-svo-structure"] },
    { id: "09-tense-comparison", title: "Tense Comparison & Usage", group: "tenses", day_fast_track: 9, day_full_course: 13, icon: "📊", description: "When to use which tense with real examples.", prerequisites: ["03-future-tense"] },
    { id: "10-sentence-practice", title: "Sentence Building Practice", group: "practice", day_fast_track: 10, day_full_course: 15, icon: "✍️", description: "Build various sentence types using all learned structures.", prerequisites: ["04-svo-structure"] }
  ],

  // ── english-vocabulary-grammar (10 topics) ──
  "english-vocabulary-grammar": [
    { id: "01-vocab-techniques", title: "Vocabulary Building Techniques", group: "vocabulary", day_fast_track: 1, day_full_course: 1, icon: "💢", description: "Word families, context clues, and memory techniques.", prerequisites: [] },
    { id: "02-prefixes-suffixes", title: "Prefixes & Suffixes", group: "vocabulary", day_fast_track: 2, day_full_course: 3, icon: "🔧", description: "un-, re-, pre-, -ly, -tion, -ment and word building.", prerequisites: ["01-vocab-techniques"] },
    { id: "03-synonyms-antonyms", title: "Synonyms & Antonyms", group: "vocabulary", day_fast_track: 3, day_full_course: 4, icon: "🔄", description: "Expanding vocabulary through word relationships.", prerequisites: ["01-vocab-techniques"] },
    { id: "04-active-voice", title: "Active Voice", group: "grammar", day_fast_track: 4, day_full_course: 5, icon: "➡️", description: "Clear, direct sentence construction with active voice.", prerequisites: [] },
    { id: "05-passive-voice", title: "Passive Voice", group: "grammar", day_fast_track: 5, day_full_course: 7, icon: "↩️", description: "When and how to use passive voice constructions.", prerequisites: ["04-active-voice"] },
    { id: "06-active-passive-convert", title: "Converting Active to Passive", group: "grammar", day_fast_track: 6, day_full_course: 8, icon: "🔀", description: "Transform sentences between active and passive voice.", prerequisites: ["05-passive-voice"] },
    { id: "07-conditionals", title: "Conditional Sentences", group: "grammar", day_fast_track: 7, day_full_course: 10, icon: "🔀", description: "Zero, first, second, and third conditionals.", prerequisites: [] },
    { id: "08-reported-speech", title: "Reported Speech", group: "grammar", day_fast_track: 8, day_full_course: 11, icon: "💬", description: "Direct vs indirect speech and tense changes.", prerequisites: [] },
    { id: "09-idioms-phrases", title: "Common Idioms & Phrases", group: "vocabulary", day_fast_track: 9, day_full_course: 13, icon: "💡", description: "Everyday English idioms and their meanings.", prerequisites: ["01-vocab-techniques"] },
    { id: "10-vocab-test", title: "Vocabulary & Grammar Test", group: "assessment", day_fast_track: 10, day_full_course: 15, icon: "📊", description: "Comprehensive test of vocabulary and advanced grammar.", prerequisites: ["02-prefixes-suffixes", "05-passive-voice"] }
  ],

  // ── english-professional (10 topics) ──
  "english-professional": [
    { id: "01-daily-greetings", title: "Daily Greetings & Introductions", group: "conversation", day_fast_track: 1, day_full_course: 1, icon: "👋", description: "Hello, how are you, introducing yourself, and common pleasantries.", prerequisites: [] },
    { id: "02-daily-conversations", title: "Everyday Conversations", group: "conversation", day_fast_track: 2, day_full_course: 2, icon: "🗣️", description: "Shopping, directions, restaurants, and daily situations.", prerequisites: ["01-daily-greetings"] },
    { id: "03-phone-email", title: "Phone Calls & Email Etiquette", group: "professional", day_fast_track: 3, day_full_course: 4, icon: "📞", description: "Professional phone manner and email writing basics.", prerequisites: ["01-daily-greetings"] },
    { id: "04-paragraph-writing", title: "Paragraph Writing", group: "writing", day_fast_track: 4, day_full_course: 5, icon: "✍️", description: "Topic sentences, supporting details, and concluding sentences.", prerequisites: ["01-daily-greetings"] },
    { id: "05-essay-structure", title: "Essay Structure & Writing", group: "writing", day_fast_track: 5, day_full_course: 7, icon: "📄", description: "Introduction, body paragraphs, and conclusion structure.", prerequisites: ["04-paragraph-writing"] },
    { id: "06-transition-words", title: "Transition Words & Flow", group: "writing", day_fast_track: 6, day_full_course: 8, icon: "🔗", description: "However, moreover, furthermore, and creating smooth text.", prerequisites: ["04-paragraph-writing"] },
    { id: "07-interview-intro", title: "Interview Preparation Basics", group: "professional", day_fast_track: 7, day_full_course: 10, icon: "💼", description: "Tell me about yourself, common questions, and first impressions.", prerequisites: ["03-phone-email"] },
    { id: "08-interview-answers", title: "Answering Interview Questions", group: "professional", day_fast_track: 8, day_full_course: 11, icon: "🎤", description: "STAR method, behavioral questions, and confident answers.", prerequisites: ["07-interview-intro"] },
    { id: "09-professional-vocab", title: "Professional Vocabulary", group: "vocabulary", day_fast_track: 9, day_full_course: 13, icon: "📚", description: "Workplace vocabulary, business terms, and formal expressions.", prerequisites: ["03-phone-email"] },
    { id: "10-final-assessment", title: "Communication Skills Assessment", group: "assessment", day_fast_track: 10, day_full_course: 15, icon: "🏆", description: "Comprehensive assessment of speaking, writing, and professional English.", prerequisites: ["05-essay-structure", "08-interview-answers"] }
  ],

  // ── self-awareness-mindset (10 topics) ──
  "self-awareness-mindset": [
    { id: "01-self-awareness", title: "Self-Awareness Fundamentals", group: "foundation", day_fast_track: 1, day_full_course: 1, icon: "🧠", description: "Understanding your strengths, weaknesses, emotions, and values.", prerequisites: [] },
    { id: "02-emotional-intelligence", title: "Emotional Intelligence (EQ)", group: "foundation", day_fast_track: 2, day_full_course: 2, icon: "❤️", description: "Self-awareness, self-regulation, motivation, empathy, social skills.", prerequisites: ["01-self-awareness"] },
    { id: "03-growth-mindset", title: "Growth Mindset", group: "mindset", day_fast_track: 3, day_full_course: 4, icon: "🌱", description: "Belief that abilities develop through effort and learning.", prerequisites: ["01-self-awareness"] },
    { id: "04-self-talk", title: "Positive Self-Talk", group: "mindset", day_fast_track: 4, day_full_course: 5, icon: "💬", description: "Replace negative thoughts with constructive inner dialogue.", prerequisites: ["03-growth-mindset"] },
    { id: "05-confidence", title: "Building Confidence", group: "mindset", day_fast_track: 5, day_full_course: 7, icon: "💪", description: "Action-based confidence, comfort zones, and small wins.", prerequisites: ["01-self-awareness"] },
    { id: "06-self-reflection", title: "Self-Reflection Practices", group: "foundation", day_fast_track: 6, day_full_course: 8, icon: "🪞", description: "Journaling, daily reviews, and the Johari Window.", prerequisites: ["01-self-awareness"] },
    { id: "07-values-clarification", title: "Values & Purpose", group: "foundation", day_fast_track: 7, day_full_course: 9, icon: "🎯", description: "Identify your core values and align actions with purpose.", prerequisites: ["01-self-awareness"] },
    { id: "08-overcoming-fear", title: "Overcoming Fear & Self-Doubt", group: "mindset", day_fast_track: 8, day_full_course: 11, icon: "🦸", description: "Face fears, build resilience, and push through discomfort.", prerequisites: ["05-confidence"] },
    { id: "09-visualization", title: "Visualization & Affirmations", group: "mindset", day_fast_track: 9, day_full_course: 12, icon: "🌈", description: "Mental rehearsal, positive affirmations, and habit formation.", prerequisites: ["03-growth-mindset"] },
    { id: "10-mindset-assessment", title: "Self-Awareness Assessment", group: "assessment", day_fast_track: 10, day_full_course: 14, icon: "📊", description: "Evaluate your self-awareness and mindset growth.", prerequisites: ["06-self-reflection", "07-values-clarification"] }
  ],

  // ── communication-skills (10 topics) ──
  "communication-skills": [
    { id: "01-communication-basics", title: "Communication Fundamentals", group: "fundamentals", day_fast_track: 1, day_full_course: 1, icon: "🗣️", description: "The 7-38-55 rule: words, tone, and body language.", prerequisites: [] },
    { id: "02-active-listening", title: "Active Listening", group: "skills", day_fast_track: 2, day_full_course: 3, icon: "👂", description: "Give full attention, paraphrase, ask clarifying questions.", prerequisites: ["01-communication-basics"] },
    { id: "03-verbal-communication", title: "Verbal Communication Skills", group: "skills", day_fast_track: 3, day_full_course: 4, icon: "🗣️", description: "Clarity, conciseness, tone modulation, and vocal variety.", prerequisites: ["01-communication-basics"] },
    { id: "04-body-language", title: "Body Language & Non-Verbal", group: "skills", day_fast_track: 4, day_full_course: 6, icon: "👤", description: "Eye contact, gestures, posture, and personal space.", prerequisites: ["01-communication-basics"] },
    { id: "05-written-communication", title: "Written Communication", group: "skills", day_fast_track: 5, day_full_course: 7, icon: "✍️", description: "Clear emails, messages, reports, and professional writing.", prerequisites: ["01-communication-basics"] },
    { id: "06-think-framework", title: "The THINK Framework", group: "techniques", day_fast_track: 6, day_full_course: 8, icon: "💡", description: "True, Helpful, Inspiring, Necessary, Kind — before speaking.", prerequisites: ["03-verbal-communication"] },
    { id: "07-difficult-conversations", title: "Difficult Conversations", group: "advanced", day_fast_track: 7, day_full_course: 10, icon: "⚡", description: "I-statements, de-escalation, and finding common ground.", prerequisites: ["03-verbal-communication"] },
    { id: "08-empathy", title: "Empathy & Understanding Others", group: "skills", day_fast_track: 8, day_full_course: 11, icon: "❤️", description: "Cognitive empathy, emotional empathy, and compassionate communication.", prerequisites: ["02-active-listening"] },
    { id: "09-feedback-skills", title: "Giving & Receiving Feedback", group: "advanced", day_fast_track: 9, day_full_course: 13, icon: "🔄", description: "Constructive feedback, SBI model, and accepting criticism gracefully.", prerequisites: ["03-verbal-communication"] },
    { id: "10-comm-assessment", title: "Communication Skills Assessment", group: "assessment", day_fast_track: 10, day_full_course: 14, icon: "🏆", description: "Evaluate your communication and identify growth areas.", prerequisites: ["02-active-listening", "04-body-language"] }
  ],

  // ── productivity-wellness (10 topics) ──
  "productivity-wellness": [
    { id: "01-time-management", title: "Time Management Fundamentals", group: "productivity", day_fast_track: 1, day_full_course: 1, icon: "⏰", description: "Eisenhower Matrix, priorities, and managing your schedule.", prerequisites: [] },
    { id: "02-pomodoro", title: "Pomodoro Technique & Focus", group: "productivity", day_fast_track: 2, day_full_course: 2, icon: "🍅", description: "25-minute focused work sessions and deep work blocks.", prerequisites: ["01-time-management"] },
    { id: "03-goal-setting", title: "SMART Goal Setting", group: "productivity", day_fast_track: 3, day_full_course: 4, icon: "🎯", description: "Specific, Measurable, Achievable, Relevant, Time-bound goals.", prerequisites: ["01-time-management"] },
    { id: "04-habits-routines", title: "Building Habits & Routines", group: "productivity", day_fast_track: 4, day_full_course: 5, icon: "🔄", description: "Habit stacking, morning routines, and consistency.", prerequisites: ["01-time-management"] },
    { id: "05-stress-intro", title: "Understanding Stress", group: "wellness", day_fast_track: 5, day_full_course: 7, icon: "😰", description: "What causes stress, the stress response, and chronic vs acute stress.", prerequisites: [] },
    { id: "06-breathing-exercises", title: "Breathing & Relaxation Techniques", group: "wellness", day_fast_track: 6, day_full_course: 8, icon: "🫁", description: "4-7-8 breathing, progressive muscle relaxation, and body scans.", prerequisites: ["05-stress-intro"] },
    { id: "07-mindfulness", title: "Mindfulness & Meditation", group: "wellness", day_fast_track: 7, day_full_course: 9, icon: "🧘", description: "Present-moment awareness, meditation basics, and daily practice.", prerequisites: ["06-breathing-exercises"] },
    { id: "08-work-life-balance", title: "Work-Life Balance", group: "wellness", day_fast_track: 8, day_full_course: 11, icon: "⚖️", description: "Setting boundaries, disconnecting, and sustainable productivity.", prerequisites: ["01-time-management"] },
    { id: "09-sleep-health", title: "Sleep & Physical Health", group: "wellness", day_fast_track: 9, day_full_course: 12, icon: "😴", description: "Sleep hygiene, exercise, nutrition, and their impact on productivity.", prerequisites: ["05-stress-intro"] },
    { id: "10-productivity-test", title: "Productivity & Wellness Assessment", group: "assessment", day_fast_track: 10, day_full_course: 14, icon: "🏆", description: "Evaluate your habits, stress levels, and productivity system.", prerequisites: ["04-habits-routines", "07-mindfulness"] }
  ],

  // ── leadership-teamwork (10 topics) ──
  "leadership-teamwork": [
    { id: "01-leadership-intro", title: "Leadership Fundamentals", group: "leadership", day_fast_track: 1, day_full_course: 1, icon: "👑", description: "What is leadership, styles, and influence vs authority.", prerequisites: [] },
    { id: "02-leadership-styles", title: "Leadership Styles", group: "leadership", day_fast_track: 2, day_full_course: 3, icon: "🎭", description: "Servant, transformational, democratic, and situational leadership.", prerequisites: ["01-leadership-intro"] },
    { id: "03-decision-making", title: "Decision Making", group: "leadership", day_fast_track: 3, day_full_course: 4, icon: "⚖️", description: "Gather facts, consider options, decide, and execute.", prerequisites: ["01-leadership-intro"] },
    { id: "04-delegation", title: "Delegation Skills", group: "leadership", day_fast_track: 4, day_full_course: 5, icon: "🤝", description: "Give the right task to the right person and trust them.", prerequisites: ["01-leadership-intro"] },
    { id: "05-team-dynamics", title: "Team Dynamics", group: "teamwork", day_fast_track: 5, day_full_course: 7, icon: "👥", description: "Forming, storming, norming, performing — stages of team development.", prerequisites: [] },
    { id: "06-conflict-resolution", title: "Conflict Resolution", group: "teamwork", day_fast_track: 6, day_full_course: 8, icon: "🕊️", description: "Listen, acknowledge, find common ground, and resolve disagreements.", prerequisites: ["05-team-dynamics"] },
    { id: "07-motivation", title: "Motivating Others", group: "leadership", day_fast_track: 7, day_full_course: 10, icon: "🔥", description: "Intrinsic vs extrinsic motivation, recognition, and empowerment.", prerequisites: ["01-leadership-intro"] },
    { id: "08-collaboration", title: "Effective Collaboration", group: "teamwork", day_fast_track: 8, day_full_course: 11, icon: "🤝", description: "Working together, shared goals, and complementary strengths.", prerequisites: ["05-team-dynamics"] },
    { id: "09-team-building", title: "Team Building Activities", group: "teamwork", day_fast_track: 9, day_full_course: 12, icon: "🎯", description: "Trust exercises, communication games, and building team culture.", prerequisites: ["05-team-dynamics"] },
    { id: "10-leadership-assessment", title: "Leadership & Teamwork Assessment", group: "assessment", day_fast_track: 10, day_full_course: 14, icon: "🏆", description: "Evaluate your leadership and teamwork skills.", prerequisites: ["04-delegation", "06-conflict-resolution"] }
  ],

  // ── career-development (10 topics) ──
  "career-development": [
    { id: "01-elevator-pitch", title: "Crafting Your Elevator Pitch", group: "branding", day_fast_track: 1, day_full_course: 1, icon: "🎤", description: "30-second introduction that makes a lasting impression.", prerequisites: [] },
    { id: "02-personal-branding", title: "Personal Branding", group: "branding", day_fast_track: 2, day_full_course: 2, icon: "⭐", description: "What do people say about you? Define and build your brand.", prerequisites: ["01-elevator-pitch"] },
    { id: "03-networking-basics", title: "Professional Networking", group: "networking", day_fast_track: 3, day_full_course: 4, icon: "🔗", description: "Build genuine relationships, give before you take, follow up.", prerequisites: ["01-elevator-pitch"] },
    { id: "04-linkedin", title: "LinkedIn Optimization", group: "branding", day_fast_track: 4, day_full_course: 5, icon: "💼", description: "Photo, headline, summary, recommendations, and networking on LinkedIn.", prerequisites: ["02-personal-branding"] },
    { id: "05-public-speaking", title: "Public Speaking Basics", group: "speaking", day_fast_track: 5, day_full_course: 7, icon: "🎙️", description: "The 3 P's: Preparation, Practice, Performance.", prerequisites: [] },
    { id: "06-storytelling", title: "Storytelling in Presentations", group: "speaking", day_fast_track: 6, day_full_course: 8, icon: "📖", description: "Hook, structure, and delivery — stories people remember.", prerequisites: ["05-public-speaking"] },
    { id: "07-overcoming-nervousness", title: "Overcoming Stage Fright", group: "speaking", day_fast_track: 7, day_full_course: 10, icon: "😤", description: "Reframe anxiety, breathing techniques, and practice strategies.", prerequisites: ["05-public-speaking"] },
    { id: "08-career-planning", title: "Career Planning & Vision", group: "career", day_fast_track: 8, day_full_course: 11, icon: "🗺️", description: "Skills inventory, gap analysis, and career roadmap.", prerequisites: [] },
    { id: "09-interview-prep", title: "Interview Preparation", group: "career", day_fast_track: 9, day_full_course: 13, icon: "🤝", description: "Research, common questions, STAR method, and follow-up.", prerequisites: ["08-career-planning"] },
    { id: "10-career-assessment", title: "Career Development Assessment", group: "assessment", day_fast_track: 10, day_full_course: 14, icon: "🏆", description: "Evaluate your networking, speaking, and career planning skills.", prerequisites: ["04-linkedin", "06-storytelling"] }
  ]
};

// ============================================
// CONTENT GENERATION TEMPLATES
// ============================================

// Template functions that generate rich content based on topic metadata

function generateQuickJSON(topicId, topicMeta, courseId) {
  const sections = generateQuickSections(topicId, topicMeta);
  return {
    topicId,
    type: "quick",
    estimatedMinutes: 5,
    sections: sections,
    jargon: generateJargon(topicId, topicMeta),
    summary: generateQuickSummary(topicId, topicMeta)
  };
}

function generateDeepJSON(topicId, topicMeta, courseId) {
  return {
    topicId,
    type: "deep",
    estimatedMinutes: 15,
    sections: generateDeepSections(topicId, topicMeta),
    summary: generateDeepSummary(topicId, topicMeta)
  };
}

function generateComparisonJSON(topicId, topicMeta, courseId) {
  return {
    topicId,
    comparisons: generateComparisons(topicId, topicMeta),
    keyInsight: generateKeyInsight(topicId, topicMeta)
  };
}

function generateInterviewJSON(topicId, topicMeta, courseId) {
  return {
    topicId,
    questions: generateInterviewQuestions(topicId, topicMeta)
  };
}

function generateExercisesJSON(topicId, topicMeta, courseId) {
  return {
    topicId,
    exercises: generateExercises(topicId, topicMeta)
  };
}

// ============================================
// CONTENT GENERATION LOGIC
// ============================================

function generateQuickSections(topicId, topic) {
  const title = topic.title;
  const desc = topic.description;

  return [
    {
      heading: `What is ${title.split('—')[0].trim()}?`,
      body: desc + ` This lesson covers the essential concepts you need to understand to get started effectively.`
    },
    {
      heading: "Key Concepts",
      body: generateKeyConcepts(topicId, topic)
    },
    {
      heading: "Why This Matters",
      body: `Understanding ${title.split('—')[0].trim()} is crucial because it builds the foundation for everything that follows. Master this topic and you'll find subsequent concepts much easier to learn.`
    }
  ];
}

function generateKeyConcepts(topicId, topic) {
  const name = topic.title.split('—')[0].trim();
  return `${name} is a fundamental concept that every developer needs to master. Here are the core ideas:\n\n1. Core Principle: The main idea behind ${name} is understanding how different components work together.\n\n2. Application: In practice, you'll use ${name} every day when building applications. It's one of those skills that becomes second nature.\n\n3. Common Patterns: Most ${name} implementations follow predictable patterns. Once you recognize them, you can apply them quickly.`;
}

function generateJargon(topicId, topic) {
  const words = topic.title.split(/[\s—]+/).filter(w => w.length > 3).slice(0, 3);
  return words.map(w => ({
    term: w,
    definition: `A key concept in ${topic.title.split('—')[0].trim()}. Understanding this term is essential for mastering the topic.`
  }));
}

function generateQuickSummary(topicId, topic) {
  return `${topic.title.split('—')[0].trim()} is a core concept in ${topic.group}. ${topic.description} Focus on understanding the fundamentals first, then practice applying them.`;
}

function generateDeepSections(topicId, topic) {
  const name = topic.title.split('—')[0].trim();
  return [
    {
      heading: `Deep Dive: ${name}`,
      body: `Let's go deeper into ${name}. This section covers the internals and advanced concepts that separate beginners from proficient developers.`,
      code: generateCodeExample(topicId, topic)
    },
    {
      heading: "Practical Implementation",
      body: `Here's how to implement ${name} in a real project. The key is to start simple and add complexity as you gain confidence.`,
      code: generateImplementationExample(topicId, topic)
    },
    {
      heading: "Common Patterns & Best Practices",
      body: generateBestPractices(topicId, topic)
    },
    {
      heading: "Practice Task",
      body: `Apply what you've learned about ${name}. Try building a small project that uses these concepts. Start with the basics and gradually add features.`
    }
  ];
}

function generateCodeExample(topicId, topic) {
  const isTyping = topic.group === 'home-row' || topic.group === 'rows' || topic.group === 'practice' || topic.group === 'basics' || topic.group === 'technique' || topic.group === 'fluency' || topic.group === 'speed' || topic.group === 'assessment';
  const isSoftSkill = topic.group === 'foundation' || topic.group === 'mindset' || topic.group === 'wellness' || topic.group === 'leadership' || topic.group === 'teamwork' || topic.group === 'branding' || topic.group === 'speaking' || topic.group === 'career' || topic.group === 'communication' || topic.group === 'skills' || topic.group === 'techniques' || topic.group === 'productivity';

  if (isTyping) {
    return {
      language: "text",
      snippet: `Practice exercise for ${topic.title}:\n\nFocus on accuracy first, then speed.\nKeep your eyes on the screen.\nUse proper finger placement.\nPractice for 15-20 minutes daily.`,
      explanation: "Consistent daily practice is the key to improvement. Start slow and focus on accuracy."
    };
  }

  if (isSoftSkill) {
    return {
      language: "text",
      snippet: `Key exercise: ${topic.title}\n\n1. Read the concepts carefully\n2. Reflect on how they apply to your life\n3. Choose one action to practice this week\n4. Track your progress in a journal\n5. Discuss with a peer or mentor`,
      explanation: "Soft skills improve through deliberate practice and reflection. Apply what you learn in real situations."
    };
  }

  return {
    language: "javascript",
    snippet: `// Example: ${topic.title}\n// This demonstrates the core concept\n\nconst example = {\n  concept: "${topic.title.split('—')[0].trim()}",\n  description: "${topic.description.substring(0, 80)}",\n  importance: "high"\n};\n\n// Apply this concept in your projects\nconsole.log("Understanding: " + example.concept);`,
    explanation: `This example shows the basic structure. In practice, you'll use ${topic.title.split('—')[0].trim()} throughout your projects.`
  };
}

function generateImplementationExample(topicId, topic) {
  const isCoding = topic.group === 'fundamentals' || topic.group === 'layout' || topic.group === 'data-structures' || topic.group === 'browser' || topic.group === 'modern' || topic.group === 'best-practices' || topic.group === 'api-design' || topic.group === 'client-side' || topic.group === 'infrastructure' || topic.group === 'database' || topic.group === 'patterns' || topic.group === 'features' || topic.group === 'version-control' || topic.group === 'deployment' || topic.group === 'devops' || topic.group === 'tools' || topic.group === 'optimization' || topic.group === 'caching' || topic.group === 'reliability' || topic.group === 'user-experience' || topic.group === 'security' || topic.group === 'auth' || topic.group === 'storage' || topic.group === 'media' || topic.group === 'interactive' || topic.group === 'layout' || topic.group === 'project';

  if (!isCoding) {
    return {
      language: "text",
      snippet: `Application exercise for ${topic.title}:\n\nStep 1: Identify a situation where you can apply this skill\nStep 2: Plan your approach using the techniques learned\nStep 3: Execute and observe the results\nStep 4: Reflect on what worked and what to improve`,
      explanation: "The best way to learn soft skills is through real-world application and reflection."
    };
  }

  return {
    language: "javascript",
    snippet: `// Practical implementation of ${topic.title.split('—')[0].trim()}\n\n// Step 1: Set up the basic structure\nfunction implement${topicId.replace(/-/g, '').replace(/^\d+/, '')}(config = {}) {\n  const defaults = {\n    enabled: true,\n    verbose: false\n  };\n  \n  const options = { ...defaults, ...config };\n  \n  // Step 2: Core logic\n  if (options.enabled) {\n    console.log("Implementing: ${topic.title.split('—')[0].trim()}");\n    // Your implementation here\n  }\n  \n  return options;\n}\n\n// Step 3: Use it\nimplement${topicId.replace(/-/g, '').replace(/^\d+/, '')}({ verbose: true });`,
    explanation: "This pattern shows how to structure your implementation. Adapt it to your specific use case."
  };
}

function generateBestPractices(topicId, topic) {
  return `Here are the best practices for ${topic.title.split('—')[0].trim()}:\n\n1. Start Simple: Begin with the simplest implementation that works, then add complexity as needed.\n\n2. Follow Conventions: Stick to established patterns and conventions in your codebase. Consistency makes code maintainable.\n\n3. Test Your Work: Always test your implementation. Write tests that cover both happy paths and edge cases.\n\n4. Document Decisions: Add comments that explain WHY, not WHAT. Future you (and teammates) will thank you.\n\n5. Review and Refactor: Code reviews and regular refactoring keep code quality high.`;
}

function generateDeepSummary(topicId, topic) {
  return `${topic.title.split('—')[0].trim()} is an essential concept that you'll use throughout your development journey. ${topic.description} Practice the examples in this lesson and apply them to your own projects.`;
}

function generateComparisons(topicId, topic) {
  return [
    {
      concept: topic.title.split('—')[0].trim(),
      javascript: {
        language: "javascript",
        code: `// JavaScript approach to ${topic.title.split('—')[0].trim()}\nconst result = {\n  concept: "${topic.title.split('—')[0].trim()}",\n  approach: "modern",\n  complexity: "moderate"\n};\nconsole.log(result);`
      },
      python: {
        language: "python",
        code: `# Python approach to ${topic.title.split('—')[0].trim()}\nresult = {\n    "concept": "${topic.title.split('—')[0].trim()}",\n    "approach": "pythonic",\n    "complexity": "moderate"\n}\nprint(result)`
      },
      explanation: `The core concept of ${topic.title.split('—')[0].trim()} is the same across languages. The syntax differs, but the underlying principles are universal.`
    }
  ];
}

function generateKeyInsight(topicId, topic) {
  return `The key insight about ${topic.title.split('—')[0].trim()} is that understanding the fundamentals deeply will make advanced concepts feel natural. Don't rush through the basics — they're the foundation for everything else.`;
}

function generateInterviewQuestions(topicId, topic) {
  const name = topic.title.split('—')[0].trim();
  return [
    {
      question: `What is ${name} and why is it important?`,
      answer: `${name} is a fundamental concept that ${topic.description} It's important because it forms the foundation for building robust and efficient applications. Understanding ${name} allows developers to make better architectural decisions and write cleaner code.`,
      difficulty: "easy"
    },
    {
      question: `How do you apply ${name} in a real project?`,
      answer: `In practice, ${name} is applied by following established patterns and best practices. Start with the simplest implementation, test thoroughly, and iterate. The key is to understand the underlying principles so you can adapt to different scenarios.`,
      difficulty: "medium"
    },
    {
      question: `What are common mistakes when working with ${name}?`,
      answer: `Common mistakes include: not understanding the fundamentals before applying advanced patterns, ignoring edge cases, not testing adequately, and over-engineering solutions. The best approach is to start simple and add complexity only when needed.`,
      difficulty: "medium"
    },
    {
      question: `How would you explain ${name} to a beginner?`,
      answer: `${name} is essentially about ${topic.description.toLowerCase()} Think of it as a building block — once you understand this concept, you can combine it with other concepts to build complex applications.`,
      difficulty: "easy"
    }
  ];
}

function generateExercises(topicId, topic) {
  const name = topic.title.split('—')[0].trim();
  return [
    {
      title: `Understanding ${name}`,
      description: `Review the concepts in this lesson and explain ${name} in your own words. Write down the key points and how they connect to what you already know.`,
      hints: ["Reread the quick lesson", "Write down key terms", "Connect to previous topics"],
      solution: { language: "text", code: `Key points about ${name}:\n1. ${topic.description}\n2. Core concept: Understanding the fundamentals\n3. Application: Use in real projects` },
      difficulty: "easy"
    },
    {
      title: `Hands-on Practice: ${name}`,
      description: `Apply what you learned about ${name} in a practical exercise. Start with the basics and build up to more complex implementations.`,
      hints: ["Start with a simple example", "Test each step", "Don't skip the fundamentals"],
      solution: { language: "text", code: `Practice steps:\n1. Set up your environment\n2. Implement the basic version\n3. Add advanced features\n4. Test and debug\n5. Refactor and optimize` },
      difficulty: "medium"
    },
    {
      title: `Challenge: ${name} Mastery`,
      description: `Push your understanding of ${name} by tackling a more complex scenario. This exercise combines multiple concepts from this lesson.`,
      hints: ["Review all sections of the lesson", "Break the problem into smaller parts", "Use the code examples as a starting point"],
      solution: { language: "text", code: `Challenge approach:\n1. Analyze the requirements\n2. Design your solution\n3. Implement step by step\n4. Test edge cases\n5. Document your approach` },
      difficulty: "hard"
    }
  ];
}

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

function generateAll() {
  let totalFiles = 0;
  let totalTopics = 0;

  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  WebLearn Academy — Course Splitter Generator   ║');
  console.log('║  Splitting 5 courses → 23 comprehensive courses ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Step 1: Generate content for each course
  for (const [courseId, course] of Object.entries(COURSES)) {
    const topics = TOPICS[courseId];
    if (!topics) {
      console.log(`⚠️  No topics defined for ${courseId}, skipping...`);
      continue;
    }

    console.log(`\n📚 Generating: ${course.title} (${topics.length} topics)`);

    for (const topic of topics) {
      const topicDir = path.join(CONTENT_DIR, course.contentDir, topic.id);

      // Generate all 5 JSON files
      writeJSON(path.join(topicDir, 'quick.json'), generateQuickJSON(topic.id, topic, courseId));
      writeJSON(path.join(topicDir, 'deep.json'), generateDeepJSON(topic.id, topic, courseId));
      writeJSON(path.join(topicDir, 'comparison.json'), generateComparisonJSON(topic.id, topic, courseId));
      writeJSON(path.join(topicDir, 'interview.json'), generateInterviewJSON(topic.id, topic, courseId));
      writeJSON(path.join(topicDir, 'exercises.json'), generateExercisesJSON(topic.id, topic, courseId));

      totalFiles += 5;
    }

    // Generate index.js for this course
    const indexContent = `module.exports = ${JSON.stringify(topics, null, 2)};`;
    writeJS(path.join(CONTENT_DIR, course.contentDir, 'index.js'), indexContent);

    totalFiles += 1; // index.js
    totalTopics += topics.length;

    console.log(`   ✅ ${topics.length} topics × 5 files + index.js = ${topics.length * 5 + 1} files`);
  }

  // Step 2: Update courses.json
  console.log('\n📝 Updating courses.json...');
  const existingCourses = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'courses.json'), 'utf-8'));
  
  // Merge new courses into existing (preserving any extra fields from existing)
  for (const [courseId, course] of Object.entries(COURSES)) {
    existingCourses.courses[courseId] = course;
  }

  writeJSON(path.join(DATA_DIR, 'courses.json'), existingCourses);
  console.log(`   ✅ courses.json updated with ${Object.keys(COURSES).length} courses`);

  // Step 3: Generate the main content/index.js that loads all courses
  console.log('\n📝 Updating content/index.js...');
  const mainIndexContent = `// ============================================
// Content Index — All Courses
// Auto-generated by generate-split-courses.js
// ============================================

const courses = {};

${Object.keys(COURSES).map(id => `courses['${id}'] = require('./${id}/index');`).join('\n')}

module.exports = courses;
`;
  writeJS(path.join(CONTENT_DIR, 'index.js'), mainIndexContent);
  totalFiles += 1;

  // Summary
  console.log('\n' + '═'.repeat(52));
  console.log('📊 GENERATION SUMMARY');
  console.log('═'.repeat(52));
  console.log(`  Total courses:    ${Object.keys(COURSES).length}`);
  console.log(`  Total topics:     ${totalTopics}`);
  console.log(`  Content files:    ${totalTopics * 5} (JSON)`);
  console.log(`  Index files:      ${Object.keys(COURSES).length + 1} (JS)`);
  console.log(`  Total files:      ${totalFiles}`);
  console.log('═'.repeat(52));

  // List all courses
  console.log('\n📋 COURSE LIST:');
  let i = 1;
  for (const [courseId, course] of Object.entries(COURSES)) {
    const topicCount = TOPICS[courseId]?.length || 0;
    console.log(`  ${String(i).padStart(2)}. ${course.emoji} ${course.title} (${topicCount} topics)`);
    i++;
  }
  console.log('');

  return { courses: Object.keys(COURSES).length, topics: totalTopics, files: totalFiles };
}

// Run the generator
if (require.main === module) {
  generateAll();
} else {
  module.exports = { COURSES, TOPICS, generateAll };
}

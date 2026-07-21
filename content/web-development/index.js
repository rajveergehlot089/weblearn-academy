// ============================================
// Topics List (Course Curriculum)
// ============================================
// This file defines all the topics in our learning platform.
// Each topic has metadata used for display and ordering.
// The actual content (lessons, exercises) is in separate JSON files.

module.exports = [
  {
    id: "01-html", // Unique identifier (matches folder name in content/)
    title: "HTML — The Structure of the Web", // Display title
    group: "fundamentals", // Category group
    day_fast_track: 1, // Day number in 15-day fast track mode
    day_full_course: 1, // Day number in 30-day full course mode
    icon: "📄", // Emoji icon for the topic card
    description: "Learn how every webpage is built with HTML tags — the skeleton of the internet.",
    prerequisites: [] // Topics you should complete first (empty = no prerequisites)
  },
  {
    id: "02-css",
    title: "CSS — Styling Your Pages",
    group: "fundamentals",
    day_fast_track: 2,
    day_full_course: 3,
    icon: "🎨",
    description: "Make your HTML beautiful with colors, layouts, and responsive design.",
    prerequisites: ["01-html"] // Must complete HTML first
  },
  {
    id: "03-javascript",
    title: "JavaScript — Making Pages Interactive",
    group: "fundamentals",
    day_fast_track: 3,
    day_full_course: 5,
    icon: "⚡",
    description: "Add logic, interactivity, and dynamic behavior to your web pages.",
    prerequisites: ["01-html", "02-css"]
  },
  {
    id: "04-http-https",
    title: "HTTP/HTTPS — How the Web Talks",
    group: "networking",
    day_fast_track: 4,
    day_full_course: 7,
    icon: "🌐",
    description: "Understand how computers communicate over the internet — requests, responses, and security.",
    prerequisites: ["03-javascript"]
  },
  {
    id: "05-api-gateway",
    title: "API Gateway & Rate Limiting",
    group: "networking",
    day_fast_track: 5,
    day_full_course: 9,
    icon: "🚪",
    description: "Learn how APIs are managed, protected, and controlled at scale.",
    prerequisites: ["04-http-https"]
  },
  {
    id: "06-routing-rest-graphql",
    title: "Routing, REST APIs & GraphQL",
    group: "backend",
    day_fast_track: 6,
    day_full_course: 11,
    icon: "🗺️",
    description: "How servers organize endpoints and how clients fetch data — REST vs GraphQL.",
    prerequisites: ["04-http-https"]
  },
  {
    id: "07-auth",
    title: "Authentication — JWT, Sessions & OAuth",
    group: "security",
    day_fast_track: 7,
    day_full_course: 13,
    icon: "🔐",
    description: "How websites know who you are and keep your account safe.",
    prerequisites: ["06-routing-rest-graphql"]
  },
  {
    id: "08-cookies-localstorage",
    title: "Cookies vs LocalStorage",
    group: "security",
    day_fast_track: 8,
    day_full_course: 15,
    icon: "🍪",
    description: "Where browsers store data — the difference between cookies and local storage.",
    prerequisites: ["07-auth"]
  },
  {
    id: "09-databases-crud",
    title: "Databases & CRUD Operations",
    group: "backend",
    day_fast_track: 9,
    day_full_course: 17,
    icon: "🗄️",
    description: "How apps store, retrieve, update, and delete data permanently.",
    prerequisites: ["06-routing-rest-graphql"]
  },
  {
    id: "10-error-handling",
    title: "Error Handling",
    group: "best-practices",
    day_fast_track: 10,
    day_full_course: 19,
    icon: "🛡️",
    description: "How to anticipate, catch, and gracefully handle things going wrong.",
    prerequisites: ["03-javascript"]
  },
  {
    id: "11-loading-caching",
    title: "Loading States & Caching",
    group: "best-practices",
    day_fast_track: 11,
    day_full_course: 21,
    icon: "⏳",
    description: "Keep users informed while data loads and make repeat visits instant.",
    prerequisites: ["03-javascript", "10-error-handling"]
  },
  {
    id: "12-deployment",
    title: "Deployment — Putting Your App Online",
    group: "devops",
    day_fast_track: 12,
    day_full_course: 24,
    icon: "🚀",
    description: "Ship your frontend and backend to the real internet so anyone can use them.",
    prerequisites: ["09-databases-crud"]
  },
  {
    id: "13-modern-html-css",
    title: "Modern HTML & CSS — Flexbox, Grid & Variables",
    group: "modern",
    day_fast_track: 13,
    day_full_course: 26,
    icon: "📐",
    description: "Professional layout techniques that power every modern website.",
    prerequisites: ["02-css"]
  },
  {
    id: "14-modern-javascript",
    title: "Modern JavaScript — ES6+, Async/Await & Fetch",
    group: "modern",
    day_fast_track: 14,
    day_full_course: 28,
    icon: "🚀",
    description: "The modern JavaScript features used in every professional codebase.",
    prerequisites: ["03-javascript"]
  },
  {
    id: "capstone",
    title: "Capstone — DevBlog Platform",
    group: "project",
    day_fast_track: 15,
    day_full_course: 30,
    icon: "🏆",
    description: "Build a complete blog app tying together everything you've learned.",
    prerequisites: ["01-html", "02-css", "03-javascript", "04-http-https", "07-auth", "09-databases-crud"]
  }
];

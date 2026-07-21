module.exports = [
  {
    "id": "01-performance-intro",
    "title": "Web Performance Fundamentals",
    "group": "fundamentals",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "⚡",
    "description": "Why performance matters, Core Web Vitals, and measuring speed.",
    "prerequisites": []
  },
  {
    "id": "02-loading-states",
    "title": "Loading States & UX",
    "group": "user-experience",
    "day_fast_track": 2,
    "day_full_course": 3,
    "icon": "⏳",
    "description": "Spinners, skeleton screens, progress bars, and keeping users informed.",
    "prerequisites": [
      "01-performance-intro"
    ]
  },
  {
    "id": "03-error-handling",
    "title": "Error Handling Best Practices",
    "group": "reliability",
    "day_fast_track": 3,
    "day_full_course": 5,
    "icon": "🛡️",
    "description": "Try/catch patterns, error boundaries, user-friendly error messages.",
    "prerequisites": [
      "01-performance-intro"
    ]
  },
  {
    "id": "04-caching-browser",
    "title": "Browser Caching Strategies",
    "group": "caching",
    "day_fast_track": 4,
    "day_full_course": 7,
    "icon": "💾",
    "description": "HTTP caching, Cache-Control headers, ETags, and service workers.",
    "prerequisites": [
      "01-performance-intro"
    ]
  },
  {
    "id": "05-lazy-loading",
    "title": "Lazy Loading & Code Splitting",
    "group": "optimization",
    "day_fast_track": 5,
    "day_full_course": 9,
    "icon": "📦",
    "description": "Load resources on demand, dynamic imports, and intersection observer.",
    "prerequisites": [
      "04-caching-browser"
    ]
  },
  {
    "id": "06-image-optimization",
    "title": "Image Optimization",
    "group": "optimization",
    "day_fast_track": 6,
    "day_full_course": 11,
    "icon": "🖼️",
    "description": "Formats, compression, responsive images, srcset, and WebP/AVIF.",
    "prerequisites": [
      "01-performance-intro"
    ]
  },
  {
    "id": "07-minification",
    "title": "Minification & Bundle Optimization",
    "group": "optimization",
    "day_fast_track": 7,
    "day_full_course": 13,
    "icon": "🔧",
    "description": "Minify CSS/JS, tree shaking, and reducing bundle sizes.",
    "prerequisites": [
      "01-performance-intro"
    ]
  },
  {
    "id": "08-caching-server",
    "title": "Server-Side Caching",
    "group": "caching",
    "day_fast_track": 8,
    "day_full_course": 15,
    "icon": "🗄️",
    "description": "Redis, Memcached, in-memory caching, and cache invalidation.",
    "prerequisites": [
      "04-caching-browser"
    ]
  },
  {
    "id": "09-performance-monitoring",
    "title": "Performance Monitoring & Metrics",
    "group": "tools",
    "day_fast_track": 9,
    "day_full_course": 17,
    "icon": "📊",
    "description": "Lighthouse, Web Vitals, performance budgets, and monitoring tools.",
    "prerequisites": [
      "01-performance-intro"
    ]
  },
  {
    "id": "10-optimization-checklist",
    "title": "Optimization Checklist & Case Studies",
    "group": "best-practices",
    "day_fast_track": 10,
    "day_full_course": 19,
    "icon": "✅",
    "description": "Complete optimization checklist and real-world performance case studies.",
    "prerequisites": [
      "01-performance-intro"
    ]
  }
];
module.exports = [
  {
    "id": "01-node-intro",
    "title": "Node.js Introduction",
    "group": "fundamentals",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "🟢",
    "description": "What is Node.js, how it works, and your first server.",
    "prerequisites": []
  },
  {
    "id": "02-express-basics",
    "title": "Express.js Basics",
    "group": "fundamentals",
    "day_fast_track": 2,
    "day_full_course": 3,
    "icon": "🚂",
    "description": "Routes, middleware, request/response, and building APIs.",
    "prerequisites": [
      "01-node-intro"
    ]
  },
  {
    "id": "03-rest-routing",
    "title": "RESTful Routing in Express",
    "group": "fundamentals",
    "day_fast_track": 3,
    "day_full_course": 5,
    "icon": "🗺️",
    "description": "Organize routes, handle parameters, and build RESTful endpoints.",
    "prerequisites": [
      "02-express-basics"
    ]
  },
  {
    "id": "04-middleware",
    "title": "Middleware Patterns",
    "group": "patterns",
    "day_fast_track": 4,
    "day_full_course": 7,
    "icon": "🔗",
    "description": "Custom middleware, error handling middleware, and the middleware chain.",
    "prerequisites": [
      "02-express-basics"
    ]
  },
  {
    "id": "05-mongodb-intro",
    "title": "MongoDB & Mongoose",
    "group": "database",
    "day_fast_track": 5,
    "day_full_course": 9,
    "icon": "🍃",
    "description": "Document databases, schemas, models, and CRUD with Mongoose.",
    "prerequisites": [
      "03-rest-routing"
    ]
  },
  {
    "id": "06-crud-operations",
    "title": "CRUD Operations Deep Dive",
    "group": "database",
    "day_fast_track": 6,
    "day_full_course": 11,
    "icon": "🗄️",
    "description": "Create, Read, Update, Delete with validation and error handling.",
    "prerequisites": [
      "05-mongodb-intro"
    ]
  },
  {
    "id": "07-data-validation",
    "title": "Data Validation & Sanitization",
    "group": "best-practices",
    "day_fast_track": 7,
    "day_full_course": 13,
    "icon": "✅",
    "description": "Validate user input, sanitize data, and prevent injection attacks.",
    "prerequisites": [
      "06-crud-operations"
    ]
  },
  {
    "id": "08-file-uploads",
    "title": "File Uploads & Storage",
    "group": "features",
    "day_fast_track": 8,
    "day_full_course": 15,
    "icon": "📤",
    "description": "Handle file uploads with Multer, store files, and serve them back.",
    "prerequisites": [
      "02-express-basics"
    ]
  },
  {
    "id": "09-api-testing",
    "title": "API Testing & Documentation",
    "group": "best-practices",
    "day_fast_track": 9,
    "day_full_course": 17,
    "icon": "🧪",
    "description": "Test APIs with tools, document endpoints, and ensure reliability.",
    "prerequisites": [
      "06-crud-operations"
    ]
  },
  {
    "id": "10-server-optimization",
    "title": "Server Optimization",
    "group": "advanced",
    "day_fast_track": 10,
    "day_full_course": 19,
    "icon": "⚙️",
    "description": "Compression, clustering, caching, and performance tuning for Node.js.",
    "prerequisites": [
      "01-node-intro"
    ]
  }
];
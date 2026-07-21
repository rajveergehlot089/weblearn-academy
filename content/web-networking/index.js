module.exports = [
  {
    "id": "01-internet-basics",
    "title": "How the Internet Works",
    "group": "fundamentals",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "🌐",
    "description": "DNS, TCP/IP, packets, and the journey of a web request.",
    "prerequisites": []
  },
  {
    "id": "02-http-fundamentals",
    "title": "HTTP Fundamentals",
    "group": "fundamentals",
    "day_fast_track": 2,
    "day_full_course": 2,
    "icon": "📤",
    "description": "Requests, responses, headers, methods, and status codes.",
    "prerequisites": [
      "01-internet-basics"
    ]
  },
  {
    "id": "03-http-methods",
    "title": "HTTP Methods — CRUD Operations",
    "group": "fundamentals",
    "day_fast_track": 3,
    "day_full_course": 4,
    "icon": "🔧",
    "description": "GET, POST, PUT, DELETE, PATCH and when to use each.",
    "prerequisites": [
      "02-http-fundamentals"
    ]
  },
  {
    "id": "04-status-codes",
    "title": "HTTP Status Codes Deep Dive",
    "group": "fundamentals",
    "day_fast_track": 4,
    "day_full_course": 6,
    "icon": "📊",
    "description": "2xx, 3xx, 4xx, 5xx codes and what they mean for your apps.",
    "prerequisites": [
      "02-http-fundamentals"
    ]
  },
  {
    "id": "05-https-security",
    "title": "HTTPS & TLS Encryption",
    "group": "security",
    "day_fast_track": 5,
    "day_full_course": 7,
    "icon": "🔒",
    "description": "SSL certificates, TLS handshakes, and why HTTPS matters.",
    "prerequisites": [
      "02-http-fundamentals"
    ]
  },
  {
    "id": "06-rest-api-design",
    "title": "REST API Design",
    "group": "api-design",
    "day_fast_track": 6,
    "day_full_course": 9,
    "icon": "🗺️",
    "description": "RESTful conventions, resource naming, versioning, and best practices.",
    "prerequisites": [
      "03-http-methods"
    ]
  },
  {
    "id": "07-fetch-api",
    "title": "Fetch API & AJAX",
    "group": "client-side",
    "day_fast_track": 7,
    "day_full_course": 11,
    "icon": "📡",
    "description": "Making HTTP requests from JavaScript with fetch() and async/await.",
    "prerequisites": [
      "06-rest-api-design"
    ]
  },
  {
    "id": "08-graphql-intro",
    "title": "GraphQL Introduction",
    "group": "api-design",
    "day_fast_track": 8,
    "day_full_course": 13,
    "icon": "◆",
    "description": "Queries, mutations, schemas, and when to choose GraphQL over REST.",
    "prerequisites": [
      "06-rest-api-design"
    ]
  },
  {
    "id": "09-api-gateway",
    "title": "API Gateway & Rate Limiting",
    "group": "infrastructure",
    "day_fast_track": 9,
    "day_full_course": 16,
    "icon": "🚪",
    "description": "Request routing, rate limiting, throttling, and API management.",
    "prerequisites": [
      "06-rest-api-design"
    ]
  },
  {
    "id": "10-cors-errors",
    "title": "CORS, Errors & Debugging APIs",
    "group": "best-practices",
    "day_fast_track": 10,
    "day_full_course": 18,
    "icon": "🐛",
    "description": "Cross-origin requests, CORS headers, error handling, and API debugging.",
    "prerequisites": [
      "07-fetch-api"
    ]
  }
];
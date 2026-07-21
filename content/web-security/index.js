module.exports = [
  {
    "id": "01-security-overview",
    "title": "Web Security Fundamentals",
    "group": "fundamentals",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "🛡️",
    "description": "OWASP Top 10, common vulnerabilities, and security mindset.",
    "prerequisites": []
  },
  {
    "id": "02-auth-intro",
    "title": "Authentication Fundamentals",
    "group": "auth",
    "day_fast_track": 2,
    "day_full_course": 3,
    "icon": "🔐",
    "description": "What is authentication, why it matters, and different approaches.",
    "prerequisites": [
      "01-security-overview"
    ]
  },
  {
    "id": "03-sessions-cookies",
    "title": "Sessions & Cookies",
    "group": "auth",
    "day_fast_track": 3,
    "day_full_course": 5,
    "icon": "🍪",
    "description": "Server-side sessions, cookies, and session-based authentication.",
    "prerequisites": [
      "02-auth-intro"
    ]
  },
  {
    "id": "04-jwt-deep-dive",
    "title": "JWT — JSON Web Tokens",
    "group": "auth",
    "day_fast_track": 4,
    "day_full_course": 7,
    "icon": "🎫",
    "description": "Token structure, signing, verification, refresh tokens, and best practices.",
    "prerequisites": [
      "02-auth-intro"
    ]
  },
  {
    "id": "05-oauth-social",
    "title": "OAuth & Social Login",
    "group": "auth",
    "day_fast_track": 5,
    "day_full_course": 9,
    "icon": "🔑",
    "description": "OAuth 2.0 flow, Google/GitHub login, and third-party authentication.",
    "prerequisites": [
      "04-jwt-deep-dive"
    ]
  },
  {
    "id": "06-localstorage",
    "title": "LocalStorage, SessionStorage & Security",
    "group": "storage",
    "day_fast_track": 6,
    "day_full_course": 11,
    "icon": "💾",
    "description": "Client-side storage options, security implications, and when to use each.",
    "prerequisites": [
      "04-jwt-deep-dive"
    ]
  },
  {
    "id": "07-password-security",
    "title": "Password Hashing & Storage",
    "group": "security",
    "day_fast_track": 7,
    "day_full_course": 13,
    "icon": "🗝️",
    "description": "bcrypt, argon2, salting, and why you never store plain passwords.",
    "prerequisites": [
      "02-auth-intro"
    ]
  },
  {
    "id": "08-cors-security",
    "title": "CORS & Cross-Site Attacks",
    "group": "security",
    "day_fast_track": 8,
    "day_full_course": 15,
    "icon": "🚫",
    "description": "CORS configuration, CSRF, XSS, and preventing cross-site attacks.",
    "prerequisites": [
      "01-security-overview"
    ]
  },
  {
    "id": "09-rate-limiting",
    "title": "Rate Limiting & Brute Force Protection",
    "group": "security",
    "day_fast_track": 9,
    "day_full_course": 17,
    "icon": "⏱️",
    "description": "Protect APIs from abuse with rate limiting and throttling.",
    "prerequisites": [
      "01-security-overview"
    ]
  },
  {
    "id": "10-security-audit",
    "title": "Security Audit & Best Practices",
    "group": "best-practices",
    "day_fast_track": 10,
    "day_full_course": 19,
    "icon": "📋",
    "description": "Checklist-based security audit and production security hardening.",
    "prerequisites": [
      "01-security-overview"
    ]
  }
];
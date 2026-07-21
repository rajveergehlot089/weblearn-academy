module.exports = [
  {
    "id": "01-js-basics",
    "title": "JavaScript Basics — Variables & Data Types",
    "group": "fundamentals",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "⚡",
    "description": "let, const, var, strings, numbers, booleans, null, undefined.",
    "prerequisites": []
  },
  {
    "id": "02-operators",
    "title": "Operators & Expressions",
    "group": "fundamentals",
    "day_fast_track": 2,
    "day_full_course": 2,
    "icon": "🔢",
    "description": "Arithmetic, comparison, logical, and assignment operators.",
    "prerequisites": [
      "01-js-basics"
    ]
  },
  {
    "id": "03-conditionals",
    "title": "Conditionals — Making Decisions",
    "group": "fundamentals",
    "day_fast_track": 3,
    "day_full_course": 4,
    "icon": "🔀",
    "description": "if/else, switch, ternary operator, and truthy/falsy values.",
    "prerequisites": [
      "02-operators"
    ]
  },
  {
    "id": "04-loops",
    "title": "Loops — Repeating Actions",
    "group": "fundamentals",
    "day_fast_track": 4,
    "day_full_course": 6,
    "icon": "🔄",
    "description": "for, while, for...of, for...in, break, continue, and iteration patterns.",
    "prerequisites": [
      "03-conditionals"
    ]
  },
  {
    "id": "05-functions",
    "title": "Functions — Reusable Code",
    "group": "fundamentals",
    "day_fast_track": 5,
    "day_full_course": 7,
    "icon": "📦",
    "description": "Function declarations, expressions, arrow functions, and parameters.",
    "prerequisites": [
      "03-conditionals"
    ]
  },
  {
    "id": "06-arrays",
    "title": "Arrays — Ordered Collections",
    "group": "data-structures",
    "day_fast_track": 6,
    "day_full_course": 9,
    "icon": "📋",
    "description": "push, pop, map, filter, reduce, find, and array iteration methods.",
    "prerequisites": [
      "05-functions"
    ]
  },
  {
    "id": "07-objects",
    "title": "Objects — Key-Value Pairs",
    "group": "data-structures",
    "day_fast_track": 7,
    "day_full_course": 11,
    "icon": "🗂️",
    "description": "Object creation, properties, methods, destructuring, and spread.",
    "prerequisites": [
      "05-functions"
    ]
  },
  {
    "id": "08-dom-manipulation",
    "title": "DOM Manipulation — Changing Pages",
    "group": "browser",
    "day_fast_track": 8,
    "day_full_course": 13,
    "icon": "🖱️",
    "description": "getElementById, querySelector, creating elements, and event listeners.",
    "prerequisites": [
      "06-arrays"
    ]
  },
  {
    "id": "09-es6-features",
    "title": "ES6+ Modern JavaScript",
    "group": "modern",
    "day_fast_track": 9,
    "day_full_course": 16,
    "icon": "🚀",
    "description": "Template literals, destructuring, spread/rest, modules, and classes.",
    "prerequisites": [
      "07-objects"
    ]
  },
  {
    "id": "10-error-handling",
    "title": "Error Handling & Debugging",
    "group": "best-practices",
    "day_fast_track": 10,
    "day_full_course": 18,
    "icon": "🛡️",
    "description": "try/catch, error types, console methods, and debugging techniques.",
    "prerequisites": [
      "05-functions"
    ]
  }
];
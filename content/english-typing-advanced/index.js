module.exports = [
  {
    "id": "01-common-words",
    "title": "Most Common English Words",
    "group": "practice",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "📝",
    "description": "The 100 most frequently used English words for fast typing.",
    "prerequisites": []
  },
  {
    "id": "02-sentence-practice",
    "title": "Sentence Typing Practice",
    "group": "practice",
    "day_fast_track": 2,
    "day_full_course": 2,
    "icon": "✍️",
    "description": "Type complete English sentences with proper punctuation.",
    "prerequisites": [
      "01-common-words"
    ]
  },
  {
    "id": "03-paragraph-practice",
    "title": "Paragraph Typing Practice",
    "group": "fluency",
    "day_fast_track": 3,
    "day_full_course": 4,
    "icon": "📄",
    "description": "Type multi-sentence paragraphs for sustained speed.",
    "prerequisites": [
      "02-sentence-practice"
    ]
  },
  {
    "id": "04-punctuation-mastery",
    "title": "Punctuation & Special Characters",
    "group": "technique",
    "day_fast_track": 4,
    "day_full_course": 5,
    "icon": "❗",
    "description": "Commas, periods, question marks, quotes, and numbers.",
    "prerequisites": [
      "02-sentence-practice"
    ]
  },
  {
    "id": "05-speed-drill-basic",
    "title": "Speed Drill — Basic",
    "group": "speed",
    "day_fast_track": 5,
    "day_full_course": 7,
    "icon": "⚡",
    "description": "Timed typing tests at comfortable speed.",
    "prerequisites": [
      "03-paragraph-practice"
    ]
  },
  {
    "id": "06-code-typing",
    "title": "Code & Technical Typing",
    "group": "specialized",
    "day_fast_track": 6,
    "day_full_course": 8,
    "icon": "💻",
    "description": "Type programming code, symbols, and technical text.",
    "prerequisites": [
      "04-punctuation-mastery"
    ]
  },
  {
    "id": "07-speed-drill-medium",
    "title": "Speed Drill — Medium",
    "group": "speed",
    "day_fast_track": 7,
    "day_full_course": 10,
    "icon": "⚡",
    "description": "Increase target speed with accuracy focus.",
    "prerequisites": [
      "05-speed-drill-basic"
    ]
  },
  {
    "id": "08-real-world-text",
    "title": "Real-World Text Typing",
    "group": "fluency",
    "day_fast_track": 8,
    "day_full_course": 11,
    "icon": "📰",
    "description": "Type from articles, emails, and documents.",
    "prerequisites": [
      "06-code-typing"
    ]
  },
  {
    "id": "09-speed-drill-advanced",
    "title": "Speed Drill — Advanced",
    "group": "speed",
    "day_fast_track": 9,
    "day_full_course": 13,
    "icon": "🚀",
    "description": "Push for 60+ WPM with timed tests.",
    "prerequisites": [
      "07-speed-drill-medium"
    ]
  },
  {
    "id": "10-final-assessment",
    "title": "Final Speed & Accuracy Assessment",
    "group": "assessment",
    "day_fast_track": 10,
    "day_full_course": 14,
    "icon": "🏆",
    "description": "Comprehensive test of all typing skills.",
    "prerequisites": [
      "09-speed-drill-advanced"
    ]
  }
];
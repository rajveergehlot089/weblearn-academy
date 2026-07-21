module.exports = [
  {
    "id": "01-upper-row-intro",
    "title": "Upper Row Introduction",
    "group": "rows",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "⬆️",
    "description": "Learn the upper row keys and their Hindi equivalents.",
    "prerequisites": []
  },
  {
    "id": "02-upper-row-practice",
    "title": "Upper Row Practice Drills",
    "group": "rows",
    "day_fast_track": 2,
    "day_full_course": 2,
    "icon": "🏋️",
    "description": "Practice upper row keys with repetition drills.",
    "prerequisites": [
      "01-upper-row-intro"
    ]
  },
  {
    "id": "03-lower-row-intro",
    "title": "Lower Row Introduction",
    "group": "rows",
    "day_fast_track": 3,
    "day_full_course": 4,
    "icon": "⬇️",
    "description": "Learn the lower row keys and their Hindi equivalents.",
    "prerequisites": [
      "01-upper-row-intro"
    ]
  },
  {
    "id": "04-lower-row-practice",
    "title": "Lower Row Practice Drills",
    "group": "rows",
    "day_fast_track": 4,
    "day_full_course": 5,
    "icon": "🏋️",
    "description": "Practice lower row keys with repetition drills.",
    "prerequisites": [
      "03-lower-row-intro"
    ]
  },
  {
    "id": "05-common-words-1",
    "title": "Common Hindi Words — Set 1",
    "group": "words",
    "day_fast_track": 5,
    "day_full_course": 7,
    "icon": "📝",
    "description": "Most frequently used Hindi words for daily conversation.",
    "prerequisites": [
      "02-upper-row-practice",
      "04-lower-row-practice"
    ]
  },
  {
    "id": "06-common-words-2",
    "title": "Common Hindi Words — Set 2",
    "group": "words",
    "day_fast_track": 6,
    "day_full_course": 8,
    "icon": "📝",
    "description": "Expand vocabulary with more everyday words.",
    "prerequisites": [
      "05-common-words-1"
    ]
  },
  {
    "id": "07-numbers",
    "title": "Hindi Numbers",
    "group": "practice",
    "day_fast_track": 7,
    "day_full_course": 10,
    "icon": "🔢",
    "description": "Type Hindi numbers from 0-100 and common numerals.",
    "prerequisites": [
      "06-common-words-2"
    ]
  },
  {
    "id": "08-symbols-punctuation",
    "title": "Symbols & Punctuation",
    "group": "practice",
    "day_fast_track": 8,
    "day_full_course": 11,
    "icon": "❗",
    "description": "Hindi punctuation marks and special symbols.",
    "prerequisites": [
      "07-numbers"
    ]
  },
  {
    "id": "09-word-combinations",
    "title": "Word Combination Drills",
    "group": "practice",
    "day_fast_track": 9,
    "day_full_course": 12,
    "icon": "🔗",
    "description": "Combine known words into two-word and three-word phrases.",
    "prerequisites": [
      "06-common-words-2"
    ]
  },
  {
    "id": "10-word-speed-test",
    "title": "Word Building Speed Test",
    "group": "assessment",
    "day_fast_track": 10,
    "day_full_course": 14,
    "icon": "⏱️",
    "description": "Timed test of word-building skills before advancing.",
    "prerequisites": [
      "09-word-combinations"
    ]
  }
];
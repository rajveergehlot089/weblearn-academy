module.exports = [
  {
    "id": "01-upper-row-intro",
    "title": "Upper Row — QWERTY Keys",
    "group": "rows",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "⬆️",
    "description": "Learn keys above the home row: Q, W, E, R, T, Y, U, I, O, P.",
    "prerequisites": []
  },
  {
    "id": "02-upper-row-drills",
    "title": "Upper Row Practice Drills",
    "group": "rows",
    "day_fast_track": 2,
    "day_full_course": 3,
    "icon": "🏋️",
    "description": "Repetitive drills to master upper row reach.",
    "prerequisites": [
      "01-upper-row-intro"
    ]
  },
  {
    "id": "03-lower-row-intro",
    "title": "Lower Row — ZXCVB Keys",
    "group": "rows",
    "day_fast_track": 3,
    "day_full_course": 4,
    "icon": "⬇️",
    "description": "Learn keys below the home row: Z, X, C, V, B, N, M.",
    "prerequisites": [
      "01-upper-row-intro"
    ]
  },
  {
    "id": "04-lower-row-drills",
    "title": "Lower Row Practice Drills",
    "group": "rows",
    "day_fast_track": 4,
    "day_full_course": 6,
    "icon": "🏋️",
    "description": "Repetitive drills to master lower row reach.",
    "prerequisites": [
      "03-lower-row-intro"
    ]
  },
  {
    "id": "05-shift-caps",
    "title": "Shift Keys & Capital Letters",
    "group": "rows",
    "day_fast_track": 5,
    "day_full_course": 7,
    "icon": "⇧",
    "description": "Using shift for capitals and the Caps Lock key.",
    "prerequisites": [
      "02-upper-row-drills",
      "04-lower-row-drills"
    ]
  },
  {
    "id": "06-all-keys-combined",
    "title": "All Keys Combined Practice",
    "group": "integration",
    "day_fast_track": 6,
    "day_full_course": 9,
    "icon": "🎹",
    "description": "Practice using all keyboard sections together.",
    "prerequisites": [
      "05-shift-caps"
    ]
  },
  {
    "id": "07-reach-patterns",
    "title": "Finger Reach Patterns",
    "group": "technique",
    "day_fast_track": 7,
    "day_full_course": 10,
    "icon": "🔄",
    "description": "Common finger movement patterns for efficiency.",
    "prerequisites": [
      "06-all-keys-combined"
    ]
  },
  {
    "id": "08-word-typing",
    "title": "Typing Real Words",
    "group": "practice",
    "day_fast_track": 8,
    "day_full_course": 12,
    "icon": "📝",
    "description": "Type complete English words using all keys.",
    "prerequisites": [
      "06-all-keys-combined"
    ]
  },
  {
    "id": "09-row-mastery-test",
    "title": "Full Keyboard Mastery Test",
    "group": "assessment",
    "day_fast_track": 9,
    "day_full_course": 13,
    "icon": "⏱️",
    "description": "Test mastery of all keyboard rows.",
    "prerequisites": [
      "08-word-typing"
    ]
  },
  {
    "id": "10-mastery-recap",
    "title": "Keyboard Mastery Recap",
    "group": "review",
    "day_fast_track": 10,
    "day_full_course": 14,
    "icon": "🏆",
    "description": "Review all skills and prepare for advanced practice.",
    "prerequisites": [
      "09-row-mastery-test"
    ]
  }
];
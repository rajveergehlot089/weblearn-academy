module.exports = [
  {
    "id": "01-touch-typing-intro",
    "title": "Introduction to Touch Typing",
    "group": "basics",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "🔑",
    "description": "What is touch typing, why it matters, and setting up your posture.",
    "prerequisites": []
  },
  {
    "id": "02-keyboard-layout",
    "title": "Keyboard Layout & Finger Maps",
    "group": "basics",
    "day_fast_track": 2,
    "day_full_course": 2,
    "icon": "🗺️",
    "description": "QWERTY layout, finger assignments, and home row markers.",
    "prerequisites": [
      "01-touch-typing-intro"
    ]
  },
  {
    "id": "03-home-row-asdf",
    "title": "Home Row — ASDF (Left Hand)",
    "group": "home-row",
    "day_fast_track": 3,
    "day_full_course": 4,
    "icon": "🤟",
    "description": "Master left hand home row keys with drills.",
    "prerequisites": [
      "02-keyboard-layout"
    ]
  },
  {
    "id": "04-home-row-jkl",
    "title": "Home Row — JKL (Right Hand)",
    "group": "home-row",
    "day_fast_track": 4,
    "day_full_course": 5,
    "icon": "🤞",
    "description": "Master right hand home row keys with drills.",
    "prerequisites": [
      "02-keyboard-layout"
    ]
  },
  {
    "id": "05-home-row-combined",
    "title": "Home Row Combined Practice",
    "group": "home-row",
    "day_fast_track": 5,
    "day_full_course": 7,
    "icon": "✋",
    "description": "Practice both hands on home row for speed and accuracy.",
    "prerequisites": [
      "03-home-row-asdf",
      "04-home-row-jkl"
    ]
  },
  {
    "id": "06-eyes-on-screen",
    "title": "Typing Without Looking",
    "group": "technique",
    "day_fast_track": 6,
    "day_full_course": 8,
    "icon": "👀",
    "description": "Build muscle memory and stop looking at the keyboard.",
    "prerequisites": [
      "05-home-row-combined"
    ]
  },
  {
    "id": "07-finger-exercises",
    "title": "Finger Strength Exercises",
    "group": "technique",
    "day_fast_track": 7,
    "day_full_course": 10,
    "icon": "💪",
    "description": "Strengthen individual fingers for faster typing.",
    "prerequisites": [
      "05-home-row-combined"
    ]
  },
  {
    "id": "08-accuracy-drills",
    "title": "Accuracy-First Drills",
    "group": "practice",
    "day_fast_track": 8,
    "day_full_course": 11,
    "icon": "🎯",
    "description": "Slow, accurate typing to build correct habits.",
    "prerequisites": [
      "06-eyes-on-screen"
    ]
  },
  {
    "id": "09-home-row-test",
    "title": "Home Row Mastery Test",
    "group": "assessment",
    "day_fast_track": 9,
    "day_full_course": 12,
    "icon": "⏱️",
    "description": "Test your home row speed and accuracy.",
    "prerequisites": [
      "08-accuracy-drills"
    ]
  },
  {
    "id": "10-foundations-recap",
    "title": "Foundations Recap & Practice",
    "group": "review",
    "day_fast_track": 10,
    "day_full_course": 14,
    "icon": "🔄",
    "description": "Review all home row skills and prepare for the next course.",
    "prerequisites": [
      "09-home-row-test"
    ]
  }
];
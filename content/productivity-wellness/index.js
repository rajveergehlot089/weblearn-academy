module.exports = [
  {
    "id": "01-time-management",
    "title": "Time Management Fundamentals",
    "group": "productivity",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "⏰",
    "description": "Eisenhower Matrix, priorities, and managing your schedule.",
    "prerequisites": []
  },
  {
    "id": "02-pomodoro",
    "title": "Pomodoro Technique & Focus",
    "group": "productivity",
    "day_fast_track": 2,
    "day_full_course": 2,
    "icon": "🍅",
    "description": "25-minute focused work sessions and deep work blocks.",
    "prerequisites": [
      "01-time-management"
    ]
  },
  {
    "id": "03-goal-setting",
    "title": "SMART Goal Setting",
    "group": "productivity",
    "day_fast_track": 3,
    "day_full_course": 4,
    "icon": "🎯",
    "description": "Specific, Measurable, Achievable, Relevant, Time-bound goals.",
    "prerequisites": [
      "01-time-management"
    ]
  },
  {
    "id": "04-habits-routines",
    "title": "Building Habits & Routines",
    "group": "productivity",
    "day_fast_track": 4,
    "day_full_course": 5,
    "icon": "🔄",
    "description": "Habit stacking, morning routines, and consistency.",
    "prerequisites": [
      "01-time-management"
    ]
  },
  {
    "id": "05-stress-intro",
    "title": "Understanding Stress",
    "group": "wellness",
    "day_fast_track": 5,
    "day_full_course": 7,
    "icon": "😰",
    "description": "What causes stress, the stress response, and chronic vs acute stress.",
    "prerequisites": []
  },
  {
    "id": "06-breathing-exercises",
    "title": "Breathing & Relaxation Techniques",
    "group": "wellness",
    "day_fast_track": 6,
    "day_full_course": 8,
    "icon": "🫁",
    "description": "4-7-8 breathing, progressive muscle relaxation, and body scans.",
    "prerequisites": [
      "05-stress-intro"
    ]
  },
  {
    "id": "07-mindfulness",
    "title": "Mindfulness & Meditation",
    "group": "wellness",
    "day_fast_track": 7,
    "day_full_course": 9,
    "icon": "🧘",
    "description": "Present-moment awareness, meditation basics, and daily practice.",
    "prerequisites": [
      "06-breathing-exercises"
    ]
  },
  {
    "id": "08-work-life-balance",
    "title": "Work-Life Balance",
    "group": "wellness",
    "day_fast_track": 8,
    "day_full_course": 11,
    "icon": "⚖️",
    "description": "Setting boundaries, disconnecting, and sustainable productivity.",
    "prerequisites": [
      "01-time-management"
    ]
  },
  {
    "id": "09-sleep-health",
    "title": "Sleep & Physical Health",
    "group": "wellness",
    "day_fast_track": 9,
    "day_full_course": 12,
    "icon": "😴",
    "description": "Sleep hygiene, exercise, nutrition, and their impact on productivity.",
    "prerequisites": [
      "05-stress-intro"
    ]
  },
  {
    "id": "10-productivity-test",
    "title": "Productivity & Wellness Assessment",
    "group": "assessment",
    "day_fast_track": 10,
    "day_full_course": 14,
    "icon": "🏆",
    "description": "Evaluate your habits, stress levels, and productivity system.",
    "prerequisites": [
      "04-habits-routines",
      "07-mindfulness"
    ]
  }
];
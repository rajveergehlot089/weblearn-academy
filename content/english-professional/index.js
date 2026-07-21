module.exports = [
  {
    "id": "01-daily-greetings",
    "title": "Daily Greetings & Introductions",
    "group": "conversation",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "👋",
    "description": "Hello, how are you, introducing yourself, and common pleasantries.",
    "prerequisites": []
  },
  {
    "id": "02-daily-conversations",
    "title": "Everyday Conversations",
    "group": "conversation",
    "day_fast_track": 2,
    "day_full_course": 2,
    "icon": "🗣️",
    "description": "Shopping, directions, restaurants, and daily situations.",
    "prerequisites": [
      "01-daily-greetings"
    ]
  },
  {
    "id": "03-phone-email",
    "title": "Phone Calls & Email Etiquette",
    "group": "professional",
    "day_fast_track": 3,
    "day_full_course": 4,
    "icon": "📞",
    "description": "Professional phone manner and email writing basics.",
    "prerequisites": [
      "01-daily-greetings"
    ]
  },
  {
    "id": "04-paragraph-writing",
    "title": "Paragraph Writing",
    "group": "writing",
    "day_fast_track": 4,
    "day_full_course": 5,
    "icon": "✍️",
    "description": "Topic sentences, supporting details, and concluding sentences.",
    "prerequisites": [
      "01-daily-greetings"
    ]
  },
  {
    "id": "05-essay-structure",
    "title": "Essay Structure & Writing",
    "group": "writing",
    "day_fast_track": 5,
    "day_full_course": 7,
    "icon": "📄",
    "description": "Introduction, body paragraphs, and conclusion structure.",
    "prerequisites": [
      "04-paragraph-writing"
    ]
  },
  {
    "id": "06-transition-words",
    "title": "Transition Words & Flow",
    "group": "writing",
    "day_fast_track": 6,
    "day_full_course": 8,
    "icon": "🔗",
    "description": "However, moreover, furthermore, and creating smooth text.",
    "prerequisites": [
      "04-paragraph-writing"
    ]
  },
  {
    "id": "07-interview-intro",
    "title": "Interview Preparation Basics",
    "group": "professional",
    "day_fast_track": 7,
    "day_full_course": 10,
    "icon": "💼",
    "description": "Tell me about yourself, common questions, and first impressions.",
    "prerequisites": [
      "03-phone-email"
    ]
  },
  {
    "id": "08-interview-answers",
    "title": "Answering Interview Questions",
    "group": "professional",
    "day_fast_track": 8,
    "day_full_course": 11,
    "icon": "🎤",
    "description": "STAR method, behavioral questions, and confident answers.",
    "prerequisites": [
      "07-interview-intro"
    ]
  },
  {
    "id": "09-professional-vocab",
    "title": "Professional Vocabulary",
    "group": "vocabulary",
    "day_fast_track": 9,
    "day_full_course": 13,
    "icon": "📚",
    "description": "Workplace vocabulary, business terms, and formal expressions.",
    "prerequisites": [
      "03-phone-email"
    ]
  },
  {
    "id": "10-final-assessment",
    "title": "Communication Skills Assessment",
    "group": "assessment",
    "day_fast_track": 10,
    "day_full_course": 15,
    "icon": "🏆",
    "description": "Comprehensive assessment of speaking, writing, and professional English.",
    "prerequisites": [
      "05-essay-structure",
      "08-interview-answers"
    ]
  }
];
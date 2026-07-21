module.exports = [
  {
    "id": "01-elevator-pitch",
    "title": "Crafting Your Elevator Pitch",
    "group": "branding",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "🎤",
    "description": "30-second introduction that makes a lasting impression.",
    "prerequisites": []
  },
  {
    "id": "02-personal-branding",
    "title": "Personal Branding",
    "group": "branding",
    "day_fast_track": 2,
    "day_full_course": 2,
    "icon": "⭐",
    "description": "What do people say about you? Define and build your brand.",
    "prerequisites": [
      "01-elevator-pitch"
    ]
  },
  {
    "id": "03-networking-basics",
    "title": "Professional Networking",
    "group": "networking",
    "day_fast_track": 3,
    "day_full_course": 4,
    "icon": "🔗",
    "description": "Build genuine relationships, give before you take, follow up.",
    "prerequisites": [
      "01-elevator-pitch"
    ]
  },
  {
    "id": "04-linkedin",
    "title": "LinkedIn Optimization",
    "group": "branding",
    "day_fast_track": 4,
    "day_full_course": 5,
    "icon": "💼",
    "description": "Photo, headline, summary, recommendations, and networking on LinkedIn.",
    "prerequisites": [
      "02-personal-branding"
    ]
  },
  {
    "id": "05-public-speaking",
    "title": "Public Speaking Basics",
    "group": "speaking",
    "day_fast_track": 5,
    "day_full_course": 7,
    "icon": "🎙️",
    "description": "The 3 P's: Preparation, Practice, Performance.",
    "prerequisites": []
  },
  {
    "id": "06-storytelling",
    "title": "Storytelling in Presentations",
    "group": "speaking",
    "day_fast_track": 6,
    "day_full_course": 8,
    "icon": "📖",
    "description": "Hook, structure, and delivery — stories people remember.",
    "prerequisites": [
      "05-public-speaking"
    ]
  },
  {
    "id": "07-overcoming-nervousness",
    "title": "Overcoming Stage Fright",
    "group": "speaking",
    "day_fast_track": 7,
    "day_full_course": 10,
    "icon": "😤",
    "description": "Reframe anxiety, breathing techniques, and practice strategies.",
    "prerequisites": [
      "05-public-speaking"
    ]
  },
  {
    "id": "08-career-planning",
    "title": "Career Planning & Vision",
    "group": "career",
    "day_fast_track": 8,
    "day_full_course": 11,
    "icon": "🗺️",
    "description": "Skills inventory, gap analysis, and career roadmap.",
    "prerequisites": []
  },
  {
    "id": "09-interview-prep",
    "title": "Interview Preparation",
    "group": "career",
    "day_fast_track": 9,
    "day_full_course": 13,
    "icon": "🤝",
    "description": "Research, common questions, STAR method, and follow-up.",
    "prerequisites": [
      "08-career-planning"
    ]
  },
  {
    "id": "10-career-assessment",
    "title": "Career Development Assessment",
    "group": "assessment",
    "day_fast_track": 10,
    "day_full_course": 14,
    "icon": "🏆",
    "description": "Evaluate your networking, speaking, and career planning skills.",
    "prerequisites": [
      "04-linkedin",
      "06-storytelling"
    ]
  }
];
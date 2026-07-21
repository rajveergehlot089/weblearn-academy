module.exports = [
  {
    "id": "01-git-fundamentals",
    "title": "Git Fundamentals",
    "group": "version-control",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "📦",
    "description": "Git init, add, commit, branches, merge, and collaboration basics.",
    "prerequisites": []
  },
  {
    "id": "02-github-workflow",
    "title": "GitHub & Collaboration",
    "group": "version-control",
    "day_fast_track": 2,
    "day_full_course": 3,
    "icon": "🐙",
    "description": "Repositories, pull requests, code review, and GitHub workflows.",
    "prerequisites": [
      "01-git-fundamentals"
    ]
  },
  {
    "id": "03-hosting-platforms",
    "title": "Hosting Platforms Overview",
    "group": "deployment",
    "day_fast_track": 3,
    "day_full_course": 5,
    "icon": "☁️",
    "description": "Vercel, Netlify, Heroku, Railway, and choosing the right platform.",
    "prerequisites": [
      "02-github-workflow"
    ]
  },
  {
    "id": "04-frontend-deploy",
    "title": "Frontend Deployment",
    "group": "deployment",
    "day_fast_track": 4,
    "day_full_course": 7,
    "icon": "🌐",
    "description": "Deploy static sites and SPAs with custom domains and SSL.",
    "prerequisites": [
      "03-hosting-platforms"
    ]
  },
  {
    "id": "05-backend-deploy",
    "title": "Backend Deployment",
    "group": "deployment",
    "day_fast_track": 5,
    "day_full_course": 9,
    "icon": "🖥️",
    "description": "Deploy Node.js servers, environment variables, and database connections.",
    "prerequisites": [
      "03-hosting-platforms"
    ]
  },
  {
    "id": "06-domains-ssl",
    "title": "Domains, DNS & SSL Certificates",
    "group": "devops",
    "day_fast_track": 6,
    "day_full_course": 11,
    "icon": "🔒",
    "description": "Buy domains, configure DNS, and set up HTTPS with free SSL.",
    "prerequisites": [
      "04-frontend-deploy"
    ]
  },
  {
    "id": "07-ci-cd",
    "title": "CI/CD Pipelines",
    "group": "devops",
    "day_fast_track": 7,
    "day_full_course": 13,
    "icon": "🔄",
    "description": "Automated testing, building, and deployment with GitHub Actions.",
    "prerequisites": [
      "02-github-workflow"
    ]
  },
  {
    "id": "08-environment-config",
    "title": "Environment Variables & Config",
    "group": "devops",
    "day_fast_track": 8,
    "day_full_course": 15,
    "icon": "⚙️",
    "description": "Manage secrets, configs for dev/staging/production, and .env files.",
    "prerequisites": [
      "05-backend-deploy"
    ]
  },
  {
    "id": "09-monitoring-logs",
    "title": "Monitoring & Logging",
    "group": "devops",
    "day_fast_track": 9,
    "day_full_course": 17,
    "icon": "📊",
    "description": "Application monitoring, error tracking, logging, and uptime checks.",
    "prerequisites": [
      "05-backend-deploy"
    ]
  },
  {
    "id": "10-capstone-project",
    "title": "Capstone — Full Stack Project",
    "group": "project",
    "day_fast_track": 10,
    "day_full_course": 20,
    "icon": "🏆",
    "description": "Build and deploy a complete full-stack application from scratch.",
    "prerequisites": [
      "05-backend-deploy",
      "07-ci-cd"
    ]
  }
];
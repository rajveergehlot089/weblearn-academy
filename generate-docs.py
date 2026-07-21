"""
WebLearn Academy - Project Documentation PDF Generator
This script generates a comprehensive PDF explaining the entire project.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    ListFlowable, ListItem, Preformatted
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

# Create the PDF document
doc = SimpleDocTemplate(
    "WebLearn_Academy_Documentation.pdf",
    pagesize=letter,
    leftMargin=0.9 * inch,
    rightMargin=0.9 * inch,
    topMargin=0.9 * inch,
    bottomMargin=1.0 * inch,
    title="WebLearn Academy - Project Documentation",
    author="WebLearn Academy Team"
)

# Define custom styles
styles = getSampleStyleSheet()

# Title style
title_style = ParagraphStyle(
    "CustomTitle",
    parent=styles["Title"],
    fontSize=28,
    spaceAfter=20,
    textColor=colors.HexColor("#667eea")
)

# Heading styles
h1_style = ParagraphStyle(
    "H1",
    parent=styles["Heading1"],
    fontSize=22,
    spaceBefore=20,
    spaceAfter=10,
    textColor=colors.HexColor("#1a1a2e")
)

h2_style = ParagraphStyle(
    "H2",
    parent=styles["Heading2"],
    fontSize=16,
    spaceBefore=15,
    spaceAfter=8,
    textColor=colors.HexColor("#667eea")
)

h3_style = ParagraphStyle(
    "H3",
    parent=styles["Heading3"],
    fontSize=13,
    spaceBefore=10,
    spaceAfter=6,
    textColor=colors.HexColor("#4a4a6a")
)

# Body text style
body_style = ParagraphStyle(
    "CustomBody",
    parent=styles["BodyText"],
    fontSize=10,
    leading=14,
    spaceAfter=8,
    alignment=TA_JUSTIFY
)

# Code style
code_style = ParagraphStyle(
    "Code",
    parent=styles["Code"],
    fontSize=8,
    leading=10,
    spaceAfter=8,
    backColor=colors.HexColor("#f5f5f5"),
    borderPadding=5
)

# Build the content
story = []

# ============================================
# COVER PAGE
# ============================================
story.append(Spacer(1, 2 * inch))
story.append(Paragraph("WebLearn Academy", title_style))
story.append(Spacer(1, 0.3 * inch))
story.append(Paragraph("Complete Project Documentation", h2_style))
story.append(Spacer(1, 0.5 * inch))
story.append(Paragraph("Interactive Web Learning Platform for Beginners", body_style))
story.append(Spacer(1, 1 * inch))

# Table of contents preview
toc_data = [
    ["Section", "Description"],
    ["1. Project Overview", "What is WebLearn Academy"],
    ["2. Technology Stack", "Technologies used"],
    ["3. Project Structure", "File organization"],
    ["4. Backend Architecture", "Server, routes, middleware"],
    ["5. Frontend Architecture", "UI, screens, components"],
    ["6. Database Design", "Data storage approach"],
    ["7. Authentication System", "Login, JWT, security"],
    ["8. Admin Panel", "Management features"],
    ["9. Content System", "Topics and lessons"],
    ["10. How to Run", "Setup instructions"],
]

toc_table = Table(toc_data, colWidths=[2*inch, 4*inch])
toc_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#667eea")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f8f9fa"), colors.white]),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
]))
story.append(toc_table)

story.append(PageBreak())

# ============================================
# SECTION 1: PROJECT OVERVIEW
# ============================================
story.append(Paragraph("1. Project Overview", h1_style))
story.append(Paragraph(
    "WebLearn Academy is an interactive web-based learning platform designed to teach "
    "web development fundamentals to beginners. The platform provides a structured learning "
    "path with 14 topics covering HTML, CSS, JavaScript, HTTP, APIs, Authentication, "
    "Databases, and more, culminating in a capstone project.",
    body_style
))

story.append(Paragraph("Key Features:", h3_style))
features = [
    "Two learning modes: 15-Day Fast Track and 30-Day Full Course",
    "5 content sections per topic: Quick Lesson, Deep Dive, Comparison, Interview Q&A, Exercises",
    "Progress tracking with streaks and completion statistics",
    "Admin panel for managing students and viewing analytics",
    "Modern glassmorphism UI with responsive design",
    "JWT-based authentication with role-based access control"
]
for feature in features:
    story.append(Paragraph(f"  \u2022  {feature}", body_style))

story.append(Spacer(1, 0.3 * inch))

# ============================================
# SECTION 2: TECHNOLOGY STACK
# ============================================
story.append(Paragraph("2. Technology Stack", h1_style))

tech_data = [
    ["Layer", "Technology", "Purpose"],
    ["Backend", "Node.js + Express", "Server and API framework"],
    ["Database", "JSON Files", "Simple file-based storage"],
    ["Authentication", "JWT (jsonwebtoken)", "Secure token-based auth"],
    ["Password Security", "bcrypt", "Password hashing"],
    ["Frontend", "HTML5 + CSS3 + JavaScript", "Single Page Application"],
    ["CSS Framework", "Bootstrap 5 + Tailwind CSS", "Responsive styling"],
    ["Icons", "Font Awesome 6", "Icon library"],
    ["Code Highlighting", "Prism.js", "Syntax highlighting"],
    ["Unique IDs", "uuid", "Generate unique identifiers"]
]

tech_table = Table(tech_data, colWidths=[1.5*inch, 2*inch, 2.5*inch])
tech_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#667eea")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f8f9fa"), colors.white]),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
]))
story.append(tech_table)

story.append(PageBreak())

# ============================================
# SECTION 3: PROJECT STRUCTURE
# ============================================
story.append(Paragraph("3. Project Structure", h1_style))
story.append(Paragraph(
    "The project follows a clean separation of concerns with dedicated folders for "
    "different purposes:",
    body_style
))

structure = """weblearn-academy/
|
|-- server.js              # Main entry point
|-- package.json           # Dependencies
|-- .env                   # Environment variables
|
|-- routes/                # API route handlers
|   |-- auth.js            # Authentication routes
|   |-- topics.js          # Topic content routes
|   |-- progress.js        # Progress tracking routes
|   |-- admin.js           # Admin panel routes
|
|-- middleware/             # Express middleware
|   |-- auth.js            # JWT verification
|   |-- admin.js           # Admin authorization
|   |-- rateLimit.js       # Rate limiting
|
|-- utils/                 # Utility functions
|   |-- db.js              # JSON file operations
|   |-- hash.js            # Password hashing
|
|-- content/               # Learning content
|   |-- index.js           # Topics list
|   |-- modes.js           # Learning modes
|   |-- 01-html/           # HTML topic content
|   |-- 02-css/            # CSS topic content
|   |-- ... (14 topics + capstone)
|
|-- data/                  # User data storage
|   |-- users.json         # User accounts
|   |-- progress.json      # Learning progress
|
|-- public/                # Frontend files
    |-- index.html         # Main HTML file
    |-- styles/
        |-- main.css       # Custom styles"""

story.append(Preformatted(structure, code_style))

story.append(PageBreak())

# ============================================
# SECTION 4: BACKEND ARCHITECTURE
# ============================================
story.append(Paragraph("4. Backend Architecture", h1_style))

story.append(Paragraph("4.1 Server Setup (server.js)", h2_style))
story.append(Paragraph(
    "The main server file sets up Express with middleware for JSON parsing, "
    "URL encoding, static file serving, and CORS. It mounts four route modules "
    "and includes an SPA fallback for client-side routing.",
    body_style
))

story.append(Paragraph("4.2 API Routes", h2_style))

routes_data = [
    ["Route", "Methods", "Description"],
    ["/api/auth", "POST, GET, PUT", "Register, login, profile, preferences"],
    ["/api/topics", "GET", "List topics, get topic content"],
    ["/api/progress", "GET, POST", "Get summary, update progress, log activity"],
    ["/api/admin", "GET, PUT, DELETE", "Dashboard, user management, statistics"]
]

routes_table = Table(routes_data, colWidths=[1.5*inch, 1.5*inch, 3*inch])
routes_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#667eea")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f8f9fa"), colors.white]),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
]))
story.append(routes_table)

story.append(Paragraph("4.3 Middleware", h2_style))
story.append(Paragraph(
    "<b>auth.js</b> - Verifies JWT tokens from the Authorization header. "
    "Decodes the token and attaches user info to req.user.",
    body_style
))
story.append(Paragraph(
    "<b>admin.js</b> - Extends auth middleware to check if user has 'admin' role. "
    "Returns 403 Forbidden for non-admin users.",
    body_style
))
story.append(Paragraph(
    "<b>rateLimit.js</b> - Prevents abuse by limiting requests per IP. "
    "Returns 429 Too Many Requests when limit exceeded.",
    body_style
))

story.append(PageBreak())

# ============================================
# SECTION 5: FRONTEND ARCHITECTURE
# ============================================
story.append(Paragraph("5. Frontend Architecture", h1_style))

story.append(Paragraph(
    "The frontend is a Single Page Application (SPA) built with vanilla JavaScript, "
    "Bootstrap 5, and Tailwind CSS. It uses a glassmorphism design theme.",
    body_style
))

story.append(Paragraph("5.1 Screen Structure", h2_style))

screens_data = [
    ["Screen", "Description", "Access"],
    ["Login Screen", "Authentication form with glass card", "Public"],
    ["Customer Dashboard", "Stats, progress, topic cards", "Customers"],
    ["Topic View", "Content sections with tabs", "Customers"],
    ["Admin Dashboard", "Platform statistics", "Admins"],
    ["Admin Students", "User management table", "Admins"],
    ["Admin Statistics", "Topic completion stats", "Admins"]
]

screens_table = Table(screens_data, colWidths=[1.8*inch, 2.5*inch, 1.7*inch])
screens_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#667eea")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f8f9fa"), colors.white]),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
]))
story.append(screens_table)

story.append(Paragraph("5.2 Application State", h2_style))
story.append(Paragraph(
    "The App object maintains global state including: JWT token (persisted in localStorage), "
    "current user info, topics list, current topic being viewed, active section tab, "
    "learning mode, and admin pagination state.",
    body_style
))

story.append(Paragraph("5.3 UI Design Theme", h2_style))
story.append(Paragraph(
    "The application uses a glassmorphism design with: frosted glass panels (backdrop-filter: blur), "
    "gradient backgrounds (purple to blue), semi-transparent cards, smooth animations, "
    "and responsive layout that adapts to mobile devices.",
    body_style
))

story.append(PageBreak())

# ============================================
# SECTION 6: DATABASE DESIGN
# ============================================
story.append(Paragraph("6. Database Design", h1_style))
story.append(Paragraph(
    "The application uses a simple JSON file-based database instead of a traditional "
    "database system. This approach is suitable for small applications and learning projects.",
    body_style
))

story.append(Paragraph("6.1 Users Collection (users.json)", h2_style))
story.append(Paragraph(
    "Each user has: id (UUID), name, email, passwordHash (bcrypt), createdAt, "
    "preferences (learningMode, theme), and role (admin/customer).",
    body_style
))

story.append(Paragraph("6.2 Progress Collection (progress.json)", h2_style))
story.append(Paragraph(
    "Each user's progress includes: topics (completion status per topic), "
    "dailyLog (activity by date), and currentTopicId.",
    body_style
))

story.append(Paragraph("6.3 Content Storage", h2_style))
story.append(Paragraph(
    "Learning content is stored in JSON files organized by topic folder. "
    "Each topic has 5 content files: quick.json, deep.json, comparison.json, "
    "interview.json, and exercises.json.",
    body_style
))

story.append(PageBreak())

# ============================================
# SECTION 7: AUTHENTICATION SYSTEM
# ============================================
story.append(Paragraph("7. Authentication System", h1_style))

story.append(Paragraph("7.1 Registration Flow", h2_style))
reg_steps = [
    "1. User submits name, email, and password",
    "2. Server validates input (all fields required, password >= 6 chars)",
    "3. Server checks if email already exists",
    "4. Password is hashed using bcrypt with 10 salt rounds",
    "5. User is saved to users.json with UUID",
    "6. JWT token is created with user id, name, email, role",
    "7. Token is returned to client and stored in localStorage"
]
for step in reg_steps:
    story.append(Paragraph(f"  {step}", body_style))

story.append(Paragraph("7.2 Login Flow", h2_style))
login_steps = [
    "1. User submits email and password",
    "2. Server finds user by email",
    "3. bcrypt.compare() verifies password against stored hash",
    "4. If valid, JWT token is created and returned",
    "5. Client stores token and redirects to dashboard"
]
for step in login_steps:
    story.append(Paragraph(f"  {step}", body_style))

story.append(Paragraph("7.3 Protected Routes", h2_style))
story.append(Paragraph(
    "Protected routes use the auth middleware which extracts the JWT token from "
    "the Authorization header, verifies it, and attaches user info to req.user. "
    "Admin routes additionally check for the 'admin' role.",
    body_style
))

story.append(PageBreak())

# ============================================
# SECTION 8: ADMIN PANEL
# ============================================
story.append(Paragraph("8. Admin Panel", h1_style))
story.append(Paragraph(
    "The admin panel provides comprehensive user management and analytics capabilities.",
    body_style
))

story.append(Paragraph("8.1 Admin Dashboard", h2_style))
story.append(Paragraph(
    "Shows overview statistics: total students, new registrations this week, "
    "completed course count, average progress percentage, and a table of recent students.",
    body_style
))

story.append(Paragraph("8.2 Student Management", h2_style))
admin_features = [
    "\u2022  View all students in a paginated table",
    "\u2022  Search students by name or email",
    "\u2022  Edit student name, email, and role",
    "\u2022  Delete students (with confirmation)",
    "\u2022  View individual student progress"
]
for feature in admin_features:
    story.append(Paragraph(f"  {feature}", body_style))

story.append(Paragraph("8.3 Statistics", h2_style))
story.append(Paragraph(
    "Shows topic completion counts across all users, helping identify which topics "
    "are most challenging or popular.",
    body_style
))

story.append(PageBreak())

# ============================================
# SECTION 9: CONTENT SYSTEM
# ============================================
story.append(Paragraph("9. Content System", h1_style))
story.append(Paragraph(
    "The learning content is organized into 14 topics plus a capstone project. "
    "Each topic has 5 content sections:",
    body_style
))

content_data = [
    ["Section", "Duration", "Description"],
    ["Quick Lesson", "5 minutes", "Core concepts with key terms"],
    ["Deep Dive", "15 minutes", "Detailed explanations and examples"],
    ["Comparison", "10 minutes", "JavaScript vs Python side-by-side"],
    ["Interview Q&A", "10 minutes", "Common interview questions"],
    ["Exercises", "15 minutes", "Coding practice with hints"]
]

content_table = Table(content_data, colWidths=[1.5*inch, 1.2*inch, 3.3*inch])
content_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#667eea")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f8f9fa"), colors.white]),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
]))
story.append(content_table)

story.append(Spacer(1, 0.3 * inch))

story.append(Paragraph("9.1 Topics List", h2_style))
topics = [
    "01. HTML - The Structure of the Web",
    "02. CSS - Styling Your Pages",
    "03. JavaScript - Making Pages Interactive",
    "04. HTTP/HTTPS - How the Web Talks",
    "05. API Gateway & Rate Limiting",
    "06. Routing, REST APIs & GraphQL",
    "07. Authentication - JWT, Sessions & OAuth",
    "08. Cookies vs LocalStorage",
    "09. Databases & CRUD Operations",
    "10. Error Handling",
    "11. Loading States & Caching",
    "12. Deployment - Putting Your App Online",
    "13. Modern HTML & CSS - Flexbox, Grid & Variables",
    "14. Modern JavaScript - ES6+, Async/Await & Fetch",
    "Capstone - DevBlog Platform"
]
for topic in topics:
    story.append(Paragraph(f"  \u2022  {topic}", body_style))

story.append(PageBreak())

# ============================================
# SECTION 10: HOW TO RUN
# ============================================
story.append(Paragraph("10. How to Run", h1_style))

story.append(Paragraph("10.1 Prerequisites", h2_style))
prereqs = [
    "\u2022  Node.js (v14 or higher)",
    "\u2022  npm (comes with Node.js)",
    "\u2022  A modern web browser"
]
for prereq in prereqs:
    story.append(Paragraph(f"  {prereq}", body_style))

story.append(Paragraph("10.2 Installation", h2_style))
story.append(Paragraph("Step 1: Navigate to project directory", body_style))
story.append(Preformatted("cd weblearn-academy", code_style))
story.append(Paragraph("Step 2: Install dependencies", body_style))
story.append(Preformatted("npm install", code_style))

story.append(Paragraph("10.3 Running the Server", h2_style))
story.append(Paragraph("Start the server:", body_style))
story.append(Preformatted("npm start", code_style))
story.append(Paragraph("Server will start at http://localhost:2007", body_style))

story.append(Paragraph("10.4 Test Accounts", h2_style))
accounts_data = [
    ["Role", "Email", "Password"],
    ["Admin", "admin@weblearn.com", "admin123"],
    ["Customer", "test@test.com", "customer123"]
]

accounts_table = Table(accounts_data, colWidths=[1.5*inch, 2.5*inch, 2*inch])
accounts_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#667eea")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f8f9fa"), colors.white]),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
]))
story.append(accounts_table)

story.append(PageBreak())

# ============================================
# APPENDIX: API REFERENCE
# ============================================
story.append(Paragraph("Appendix: API Reference", h1_style))

story.append(Paragraph("Authentication Endpoints", h2_style))
api_data = [
    ["Method", "Endpoint", "Body", "Description"],
    ["POST", "/api/auth/register", "name, email, password", "Create account"],
    ["POST", "/api/auth/login", "email, password", "Login"],
    ["GET", "/api/auth/profile", "-", "Get profile"],
    ["PUT", "/api/auth/preferences", "learningMode, theme", "Update prefs"]
]

api_table = Table(api_data, colWidths=[0.8*inch, 1.8*inch, 2*inch, 1.4*inch])
api_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#667eea")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 8),
    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f8f9fa"), colors.white]),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
]))
story.append(api_table)

story.append(Spacer(1, 0.3 * inch))

story.append(Paragraph("Topics Endpoints", h2_style))
topics_api = [
    ["Method", "Endpoint", "Description"],
    ["GET", "/api/topics", "List all topics"],
    ["GET", "/api/topics/:id", "Get topic content"]
]

topics_api_table = Table(topics_api, colWidths=[1*inch, 2*inch, 3*inch])
topics_api_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#667eea")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 8),
    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f8f9fa"), colors.white]),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
]))
story.append(topics_api_table)

story.append(Spacer(1, 0.3 * inch))

story.append(Paragraph("Progress Endpoints", h2_style))
progress_api = [
    ["Method", "Endpoint", "Description"],
    ["GET", "/api/progress/summary", "Get progress summary"],
    ["POST", "/api/progress/topic/:id", "Update topic progress"],
    ["POST", "/api/progress/topic/:id/interview", "Record interview attempt"],
    ["POST", "/api/progress/topic/:id/exercise", "Record exercise attempt"],
    ["POST", "/api/progress/log", "Log daily activity"]
]

progress_api_table = Table(progress_api, colWidths=[1*inch, 2.5*inch, 2.5*inch])
progress_api_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#667eea")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 8),
    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f8f9fa"), colors.white]),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
]))
story.append(progress_api_table)

story.append(Spacer(1, 0.3 * inch))

story.append(Paragraph("Admin Endpoints", h2_style))
admin_api = [
    ["Method", "Endpoint", "Description"],
    ["GET", "/api/admin/dashboard", "Get dashboard stats"],
    ["GET", "/api/admin/users", "List users (paginated)"],
    ["GET", "/api/admin/users/:id", "Get user details"],
    ["PUT", "/api/admin/users/:id", "Update user"],
    ["DELETE", "/api/admin/users/:id", "Delete user"],
    ["GET", "/api/admin/progress", "Get all progress"],
    ["GET", "/api/admin/stats", "Get platform statistics"]
]

admin_api_table = Table(admin_api, colWidths=[1*inch, 2.2*inch, 2.8*inch])
admin_api_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#667eea")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 8),
    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f8f9fa"), colors.white]),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
]))
story.append(admin_api_table)

# ============================================
# BUILD THE PDF
# ============================================
doc.build(story)
print("PDF generated successfully: WebLearn_Academy_Documentation.pdf")

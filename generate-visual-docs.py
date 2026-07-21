"""
WebLearn Academy - Visual Project Documentation PDF Generator
This script generates a comprehensive PDF with diagrams and visual elements.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    ListFlowable, ListItem, Image
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Polygon
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics import renderPDF

# Create the PDF document
doc = SimpleDocTemplate(
    "WebLearn_Academy_Visual_Documentation.pdf",
    pagesize=letter,
    leftMargin=0.75 * inch,
    rightMargin=0.75 * inch,
    topMargin=0.75 * inch,
    bottomMargin=0.75 * inch,
    title="WebLearn Academy - Visual Documentation",
    author="WebLearn Academy Team"
)

# Define custom styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "CustomTitle",
    parent=styles["Title"],
    fontSize=32,
    spaceAfter=15,
    textColor=colors.HexColor("#667eea"),
    alignment=TA_CENTER
)

subtitle_style = ParagraphStyle(
    "Subtitle",
    parent=styles["Normal"],
    fontSize=14,
    spaceAfter=30,
    textColor=colors.HexColor("#666666"),
    alignment=TA_CENTER
)

h1_style = ParagraphStyle(
    "H1",
    parent=styles["Heading1"],
    fontSize=24,
    spaceBefore=25,
    spaceAfter=12,
    textColor=colors.HexColor("#1a1a2e"),
    borderWidth=0,
    borderPadding=0
)

h2_style = ParagraphStyle(
    "H2",
    parent=styles["Heading2"],
    fontSize=18,
    spaceBefore=18,
    spaceAfter=10,
    textColor=colors.HexColor("#667eea")
)

h3_style = ParagraphStyle(
    "H3",
    parent=styles["Heading3"],
    fontSize=14,
    spaceBefore=12,
    spaceAfter=8,
    textColor=colors.HexColor("#4a4a6a")
)

body_style = ParagraphStyle(
    "CustomBody",
    parent=styles["BodyText"],
    fontSize=10,
    leading=14,
    spaceAfter=8,
    alignment=TA_JUSTIFY
)

caption_style = ParagraphStyle(
    "Caption",
    parent=styles["Normal"],
    fontSize=9,
    spaceAfter=15,
    textColor=colors.HexColor("#666666"),
    alignment=TA_CENTER,
    fontStyle="italic"
)

code_style = ParagraphStyle(
    "Code",
    parent=styles["Code"],
    fontSize=8,
    leading=10,
    spaceAfter=8,
    backColor=colors.HexColor("#f5f5f5"),
    borderPadding=5
)

# ============================================
# HELPER FUNCTIONS FOR DRAWING
# ============================================

def create_box(drawing, x, y, width, height, text, fill_color, text_color=colors.white, font_size=10):
    """Create a colored box with text"""
    rect = Rect(x, y, width, height, fillColor=fill_color, strokeColor=None)
    drawing.add(rect)
    text_obj = String(x + width/2, y + height/2 - font_size/3, text, 
                      fillColor=text_color, fontSize=font_size, textAnchor='middle')
    drawing.add(text_obj)

def create_arrow(drawing, x1, y1, x2, y2, color=colors.HexColor("#667eea")):
    """Create an arrow line"""
    line = Line(x1, y1, x2, y2, strokeColor=color, strokeWidth=2)
    drawing.add(line)
    # Arrowhead
    if x2 > x1:
        arrow_x = x2 - 8
    else:
        arrow_x = x2 + 8
    polygon = Polygon([x2, y2, arrow_x, y2+5, arrow_x, y2-5], fillColor=color, strokeColor=None)
    drawing.add(polygon)

def create_diagram_background(drawing, width, height):
    """Create a light background for diagrams"""
    rect = Rect(0, 0, width, height, fillColor=colors.HexColor("#f8f9fa"), strokeColor=colors.HexColor("#dee2e6"), strokeWidth=1)
    drawing.add(rect)

# ============================================
# COVER PAGE
# ============================================
cover_drawing = Drawing(500, 200)
create_diagram_background(cover_drawing, 500, 200)

# Decorative elements
for i in range(5):
    rect = Rect(20 + i*100, 20, 80, 160, fillColor=colors.HexColor("#667eea"), strokeColor=None, fillOpacity=0.1)
    cover_drawing.add(rect)

# Title
cover_drawing.add(String(250, 170, "WebLearn Academy", fillColor=colors.HexColor("#667eea"), fontSize=28, textAnchor='middle', fontName='Helvetica-Bold'))
cover_drawing.add(String(250, 140, "Visual Project Documentation", fillColor=colors.HexColor("#666666"), fontSize=16, textAnchor='middle'))
cover_drawing.add(String(250, 100, "Interactive Web Learning Platform", fillColor=colors.HexColor("#4a4a6a"), fontSize=12, textAnchor='middle'))
cover_drawing.add(String(250, 70, "Built with Node.js, Express, and Vanilla JavaScript", fillColor=colors.HexColor("#888888"), fontSize=10, textAnchor='middle'))

story = []
story.append(Spacer(1, 1.5 * inch))
story.append(cover_drawing)
story.append(Spacer(1, 0.5 * inch))

# Quick info table
info_data = [
    ["Version", "1.0.0"],
    ["Technology", "Node.js + Express + Vanilla JS"],
    ["Database", "JSON File Storage"],
    ["Auth", "JWT (JSON Web Tokens)"],
    ["UI Theme", "Glassmorphism"]
]

info_table = Table(info_data, colWidths=[1.5*inch, 3*inch])
info_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#667eea")),
    ("TEXTCOLOR", (0, 0), (0, -1), colors.white),
    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
    ("BACKGROUND", (1, 0), (1, -1), colors.white),
    ("ROWBACKGROUNDS", (1, 0), (1, -1), [colors.HexColor("#f8f9fa"), colors.white]),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ("TOPPADDING", (0, 0), (-1, -1), 10),
    ("LEFTPADDING", (0, 0), (-1, -1), 12),
]))
story.append(info_table)

story.append(PageBreak())

# ============================================
# TABLE OF CONTENTS
# ============================================
story.append(Paragraph("Table of Contents", h1_style))
story.append(Spacer(1, 0.3 * inch))

toc_items = [
    "1. System Architecture Diagram",
    "2. Project Structure Visualization",
    "3. Authentication Flow",
    "4. Database Schema",
    "5. User Interface Mockups",
    "6. API Endpoint Map",
    "7. Content Structure",
    "8. Admin Panel Flow",
    "9. Learning Path Diagram",
    "10. Technology Integration"
]

for i, item in enumerate(toc_items):
    story.append(Paragraph(f"<b>{item}</b>", body_style))
    story.append(Spacer(1, 0.1 * inch))

story.append(PageBreak())

# ============================================
# SECTION 1: SYSTEM ARCHITECTURE DIAGRAM
# ============================================
story.append(Paragraph("1. System Architecture Diagram", h1_style))
story.append(Paragraph(
    "The following diagram shows how the different components of WebLearn Academy "
    "interact with each other:",
    body_style
))

# Create architecture diagram
arch_drawing = Drawing(480, 280)
create_diagram_background(arch_drawing, 480, 280)

# Client Layer
arch_drawing.add(String(240, 260, "CLIENT LAYER", fillColor=colors.HexColor("#667eea"), fontSize=10, textAnchor='middle', fontName='Helvetica-Bold'))
create_box(arch_drawing, 50, 220, 100, 35, "Web Browser", colors.HexColor("#667eea"))
create_box(arch_drawing, 190, 220, 100, 35, "HTML/CSS/JS", colors.HexColor("#764ba2"))
create_box(arch_drawing, 330, 220, 100, 35, "SPA Router", colors.HexColor("#8b5cf6"))

# Server Layer
arch_drawing.add(String(240, 180, "SERVER LAYER", fillColor=colors.HexColor("#10b981"), fontSize=10, textAnchor='middle', fontName='Helvetica-Bold'))
create_box(arch_drawing, 50, 140, 100, 35, "Express.js", colors.HexColor("#10b981"))
create_box(arch_drawing, 190, 140, 100, 35, "API Routes", colors.HexColor("#14b8a6"))
create_box(arch_drawing, 330, 140, 100, 35, "Middleware", colors.HexColor("#06b6d4"))

# Data Layer
arch_drawing.add(String(240, 100, "DATA LAYER", fillColor=colors.HexColor("#f59e0b"), fontSize=10, textAnchor='middle', fontName='Helvetica-Bold'))
create_box(arch_drawing, 50, 60, 100, 35, "Users DB", colors.HexColor("#f59e0b"))
create_box(arch_drawing, 190, 60, 100, 35, "Progress DB", colors.HexColor("#eab308"))
create_box(arch_drawing, 330, 60, 100, 35, "Content Files", colors.HexColor("#f97316"))

# Arrows
create_arrow(arch_drawing, 100, 220, 100, 175, colors.HexColor("#667eea"))
create_arrow(arch_drawing, 240, 220, 240, 175, colors.HexColor("#764ba2"))
create_arrow(arch_drawing, 380, 220, 380, 175, colors.HexColor("#8b5cf6"))
create_arrow(arch_drawing, 100, 140, 100, 95, colors.HexColor("#10b981"))
create_arrow(arch_drawing, 240, 140, 240, 95, colors.HexColor("#14b8a6"))
create_arrow(arch_drawing, 380, 140, 380, 95, colors.HexColor("#06b6d4"))

story.append(arch_drawing)
story.append(Paragraph("Figure 1: System Architecture - Three-tier architecture with Client, Server, and Data layers", caption_style))

story.append(Paragraph(
    "The application follows a classic three-tier architecture. The client layer handles "
    "the user interface, the server layer processes requests and business logic, and the "
    "data layer stores all persistent information in JSON files.",
    body_style
))

story.append(PageBreak())

# ============================================
# SECTION 2: PROJECT STRUCTURE VISUALIZATION
# ============================================
story.append(Paragraph("2. Project Structure Visualization", h1_style))

# Create file tree diagram
tree_drawing = Drawing(480, 320)
create_diagram_background(tree_drawing, 480, 320)

# Title
tree_drawing.add(String(240, 300, "Project File Structure", fillColor=colors.HexColor("#667eea"), fontSize=14, textAnchor='middle', fontName='Helvetica-Bold'))

# Main folder
create_box(tree_drawing, 30, 260, 120, 28, "weblearn-academy/", colors.HexColor("#667eea"), font_size=8)

# Level 1 folders
folders = [
    (30, 210, "routes/", "#10b981"),
    (180, 210, "middleware/", "#f59e0b"),
    (330, 210, "utils/", "#8b5cf6"),
    (30, 150, "content/", "#06b6d4"),
    (180, 150, "data/", "#ec4899"),
    (330, 150, "public/", "#ef4444"),
]

for x, y, text, color in folders:
    create_box(tree_drawing, x, y, 100, 24, text, colors.HexColor(color), font_size=8)

# Level 2 files
files = [
    (30, 110, "auth.js", "#10b981"),
    (30, 85, "topics.js", "#10b981"),
    (30, 60, "progress.js", "#10b981"),
    (180, 110, "auth.js", "#f59e0b"),
    (180, 85, "admin.js", "#f59e0b"),
    (180, 60, "rateLimit.js", "#f59e0b"),
    (330, 110, "db.js", "#8b5cf6"),
    (330, 85, "hash.js", "#8b5cf6"),
    (330, 60, "index.js", "#06b6d4"),
    (30, 35, "server.js", "#667eea"),
    (180, 35, "package.json", "#667eea"),
    (330, 35, "index.html", "#ef4444"),
]

for x, y, text, color in files:
    rect = Rect(x, y, 80, 18, fillColor=colors.HexColor(color), strokeColor=None, fillOpacity=0.7)
    tree_drawing.add(rect)
    tree_drawing.add(String(x + 40, y + 5, text, fillColor=colors.white, fontSize=7, textAnchor='middle'))

# Connection lines
for x, y, _, color in folders:
    tree_drawing.add(Line(90, 260, x + 50, y + 24, strokeColor=colors.HexColor(color), strokeWidth=1, strokeOpacity=0.5))

story.append(tree_drawing)
story.append(Paragraph("Figure 2: Project folder structure with file organization", caption_style))

story.append(PageBreak())

# ============================================
# SECTION 3: AUTHENTICATION FLOW
# ============================================
story.append(Paragraph("3. Authentication Flow Diagram", h1_style))
story.append(Paragraph(
    "The following diagram illustrates the complete authentication process "
    "from user registration to accessing protected routes:",
    body_style
))

# Create auth flow diagram
auth_drawing = Drawing(480, 350)
create_diagram_background(auth_drawing, 480, 350)

# Title
auth_drawing.add(String(240, 330, "Authentication Flow", fillColor=colors.HexColor("#667eea"), fontSize=14, textAnchor='middle', fontName='Helvetica-Bold'))

# Flow steps
steps = [
    (60, 280, "User Enters\nCredentials", colors.HexColor("#667eea")),
    (220, 280, "Server Validates\nInput", colors.HexColor("#764ba2")),
    (380, 280, "Check if Email\nExists", colors.HexColor("#8b5cf6")),
    (60, 210, "Hash Password\nwith bcrypt", colors.HexColor("#10b981")),
    (220, 210, "Save User to\nDatabase", colors.HexColor("#14b8a6")),
    (380, 210, "Generate JWT\nToken", colors.HexColor("#06b6d4")),
    (60, 140, "Return Token\nto Client", colors.HexColor("#f59e0b")),
    (220, 140, "Store Token\nin localStorage", colors.HexColor("#eab308")),
    (380, 140, "Attach Token to\nRequests", colors.HexColor("#f97316")),
    (60, 70, "Server Verifies\nToken", colors.HexColor("#ef4444")),
    (220, 70, "Decode User\nData", colors.HexColor("#dc2626")),
    (380, 70, "Grant Access\nto Route", colors.HexColor("#b91c1c")),
]

for x, y, text, color in steps:
    create_box(auth_drawing, x, y, 100, 50, text, color, font_size=8)

# Arrows connecting steps
arrows = [
    (160, 305, 220, 305),
    (320, 305, 380, 305),
    (380, 280, 380, 260),
    (380, 210, 320, 210),
    (220, 210, 160, 210),
    (60, 210, 60, 190),
    (60, 140, 160, 140),
    (160, 140, 220, 140),
    (320, 140, 380, 140),
    (380, 140, 380, 120),
    (380, 70, 320, 70),
    (220, 70, 160, 70),
]

for x1, y1, x2, y2 in arrows:
    create_arrow(auth_drawing, x1, y1, x2, y2)

story.append(auth_drawing)
story.append(Paragraph("Figure 3: Complete authentication flow from login to route access", caption_style))

story.append(Paragraph(
    "<b>Key Security Features:</b><br/>"
    "\u2022 Passwords are never stored in plain text (bcrypt hashing)<br/>"
    "\u2022 JWT tokens expire after 7 days<br/>"
    "\u2022 Rate limiting prevents brute force attacks<br/>"
    "\u2022 Admin routes require additional role verification",
    body_style
))

story.append(PageBreak())

# ============================================
# SECTION 4: DATABASE SCHEMA
# ============================================
story.append(Paragraph("4. Database Schema Diagram", h1_style))
story.append(Paragraph(
    "WebLearn Academy uses JSON file-based storage. Here's the data structure:",
    body_style
))

# Create database schema diagram
schema_drawing = Drawing(480, 280)
create_diagram_background(schema_drawing, 480, 280)

# Title
schema_drawing.add(String(240, 260, "Database Schema", fillColor=colors.HexColor("#667eea"), fontSize=14, textAnchor='middle', fontName='Helvetica-Bold'))

# Users table
create_box(schema_drawing, 30, 180, 140, 70, "", colors.HexColor("#667eea"))
schema_drawing.add(String(100, 230, "USERS", fillColor=colors.white, fontSize=10, textAnchor='middle', fontName='Helvetica-Bold'))
schema_drawing.add(String(100, 215, "id (UUID)", fillColor=colors.white, fontSize=8, textAnchor='middle'))
schema_drawing.add(String(100, 205, "name", fillColor=colors.white, fontSize=8, textAnchor='middle'))
schema_drawing.add(String(100, 195, "email", fillColor=colors.white, fontSize=8, textAnchor='middle'))
schema_drawing.add(String(100, 185, "passwordHash", fillColor=colors.white, fontSize=8, textAnchor='middle'))

# Progress table
create_box(schema_drawing, 200, 180, 140, 70, "", colors.HexColor("#10b981"))
schema_drawing.add(String(270, 230, "PROGRESS", fillColor=colors.white, fontSize=10, textAnchor='middle', fontName='Helvetica-Bold'))
schema_drawing.add(String(270, 215, "userId", fillColor=colors.white, fontSize=8, textAnchor='middle'))
schema_drawing.add(String(270, 205, "topics{}", fillColor=colors.white, fontSize=8, textAnchor='middle'))
schema_drawing.add(String(270, 195, "dailyLog{}", fillColor=colors.white, fontSize=8, textAnchor='middle'))
schema_drawing.add(String(270, 185, "currentTopicId", fillColor=colors.white, fontSize=8, textAnchor='middle'))

# Content structure
create_box(schema_drawing, 370, 180, 100, 70, "", colors.HexColor("#f59e0b"))
schema_drawing.add(String(420, 230, "CONTENT", fillColor=colors.white, fontSize=10, textAnchor='middle', fontName='Helvetica-Bold'))
schema_drawing.add(String(420, 215, "topicId", fillColor=colors.white, fontSize=8, textAnchor='middle'))
schema_drawing.add(String(420, 205, "quick.json", fillColor=colors.white, fontSize=8, textAnchor='middle'))
schema_drawing.add(String(420, 195, "deep.json", fillColor=colors.white, fontSize=8, textAnchor='middle'))
schema_drawing.add(String(420, 185, "+ 3 more", fillColor=colors.white, fontSize=8, textAnchor='middle'))

# Relationships
schema_drawing.add(String(170, 170, "1:N", fillColor=colors.HexColor("#666666"), fontSize=8, textAnchor='middle'))
schema_drawing.add(Line(170, 175, 200, 175, strokeColor=colors.HexColor("#666666"), strokeWidth=1))
schema_drawing.add(String(345, 170, "N:1", fillColor=colors.HexColor("#666666"), fontSize=8, textAnchor='middle'))
schema_drawing.add(Line(345, 175, 370, 175, strokeColor=colors.HexColor("#666666"), strokeWidth=1))

story.append(schema_drawing)
story.append(Paragraph("Figure 4: Database schema showing users, progress, and content relationships", caption_style))

story.append(Paragraph(
    "<b>Data Storage Details:</b><br/>"
    "\u2022 <b>users.json</b>: Stores all user accounts with hashed passwords<br/>"
    "\u2022 <b>progress.json</b>: Tracks learning progress for each user<br/>"
    "\u2022 <b>content/</b>: Contains JSON files with lesson content organized by topic",
    body_style
))

story.append(PageBreak())

# ============================================
# SECTION 5: UI MOCKUPS
# ============================================
story.append(Paragraph("5. User Interface Mockups", h1_style))
story.append(Paragraph(
    "The application features a modern glassmorphism design. Here are the main screens:",
    body_style
))

# Create UI mockup - Login Screen
login_drawing = Drawing(480, 200)
create_diagram_background(login_drawing, 480, 200)

# Gradient background simulation
for i in range(10):
    rect = Rect(0, i*20, 480, 20, fillColor=colors.HexColor("#667eea"), strokeColor=None, fillOpacity=0.1)
    login_drawing.add(rect)

# Glass card
create_box(login_drawing, 140, 30, 200, 140, "", colors.white)
login_drawing.add(String(240, 150, "WebLearn Academy", fillColor=colors.HexColor("#667eea"), fontSize=14, textAnchor='middle', fontName='Helvetica-Bold'))
login_drawing.add(String(240, 135, "Welcome back!", fillColor=colors.HexColor("#666666"), fontSize=10, textAnchor='middle'))

# Form fields
create_box(login_drawing, 160, 100, 160, 20, "Email", colors.HexColor("#e5e7eb"), colors.HexColor("#9ca3af"), 8)
create_box(login_drawing, 160, 75, 160, 20, "Password", colors.HexColor("#e5e7eb"), colors.HexColor("#9ca3af"), 8)
create_box(login_drawing, 160, 50, 160, 25, "Sign In", colors.HexColor("#667eea"), colors.white, 9)

story.append(login_drawing)
story.append(Paragraph("Figure 5: Login screen with glassmorphism card design", caption_style))

# Create UI mockup - Dashboard
dash_drawing = Drawing(480, 200)
create_diagram_background(dash_drawing, 480, 200)

# Sidebar
create_box(dash_drawing, 0, 0, 80, 200, "", colors.HexColor("#1a1a2e"))
dash_drawing.add(String(40, 180, "WebLearn", fillColor=colors.white, fontSize=7, textAnchor='middle', fontName='Helvetica-Bold'))
create_box(dash_drawing, 10, 150, 60, 18, "Dashboard", colors.HexColor("#667eea"), colors.white, 6)
create_box(dash_drawing, 10, 125, 60, 18, "Topics", colors.HexColor("#374151"), colors.white, 6)
create_box(dash_drawing, 10, 100, 60, 18, "Progress", colors.HexColor("#374151"), colors.white, 6)

# Main content
create_box(dash_drawing, 90, 160, 130, 30, "Hey User!", colors.HexColor("#667eea"), colors.white, 10)
create_box(dash_drawing, 90, 120, 130, 35, "Stats Cards", colors.HexColor("#10b981"), colors.white, 9)
create_box(dash_drawing, 230, 120, 130, 35, "Progress", colors.HexColor("#f59e0b"), colors.white, 9)
create_box(dash_drawing, 370, 120, 100, 35, "Streak", colors.HexColor("#ef4444"), colors.white, 9)

# Topic cards
create_box(dash_drawing, 90, 70, 100, 40, "HTML", colors.HexColor("#f3f4f6"), colors.HexColor("#1a1a2e"), 9)
create_box(dash_drawing, 200, 70, 100, 40, "CSS", colors.HexColor("#f3f4f6"), colors.HexColor("#1a1a2e"), 9)
create_box(dash_drawing, 310, 70, 100, 40, "JS", colors.HexColor("#f3f4f6"), colors.HexColor("#1a1a2e"), 9)

story.append(dash_drawing)
story.append(Paragraph("Figure 6: Customer dashboard with sidebar navigation and stats cards", caption_style))

story.append(PageBreak())

# ============================================
# SECTION 6: API ENDPOINT MAP
# ============================================
story.append(Paragraph("6. API Endpoint Map", h1_style))
story.append(Paragraph(
    "Visual representation of all API endpoints organized by module:",
    body_style
))

# Create API map diagram
api_drawing = Drawing(480, 320)
create_diagram_background(api_drawing, 480, 320)

# Title
api_drawing.add(String(240, 300, "API Endpoint Map", fillColor=colors.HexColor("#667eea"), fontSize=14, textAnchor='middle', fontName='Helvetica-Bold'))

# Auth endpoints
create_box(api_drawing, 30, 240, 100, 50, "Auth Module", colors.HexColor("#667eea"))
auth_endpoints = [
    (40, 220, "POST /register"),
    (40, 210, "POST /login"),
    (40, 200, "GET /profile"),
    (40, 190, "PUT /preferences"),
]
for x, y, text in auth_endpoints:
    api_drawing.add(String(x, y, text, fillColor=colors.HexColor("#666666"), fontSize=7))

# Topics endpoints
create_box(api_drawing, 180, 240, 100, 50, "Topics Module", colors.HexColor("#10b981"))
topics_endpoints = [
    (190, 220, "GET /topics"),
    (190, 210, "GET /topics/:id"),
]
for x, y, text in topics_endpoints:
    api_drawing.add(String(x, y, text, fillColor=colors.HexColor("#666666"), fontSize=7))

# Progress endpoints
create_box(api_drawing, 330, 240, 120, 50, "Progress Module", colors.HexColor("#f59e0b"))
progress_endpoints = [
    (340, 220, "GET /summary"),
    (340, 210, "POST /topic/:id"),
    (340, 200, "POST /log"),
]
for x, y, text in progress_endpoints:
    api_drawing.add(String(x, y, text, fillColor=colors.HexColor("#666666"), fontSize=7))

# Admin endpoints
create_box(api_drawing, 150, 130, 180, 50, "Admin Module", colors.HexColor("#ef4444"))
admin_endpoints = [
    (160, 110, "GET /dashboard"),
    (160, 100, "GET/PUT/DELETE /users"),
    (160, 90, "GET /progress"),
    (160, 80, "GET /stats"),
]
for x, y, text in admin_endpoints:
    api_drawing.add(String(x, y, text, fillColor=colors.HexColor("#666666"), fontSize=7))

# Connection lines
api_drawing.add(Line(80, 240, 80, 230, strokeColor=colors.HexColor("#667eea"), strokeWidth=1))
api_drawing.add(Line(230, 240, 230, 225, strokeColor=colors.HexColor("#10b981"), strokeWidth=1))
api_drawing.add(Line(390, 240, 390, 225, strokeColor=colors.HexColor("#f59e0b"), strokeWidth=1))
api_drawing.add(Line(240, 130, 240, 125, strokeColor=colors.HexColor("#ef4444"), strokeWidth=1))

story.append(api_drawing)
story.append(Paragraph("Figure 7: API endpoints organized by functional module", caption_style))

story.append(PageBreak())

# ============================================
# SECTION 7: CONTENT STRUCTURE
# ============================================
story.append(Paragraph("7. Content Structure Diagram", h1_style))
story.append(Paragraph(
    "Each learning topic contains 5 types of content sections:",
    body_style
))

# Create content structure diagram
content_drawing = Drawing(480, 250)
create_diagram_background(content_drawing, 480, 250)

# Title
content_drawing.add(String(240, 230, "Topic Content Structure", fillColor=colors.HexColor("#667eea"), fontSize=14, textAnchor='middle', fontName='Helvetica-Bold'))

# Main topic box
create_box(content_drawing, 180, 180, 120, 35, "Topic (e.g., HTML)", colors.HexColor("#667eea"))

# Content types
content_types = [
    (30, 100, "Quick Lesson\n(5 min)", colors.HexColor("#10b981")),
    (130, 100, "Deep Dive\n(15 min)", colors.HexColor("#06b6d4")),
    (230, 100, "Comparison\n(JS vs Python)", colors.HexColor("#8b5cf6")),
    (330, 100, "Interview\nQ&A", colors.HexColor("#f59e0b")),
    (420, 100, "Exercises\n(Logic Building)", colors.HexColor("#ef4444")),
]

for x, y, text, color in content_types:
    create_box(content_drawing, x, y, 85, 55, text, color, font_size=7)
    # Connection line
    content_drawing.add(Line(x + 42, 135, 240, 180, strokeColor=colors.HexColor("#666666"), strokeWidth=1, strokeOpacity=0.5))

# Features list
features_y = 50
content_drawing.add(String(240, features_y + 30, "Each section includes:", fillColor=colors.HexColor("#333333"), fontSize=10, textAnchor='middle', fontName='Helvetica-Bold'))
content_drawing.add(String(240, features_y + 15, "\u2022 Code examples with syntax highlighting", fillColor=colors.HexColor("#666666"), fontSize=8, textAnchor='middle'))
content_drawing.add(String(240, features_y, "\u2022 Explanations and key concepts", fillColor=colors.HexColor("#666666"), fontSize=8, textAnchor='middle'))
content_drawing.add(String(240, features_y - 15, "\u2022 Practice exercises with hints", fillColor=colors.HexColor("#666666"), fontSize=8, textAnchor='middle'))

story.append(content_drawing)
story.append(Paragraph("Figure 8: Topic content structure with 5 learning sections", caption_style))

story.append(PageBreak())

# ============================================
# SECTION 8: ADMIN PANEL FLOW
# ============================================
story.append(Paragraph("8. Admin Panel Flow", h1_style))
story.append(Paragraph(
    "The admin panel provides comprehensive user management capabilities:",
    body_style
))

# Create admin flow diagram
admin_drawing = Drawing(480, 280)
create_diagram_background(admin_drawing, 480, 280)

# Title
admin_drawing.add(String(240, 260, "Admin Panel Workflow", fillColor=colors.HexColor("#667eea"), fontSize=14, textAnchor='middle', fontName='Helvetica-Bold'))

# Admin dashboard
create_box(admin_drawing, 180, 210, 120, 35, "Admin Dashboard", colors.HexColor("#667eea"))

# Main actions
actions = [
    (50, 140, "View Stats", colors.HexColor("#10b981")),
    (200, 140, "Manage Users", colors.HexColor("#f59e0b")),
    (350, 140, "View Progress", colors.HexColor("#8b5cf6")),
]

for x, y, text, color in actions:
    create_box(admin_drawing, x, y, 100, 40, text, color)
    admin_drawing.add(Line(240, 210, x + 50, y + 40, strokeColor=colors.HexColor("#666666"), strokeWidth=1))

# User management sub-actions
user_actions = [
    (50, 70, "Search\nStudents", colors.HexColor("#10b981")),
    (150, 70, "Edit\nUser", colors.HexColor("#06b6d4")),
    (250, 70, "Delete\nUser", colors.HexColor("#ef4444")),
    (350, 70, "View\nDetails", colors.HexColor("#8b5cf6")),
]

for x, y, text, color in user_actions:
    create_box(admin_drawing, x, y, 80, 45, text, color, font_size=8)
    admin_drawing.add(Line(250, 140, x + 40, y + 45, strokeColor=colors.HexColor("#f59e0b"), strokeWidth=1))

# Features list
admin_drawing.add(String(240, 40, "Features: Pagination | Search | Role Management | Progress Tracking", fillColor=colors.HexColor("#666666"), fontSize=9, textAnchor='middle'))

story.append(admin_drawing)
story.append(Paragraph("Figure 9: Admin panel workflow with user management actions", caption_style))

story.append(PageBreak())

# ============================================
# SECTION 9: LEARNING PATH
# ============================================
story.append(Paragraph("9. Learning Path Diagram", h1_style))
story.append(Paragraph(
    "The 15-day fast-track learning path through web development topics:",
    body_style
))

# Create learning path diagram
path_drawing = Drawing(480, 300)
create_diagram_background(path_drawing, 480, 300)

# Title
path_drawing.add(String(240, 280, "15-Day Learning Path", fillColor=colors.HexColor("#667eea"), fontSize=14, textAnchor='middle', fontName='Helvetica-Bold'))

# Learning phases
phases = [
    (20, 220, "Fundamentals", ["HTML", "CSS", "JavaScript"], colors.HexColor("#667eea")),
    (170, 220, "Networking", ["HTTP", "API Gateway"], colors.HexColor("#10b981")),
    (290, 220, "Backend", ["REST APIs", "Auth"], colors.HexColor("#f59e0b")),
    (400, 220, "Security", ["Cookies", "Storage"], colors.HexColor("#ef4444")),
]

for x, y, title, topics, color in phases:
    create_box(path_drawing, x, y, 90, 50, title, color)
    for i, topic in enumerate(topics):
        path_drawing.add(String(x + 45, y + 35 - i*12, topic, fillColor=colors.white, fontSize=7, textAnchor='middle'))

# Second row
phases2 = [
    (20, 130, "Data", ["Databases", "CRUD"], colors.HexColor("#8b5cf6")),
    (130, 130, "Best Practices", ["Error Handling", "Caching"], colors.HexColor("#06b6d4")),
    (280, 130, "DevOps", ["Deployment"], colors.HexColor("#ec4899")),
    (380, 130, "Modern", ["Flexbox/Grid", "ES6+"], colors.HexColor("#14b8a6")),
]

for x, y, title, topics, color in phases2:
    create_box(path_drawing, x, y, 90, 50, title, color)
    for i, topic in enumerate(topics):
        path_drawing.add(String(x + 45, y + 35 - i*12, topic, fillColor=colors.white, fontSize=7, textAnchor='middle'))

# Capstone
create_box(path_drawing, 180, 40, 120, 50, "Capstone Project\nDevBlog Platform", colors.HexColor("#667eea"))

# Arrows showing progression
path_drawing.add(Line(110, 220, 170, 220, strokeColor=colors.HexColor("#666666"), strokeWidth=1))
path_drawing.add(Line(260, 220, 290, 220, strokeColor=colors.HexColor("#666666"), strokeWidth=1))
path_drawing.add(Line(380, 220, 400, 220, strokeColor=colors.HexColor("#666666"), strokeWidth=1))
path_drawing.add(Line(240, 130, 240, 90, strokeColor=colors.HexColor("#666666"), strokeWidth=1))

story.append(path_drawing)
story.append(Paragraph("Figure 10: 15-day learning path with topic progression", caption_style))

story.append(PageBreak())

# ============================================
# SECTION 10: TECHNOLOGY INTEGRATION
# ============================================
story.append(Paragraph("10. Technology Integration", h1_style))
story.append(Paragraph(
    "How different technologies work together in the stack:",
    body_style
))

# Create tech stack diagram
tech_drawing = Drawing(480, 280)
create_diagram_background(tech_drawing, 480, 280)

# Title
tech_drawing.add(String(240, 260, "Technology Integration", fillColor=colors.HexColor("#667eea"), fontSize=14, textAnchor='middle', fontName='Helvetica-Bold'))

# Frontend technologies
tech_drawing.add(String(120, 230, "Frontend", fillColor=colors.HexColor("#667eea"), fontSize=12, textAnchor='middle', fontName='Helvetica-Bold'))
frontend_tech = [
    (30, 190, "HTML5", colors.HexColor("#e44d26")),
    (100, 190, "CSS3", colors.HexColor("#264de4")),
    (170, 190, "JavaScript", colors.HexColor("#f7df1e")),
]

for x, y, text, color in frontend_tech:
    create_box(tech_drawing, x, y, 60, 25, text, color, colors.black if text == "JavaScript" else colors.white, 8)

# Backend technologies
tech_drawing.add(String(380, 230, "Backend", fillColor=colors.HexColor("#10b981"), fontSize=12, textAnchor='middle', fontName='Helvetica-Bold'))
backend_tech = [
    (300, 190, "Node.js", colors.HexColor("#339933")),
    (370, 190, "Express", colors.HexColor("#333333")),
    (440, 190, "JWT", colors.HexColor("#000000")),
]

for x, y, text, color in backend_tech:
    create_box(tech_drawing, x, y, 55, 25, text, color, colors.white, 8)

# Libraries
tech_drawing.add(String(240, 140, "Key Libraries", fillColor=colors.HexColor("#f59e0b"), fontSize=12, textAnchor='middle', fontName='Helvetica-Bold'))
libraries = [
    (50, 100, "bcrypt\n(Password Hashing)", colors.HexColor("#f59e0b")),
    (180, 100, "jsonwebtoken\n(Auth Tokens)", colors.HexColor("#eab308")),
    (310, 100, "uuid\n(Unique IDs)", colors.HexColor("#f97316")),
]

for x, y, text, color in libraries:
    create_box(tech_drawing, x, y, 100, 40, text, color, font_size=7)

# Integration arrows
tech_drawing.add(Line(120, 190, 300, 190, strokeColor=colors.HexColor("#666666"), strokeWidth=1, strokeDashArray=[3,3]))
tech_drawing.add(Line(240, 190, 240, 140, strokeColor=colors.HexColor("#666666"), strokeWidth=1, strokeDashArray=[3,3]))

story.append(tech_drawing)
story.append(Paragraph("Figure 11: Technology stack integration diagram", caption_style))

story.append(Spacer(1, 0.5 * inch))

# Final summary box
summary_drawing = Drawing(480, 100)
create_diagram_background(summary_drawing, 480, 100)

create_box(summary_drawing, 20, 20, 440, 60, "", colors.HexColor("#667eea"))
summary_drawing.add(String(240, 65, "WebLearn Academy", fillColor=colors.white, fontSize=16, textAnchor='middle', fontName='Helvetica-Bold'))
summary_drawing.add(String(240, 45, "A complete, modern web learning platform built with simplicity and scalability in mind", fillColor=colors.white, fontSize=9, textAnchor='middle'))

story.append(summary_drawing)

# ============================================
# BUILD THE PDF
# ============================================
doc.build(story)
print("Visual PDF generated successfully: WebLearn_Academy_Visual_Documentation.pdf")

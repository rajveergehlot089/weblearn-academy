module.exports = [
  {
    "id": "01-css-intro",
    "title": "CSS Introduction & Selectors",
    "group": "fundamentals",
    "day_fast_track": 1,
    "day_full_course": 1,
    "icon": "🎨",
    "description": "How CSS works, selectors, specificity, and the cascade.",
    "prerequisites": []
  },
  {
    "id": "02-box-model",
    "title": "The Box Model — Spacing & Borders",
    "group": "fundamentals",
    "day_fast_track": 2,
    "day_full_course": 3,
    "icon": "📦",
    "description": "Margin, padding, border, box-sizing, and element dimensions.",
    "prerequisites": [
      "01-css-intro"
    ]
  },
  {
    "id": "03-typography-colors",
    "title": "Typography, Colors & Units",
    "group": "fundamentals",
    "day_fast_track": 3,
    "day_full_course": 5,
    "icon": "🔤",
    "description": "Font properties, color systems (hex, RGB, HSL), and CSS units.",
    "prerequisites": [
      "01-css-intro"
    ]
  },
  {
    "id": "04-flexbox",
    "title": "Flexbox — One-Dimensional Layouts",
    "group": "layout",
    "day_fast_track": 4,
    "day_full_course": 7,
    "icon": "↔️",
    "description": "Master flex containers, items, alignment, wrapping, and ordering.",
    "prerequisites": [
      "02-box-model"
    ]
  },
  {
    "id": "05-css-grid",
    "title": "CSS Grid — Two-Dimensional Layouts",
    "group": "layout",
    "day_fast_track": 5,
    "day_full_course": 9,
    "icon": "🔲",
    "description": "Grid containers, areas, template columns/rows, and responsive grids.",
    "prerequisites": [
      "04-flexbox"
    ]
  },
  {
    "id": "06-responsive-design",
    "title": "Responsive Design & Media Queries",
    "group": "layout",
    "day_fast_track": 6,
    "day_full_course": 11,
    "icon": "📱",
    "description": "Build pages that work on every screen size with breakpoints.",
    "prerequisites": [
      "05-css-grid"
    ]
  },
  {
    "id": "07-positioning",
    "title": "Positioning & Stacking",
    "group": "layout",
    "day_fast_track": 7,
    "day_full_course": 13,
    "icon": "📍",
    "description": "Static, relative, absolute, fixed, sticky positioning and z-index.",
    "prerequisites": [
      "02-box-model"
    ]
  },
  {
    "id": "08-pseudo-classes",
    "title": "Pseudo-Classes & Pseudo-Elements",
    "group": "advanced",
    "day_fast_track": 8,
    "day_full_course": 15,
    "icon": "🎯",
    "description": "Hover, focus, nth-child, ::before, ::after, and dynamic states.",
    "prerequisites": [
      "01-css-intro"
    ]
  },
  {
    "id": "09-animations",
    "title": "Transitions & Animations",
    "group": "advanced",
    "day_fast_track": 9,
    "day_full_course": 17,
    "icon": "✨",
    "description": "Smooth transitions, keyframe animations, and transform effects.",
    "prerequisites": [
      "01-css-intro"
    ]
  },
  {
    "id": "10-css-variables",
    "title": "CSS Variables & Custom Properties",
    "group": "modern",
    "day_fast_track": 10,
    "day_full_course": 19,
    "icon": "🔧",
    "description": "Reusable values, theming, and dynamic styles with custom properties.",
    "prerequisites": [
      "01-css-intro"
    ]
  }
];
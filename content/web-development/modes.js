// ============================================
// Learning Modes Configuration
// ============================================
// Users can choose between two learning paths:
// 1. Fast Track: Complete in 15 days (25 min/day)
// 2. Full Course: Complete in ~30 days (40 min/day)

module.exports = {
  "fast-track": {
    id: "fast-track",
    title: "15-Day Fast Track",
    description: "One topic per day. Quick lesson (5 min) + Deep lesson (15 min). Get the essentials fast.",
    totalDays: 15, // Total course duration
    dailyMinutes: 25 // Recommended daily study time
  },
  "full-course": {
    id: "full-course",
    title: "Full Course (~30 Days)",
    description: "Same topics with extra practice, more exercises, and a capstone project woven in.",
    totalDays: 30,
    dailyMinutes: 40
  }
};

// ============================================
// Input Validation Middleware (Zod)
// ============================================
const { z } = require('zod');

// Validation middleware factory
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    req.body = result.data;
    next();
  };
}

// ============================================
// Auth Schemas
// ============================================
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

const preferencesSchema = z.object({
  mode: z.enum(['fast-track', 'full-course']).optional(),
  theme: z.enum(['light', 'dark']).optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one preference must be provided' });

// ============================================
// Course Schemas
// ============================================
const courseIdSchema = z.object({
  courseId: z.string().min(1).max(100),
});

const createCourseSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'Course ID must be lowercase alphanumeric with hyphens').min(3).max(50),
  title: z.string().min(2).max(200).trim(),
  description: z.string().max(2000).optional().default(''),
  icon: z.string().max(50).optional().default('fas fa-book'),
  emoji: z.string().max(4).optional().default('\ud83d\udcda'),
  category: z.enum(['technology', 'typing', 'language', 'soft-skills', 'general']).optional().default('general'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().default('beginner'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#667eea'),
});

const updateCourseSchema = z.object({
  title: z.string().min(2).max(200).trim().optional(),
  description: z.string().max(2000).optional(),
  icon: z.string().max(50).optional(),
  emoji: z.string().max(4).optional(),
  category: z.enum(['technology', 'typing', 'language', 'soft-skills', 'general']).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  isActive: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field must be provided' });

const createTopicSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'Topic ID must be lowercase alphanumeric with hyphens').min(3).max(50),
  title: z.string().min(2).max(200).trim(),
  group: z.string().max(100).optional().default('general'),
  icon: z.string().max(4).optional().default('\ud83d\udcdd'),
  description: z.string().max(1000).optional().default(''),
  prerequisites: z.array(z.string()).optional().default([]),
});

// ============================================
// Progress Schemas
// ============================================
const topicProgressSchema = z.object({
  courseId: z.string().min(1).max(100).optional(),
  quickDone: z.boolean().optional(),
  deepDone: z.boolean().optional(),
}).refine(data => data.quickDone !== undefined || data.deepDone !== undefined || Object.keys(data).filter(k => k !== 'courseId').length > 0, {
  message: 'At least one progress field must be provided',
});

const typingScoreSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  topicId: z.string().max(100).optional(),
  wpm: z.number().min(0).max(500, 'WPM must be between 0 and 500'),
  accuracy: z.number().min(0).max(100).optional(),
  timeLimit: z.number().int().min(5).max(600).optional(),
});

const interviewAttemptSchema = z.object({
  questionIndex: z.number().int().min(0),
  correct: z.boolean(),
  courseId: z.string().min(1).optional(),
});

const exerciseAttemptSchema = z.object({
  exerciseIndex: z.number().int().min(0),
  correct: z.boolean(),
  courseId: z.string().min(1).optional(),
});

const dailyLogSchema = z.object({
  minutes: z.number().min(0).max(480).optional(),
  topicId: z.string().max(100).optional(),
});

// ============================================
// Admin Schemas
// ============================================
const adminUpdateUserSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  email: z.string().email().toLowerCase().trim().optional(),
  role: z.enum(['customer', 'admin']).optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field must be provided' });

const adminRoleSchema = z.object({
  role: z.enum(['customer', 'admin']),
});

// ============================================
// Search Schema
// ============================================
const searchSchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters').max(200).trim(),
  context: z.string().max(100).optional(),
});

// ============================================
// Analysis Schemas
// ============================================
const analysisGenerateSchema = z.object({
  role: z.string().min(1, 'Role is required').max(200).trim(),
  industry: z.string().max(200).optional(),
  currentSkills: z.array(z.string().max(100)).max(50).optional().default([]),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional().default('intermediate'),
  goal: z.string().max(500).optional(),
  region: z.string().max(100).optional().default('global'),
});

const analysisReportSchema = z.object({
  analysis: z.any(),
  format: z.enum(['html', 'markdown']).optional().default('html'),
});

// ============================================
// Query Param Schemas
// ============================================
const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().max(200).optional().default(''),
});

// ============================================
// Password Reset Schemas (for future use)
// ============================================
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  preferencesSchema,
  courseIdSchema,
  createCourseSchema,
  updateCourseSchema,
  createTopicSchema,
  topicProgressSchema,
  typingScoreSchema,
  interviewAttemptSchema,
  exerciseAttemptSchema,
  dailyLogSchema,
  adminUpdateUserSchema,
  adminRoleSchema,
  searchSchema,
  analysisGenerateSchema,
  analysisReportSchema,
  paginationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};

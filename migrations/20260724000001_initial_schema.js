// ============================================
// Initial Schema Migration
// ============================================

exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.text('id').primary();
      table.text('name').notNullable();
      table.text('email').notNullable().unique();
      table.text('passwordHash').notNullable();
      table.text('role').defaultTo('customer');
      table.text('preferences').defaultTo('{}');
      table.text('createdAt').notNullable();
      table.integer('emailVerified').defaultTo(0);
      table.integer('failedLoginAttempts').defaultTo(0);
      table.text('lockedUntil');
      table.integer('tokenVersion').defaultTo(0);
    })
    .createTable('verification_tokens', (table) => {
      table.text('token').primary();
      table.text('userId').notNullable();
      table.text('email').notNullable();
      table.text('expiresAt').notNullable();
    })
    .createTable('reset_tokens', (table) => {
      table.text('token').primary();
      table.text('userId').notNullable();
      table.text('email').notNullable();
      table.text('expiresAt').notNullable();
    })
    .createTable('courses', (table) => {
      table.text('id').primary();
      table.text('title').notNullable();
      table.text('description').defaultTo('');
      table.text('icon').defaultTo('fas fa-book');
      table.text('emoji').defaultTo('\ud83d\udcda');
      table.text('category').defaultTo('general');
      table.text('difficulty').defaultTo('beginner');
      table.text('color').defaultTo('#667eea');
      table.text('contentDir').notNullable();
      table.integer('hasTypingPractice').defaultTo(0);
      table.text('typingLayout').defaultTo('qwerty');
      table.text('modes').defaultTo('["fast-track","full-course"]');
      table.text('totalDays').defaultTo('{"fast-track":10,"full-course":20}');
      table.integer('isActive').defaultTo(1);
      table.text('createdAt').notNullable();
    })
    .createTable('enrollments', (table) => {
      table.text('userId').notNullable();
      table.text('courseId').notNullable();
      table.text('activeCourse');
      table.unique(['userId', 'courseId']);
    })
    .createTable('topic_progress', (table) => {
      table.text('userId').notNullable();
      table.text('courseId').notNullable();
      table.text('topicId').notNullable();
      table.integer('quickDone').defaultTo(0);
      table.integer('deepDone').defaultTo(0);
      table.text('extraData').defaultTo('{}');
      table.text('lastAccessed');
      table.unique(['userId', 'courseId', 'topicId']);
    })
    .createTable('daily_log', (table) => {
      table.text('userId').notNullable();
      table.text('date').notNullable();
      table.float('minutesSpent').defaultTo(0);
      table.text('topicsVisited').defaultTo('[]');
      table.unique(['userId', 'date']);
    })
    .createTable('typing_scores', (table) => {
      table.text('userId').notNullable();
      table.text('courseId').notNullable();
      table.text('topicId').defaultTo('overall');
      table.float('bestWpm').defaultTo(0);
      table.float('bestAccuracy').defaultTo(0);
      table.float('lastWpm').defaultTo(0);
      table.float('lastAccuracy').defaultTo(0);
      table.integer('attempts').defaultTo(0);
      table.integer('timeLimit').defaultTo(60);
      table.text('lastAttempt');
      table.unique(['userId', 'courseId', 'topicId']);
    })
    .createTable('interview_progress', (table) => {
      table.text('userId').notNullable();
      table.text('courseId').notNullable();
      table.text('topicId').notNullable();
      table.integer('questionIndex').notNullable();
      table.integer('correct').defaultTo(0);
      table.unique(['userId', 'courseId', 'topicId', 'questionIndex']);
    })
    .createTable('exercise_progress', (table) => {
      table.text('userId').notNullable();
      table.text('courseId').notNullable();
      table.text('topicId').notNullable();
      table.integer('exerciseIndex').notNullable();
      table.integer('correct').defaultTo(0);
      table.unique(['userId', 'courseId', 'topicId', 'exerciseIndex']);
    })
    .createTable('analysis_history', (table) => {
      table.text('id').primary();
      table.text('userId').notNullable();
      table.text('analysis').notNullable();
      table.text('createdAt').notNullable();
    })
    .then(() =>
      Promise.all([
        knex.raw('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)'),
        knex.raw('CREATE INDEX IF NOT EXISTS idx_progress_user_course ON topic_progress("userId", "courseId")'),
        knex.raw('CREATE INDEX IF NOT EXISTS idx_analysis_user ON analysis_history("userId")'),
      ]),
    );
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('analysis_history')
    .dropTableIfExists('exercise_progress')
    .dropTableIfExists('interview_progress')
    .dropTableIfExists('typing_scores')
    .dropTableIfExists('daily_log')
    .dropTableIfExists('topic_progress')
    .dropTableIfExists('enrollments')
    .dropTableIfExists('courses')
    .dropTableIfExists('reset_tokens')
    .dropTableIfExists('verification_tokens')
    .dropTableIfExists('users');
};

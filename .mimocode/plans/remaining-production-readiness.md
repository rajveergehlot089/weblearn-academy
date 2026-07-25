# Remaining Production Readiness Items

## Already Completed (Previous Session)

1. Structured logging (pino) ✅
2. CI/CD pipeline (GitHub Actions) ✅
3. Test coverage expansion (9 suites, 90 tests) ✅
4. Request correlation IDs ✅
5. Zod v4 email validation bug fix ✅

---

## Remaining Items (Prioritized)

### Tier 1 — HIGH (Should do before launch)

#### T6. Security Hardening (CSP `unsafe-inline` + Trusted Proxy)

- **What**: server.js CSP has `'unsafe-inline'` for `scriptSrc` — a known XSS risk
- **Fix**: Extract inline `onclick` handlers in `public/app.js` to `addEventListener`; move inline styles to CSS classes
- **Also**: Add `app.set('trust proxy', 1)` for correct IP detection behind Vercel/load balancer
- **Files**: `server.js`, `public/app.js`, `public/styles/main.css`
- **Effort**: Medium

#### T7. Periodic Data Cleanup Job

- **What**: Expired tokens only cleaned on startup. Need a scheduled cleanup for:
  - Expired verification tokens
  - Expired reset tokens
  - Old daily_log entries (>90 days)
  - Old analysis_history (>100 entries per user)
- **Fix**: Add a `utils/cleanup.js` module + call it on startup + optional cron
- **Files**: `utils/cleanup.js` (new), `server.js`
- **Effort**: Low

#### T8. HTTP Cache Headers on API Responses

- **What**: No cache headers on any API response — every request hits the DB
- **Fix**: Add `Cache-Control` headers to read-heavy endpoints (courses list, topic content, progress summary)
- **Files**: `routes/courses.js`, `routes/progress.js`, `middleware/cacheHeaders.js` (new)
- **Effort**: Low

### Tier 2 — MEDIUM (Post-launch improvements)

#### T9. Rate Limiting Resilience (Redis)

- **What**: In-memory `Map` resets on restart and doesn't work across serverless instances
- **Fix**: Replace with `@upstash/ratelimit` (works with Upstash Redis, serverless-friendly) or `rate-limit-redis`
- **Also**: Fallback to in-memory if Redis is unavailable
- **Files**: `middleware/rateLimit.js`, `package.json`
- **Effort**: Medium (requires Redis instance)

#### T10. Monitoring & Error Tracking (Sentry)

- **What**: No APM or error tracking in production
- **Fix**: Add `@sentry/node` for error tracking + performance monitoring
- **Setup**: DSN in `.env`, sample rate config, release tracking
- **Files**: `server.js` (init Sentry), `package.json`
- **Effort**: Medium (requires Sentry account)

#### T11. Database Migrations Tool

- **What**: Schema changes via `ALTER TABLE IF NOT EXISTS` at startup — no versioning, no rollback
- **Fix**: Add `knex` for migrations with versioned migration files
- **Migration**: Convert current schema to initial migration, remove `initDb()` auto-create
- **Files**: `knexfile.js` (new), `migrations/` (new), `utils/database.js` (refactor)
- **Effort**: Medium

#### T12. API Documentation (OpenAPI)

- **What**: No API docs — new developers have to read route source code
- **Fix**: Add `swagger-jsdoc` + `swagger-ui-express` for auto-generated docs from JSDoc annotations
- **Files**: `middleware/swagger.js` (new), route files (add JSDoc), `server.js`
- **Effort**: Low-Medium

### Tier 3 — LOW (Nice to have)

#### T13. Frontend: Error Pages + SEO Meta Tags

- **What**: No user-facing error pages (404, 500); no SEO meta tags
- **Fix**: Add meta tags to `index.html` (title, description, OG tags); add error page views in SPA router
- **Files**: `public/index.html`, `public/app.js`
- **Effort**: Low

#### T14. File Storage for Serverless

- **What**: Admin topic creation writes to filesystem — won't work on Vercel serverless
- **Fix**: Store topic content as JSONB in PostgreSQL `courses` table, or use S3/R2 for file storage
- **Files**: `routes/courses.js` (admin topic CRUD), `utils/db.js`
- **Effort**: High (schema change + migration)

#### T15. Content-Route Duplication Cleanup

- **What**: `routes/topics.js` reads from file-based content, `routes/courses.js` from DB — can diverge
- **Fix**: Deprecate `routes/topics.js` or make it delegate to `routes/courses.js` logic
- **Files**: `routes/topics.js`, `routes/courses.js`
- **Effort**: Low

---

## Recommended Execution Order

| #   | Task                             | Effort  | Blocks              |
| --- | -------------------------------- | ------- | ------------------- |
| T6  | Security hardening (CSP + proxy) | Medium  | -                   |
| T7  | Periodic data cleanup            | Low     | -                   |
| T8  | HTTP cache headers               | Low     | -                   |
| T13 | Error pages + SEO                | Low     | -                   |
| T15 | Content-route cleanup            | Low     | -                   |
| T12 | API documentation                | Low-Med | -                   |
| T9  | Redis rate limiting              | Medium  | Needs Redis         |
| T10 | Sentry monitoring                | Medium  | Needs Sentry        |
| T11 | DB migrations                    | Medium  | Needs planning      |
| T14 | File storage for serverless      | High    | Needs schema design |

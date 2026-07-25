# WebLearn Academy

Interactive web learning platform for beginners. Supports multiple courses with fast-track and full-course modes, typing practice, interview prep, and progress tracking.

## Tech Stack

- **Backend:** Express 4.18 (Node.js)
- **Frontend:** Vanilla JS SPA
- **Database:** PostgreSQL (Neon for production)
- **ORM/Migration:** Knex.js
- **Auth:** JWT + bcrypt
- **Email:** Resend API
- **Rate Limiting:** Upstash Redis (optional) or in-memory fallback
- **Error Tracking:** Sentry (optional)
- **Deployment:** Vercel (serverless)

## Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your local PostgreSQL credentials

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

The dev server runs at `http://localhost:2007`.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 2007) |
| `NODE_ENV` | Yes (prod) | `production` or `development` |
| `JWT_SECRET` | Yes | JWT signing secret (min 32 chars) |
| `ALLOWED_ORIGINS` | Yes (prod) | Comma-separated CORS origins |
| `PGHOST` | Yes | PostgreSQL host |
| `PGPORT` | No | PostgreSQL port (default: 5432) |
| `PGUSER` | Yes | PostgreSQL user |
| `PGDATABASE` | Yes | PostgreSQL database name |
| `PGPASSWORD` | Yes | PostgreSQL password |
| `PGSSL` | No | Enable SSL (`true`/`false`) |
| `ADMIN_EMAIL` | No | Initial admin email (one-time setup) |
| `ADMIN_PASSWORD` | No | Initial admin password |
| `RESEND_API_KEY` | No | Resend API key for emails |
| `EMAIL_FROM` | No | Sender email address |
| `APP_URL` | Yes (if email) | Public URL for email links |
| `UPSTASH_REDIS_REST_URL` | No | Redis URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | No | Redis auth token |
| `SENTRY_DSN` | No | Sentry error tracking DSN |
| `DATABASE_URL` | No | Full PostgreSQL connection string (alternative to individual PG* vars) |

## Database

```bash
# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:rollback

# Create new migration
npm run db:migrate:make migration_name
```

Migrations run automatically during Vercel builds. The runtime also initializes the schema via `CREATE TABLE IF NOT EXISTS` as a safety net.

## Deployment (Vercel)

The project is configured for Vercel deployment with serverless functions.

### Automatic Deployment

Push to `main` or `master` to trigger the CI/CD pipeline:

1. **CI** runs linting, tests (with PostgreSQL), and build
2. **Deploy** runs `vercel build --prod` (includes migrations + content build) and deploys

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Required Vercel Secrets

Set these in your Vercel project settings:

- `VERCEL_TOKEN` — Vercel API token (for GitHub Actions)
- All environment variables from the table above (set via Vercel dashboard)

### Build Pipeline

The Vercel build runs:
1. `node scripts/migrate.js` — Runs Knex migrations against the production database
2. `node scripts/build-content.js` — Generates content JSON bundles for serverless functions

## Architecture

### Dual Deployment Model

The app can run as:
- **Traditional Express server** (`node server.js`) — uses `utils/database.js` with connection pooling
- **Vercel serverless functions** (`api/*.js`) — uses `serverless-lib/db.js` with Neon HTTP driver

### Database Access Layers

| File | Used By | Driver |
|---|---|---|
| `utils/database.js` | `server.js` (traditional) | `pg` Pool |
| `api/lib/db.js` | Serverless functions (alt) | `pg` Pool |
| `serverless-lib/db.js` | Serverless functions (primary) | `@neondatabase/serverless` |

All three initialize the schema independently as a safety net.

### API Routes

| Route | File | Description |
|---|---|---|
| `/api/auth/*` | `api/auth.js` | Registration, login, email verification, password reset |
| `/api/courses/*` | `api/courses.js` | Course listing and details |
| `/api/topics/*` | `api/topics.js` | Topic content |
| `/api/progress/*` | `api/progress.js` | User progress tracking |
| `/api/admin/*` | `api/admin.js` | Admin operations |
| `/api/search/*` | `api/search.js` | Search functionality |
| `/api/analysis/*` | `api/analysis.js` | Learning analytics |
| `/api/health` | `api/health.js` | Health check |

## Known Issues

- **CSP `unsafe-inline`**: The frontend uses ~93 inline `onclick` handlers that need migrating to `addEventListener` before `unsafe-inline` can be removed from the Content Security Policy.
- **Duplicate DB layers**: Three database access layers exist for the dual deployment model. Schema drift is a risk — all three must be kept in sync manually.
- **WebSocket dependency**: `ws` was listed in dependencies but unused and has been removed.

#!/usr/bin/env node
// ============================================
// Production Migration Script for Vercel Build
// Runs knex migrate:latest using production config
// ============================================
const knex = require('knex');
const path = require('path');

function clean(val, fallback) {
  return String(val || fallback).replace(/^\uFEFF/, '').trim();
}

function buildConnection() {
  const dbUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
  if (dbUrl) {
    try {
      const u = new URL(dbUrl);
      return {
        host: u.hostname,
        port: parseInt(u.port || '5432'),
        user: decodeURIComponent(u.username),
        database: u.pathname.slice(1).split('?')[0],
        password: decodeURIComponent(u.password),
        ssl: { rejectUnauthorized: false },
      };
    } catch {
      console.warn('Warning: Invalid DATABASE_URL, falling back to PG* vars');
    }
  }

  const useSSL =
    process.env.PGSSL === 'true' ||
    process.env.NODE_ENV === 'production' ||
    (process.env.PGHOST || '').includes('neon');

  return {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(clean(process.env.PGPORT, '5432'), 10) || 5432,
    user: process.env.PGUSER || 'postgres',
    database: clean(process.env.PGDATABASE, 'weblearn_academy'),
    password: process.env.PGPASSWORD || undefined,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
  };
}

async function migrate() {
  if (!process.env.DATABASE_URL && !process.env.PGHOST) {
    console.log('Skipping migrations: database environment variables not set');
    process.exit(0);
  }

  console.log('Running migrations...');

  let db;
  try {
    const config = {
      client: 'pg',
      connection: buildConnection(),
      migrations: {
        directory: path.join(__dirname, '..', 'migrations'),
      },
    };
    db = knex(config);
    const [batchNo, migrations] = await db.migrate.latest();
    if (migrations.length === 0) {
      console.log('Database is already up to date');
    } else {
      console.log(`Ran batch ${batchNo} with ${migrations.length} migration(s):`);
      migrations.forEach((m) => console.log(`  - ${m}`));
    }
  } catch (err) {
    console.error('Migration failed:', err.message);
    console.log('Schema will be initialized at runtime');
  } finally {
    if (db) await db.destroy();
  }
}

migrate();

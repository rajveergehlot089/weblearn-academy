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

function shouldUseSSL() {
  if (process.env.VERCEL || process.env.VERCEL_ENV) return true;
  if (process.env.PGSSL === 'true') return true;
  if (process.env.NODE_ENV === 'production') return true;
  if ((process.env.PGHOST || '').includes('neon')) return true;
  return false;
}

// Always use individual PG* vars with explicit SSL config
// (connection string SSL handling is unreliable with knex/pg)
const useSSL = shouldUseSSL();
const connection = {
  host: process.env.PGHOST,
  port: parseInt(clean(process.env.PGPORT, '5432'), 10),
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
};

const config = {
  client: 'pg',
  connection,
  migrations: {
    directory: path.join(__dirname, '..', 'migrations'),
  },
};

async function migrate() {
  if (!process.env.PGHOST || !process.env.PGDATABASE) {
    console.log('Skipping migrations: database environment variables not set');
    process.exit(0);
  }

  console.log(`Running migrations (SSL: ${useSSL ? 'enabled' : 'disabled'}, host: ${process.env.PGHOST})...`);
  const db = knex(config);
  try {
    const [batchNo, migrations] = await db.migrate.latest();
    if (migrations.length === 0) {
      console.log('Database is already up to date');
    } else {
      console.log(`Ran batch ${batchNo} with ${migrations.length} migration(s):`);
      migrations.forEach((m) => console.log(`  - ${m}`));
    }
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

migrate();

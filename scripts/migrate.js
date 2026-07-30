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
    return {
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    };
  }

  const useSSL =
    process.env.PGSSL === 'true' ||
    process.env.NODE_ENV === 'production' ||
    (process.env.PGHOST || '').includes('neon');

  return {
    host: process.env.PGHOST,
    port: parseInt(clean(process.env.PGPORT, '5432'), 10),
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
  };
}

const config = {
  client: 'pg',
  connection: buildConnection(),
  migrations: {
    directory: path.join(__dirname, '..', 'migrations'),
  },
};

async function migrate() {
  if (!process.env.DATABASE_URL && !process.env.PGHOST) {
    console.log('Skipping migrations: database environment variables not set');
    process.exit(0);
  }

  console.log('Running migrations...');
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

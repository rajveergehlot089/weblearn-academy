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

// Support both individual PG* vars and DATABASE_URL (Neon)
let connection;
if (process.env.DATABASE_URL) {
  connection = process.env.DATABASE_URL;
} else {
  connection = {
    host: process.env.PGHOST,
    port: parseInt(clean(process.env.PGPORT, '5432'), 10),
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    ssl:
      process.env.PGSSL === 'true' ||
      process.env.NODE_ENV === 'production' ||
      (process.env.PGHOST || '').includes('neon')
        ? { rejectUnauthorized: false }
        : false,
  };
}

const config = {
  client: 'pg',
  connection,
  migrations: {
    directory: path.join(__dirname, '..', 'migrations'),
  },
};

async function migrate() {
  if (!process.env.DATABASE_URL && (!process.env.PGHOST || !process.env.PGDATABASE)) {
    console.log('Skipping migrations: database environment variables not set');
    process.exit(0);
  }

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

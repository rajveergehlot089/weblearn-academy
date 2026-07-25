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
  // Always use SSL on Vercel (Neon requires it)
  if (process.env.VERCEL || process.env.VERCEL_ENV) return true;
  // Explicit SSL requested
  if (process.env.PGSSL === 'true') return true;
  // Production environment
  if (process.env.NODE_ENV === 'production') return true;
  // Neon host detected
  if ((process.env.PGHOST || '').includes('neon')) return true;
  return false;
}

function buildConnection() {
  if (process.env.DATABASE_URL) {
    let url = process.env.DATABASE_URL;
    // Ensure sslmode=require for Neon connections
    if (shouldUseSSL() && !url.includes('sslmode=')) {
      url += (url.includes('?') ? '&' : '?') + 'sslmode=require';
    }
    return url;
  }

  return {
    host: process.env.PGHOST,
    port: parseInt(clean(process.env.PGPORT, '5432'), 10),
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    ssl: shouldUseSSL() ? { rejectUnauthorized: false } : false,
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
  if (!process.env.DATABASE_URL && (!process.env.PGHOST || !process.env.PGDATABASE)) {
    console.log('Skipping migrations: database environment variables not set');
    process.exit(0);
  }

  console.log(`Running migrations (SSL: ${shouldUseSSL() ? 'enabled' : 'disabled'})...`);
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

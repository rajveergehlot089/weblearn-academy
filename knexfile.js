// ============================================
// Knex Configuration
// ============================================
require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432'),
      user: process.env.PGUSER || 'postgres',
      database: process.env.PGDATABASE || 'weblearn_academy',
      password: process.env.PGPASSWORD || undefined,
    },
    migrations: {
      directory: './migrations',
    },
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432'),
      user: process.env.PGUSER,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
    },
    migrations: {
      directory: './migrations',
    },
  },
};

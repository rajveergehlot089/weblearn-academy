// Minimal DB test - no schema init
const { Pool } = require('pg');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const pool = new Pool({
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432'),
      user: process.env.PGUSER,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 25000,
    });
    const start = Date.now();
    const result = await pool.query('SELECT current_database() as db, now() as time');
    const ms = Date.now() - start;
    await pool.end();
    res.json({ ok: true, ms, result: result.rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message, code: err.code });
  }
};

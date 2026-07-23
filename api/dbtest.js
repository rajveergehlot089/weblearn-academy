// Minimal DB test using Neon serverless driver
const { neon } = require('@neondatabase/serverless');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const connectionString = process.env.DATABASE_URL
      || `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}?sslmode=require`;
    const sql = neon(connectionString);
    const start = Date.now();
    const result = await sql`SELECT current_database() as db, now() as time`;
    const ms = Date.now() - start;
    res.json({ ok: true, ms, result: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message, code: err.code });
  }
};

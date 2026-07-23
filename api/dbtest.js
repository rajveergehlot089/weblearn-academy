// Minimal DB test using Neon serverless driver
const { neon } = require('@neondatabase/serverless');
function c(v, fb) { return String(v || fb).replace(/\uFEFF/g, '').trim(); }
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const connectionString = process.env.DATABASE_URL
      || `postgresql://${c(process.env.PGUSER)}:${c(process.env.PGPASSWORD)}@${c(process.env.PGHOST)}:${c(process.env.PGPORT, '5432')}/${c(process.env.PGDATABASE)}?sslmode=require`;
    const sql = neon(connectionString);
    const start = Date.now();
    const result = await sql`SELECT current_database() as db, now() as time`;
    const ms = Date.now() - start;
    res.json({ ok: true, ms, result: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message, code: err.code });
  }
};

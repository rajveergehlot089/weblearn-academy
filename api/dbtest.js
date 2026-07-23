// Test neon() with $1 parameterized queries directly
const { neon } = require('@neondatabase/serverless');
function c(v, fb) { return String(v || fb).replace(/\uFEFF/g, '').trim(); }
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const connStr = c(process.env.DATABASE_URL)
      || `postgresql://${c(process.env.PGUSER)}:${c(process.env.PGPASSWORD)}@${c(process.env.PGHOST)}:${c(process.env.PGPORT, '5432')}/${c(process.env.PGDATABASE)}?sslmode=require`;
    const sql = neon(connStr);
    const start = Date.now();
    // Test schema exists
    const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
    const ms = Date.now() - start;
    res.json({ ok: true, ms, tables: tables.map(t => t.tablename) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message, code: err.code });
  }
};

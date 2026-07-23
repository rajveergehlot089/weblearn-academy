// Minimal auth test - no imports from serverless-lib
const { neon } = require('@neondatabase/serverless');
function c(v, fb) { return String(v || fb).replace(/\uFEFF/g, '').trim(); }

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const connStr = c(process.env.DATABASE_URL);
    const sql = neon(connStr);
    const result = await sql`SELECT 1 as ok`;
    res.json({ ok: true, result: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message, code: err.code });
  }
};

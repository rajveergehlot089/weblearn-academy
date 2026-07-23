// Quick DB connection test endpoint
const db = require('./lib/db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const start = Date.now();
    await db.initSchema();
    const schemaMs = Date.now() - start;
    const t2 = Date.now();
    const result = await db.one('SELECT current_database(), inet_server_addr()');
    const queryMs = Date.now() - t2;
    res.json({ ok: true, schemaMs, queryMs, db: result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message, code: err.code });
  }
};

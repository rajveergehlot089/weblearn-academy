// Debug: show env vars (no secrets)
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    PGHOST: process.env.PGHOST ? 'SET' : 'MISSING',
    PGPORT: process.env.PGPORT,
    PGUSER: process.env.PGUSER ? 'SET' : 'MISSING',
    PGDATABASE: process.env.PGDATABASE,
    PGSSL: process.env.PGSSL,
    PGPASSWORD: process.env.PGPASSWORD ? 'SET' : 'MISSING',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV,
  });
};

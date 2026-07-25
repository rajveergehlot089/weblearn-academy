// ============================================
// Unit Tests: CSRF Middleware
// ============================================
const { csrfInit, csrfProtect, generateCsrfToken } = require('../../middleware/csrf');

function createReq(overrides = {}) {
  return {
    method: 'GET',
    path: '/api/test',
    cookies: {},
    headers: {},
    ...overrides,
  };
}

function createRes() {
  const res = {
    statusCode: null,
    body: null,
    headers: {},
    _cookies: [],
    setHeader(name, value) { this.headers[name] = value; },
    set(name, value) { this.headers[name] = value; },
    cookie(name, value, opts) { this._cookies.push({ name, value, opts }); },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
  };
  return res;
}

describe('CSRF Middleware', () => {
  describe('csrfInit', () => {
    it('sets CSRF cookie on GET requests', () => {
      const req = createReq({ method: 'GET' });
      const res = createRes();
      let nextCalled = false;

      csrfInit(req, res, () => { nextCalled = true; });

      expect(nextCalled).toBe(true);
      expect(res._cookies.length).toBe(1);
      expect(res._cookies[0].name).toBe('csrf_token');
      expect(res.headers['X-CSRF-Token']).toBeDefined();
    });

    it('does not set cookie on POST requests', () => {
      const req = createReq({ method: 'POST' });
      const res = createRes();
      let nextCalled = false;

      csrfInit(req, res, () => { nextCalled = true; });

      expect(nextCalled).toBe(true);
      expect(res._cookies.length).toBe(0);
    });

    it('reuses existing cookie token', () => {
      const existingToken = generateCsrfToken();
      const req = createReq({ method: 'GET', cookies: { csrf_token: existingToken } });
      const res = createRes();
      let nextCalled = false;

      csrfInit(req, res, () => { nextCalled = true; });

      expect(nextCalled).toBe(true);
      expect(res._cookies.length).toBe(0);
      expect(res.headers['X-CSRF-Token']).toBe(existingToken);
    });
  });

  describe('csrfProtect', () => {
    it('skips GET requests', () => {
      const req = createReq({ method: 'GET' });
      const res = createRes();
      let nextCalled = false;

      csrfProtect(req, res, () => { nextCalled = true; });

      expect(nextCalled).toBe(true);
    });

    it('skips OPTIONS requests', () => {
      const req = createReq({ method: 'OPTIONS' });
      const res = createRes();
      let nextCalled = false;

      csrfProtect(req, res, () => { nextCalled = true; });

      expect(nextCalled).toBe(true);
    });

    it('skips login/register endpoints', () => {
      const req = createReq({ method: 'POST', path: '/api/auth/login' });
      const res = createRes();
      let nextCalled = false;

      csrfProtect(req, res, () => { nextCalled = true; });

      expect(nextCalled).toBe(true);
    });

    it('returns 403 when CSRF token is missing', () => {
      const req = createReq({
        method: 'POST',
        cookies: {},
        headers: {},
      });
      const res = createRes();

      csrfProtect(req, res, () => {});

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain('missing');
    });

    it('returns 403 on CSRF token mismatch', () => {
      const req = createReq({
        method: 'POST',
        cookies: { csrf_token: 'token-a' },
        headers: { 'x-csrf-token': 'token-b' },
      });
      const res = createRes();

      csrfProtect(req, res, () => {});

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain('mismatch');
    });

    it('passes with matching CSRF tokens', () => {
      const token = generateCsrfToken();
      const req = createReq({
        method: 'POST',
        cookies: { csrf_token: token },
        headers: { 'x-csrf-token': token },
      });
      const res = createRes();
      let nextCalled = false;

      csrfProtect(req, res, () => { nextCalled = true; });

      expect(nextCalled).toBe(true);
    });
  });
});

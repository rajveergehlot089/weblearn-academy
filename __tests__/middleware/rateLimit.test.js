// ============================================
// Unit Tests: Rate Limit Middleware
// ============================================
const rateLimit = require('../../middleware/rateLimit');

function createReq(overrides = {}) {
  return {
    path: '/api/test',
    ip: '127.0.0.1',
    headers: {},
    ...overrides,
  };
}

function createRes() {
  const res = {
    statusCode: null,
    body: null,
    headers: {},
    set(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
}

describe('Rate Limit Middleware', () => {
  it('allows requests within limit', () => {
    const limiter = rateLimit(5, 60000);
    const req = createReq();
    const res = createRes();
    let nextCalled = false;

    limiter(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    expect(res.headers['X-RateLimit-Limit']).toBe('5');
    expect(res.headers['X-RateLimit-Remaining']).toBe('4');
  });

  it('blocks requests exceeding limit', () => {
    const limiter = rateLimit(2, 60000);
    const req1 = createReq();
    const res1 = createRes();
    limiter(req1, res1, () => {});

    const req2 = createReq();
    const res2 = createRes();
    limiter(req2, res2, () => {});

    // Third request should be blocked
    const req3 = createReq();
    const res3 = createRes();
    let nextCalled = false;
    limiter(req3, res3, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(false);
    expect(res3.statusCode).toBe(429);
    expect(res3.body.error).toContain('Too many');
    expect(res3.headers['Retry-After']).toBeDefined();
  });

  it('uses different keys for different paths', () => {
    const limiter = rateLimit(1, 60000);
    const req1 = createReq({ path: '/api/a' });
    const res1 = createRes();
    limiter(req1, res1, () => {});

    const req2 = createReq({ path: '/api/b' });
    const res2 = createRes();
    let nextCalled = false;
    limiter(req2, res2, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });

  it('handles x-forwarded-for header', () => {
    const limiter = rateLimit(1, 60000);
    const req1 = createReq({ headers: { 'x-forwarded-for': '10.0.0.1, 10.0.0.2' } });
    const res1 = createRes();
    limiter(req1, res1, () => {});

    const req2 = createReq({ ip: 'other-ip' });
    const res2 = createRes();
    let nextCalled = false;
    limiter(req2, res2, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });
});

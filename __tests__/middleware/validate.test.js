// ============================================
// Unit Tests: Validation Middleware (Zod)
// ============================================
const { validate, registerSchema, loginSchema, createCourseSchema } = require('../../middleware/validate');

function createReq(body = {}) {
  return { body };
}

function createRes() {
  const res = {
    statusCode: null,
    body: null,
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

describe('Validate Middleware', () => {
  it('passes valid data through', () => {
    const middleware = validate(registerSchema);
    const req = createReq({
      name: 'Test User',
      email: 'test@example.com',
      password: 'StrongPass1!',
    });
    const res = createRes();
    let nextCalled = false;

    middleware(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    expect(req.body.name).toBe('Test User');
    expect(req.body.email).toBe('test@example.com');
  });

  it('rejects invalid data', () => {
    const middleware = validate(registerSchema);
    const req = createReq({
      name: 'T',
      email: 'not-an-email',
      password: 'weak',
    });
    const res = createRes();

    middleware(req, res, () => {});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toBeInstanceOf(Array);
  });

  it('sanitizes data (trims, lowercases)', () => {
    const middleware = validate(loginSchema);
    const req = createReq({
      email: '  TEST@Example.COM  ',
      password: 'password123',
    });
    const res = createRes();
    let nextCalled = false;

    middleware(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    expect(req.body.email).toBe('test@example.com');
  });

  describe('registerSchema', () => {
    it('requires name >= 2 chars', () => {
      const result = registerSchema.safeParse({ name: 'A', email: 'a@b.com', password: 'Strong1!' });
      expect(result.success).toBe(false);
    });

    it('requires valid password complexity', () => {
      const result = registerSchema.safeParse({ name: 'Test', email: 'a@b.com', password: 'nouppercase1!' });
      expect(result.success).toBe(false);
    });

    it('accepts strong password', () => {
      const result = registerSchema.safeParse({ name: 'Test', email: 'a@b.com', password: 'Strong1!' });
      expect(result.success).toBe(true);
    });
  });

  describe('createCourseSchema', () => {
    it('requires lowercase alphanumeric id with hyphens', () => {
      const result = createCourseSchema.safeParse({ id: 'My Course', title: 'Test' });
      expect(result.success).toBe(false);
    });

    it('accepts valid course id', () => {
      const result = createCourseSchema.safeParse({ id: 'my-course', title: 'Test Course' });
      expect(result.success).toBe(true);
    });
  });
});

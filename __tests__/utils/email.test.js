// ============================================
// Unit Tests: Email Service
// ============================================

// Mock Resend SDK
const mockSend = jest.fn();
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

beforeEach(() => {
  mockSend.mockReset();
  process.env.RESEND_API_KEY = 're_test_key';
  process.env.EMAIL_FROM = 'Test <test@example.com>';
  process.env.APP_URL = 'https://example.com';
});

afterEach(() => {
  delete process.env.RESEND_API_KEY;
});

describe('sendEmail', () => {
  it('sends email via Resend', async () => {
    const { sendEmail } = require('../../utils/email');
    mockSend.mockResolvedValue({ data: { id: 'email-123' } });

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Hello</p>',
    });

    expect(result).toEqual({ id: 'email-123', skipped: false });
    expect(mockSend).toHaveBeenCalledWith({
      from: 'Test <test@example.com>',
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Hello</p>',
    });
  });

  it('skips sending when RESEND_API_KEY is not set', async () => {
    delete process.env.RESEND_API_KEY;
    // Need to re-require to pick up the env change
    jest.resetModules();
    const { sendEmail } = require('../../utils/email');

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Hello</p>',
    });

    expect(result).toEqual({ id: 'skipped', skipped: true });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('throws on Resend API error', async () => {
    const { sendEmail } = require('../../utils/email');
    mockSend.mockResolvedValue({ error: { message: 'Invalid API key' } });

    await expect(sendEmail({
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Hello</p>',
    })).rejects.toThrow('Invalid API key');
  });
});

describe('sendVerificationEmail', () => {
  it('sends verification email with correct link', async () => {
    const { sendVerificationEmail } = require('../../utils/email');
    mockSend.mockResolvedValue({ data: { id: 'email-456' } });

    const result = await sendVerificationEmail('user@example.com', 'verify-token-123');

    expect(result.id).toBe('email-456');
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@example.com',
        subject: expect.stringContaining('Verify'),
        html: expect.stringContaining('https://example.com/verify-email?token=verify-token-123'),
      })
    );
  });
});

describe('sendPasswordResetEmail', () => {
  it('sends reset email with correct link', async () => {
    const { sendPasswordResetEmail } = require('../../utils/email');
    mockSend.mockResolvedValue({ data: { id: 'email-789' } });

    const result = await sendPasswordResetEmail('user@example.com', 'reset-token-456');

    expect(result.id).toBe('email-789');
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@example.com',
        subject: expect.stringContaining('Reset'),
        html: expect.stringContaining('https://example.com/reset-password?token=reset-token-456'),
      })
    );
  });

  it('includes expiration warning in email', async () => {
    const { sendPasswordResetEmail } = require('../../utils/email');
    mockSend.mockResolvedValue({ data: { id: 'email-789' } });

    await sendPasswordResetEmail('user@example.com', 'token');

    const html = mockSend.mock.calls[0][0].html;
    expect(html).toContain('1 hour');
  });
});

// ============================================
// Unit Tests: Database Access Layer
// ============================================
// Mock the database pool before requiring db module

const mockQuery = jest.fn();
const mockPool = { query: mockQuery };

jest.mock('../../utils/database', () => ({
  getPool: () => mockPool,
}));

const db = require('../../utils/db');

beforeEach(() => {
  mockQuery.mockReset();
});

describe('User Operations', () => {
  describe('getUserByEmail', () => {
    it('returns user when found', async () => {
      const fakeUser = { id: '1', name: 'Test', email: 'test@example.com' };
      mockQuery.mockResolvedValue({ rows: [fakeUser] });

      const result = await db.getUserByEmail('test@example.com');
      expect(result).toEqual(fakeUser);
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
    });

    it('returns null when not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });
      const result = await db.getUserByEmail('missing@example.com');
      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('returns user by id', async () => {
      const fakeUser = { id: 'abc-123', name: 'Test User' };
      mockQuery.mockResolvedValue({ rows: [fakeUser] });

      const result = await db.getUserById('abc-123');
      expect(result).toEqual(fakeUser);
    });
  });

  describe('createUser', () => {
    it('inserts a new user', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await db.createUser('id-1', 'John', 'john@example.com', 'hashedpass', 'customer');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        ['id-1', 'John', 'john@example.com', 'hashedpass', 'customer', '{}', expect.any(String)]
      );
    });
  });

  describe('updateUser', () => {
    it('updates name field', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await db.updateUser('user-1', { name: 'New Name' });
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('name = $1'),
        ['New Name', 'user-1']
      );
    });

    it('updates passwordHash field', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await db.updateUser('user-1', { passwordHash: 'newhash' });
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('"passwordHash" = $1'),
        ['newhash', 'user-1']
      );
    });

    it('does nothing when no fields provided', async () => {
      await db.updateUser('user-1', {});
      expect(mockQuery).not.toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('returns all users', async () => {
      const users = [{ id: '1', name: 'A' }, { id: '2', name: 'B' }];
      mockQuery.mockResolvedValue({ rows: users });

      const result = await db.getAllUsers();
      expect(result).toEqual(users);
    });
  });
});

describe('Enrollment Operations', () => {
  describe('enrollUser', () => {
    it('creates enrollment when not already enrolled', async () => {
      // First call: check existing
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // Second call: check active course
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // Third call: insert enrollment
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // Fourth call: set as active
      mockQuery.mockResolvedValueOnce({ rows: [] });

      await db.enrollUser('user-1', 'course-1');
      expect(mockQuery).toHaveBeenCalledTimes(4);
    });

    it('skips insert if already enrolled', async () => {
      // First call: check existing - found
      mockQuery.mockResolvedValueOnce({ rows: [{ 1: 1 }] });
      // Second call: check active course
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // Third call: set as active
      mockQuery.mockResolvedValueOnce({ rows: [] });

      await db.enrollUser('user-1', 'course-1');
      expect(mockQuery).toHaveBeenCalledTimes(3);
    });
  });

  describe('setActiveCourse', () => {
    it('clears current active then sets new one', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await db.setActiveCourse('user-1', 'course-2');
      expect(mockQuery).toHaveBeenCalledTimes(2);
      // First: clear all active
      expect(mockQuery).toHaveBeenNthCalledWith(1,
        expect.stringContaining('SET "activeCourse" = NULL'),
        ['user-1']
      );
      // Second: set new active
      expect(mockQuery).toHaveBeenNthCalledWith(2,
        expect.stringContaining('SET "activeCourse" = $1'),
        ['course-2', 'user-1', 'course-2']
      );
    });
  });
});

describe('Topic Progress Operations', () => {
  describe('upsertTopicProgress', () => {
    it('inserts new progress record', async () => {
      // getTopicProgress returns null (no existing)
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // INSERT
      mockQuery.mockResolvedValueOnce({ rows: [] });

      await db.upsertTopicProgress('user-1', 'course-1', 'topic-1', { quickDone: true, deepDone: false });
      expect(mockQuery).toHaveBeenCalledTimes(2);
      expect(mockQuery).toHaveBeenNthCalledWith(2,
        expect.stringContaining('INSERT INTO topic_progress'),
        expect.arrayContaining(['user-1', 'course-1', 'topic-1', 1, 0])
      );
    });

    it('updates existing progress record', async () => {
      // getTopicProgress returns existing
      mockQuery.mockResolvedValueOnce({
        rows: [{ quickDone: 0, deepDone: 0, extraData: '{}' }],
      });
      // UPDATE
      mockQuery.mockResolvedValueOnce({ rows: [] });

      await db.upsertTopicProgress('user-1', 'course-1', 'topic-1', { deepDone: true });
      expect(mockQuery).toHaveBeenCalledTimes(2);
      expect(mockQuery).toHaveBeenNthCalledWith(2,
        expect.stringContaining('UPDATE topic_progress'),
        expect.arrayContaining([0, 1])
      );
    });
  });
});

describe('Token Management', () => {
  describe('saveVerificationToken', () => {
    it('inserts verification token', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await db.saveVerificationToken('tok-123', 'user-1', 'test@example.com', '2026-12-31');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO verification_tokens'),
        ['tok-123', 'user-1', 'test@example.com', '2026-12-31']
      );
    });
  });

  describe('getVerificationToken', () => {
    it('returns token record when found', async () => {
      const record = { token: 'tok-123', userId: 'user-1' };
      mockQuery.mockResolvedValue({ rows: [record] });

      const result = await db.getVerificationToken('tok-123');
      expect(result).toEqual(record);
    });

    it('returns null when not found', async () => {
      mockQuery.mockResolvedValue({ rows: [] });
      const result = await db.getVerificationToken('invalid');
      expect(result).toBeNull();
    });
  });
});

describe('Security Operations', () => {
  describe('incrementFailedLogin', () => {
    it('increments failed login count', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await db.incrementFailedLogin('user-1');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('"failedLoginAttempts" = "failedLoginAttempts" + 1'),
        ['user-1']
      );
    });
  });

  describe('lockAccount', () => {
    it('sets lockedUntil timestamp', async () => {
      mockQuery.mockResolvedValue({ rows: [] });
      const until = '2026-07-23T16:00:00.000Z';

      await db.lockAccount('user-1', until);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('"lockedUntil" = $1'),
        [until, 'user-1']
      );
    });
  });

  describe('incrementTokenVersion', () => {
    it('increments token version for JWT revocation', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await db.incrementTokenVersion('user-1');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('"tokenVersion" = "tokenVersion" + 1'),
        ['user-1']
      );
    });
  });
});

describe('Course Operations', () => {
  describe('getAllCourses', () => {
    it('returns active courses', async () => {
      const courses = [{ id: 'web-dev', title: 'Web Development' }];
      mockQuery.mockResolvedValue({ rows: courses });

      const result = await db.getAllCourses();
      expect(result).toEqual(courses);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE "isActive" = 1'),
        []
      );
    });
  });

  describe('createCourse', () => {
    it('inserts a new course', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await db.createCourse({
        id: 'new-course',
        title: 'New Course',
        description: 'A test course',
        icon: 'fas fa-book',
        emoji: '📚',
        category: 'technology',
        difficulty: 'beginner',
        color: '#667eea',
        contentDir: 'new-course',
        hasTypingPractice: false,
        modes: ['fast-track', 'full-course'],
        totalDays: { 'fast-track': 10, 'full-course': 20 },
        isActive: true,
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO courses'),
        expect.arrayContaining(['new-course', 'New Course', 'A test course'])
      );
    });
  });

  describe('deleteCourse', () => {
    it('soft-deletes by setting isActive = 0', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await db.deleteCourse('course-1');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('"isActive" = 0'),
        ['course-1']
      );
    });
  });
});

describe('Admin Stats', () => {
  describe('getAdminStats', () => {
    it('returns aggregated stats', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ count: 10 }] })   // totalUsers
        .mockResolvedValueOnce({ rows: [{ count: 2 }] })    // adminCount
        .mockResolvedValueOnce({ rows: [{ count: 50 }] });  // totalCompletions

      const stats = await db.getAdminStats();
      expect(stats).toEqual({
        totalUsers: 10,
        adminCount: 2,
        totalTopicCompletions: 50,
      });
    });
  });
});

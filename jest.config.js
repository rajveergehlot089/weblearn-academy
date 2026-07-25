module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['utils/**/*.js', 'middleware/**/*.js', 'routes/**/*.js', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 35,
      statements: 35,
    },
  },
};

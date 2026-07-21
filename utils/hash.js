// ============================================
// Password Hashing Utilities
// ============================================
// This file handles password security using bcrypt.
// NEVER store plain text passwords - always hash them first!
// bcrypt adds a random "salt" to make each hash unique.

const bcrypt = require('bcrypt'); // Library for secure password hashing

// Salt rounds = how many times the hashing algorithm runs
// Higher = more secure but slower. 10 is a good balance.
const SALT_ROUNDS = 10;

// Hash a password before storing it
// Example: hashPassword("mypassword") → "$2b$10$XbT5/MlmHOvx..."
async function hashPassword(password) {
  // bcrypt.hash() takes the password and salt rounds
  // Returns a one-way hash (can't be reversed to get the original password)
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Compare a password with a stored hash
// Example: comparePassword("mypassword", "$2b$10$XbT5/Mlm...") → true
async function comparePassword(password, hash) {
  // bcrypt.compare() hashes the password with the same salt and compares
  // Returns true if they match, false if they don't
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword };

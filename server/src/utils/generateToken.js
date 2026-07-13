import jwt from 'jsonwebtoken';

/**
 * Generate a signed JSON Web Token
 * @param {string} id - The user ID
 * @param {string} role - The user role
 * @returns {string} The signed JWT
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

export default generateToken;

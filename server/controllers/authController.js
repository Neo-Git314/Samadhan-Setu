import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_EXPIRES_IN = '7d';

/**
 * Generate a signed JWT token with user id and role (expires in 7 days).
 */
const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET || 'samadhan_setu_jwt_fallback_secret_key';
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    jwtSecret,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * POST /api/auth/register
 * Hashes password with bcrypt (10 rounds), saves user, returns { token, user: { _id, name, email, role } }
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, organization } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate role if provided
    const validRoles = ['citizen', 'university', 'industry', 'admin'];
    const userRole = role ? role.toLowerCase().trim() : 'citizen';
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Role must be one of: ${validRoles.join(', ')}`
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    // Hash password with bcrypt (10 rounds)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create and save user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: userRole,
      phone: phone ? phone.trim() : '',
      organization: organization ? organization.trim() : ''
    });

    const token = generateToken(user);

    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      organization: user.organization,
      createdAt: user.createdAt
    };

    return res.status(201).json({
      token,
      user: userPayload
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Compares password, returns { token, user: { _id, name, email, role } }
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      organization: user.organization,
      createdAt: user.createdAt
    };

    return res.status(200).json({
      token,
      user: userPayload
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Protected by auth.js, returns current user object without password hash
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.passwordHash;

    return res.status(200).json({
      ...userObj,
      user: userObj
    });
  } catch (error) {
    next(error);
  }
};

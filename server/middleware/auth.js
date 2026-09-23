import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate requests using a Bearer JWT token.
 * Validates token against process.env.JWT_SECRET and attaches { id, role } to req.user.
 */
export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Malformed authorization header.'
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'samadhan_setu_jwt_fallback_secret_key';
    const decoded = jwt.verify(token, jwtSecret);

    req.user = {
      id: decoded.id || decoded._id || decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

export default auth;


import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../../config.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth middleware - Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log('Auth middleware - Decoded token:', decoded);
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('Auth middleware - User not found');
      return res.status(401).json({ message: 'Invalid token.' });
    }

    if (user.isBlocked) {
      console.log('Auth middleware - User is blocked');
      return res.status(403).json({ message: 'Account is blocked. Contact admin.' });
    }

    console.log('Auth middleware - User authenticated:', user._id);
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    
    next();
  };
};

export { authMiddleware, roleMiddleware };
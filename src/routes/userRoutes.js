import express from 'express';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Delete user (admin only)
router.delete('/:userId', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await User.findByIdAndDelete(userId);
    
    return res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

export default router;

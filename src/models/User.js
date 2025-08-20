// src/models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  }, 
  isProfileComplete: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Cascade delete projects, profiles, and comments when a user is deleted
userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    // Dynamically reference the models to avoid circular dependencies
    const Project = mongoose.models.Project;
    const Profile = mongoose.models.Profile;
    const Comment = mongoose.models.CommentModel;

    // Check if models exist before attempting to delete
    if (Project) {
        await Project.deleteMany({ userId: this._id });
    }
    if (Profile) {
        await Profile.deleteMany({ userId: this._id });
    }
    if (Comment) {
        await Comment.deleteMany({ userId: this._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Fix for OverwriteModelError: Check if the model is already compiled before creating it.
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

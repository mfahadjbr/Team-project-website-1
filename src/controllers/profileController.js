import Profile from '../models/Profile.js';
import User from '../models/User.js';
import {
  ServerError,
  ValidationErrorResponse,
  ClientError,
  AuthError,
  ResourceNotFound,
  SuccessResponse,
  CreatedResponse
} from '../utils/helperFunctions.js';

// @desc    Create profile
// @route   POST /profile/add
// @access  Private
const createProfile = async (req, res) => {
  try {
    const {
      profession,
      skills,
      description,
      yearsOfExperience,
      linkedin,
      github,
      fiverr,
      whatsapp
    } = req.body;

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ userId: req.user._id });
    if (existingProfile) {
      return ClientError(res, 'Profile already exists for this user');
    }

    // Validate required fields
    if (!linkedin) {
      return ClientError(res, 'LinkedIn profile is required');
    }

    // Create profile
    const profile = await Profile.create({
      userId: req.user._id,
      profession,
      skills: skills.split(',').map(skill => skill.trim()),
      description,
      yearsOfExperience,
      linkedin,
      github,
      fiverr,
      whatsapp,
      certificates: req.files?.certificates?.map(file => file.path) || [],
      profileImage: req.files?.profileImage?.[0]?.path || null
    });
await User.findByIdAndUpdate(req.user._id, { isProfileComplete: true }, { new: true });
    return CreatedResponse(res, 'Profile created successfully', profile);
  } catch (error) {
    // Handle specific database errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return ValidationErrorResponse(res, validationErrors);
    }

    return ServerError(res, 'Server error during profile creation');
  }
};

// @desc    Get own profile
// @route   GET /profile/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id })
      .populate('userId', 'fullName email');

    if (!profile) {
      return ResourceNotFound(res, 'Profile');
    }

    return SuccessResponse(res, 'Profile retrieved successfully', profile);
  } catch (error) {
    return ServerError(res, 'Server error while fetching profile');
  }
};

// @desc    Update profile
// @route   PUT /profile/update/:id
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      profession,
      skills,
      description,
      yearsOfExperience,
      linkedin,
      github,
      fiverr,
      whatsapp
    } = req.body;

    // Find profile
    const profile = await Profile.findById(id);
    if (!profile) {
      return ResourceNotFound(res, 'Profile');
    }

    // Check ownership
    if (profile.userId.toString() !== req.user._id.toString()) {
      return AuthError(res, 'Not authorized to update this profile');
    }

    // Validate required fields
    if (!linkedin) {
      return ClientError(res, 'LinkedIn profile is required');
    }

    // Update profile
    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      {
        profession,
        skills: skills ? skills.split(',').map(skill => skill.trim()) : profile.skills,
        description,
        yearsOfExperience,
        linkedin,
        github,
        fiverr,
        whatsapp,
        ...(req.files?.certificates && { certificates: req.files.certificates.map(file => file.path) }),
        ...(req.file?.path && { profileImage: req.file.path })
      },
      { new: true, runValidators: true }
    );

    return SuccessResponse(res, 'Profile updated successfully', { profile: updatedProfile });
  } catch (error) {
    return ServerError(res, 'Server error during profile update');
  }
};

// @desc    Get profile by user ID
// @route   GET /profile/:userId
// @access  Public
const getProfileByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ userId })
      .populate('userId', 'fullName email');

    if (!profile) {
      return ResourceNotFound(res, 'Profile');
    }

    return SuccessResponse(res, 'Profile retrieved successfully', profile);
  } catch (error) {
    return ServerError(res, 'Server error while fetching profile');
  }
};

// @desc    Get all profiles (admin only)
// @route   GET /profiles
// @access  Private/Admin
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate('userId', 'fullName email isBlocked')
      .sort({ createdAt: -1 });

    return SuccessResponse(res, 'Profiles retrieved successfully', { profiles, count: profiles.length });
  } catch (error) {
    return ServerError(res, 'Server error while fetching profiles');
  }
};

// @desc    Delete profile (admin only)
// @route   DELETE /profile/delete/:id
// @access  Private/Admin
const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findById(id);
    if (!profile) {
      return ResourceNotFound(res, 'Profile');
    }

    await Profile.findByIdAndDelete(id);

    return SuccessResponse(res, 'Profile deleted successfully');
  } catch (error) {
    return ServerError(res, 'Server error during profile deletion');
  }
};

export {
  createProfile,
  getMyProfile,
  updateProfile,
  getProfileByUser,
  getAllProfiles,
  deleteProfile
};
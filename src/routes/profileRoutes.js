





























import express from 'express';
import {
  createProfile,
  getMyProfile,
  updateProfile,
  getProfileByUser,
  getAllProfiles,
  deleteProfile
} from '../controllers/profileController.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';
import { profileUploadWithErrorHandling, profileImageUpload, certificateUpload } from '../middlewares/upload.js';
import Profile from '../models/Profile.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/profile/add:
 *   post:
 *     summary: Create a new user profile
 *     description: Creates a new user profile with details such as profession, skills, description, and optional file uploads for profile image and certificates. Requires authentication.
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *            
 *               - profession
 *               - description
 *               - yearsOfExperience
 *               - linkedin
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user (ObjectId referencing the User model)
 *                 example: "507f1f77bcf86cd799439011"
 *               profession:
 *                 type: string
 *                 enum:
 *                   - Full Stack Developer
 *                   - Frontend Developer
 *                   - Backend Developer
 *                   - Software Engineer
 *                   - Mobile App Developer (iOS/Android)
 *                   - DevOps Engineer
 *                   - Cloud Engineer
 *                   - Site Reliability Engineer (SRE)
 *                   - Automation Engineer
 *                   - UI/UX Designer
 *                   - Product Designer
 *                   - UX Researcher
 *                   - WordPress Designer
 *                   - WordPress Administrator
 *                   - Digital Marketing Specialist
 *                   - Content Strategist
 *                   - SEO Specialist
 *                   - SEM Specialist
 *                   - Social Media Manager
 *                   - Email Marketing Specialist
 *                   - Marketing Analyst
 *                   - Data Scientist
 *                   - Data Analyst
 *                   - Machine Learning Engineer
 *                   - AI Engineer
 *                   - Cybersecurity Analyst
 *                   - Network Engineer
 *                   - Database Administrator
 *                   - QA Engineer
 *                   - Manual Tester
 *                   - Automation Tester
 *                   - Technical Writer
 *                   - IT Support Specialist
 *                   - Business Analyst
 *                   - Technical Project Manager
 *                   - Scrum Master
 *                   - Solutions Architect
 *                   - Blockchain Developer
 *                   - Game Developer
 *                   - AR/VR Developer
 *                   - Robotics Engineer
 *                   - Systems Analyst
 *                 description: The user's profession
 *                 example: Software Engineer
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of skills the user possesses
 *                 example: ["JavaScript", "React", "Node.js"]
 *               description:
 *                 type: string
 *                 description: A brief description of the user's professional background
 *                 example: "Experienced software engineer with a focus on full-stack development."
 *               yearsOfExperience:
 *                 type: number
 *                 minimum: 0
 *                 description: Years of professional experience
 *                 example: 5
 *               linkedin:
 *                 type: string
 *                 description: URL to the user's LinkedIn profile
 *                 example: "https://linkedin.com.in/johndoe"
 *               github:
 *                 type: string
 *                 description: URL to the user's GitHub profile (optional)
 *                 example: "https://github.com/johndoe"
 *               fiverr:
 *                 type: string
 *                 description: URL to the user's Fiverr profile (optional)
 *                 example: "https://fiverr.com/johndoe"
 *               whatsapp:
 *                 type: string
 *                 description: WhatsApp contact number (optional)
 *                 example: "+1234567890"
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file (uploaded to Cloudinary)
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: List of certificate files (uploaded to Cloudinary)
 *             additionalProperties: false
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile created successfully
 *                 profile:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439012"
 *                     userId:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     profession:
 *                       type: string
 *                       example: Software Engineer
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["JavaScript", "React", "Node.js"]
 *                     description:
 *                       type: string
 *                       example: "Experienced software engineer with a focus on full-stack development."
 *                     yearsOfExperience:
 *                       type: number
 *                       example: 5
 *                     linkedin:
 *                       type: string
 *                       example: "https://linkedin.com/in/johndoe"
 *                     github:
 *                       type: string
 *                       example: "https://github.com/johndoe"
 *                     fiverr:
 *                       type: string
 *                       example: "https://fiverr.com/johndoe"
 *                     whatsapp:
 *                       type: string
 *                       example: "+1234567890"
 *                     profileImage:
 *                       type: string
 *                       example: "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/profile.jpg"
 *                     certificates:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://res.cloudinary.com/your-cloud/image/upload/v1234567890/cert1.jpg"]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-19T03:23:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-19T03:23:00.000Z"
 *       400:
 *         description: Bad request (e.g., missing required fields or invalid data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profession is required
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/add', authMiddleware, profileUploadWithErrorHandling, async (req, res, next) => {
  try {
    // Debugging middleware output
    if (!createProfile) {
      throw new Error('createProfile controller is not defined');
    }
    await createProfile(req, res, next);
  } catch (error) {
    console.error('Error in /add route:', error);
    res.status(500).json({ message: 'Server error in profile creation', error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/profile/me:
 *   get:
 *     summary: Get current user's profile
 *     description: Retrieves the profile of the authenticated user.
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile not found
 */
router.get('/me', authMiddleware, getMyProfile);

/**
 * @swagger
 * /api/v1/profile/update/{id}:
 *   put:
 *     summary: Update a profile with image uploads
 *     description: Update an existing user profile with new information and optional media uploads
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID to update
 *         example: "68a1bf1a589c37d0d268ef00"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profession:
 *                 type: string
 *                 enum:
 *                   - Full Stack Developer
 *                   - Frontend Developer
 *                   - Backend Developer
 *                   - Software Engineer
 *                   - Mobile App Developer (iOS/Android)
 *                   - DevOps Engineer
 *                   - Cloud Engineer
 *                   - Site Reliability Engineer (SRE)
 *                   - Automation Engineer
 *                   - UI/UX Designer
 *                   - Product Designer
 *                   - UX Researcher
 *                   - WordPress Designer
 *                   - WordPress Administrator
 *                   - Digital Marketing Specialist
 *                   - Content Strategist
 *                   - SEO Specialist
 *                   - SEM Specialist
 *                   - Social Media Manager
 *                   - Email Marketing Specialist
 *                   - Marketing Analyst
 *                   - Data Scientist
 *                   - Data Analyst
 *                   - Machine Learning Engineer
 *                   - AI Engineer
 *                   - Cybersecurity Analyst
 *                   - Network Engineer
 *                   - Database Administrator
 *                   - QA Engineer
 *                   - Manual Tester
 *                   - Automation Tester
 *                   - Technical Writer
 *                   - IT Support Specialist
 *                   - Business Analyst
 *                   - Technical Project Manager
 *                   - Scrum Master
 *                   - Solutions Architect
 *                   - Blockchain Developer
 *                   - Game Developer
 *                   - AR/VR Developer
 *                   - Robotics Engineer
 *                   - Systems Analyst
 *                 description: User's profession (optional for updates)
 *                 example: "Full Stack Developer"
 *               skills:
 *                 type: string
 *                 description: Comma-separated skills (optional for updates)
 *                 example: "JavaScript, React, Node.js, MongoDB, TypeScript"
 *               description:
 *                 type: string
 *                 description: User's description/bio (optional for updates)
 *                 example: "Experienced developer with expertise in modern web technologies"
 *               yearsOfExperience:
 *                 type: number
 *                 minimum: 0
 *                 description: Years of work experience (optional for updates)
 *                 example: 5
 *               linkedin:
 *                 type: string
 *                 description: LinkedIn profile URL (optional for updates)
 *                 example: "https://linkedin.com/in/username"
 *               github:
 *                 type: string
 *                 description: GitHub profile URL (optional for updates)
 *                 example: "https://github.com/username"
 *               fiverr:
 *                 type: string
 *                 description: Fiverr profile URL (optional for updates)
 *                 example: "https://fiverr.com/username"
 *               whatsapp:
 *                 type: string
 *                 description: WhatsApp number (optional for updates)
 *                 example: "+1234567890"
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: New profile image file (optional, max 5MB, replaces existing)
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: New certificate image files (optional, max 5 files, 5MB each, replaces existing)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *             example:
 *               success: true
 *               message: "Profile updated successfully"
 *               profile:
 *                 _id: "68a1bf1a589c37d0d268ef00"
 *                 userId: "68a1bf1a589c37d0d268ef01"
 *                 profession: "Full Stack Developer"
 *                 skills: ["JavaScript", "React", "Node.js", "MongoDB", "TypeScript"]
 *                 description: "Experienced developer with expertise in modern web technologies"
 *                 yearsOfExperience: 5
 *                 linkedin: "https://linkedin.com/in/username"
 *                 github: "https://github.com/username"
 *                 fiverr: "https://fiverr.com/username"
 *                 whatsapp: "+1234567890"
 *                 profileImage: "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/profile.jpg"
 *                 certificates: ["https://res.cloudinary.com/your-cloud/image/upload/v1234567890/cert1.jpg"]
 *                 updatedAt: "2025-08-19T03:23:00.000Z"
 *       400:
 *         description: Bad request - Validation error or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "LinkedIn profile is required"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to update this profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized to update this profile
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.put('/update/:id', authMiddleware, profileImageUpload, certificateUpload, updateProfile);

/**
 * @swagger
 * /api/v1/profile/update-image/{id}:
 *   put:
 *     summary: Update only profile image
 *     description: Update just the profile image for an existing profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID to update
 *         example: "68a1bf1a589c37d0d268ef00"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profileImage
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: New profile image file (required, max 5MB, replaces existing)
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile image updated successfully"
 *                 profileImage:
 *                   type: string
 *                   example: "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/profile.jpg"
 *       400:
 *         description: Bad request - No image file provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No image file provided
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to update this profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized to update this profile
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.put('/update-image/:id', authMiddleware, profileImageUpload, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Profile image is required' });
    }

    // Find profile
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Check ownership
    if (profile.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    // Update only the profile image
    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      { profileImage: req.file.path },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile image updated successfully',
      profileImage: req.file.path
    });
  } catch (error) {
    console.error('Error in /update-image/:id route:', error);
    res.status(500).json({ message: 'Server error during profile image update', error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/profile/update-certificates/{id}:
 *   put:
 *     summary: Update only profile certificates
 *     description: Update just the certificates for an existing profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID to update
 *         example: "68a1bf1a589c37d0d268ef00"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - certificates
 *             properties:
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: New certificate image files (required, max 5 files, 5MB each, replaces existing)
 *     responses:
 *       200:
 *         description: Profile certificates updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile certificates updated successfully"
 *                 certificates:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["https://res.cloudinary.com/your-cloud/image/upload/v1234567890/cert1.jpg"]
 *       400:
 *         description: Bad request - No certificate files provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No certificate files provided
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to update this profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized to update this profile
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.put('/update-certificates/:id', authMiddleware, certificateUpload, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one certificate file is required' });
    }

    // Find profile
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Check ownership
    if (profile.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    // Update only the certificates
    const certificatePaths = req.files.map(file => file.path);
    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      { certificates: certificatePaths },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile certificates updated successfully',
      certificates: certificatePaths
    });
  } catch (error) {
    console.error('Error in /update-certificates/:id route:', error);
    res.status(500).json({ message: 'Server error during profile certificates update', error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Get all profiles
 *     description: Retrieves all profiles (temporarily accessible by all users).
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 profiles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forbidden - Admin access required
 */
router.get('/', authMiddleware, getAllProfiles);

/**
 * @swagger
 * /api/v1/profile/{userId}:
 *   get:
 *     summary: Get profile by user ID
 *     description: Retrieves a profile by the specified user ID.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile not found
 */
router.get('/:userId', getProfileByUser);

/**
 * @swagger
 * /api/v1/profile/delete/{id}:
 *   delete:
 *     summary: Delete a profile (Admin only)
 *     description: Deletes a profile by ID. Requires admin privileges.
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *         example: "68a1bf1a589c37d0d268ef00"
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forbidden - Admin access required
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile not found
 */
router.delete('/delete/:id', authMiddleware, roleMiddleware(['admin']), deleteProfile);

/**
 * @swagger
 * /api/v1/profile/test-upload:
 *   post:
 *     summary: Test file upload functionality
 *     description: Simple test endpoint to verify file uploads work
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               testFile:
 *                 type: string
 *                 format: binary
 *                 description: Test file to upload
 *     responses:
 *       200:
 *         description: Upload test successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Upload test successful
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                 body:
 *                   type: object
 *       400:
 *         description: Upload error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload error
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload test failed
 */
router.post('/test-upload', profileUploadWithErrorHandling, (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Upload test successful',
      files: req.files,
      body: req.body
    });
  } catch (error) {
    console.error('Error in /test-upload route:', error);
    res.status(500).json({
      success: false,
      message: 'Upload test failed',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/profile/test-cloudinary:
 *   get:
 *     summary: Test Cloudinary connection
 *     description: Simple test endpoint to verify Cloudinary is working
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: Cloudinary test successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cloudinary connection successful
 *                 result:
 *                   type: object
 *       500:
 *         description: Cloudinary test failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cloudinary test failed
 */
router.get('/test-cloudinary', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({
      success: true,
      message: 'Cloudinary connection successful',
      result: result
    });
  } catch (error) {
    console.error('Error in /test-cloudinary route:', error);
    res.status(500).json({
      success: false,
      message: 'Cloudinary test failed',
      error: error.message
    });
  }
});

export default router;
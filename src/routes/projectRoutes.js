import express from 'express';
import {
  createProject,
  getMyProjects,
  updateProject,
  deleteProject,
  getProjectsByUser,
  getAllProjects
} from '../controllers/projectController.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';
import { projectUploadWithErrorHandling } from '../middlewares/upload.js';
import cloudinary from '../config/cloudinary.js';
import Project from '../models/Project.js'; // Added import for Project model

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - title
 *         - summary
 *         - description
 *         - thumbnail
 *       properties:
 *         title:
 *           type: string
 *           description: Project title
 *           example: "E-Commerce Platform"
 *         summary:
 *           type: string
 *           description: Project summary (max 15 words)
 *           example: "A modern e-commerce platform built with React and Node.js"
 *         description:
 *           type: string
 *           description: Detailed project description
 *           example: "Full-stack e-commerce application with user authentication, product management, and payment integration"
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: Technologies and skills used in the project
 *           example: ["React", "Node.js", "MongoDB", "Express"]
 *         link:
 *           type: string
 *           format: uri
 *           description: Live project URL or GitHub repository
 *           example: "https://github.com/username/project"
 *         thumbnail:
 *           type: string
 *           description: Project thumbnail image URL (required)
 *           example: "https://res.cloudinary.com/dhvk1yovx/image/upload/v1755430683/Community Learning Platform API/projects/thumbnails/project-thumb.png"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Additional project image URLs (max 3)
 *           example: ["https://res.cloudinary.com/dhvk1yovx/image/upload/v1755430683/Community Learning Platform API/projects/images/project-img1.png"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Project creation timestamp
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Project last update timestamp
 *           example: "2024-01-15T10:30:00.000Z"
 *     ProjectResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Project created successfully"
 *         project:
 *           $ref: '#/components/schemas/Project'
 */

/**
 * @swagger
 * /api/v1/project/add:
 *   post:
 *     summary: Create a new project
 *     description: Create a new project with title, summary, description, skills, and optional media uploads
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - summary
 *               - description
 *               - thumbnail
 *             properties:
 *               title:
 *                 type: string
 *                 description: Project title (required)
 *                 example: "E-Commerce Platform"
 *               summary:
 *                 type: string
 *                 description: Project summary, max 15 words (required)
 *                 example: "A modern e-commerce platform built with React and Node.js"
 *               description:
 *                 type: string
 *                 description: Detailed project description (required)
 *                 example: "Full-stack e-commerce application with user authentication, product management, and payment integration"
 *               skills:
 *                 type: string
 *                 description: Comma-separated skills and technologies (optional)
 *                 example: "React, Node.js, MongoDB, Express"
 *               link:
 *                 type: string
 *                 description: Live project URL or GitHub repository (optional)
 *                 example: "https://github.com/username/project"
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Project thumbnail image file (required, max 5MB)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Additional project image files (optional, max 3 files, 5MB each)
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *             example:
 *               success: true
 *               message: "Project created successfully"
 *               project:
 *                 _id: "68a1bf1a589c37d0d268ef00"
 *                 userId: "68a1bf1a589c37d0d268ef01"
 *                 title: "E-Commerce Platform"
 *                 summary: "A modern e-commerce platform built with React and Node.js"
 *                 description: "Full-stack e-commerce application with user authentication, product management, and payment integration"
 *                 skills: ["React", "Node.js", "MongoDB", "Express"]
 *                 link: "https://github.com/username/project"
 *                 thumbnail: "https://res.cloudinary.com/dhvk1yovx/image/upload/v1755430683/Community Learning Platform API/projects/thumbnails/project-thumb.png"
*                 images: ["https://res.cloudinary.com/dhvk1yovx/image/upload/v1755430683/Community Learning Platform API/projects/images/project-img1.png"]
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Bad request - Validation error or missing required fields
 *         content:
 *           application/json:
 *             example:
 *               message: "Project title is required"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal server error
 */
router.post('/add', authMiddleware, roleMiddleware(['user']), projectUploadWithErrorHandling, createProject);

/**
 * @swagger
 * /api/v1/project/me:
 *   get:
 *     summary: Get current user's projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, getMyProjects);

/**
 * @swagger
 * /api/v1/project/update/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
router.put('/update/:id', authMiddleware, projectUploadWithErrorHandling, updateProject);

/**
 * @swagger
 * /api/v1/project/delete/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
router.delete('/delete/:id', authMiddleware, deleteProject);

/**
 * @swagger
 * /api/v1/project/{userId}:
 *   get:
 *     summary: Get projects by user ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       404:
 *         description: User not found
 */
router.get('/:userId', getProjectsByUser);

/**
 * @swagger
 * /api/v1/project:
 *   get:
 *     summary: Get all projects (Admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllProjects);

/**
 * @swagger
 * /api/v1/project/test-upload:
 *   post:
 *     summary: Test project file upload functionality
 *     description: Simple test endpoint to verify project file uploads work
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Test thumbnail file
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Test project image files
 *     responses:
 *       200:
 *         description: Upload test successful
 *       400:
 *         description: Upload error
 */
router.post('/test-upload', projectUploadWithErrorHandling, (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Project upload test successful',
      thumbnail: req.files?.thumbnail?.[0],
      images: req.files?.images || [],
      body: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Project upload test failed',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/project/test-cloudinary:
 *   get:
 *     summary: Test Cloudinary connection for projects
 *     description: Simple test endpoint to verify Cloudinary is working for project uploads
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Cloudinary test successful
 *       500:
 *         description: Cloudinary test failed
 */
router.get('/test-cloudinary', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    
    res.json({
      success: true,
      message: 'Cloudinary connection successful for projects',
      result: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Project Cloudinary test failed',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/project/test-create:
 *   post:
 *     summary: Test project creation without file uploads
 *     description: Simple test endpoint to verify project creation works without files
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - summary
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Test Project"
 *               summary:
 *                 type: string
 *                 example: "A test project for debugging"
 *               description:
 *                 type: string
 *                 example: "This is a test project to verify the creation flow works"
 *               skills:
 *                 type: string
 *                 example: "React, Node.js"
 *               link:
 *                 type: string
 *                 example: "https://github.com/test/project"
 *     responses:
 *       201:
 *         description: Test project created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/test-create', authMiddleware, async (req, res) => {
  try {
    console.log('=== TEST PROJECT CREATION ===');
    console.log('Request body:', req.body);
    console.log('User ID:', req.user._id);

    const { title, summary, description, skills, link } = req.body;

    // Validate required fields
    if (!title || !summary || !description) {
      return res.status(400).json({
        status: false,
        message: 'Title, summary, and description are required'
      });
    }

    // Parse skills
    let skillsArray = [];
    if (skills) {
      try {
        skillsArray = JSON.parse(skills);
      } catch (e) {
        skillsArray = skills.split(',').map(skill => skill.trim());
      }
    }

    // Create test project without files
    const project = await Project.create({
      userId: req.user._id,
      title,
      summary,
      description,
      skills: skillsArray,
      link,
      thumbnail: 'test-thumbnail-url', // Placeholder
      images: []
    });

    console.log('Test project created:', project);

    res.status(201).json({
      status: true,
      message: 'Test project created successfully',
      project
    });
  } catch (error) {
    console.error('Test project creation error:', error);
    res.status(500).json({
      status: false,
      message: 'Test project creation failed',
      error: error.message
    });
  }
});

export default router;
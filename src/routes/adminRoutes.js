import express from 'express';
import {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  updateProject,
  deleteProject,
  getDashboardStats,
  addCategory,
  editCategory,
  deleteCategory,
  createContentWithCategories,
  createCarousel,
  getAllCategories,
  getAllCarousel,
  editCarousel,
  deleteCarousel
} from '../controllers/adminController.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';
import { projectUploadWithErrorHandling, carouselUpload, categoryImageUpload } from '../middlewares/upload.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardStats:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: number
 *           description: Total number of users
 *         totalProfiles:
 *           type: number
 *           description: Total number of profiles
 *         totalProjects:
 *           type: number
 *           description: Total number of projects
 *         blockedUsers:
 *           type: number
 *           description: Number of blocked users
 *         unverifiedUsers:
 *           type: number
 *           description: Number of unverified users
 *     AdminResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *     Content:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Content ID
 *         coursolimages:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of carousel image URLs
 *         categories:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               title:
 *                 type: string
 *               liveLink:
 *                 type: string
 *               image:
 *                 type: string
 *                 description: Category image URL
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         liveLink:
 *           type: string
 *         image:
 *           type: string
 *           description: Category image URL
 */

router.get('/users',authMiddleware, roleMiddleware(['admin']), getAllUsers);



























router.put('/unblock/:userId', unblockUser);
router.delete('/delete-user/:id', deleteUser);
router.put('/update-project/:id', projectUploadWithErrorHandling, updateProject);
router.delete('/delete-project/:id', deleteProject);
router.get('/dashboard', getDashboardStats);

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }
    const profile = await Profile.findOne({ userId });
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    res.json({
      status: true,
      message: 'User details retrieved successfully',
      data: { user, profile, projects }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server error while fetching user details' });
  }
});

/**
 * @swagger
 * /api/v1/admin/content:
 *   post:
 *     summary: Create new content with categories and image uploads (Admin only)
 *     description: Create a new content entry including uploading carousel images and category images with corresponding category details
 *     tags: [Admin, Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coursolImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Exactly 3 carousel image files (e.g., JPEG, PNG)
 *               categoryImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files for categories (must match the number of categories)
 *               categories:
 *                 type: string
 *                 description: JSON string of categories array
 *                 example: '[{"title": "Programming", "liveLink": "https://example.com/programming"}]'
 *             required:
 *               - coursolImages
 *               - categoryImages
 *               - categories
 *     responses:
 *       201:
 *         description: Content created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminResponse'
 *             example:
 *               status: true
 *               message: "Content with categories created successfully"
 *               data:
 *                 id: "65c7e6e892f4a8b2d8f01a23"
 *                 coursolImages: [
 *                   "https://cdn.example.com/carousel/image1.jpg",
 *                   "https://cdn.example.com/carousel/image2.jpg",
 *                   "https://cdn.example.com/carousel/image3.jpg"
 *                 ]
 *                 categories: [
 *                   {
 *                     _id: "65c7e6e892f4a8b2d8f01a24",
 *                     title: "Programming",
 *                     liveLink: "https://example.com/programming",
 *                     image: "https://cdn.example.com/category/image1.jpg"
 *                   }
 *                 ]
 *       400:
 *         description: Bad request - Invalid data, file count, or mismatched category images
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/content',authMiddleware, roleMiddleware(['admin']), carouselUpload, createContentWithCategories);

/**
 * @swagger
 * /api/v1/admin/content/{contentId}/categories:
 *   get:
 *     summary: Get all categories of a content
 *     description: Retrieve all categories for a specific content
 *     tags: [Admin, Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *         example: "65c7e6e892f4a8b2d8f01a23"
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *             example:
 *               status: true
 *               message: "Categories retrieved successfully"
 *               data:
 *                 categories: [
 *                   {
 *                     _id: "65c7e6e892f4a8b2d8f01a24",
 *                     title: "Programming",
 *                     liveLink: "https://example.com/programming",
 *                     image: "https://cdn.example.com/category/image1.jpg"
 *                   }
 *                 ]
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Content not found
 */
router.get('/content/:contentId/categories', getAllCategories);

/**
 * @swagger
 * /api/v1/admin/content/{contentId}/category:
 *   post:
 *     summary: Add a category to content (Admin only)
 *     description: Add a new category (title, live link, and image) to an existing content
 *     tags: [Admin, Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID to add category to
 *         example: "65c7e6e892f4a8b2d8f01a23"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Design"
 *               liveLink:
 *                 type: string
 *                 example: "https://example.com/design"
 *               categoryImage:
 *                 type: string
 *                 format: binary
 *                 description: Category image file (e.g., JPEG, PNG)
 *             required:
 *               - title
 *               - liveLink
 *               - categoryImage
 *     responses:
 *       200:
 *         description: Category added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *             example:
 *               status: true
 *               message: "Category added successfully"
 *               data:
 *                 categories: [
 *                   {
 *                     _id: "65c7e6e892f4a8b2d8f01a24",
 *                     title: "Design",
 *                     liveLink: "https://example.com/design",
 *                     image: "https://cdn.example.com/category/image1.jpg"
 *                   }
 *                 ]
 *       400:
 *         description: Bad request - Invalid data or missing image
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Content not found
 */
router.post('/content/:contentId/category',authMiddleware, roleMiddleware(['admin']), categoryImageUpload, addCategory);

/**
 * @swagger
 * /api/v1/admin/category/{categoryId}:
 *   put:
 *     summary: Edit a category (Admin only)
 *     description: Update category details (title, live link, or image) by category ID
 *     tags: [Admin, Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID to update
 *         example: "65c7e6e892f4a8b2d8f01a99"
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Design"
 *               liveLink:
 *                 type: string
 *                 example: "https://example.com/updated-design"
 *               categoryImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional category image file (e.g., JPEG, PNG)
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     contentId:
 *                       type: string
 *                     updatedCategory:
 *                       $ref: '#/components/schemas/Category'
 *             example:
 *               status: true
 *               message: "Category updated successfully"
 *               data:
 *                 contentId: "65c7e6e892f4a8b2d8f01a23"
 *                 updatedCategory:
 *                   _id: "65c7e6e892f4a8b2d8f01a99"
 *                   title: "Updated Design"
 *                   liveLink: "https://example.com/updated-design"
 *                   image: "https://cdn.example.com/category/updated-image.jpg"
 *       400:
 *         description: Bad request - Invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category or content not found
 */
router.put('/category/:categoryId',authMiddleware, roleMiddleware(['admin']), categoryImageUpload, editCategory);

/**
 * @swagger
 * /api/v1/admin/content/{contentId}/category/{categoryId}:
 *   delete:
 *     summary: Delete a category from content (Admin only)
 *     description: Remove a specific category from an existing content
 *     tags: [Admin, Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *         example: "65c7e6e892f4a8b2d8f01a23"
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID to delete
 *         example: "65c7e6e892f4a8b2d8f01a99"
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *             example:
 *               status: true
 *               message: "Category deleted successfully"
 *               data:
 *                 categories: []
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category or content not found
 */
router.delete('/content/:contentId/category/:categoryId',authMiddleware, roleMiddleware(['admin']), deleteCategory);

/**
 * @swagger
 * /api/v1/admin/carousel:
 *   post:
 *     summary: Create new carousel (Admin only)
 *     description: Upload exactly 3 images to create a new carousel
 *     tags: [Admin, Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coursolImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Exactly 3 image files to upload (e.g., JPEG, PNG)
 *             required:
 *               - coursolImages
 *     responses:
 *       201:
 *         description: Carousel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminResponse'
 *             example:
 *               status: true
 *               message: "Carousel images uploaded successfully"
 *               data:
 *                 id: "65c7e6e892f4a8b2d8f01a23"
 *                 coursolImages: [
 *                   "https://cdn.example.com/carousel/image1.jpg",
 *                   "https://cdn.example.com/carousel/image2.jpg",
 *                   "https://cdn.example.com/carousel/image3.jpg"
 *                 ]
 *       400:
 *         description: Bad request - Invalid file count or format
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/carousel',authMiddleware, roleMiddleware(['admin']), carouselUpload, createCarousel);

/**
 * @swagger
 * /api/v1/admin/carousel:
 *   get:
 *     summary: Get all carousels
 *     description: Retrieve all carousel sets with their image URLs
 *     tags: [Admin, Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carousels retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *             example:
 *               status: true
 *               message: "Carousel sets retrieved successfully"
 *               data: [
 *                 {
 *                   id: "65c7e6e892f4a8b2d8f01a23",
 *                   coursolImages: [
 *                     "https://cdn.example.com/carousel/image1.jpg",
 *                     "https://cdn.example.com/carousel/image2.jpg",
 *                     "https://cdn.example.com/carousel/image3.jpg"
 *                   ]
 *                 }
 *               ]
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/carousel', getAllCarousel);

/**
 * @swagger
 * /api/v1/admin/carousel/{id}:
 *   put:
 *     summary: Edit a carousel (Admin only)
 *     description: Update a carousel by uploading exactly 3 new images
 *     tags: [Admin, Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Carousel ID to update
 *         example: "65c7e6e892f4a8b2d8f01a23"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coursolImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Exactly 3 image files to upload (e.g., JPEG, PNG)
 *             required:
 *               - coursolImages
 *     responses:
 *       200:
 *         description: Carousel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminResponse'
 *             example:
 *               status: true
 *               message: "Carousel updated successfully"
 *               data:
 *                 id: "65c7e6e892f4a8b2d8f01a23"
 *                 coursolImages: [
 *                   "https://cdn.example.com/carousel/newimage1.jpg",
 *                   "https://cdn.example.com/carousel/newimage2.jpg",
 *                   "https://cdn.example.com/carousel/newimage3.jpg"
 *                 ]
 *       400:
 *         description: Bad request - Invalid file count or format
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Carousel not found
 */
router.put('/carousel/:id',authMiddleware, roleMiddleware(['admin']), carouselUpload, editCarousel);

/**
 * @swagger
 * /api/v1/admin/carousel/{id}:
 *   delete:
 *     summary: Delete a carousel (Admin only)
 *     description: Delete a carousel and its associated images
 *     tags: [Admin, Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Carousel ID to delete
 *         example: "65c7e6e892f4a8b2d8f01a23"
 *     responses:
 *       200:
 *         description: Carousel deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminResponse'
 *             example:
 *               status: true
 *               message: "Carousel deleted successfully"
 *               data: {}
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Carousel not found
 */
router.delete('/carousel/:id',authMiddleware, roleMiddleware(['admin']), deleteCarousel);

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Test admin access (Admin only)
 *     description: Simple test endpoint to verify admin authentication and authorization
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access test successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 adminInfo:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     role:
 *                       type: string
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *             example:
 *               status: true
 *               message: "Admin access verified successfully"
 *               adminInfo:
 *                 userId: "68a1bf1a589c37d0d268ef01"
 *                 role: "admin"
 *                 permissions: ["users", "projects", "dashboard"]
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/dashboard',authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.json({
    status: true,
    message: 'Admin access verified successfully',
    adminInfo: {
      userId: req.user._id,
      role: req.user.role,
      permissions: ['users', 'projects', 'dashboard']
    }
  });
});

export default router;
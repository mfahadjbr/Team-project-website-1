import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import ContentModel from '../models/Content.js';
import {
  ServerError,
  ClientError,
  ResourceNotFound,
  SuccessResponse,
  CreatedResponse
} from '../utils/helperFunctions.js';

// @desc    Get all users
// @route   GET /admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return SuccessResponse(res, 'Users retrieved successfully', { users, count: users.length });
  } catch (error) {
    return ServerError(res, 'Server error while fetching users');
  }
};

// @desc    Block user
// @route   PUT /admin/block/:userId
// @access  Private/Admin
const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    if (user.role === 'admin') {
      return ClientError(res, 'Cannot block admin users');
    }

    user.isBlocked = true;
    await user.save();

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked
    };

    return SuccessResponse(res, 'User blocked successfully', { user: userData });
  } catch (error) {
    return ServerError(res, 'Server error while blocking user');
  }
};

// @desc    Unblock user
// @route   PUT /admin/unblock/:userId
// @access  Private/Admin
const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    user.isBlocked = false;
    await user.save();

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked
    };

    return SuccessResponse(res, 'User unblocked successfully', { user: userData });
  } catch (error) {
    return ServerError(res, 'Server error while unblocking user');
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /admin/delete-user/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    if (user.role === 'admin') {
      return ClientError(res, 'Cannot delete admin users');
    }

    await Profile.findOneAndDelete({ userId: id });
    await Project.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);

    return SuccessResponse(res, 'User and all associated data deleted successfully');
  } catch (error) {
    return ServerError(res, 'Server error during user deletion');
  }
};

// @desc    Update any project (admin only)
// @route   PUT /admin/update-project/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, skills, description, link } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return ResourceNotFound(res, 'Project');
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        skills: skills ? skills.split(',').map(skill => skill.trim()) : project.skills,
        description,
        link,
        ...(req.files?.thumbnail?.[0]?.path && { thumbnail: req.files.thumbnail[0].path }),
        ...(req.files?.images && { images: req.files.images.map(file => file.path) })
      },
      { new: true, runValidators: true }
    );

    return SuccessResponse(res, 'Project updated successfully by admin', { project: updatedProject });
  } catch (error) {
    return ServerError(res, 'Server error during project update');
  }
};

// @desc    Delete any project (admin only)
// @route   DELETE /admin/delete-project/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return ResourceNotFound(res, 'Project');
    }

    await Project.findByIdAndDelete(id);

    return SuccessResponse(res, 'Project deleted successfully by admin');
  } catch (error) {
    return ServerError(res, 'Server error during project deletion');
  }
};

// @desc    Get admin dashboard stats
// @route   GET /admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProfiles = await Profile.countDocuments();
    const totalProjects = await Project.countDocuments();
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });

    const stats = {
      totalUsers,
      totalProfiles,
      totalProjects,
      blockedUsers,
      unverifiedUsers
    };

    return SuccessResponse(res, 'Dashboard stats retrieved successfully', { stats });
  } catch (error) {
    return ServerError(res, 'Server error while fetching dashboard stats');
  }
};

// @desc    Create new Content with Categories
// @route   POST /admin/content
// @access  Private/Admin
const createContentWithCategories = async (req, res) => {
  try {
    const checkIfexists = await ContentModel.findOne({ coursolimages: { $exists: true, $ne: [] } });
    if (checkIfexists) {
      return ClientError(res, 'Content with categories already exists. Please delete existing content before creating a new one.');
    }

    const { categories } = req.body;
    const files = req.files;

    if (!files?.coursolImages || files.coursolImages.length !== 3) {
      return ClientError(res, 'Exactly 3 carousel images are required');
    }

    if (!categories) {
      return ClientError(res, 'At least one category is required');
    }

    let parsedCategories;
    try {
      parsedCategories = JSON.parse(categories);
      if (!Array.isArray(parsedCategories) || parsedCategories.length === 0) {
        throw new Error('Invalid categories format');
      }
    } catch (error) {
      return ClientError(res, 'Categories must be a valid JSON array');
    }

    if (!files?.categoryImages || files.categoryImages.length !== parsedCategories.length) {
      return ClientError(res, 'Number of category images must match the number of categories');
    }

    const coursolImages = files.coursolImages.map(file => file.path);
    const categoryImages = files.categoryImages.map(file => file.path);

    const formattedCategories = parsedCategories.map((cat, index) => ({
      title: cat.title,
      liveLink: cat.liveLink,
      image: categoryImages[index]
    }));

    const newContent = await ContentModel.create({
      coursolimages: coursolImages,
      categories: formattedCategories
    });

    return CreatedResponse(res, 'Content with categories created successfully', newContent);
  } catch (error) {
    return ServerError(res, 'Server error while creating content');
  }
};

// @desc    Add category inside Content
// @route   POST /admin/content/:contentId/category
// @access  Private/Admin
const addCategory = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { title, liveLink } = req.body;

    if (!req.file) {
      return ClientError(res, 'Category image is required');
    }

    const content = await ContentModel.findById(contentId);
    if (!content) {
      return ResourceNotFound(res, 'Content');
    }

    content.categories.push({
      title,
      liveLink,
      image: req.file.path
    });
    await content.save();

    return SuccessResponse(res, 'Category added successfully', { categories: content.categories });
  } catch (error) {
    return ServerError(res, 'Server error while adding category');
  }
};

// @desc    Get all categories of a Content
// @route   GET /admin/content/:contentId/categories
// @access  Private/Admin
const getAllCategories = async (req, res) => {
  try {
    const { contentId } = req.params;

    const content = await ContentModel.findById(contentId).select('categories');
    if (!content) {
      return ResourceNotFound(res, 'Content');
    }

    return SuccessResponse(res, 'Categories retrieved successfully', { categories: content.categories });
  } catch (error) {
    return ServerError(res, 'Server error while fetching categories');
  }
};

// @desc    Edit category by Category ID
// @route   PUT /admin/category/:categoryId
// @access  Private/Admin
const editCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { title, liveLink } = req.body;

    const content = await ContentModel.findOne({ 'categories._id': categoryId });
    if (!content) {
      return ResourceNotFound(res, 'Content with specified category');
    }

    const category = content.categories.id(categoryId);
    if (!category) {
      return ResourceNotFound(res, 'Category');
    }

    category.title = title || category.title;
    category.liveLink = liveLink || category.liveLink;
    if (req.file) {
      category.image = req.file.path;
    }
    await content.save();

    const data = { contentId: content._id, updatedCategory: category };
    return SuccessResponse(res, 'Category updated successfully', data);
  } catch (error) {
    return ServerError(res, 'Server error while editing category');
  }
};

// @desc    Delete category inside Content
// @route   DELETE /admin/content/:contentId/category/:categoryId
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const content = await ContentModel.findOne({ 'categories._id': categoryId });
    if (!content) {
      return ResourceNotFound(res, 'Content with specified category');
    }

    const category = content.categories.id(categoryId);
    if (!category) {
      return ResourceNotFound(res, 'Category');
    }

    category.deleteOne();
    await content.save();

    return SuccessResponse(res, 'Category deleted successfully', { categories: content.categories });
  } catch (error) {
    return ServerError(res, 'Server error while deleting category');
  }
};

// @desc    Create carousel images (upload up to 3)
// @route   POST /admin/carousel
// @access  Private/Admin
const createCarousel = async (req, res) => {
  try {
    if (!req.files || req.files.length !== 3) {
      return ClientError(res, 'Exactly 3 images are required.');
    }

    const checkCourselImages = await ContentModel.findOne({ coursolimages: { $exists: true, $ne: [] } });
    if (checkCourselImages) {
      return ClientError(res, 'Carousel images already exist. Please delete existing carousel before creating a new one.');
    }

    const imageUrls = req.files.map(file => file.path);

    const newCarousel = await ContentModel.create({
      coursolimages: imageUrls
    });

    return CreatedResponse(res, 'Carousel images uploaded successfully', newCarousel);
  } catch (error) {
    return ServerError(res, 'Server error while creating carousel');
  }
};

// @desc    Get all carousel sets
// @route   GET /admin/carousel
// @access  Private/Admin
const getAllCarousel = async (req, res) => {
  try {
    const carousels = await ContentModel.find({}, 'coursolimages');
    return SuccessResponse(res, 'Carousel sets retrieved successfully', carousels);
  } catch (error) {
    return ServerError(res, 'Server error while fetching carousel');
  }
};

// @desc    Edit carousel images by ID
// @route   PUT /admin/carousel/:id
// @access  Private/Admin
const editCarousel = async (req, res) => {
  try {
    const { id } = req.params;
  

    // const imageUrls = req.files.map(file => file.path);
    if (!req.files?.coursolImages || req.files.coursolImages.length !== 3) {
  return ClientError(res, 'Exactly 3 images are required for update.');
}

const imageUrls = req.files.coursolImages.map(file => file.path);

    const updatedCarousel = await ContentModel.findByIdAndUpdate(
      id,
      { coursolimages: imageUrls },
      { new: true }
    );

    if (!updatedCarousel) {
      return ResourceNotFound(res, 'Carousel');
    }

    return SuccessResponse(res, 'Carousel updated successfully', updatedCarousel);
  } catch (error) {
    return ServerError(res, 'Server error while editing carousel');
  }
};

// @desc    Delete carousel by ID
// @route   DELETE /admin/carousel/:id
// @access  Private/Admin
const deleteCarousel = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCarousel = await ContentModel.findByIdAndDelete(id);
    if (!deletedCarousel) {
      return ResourceNotFound(res, 'Carousel');
    }

    return SuccessResponse(res, 'Carousel deleted successfully');
  } catch (error) {
    return ServerError(res, 'Server error while deleting carousel');
  }
};



export {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  updateProject,
  deleteProject,
  getDashboardStats,
  createContentWithCategories,
  addCategory,
  getAllCategories,
  editCategory,
  deleteCategory,
  createCarousel,
  getAllCarousel,
  editCarousel,
  deleteCarousel
};
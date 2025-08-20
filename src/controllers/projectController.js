import Project from '../models/Project.js';
import User from '../models/User.js';
import {
  ServerError,
  ClientError,
  AuthError,
  ResourceNotFound,
  SuccessResponse,
  CreatedResponse
} from '../utils/helperFunctions.js';

// @desc    Create project
// @route   POST /project/add
// @access  Private
const createProject = async (req, res) => {
  try {
    console.log('=== PROJECT CREATION START ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('User ID:', req.user._id);

    const {
      title,
      summary,
      skills,
      description,
      link
    } = req.body;

    // Process files - handle cases where files might not be uploaded
    let thumbnailPath = null;
    let imagePaths = [];

    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      thumbnailPath = req.files.thumbnail[0].path;
      console.log('Thumbnail uploaded successfully:', thumbnailPath);
    } else {
      console.log('No thumbnail file uploaded');
    }

    if (req.files && req.files.images && req.files.images.length > 0) {
      imagePaths = req.files.images.map(file => file.path);
      console.log('Images uploaded successfully:', imagePaths);
    } else {
      console.log('No additional images uploaded');
    }

    const user = await User.findById(req.user._id).select('isProfileComplete');
    if (!user || !user.isProfileComplete) {
      console.log('User profile incomplete or user not found');
      return ClientError(res, 'Please complete your profile before creating a project');
    }

    console.log('User profile complete:', user.isProfileComplete);
    const thisUser = await User.findById(req.user._id);
    console.log('Current user:', thisUser);

    // Parse skills if it's a JSON string, otherwise split by comma
    let skillsArray = [];
    if (skills) {
      console.log('Create project - Raw skills input:', skills);
      try {
        // Try to parse as JSON first (frontend sends it as JSON string)
        const parsedSkills = JSON.parse(skills);
        console.log('Create project - Parsed skills:', parsedSkills);
        
        // Ensure we have an array of strings
        if (Array.isArray(parsedSkills)) {
          skillsArray = parsedSkills.map(skill => String(skill).trim()).filter(skill => skill);
        } else if (typeof parsedSkills === 'string') {
          // If it's a string, split by comma
          skillsArray = parsedSkills.split(',').map(skill => skill.trim()).filter(skill => skill);
        } else {
          // If it's neither array nor string, convert to string and split
          skillsArray = String(parsedSkills).split(',').map(skill => skill.trim()).filter(skill => skill);
        }
        
        console.log('Create project - Final skills array:', skillsArray);
      } catch (e) {
        // If not JSON, split by comma (fallback)
        skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        console.log('Create project - Skills split by comma:', skillsArray);
      }
    }

    // Create project data object
    const projectData = {
      userId: req.user._id,
      title,
      summary,
      skills: skillsArray,
      description,
      link,
      thumbnail: thumbnailPath,
      images: imagePaths
    };

    console.log('Project data to create:', projectData);

    // Validate required fields
    if (!title || !summary || !description) {
      console.log('Missing required fields');
      return ClientError(res, 'Title, summary, and description are required');
    }

    // Create project
    const project = await Project.create(projectData);
    console.log('Project created successfully:', project);
    console.log('Project skills after creation:', project.skills);

    console.log('=== PROJECT CREATION END ===');
    return CreatedResponse(res, 'Project created successfully', project);
  } catch (error) {
    console.error('=== PROJECT CREATION ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return ClientError(res, `Validation error: ${validationErrors.join(', ')}`);
    }
    
    return ServerError(res, 'Server error during project creation');
  }
};

// @desc    Get own projects
// @route   GET /project/me
// @access  Private
const getMyProjects = async (req, res) => {
  try {
    console.log('=== FETCHING MY PROJECTS ===');
    console.log('User ID:', req.user._id);
    
    const projects = await Project.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    console.log('Found projects:', projects);
    console.log('Project count:', projects.length);
    
    // Debug skills data for each project
    projects.forEach((project, index) => {
      console.log(`Project ${index + 1} skills:`, project.skills);
    });

    return SuccessResponse(res, 'Projects retrieved successfully', { projects, count: projects.length });
  } catch (error) {
    console.error('=== ERROR FETCHING PROJECTS ===');
    console.error('Error details:', error);
    return ServerError(res, 'Server error while fetching projects');
  }
};

// @desc    Update project
// @route   PUT /project/update/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      summary,
      skills,
      description,
      link
    } = req.body;

    // Find project
    const project = await Project.findById(id);
    if (!project) {
      return ResourceNotFound(res, 'Project');
    }

    // Check ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      return AuthError(res, 'Not authorized to update this project');
    }

    // Parse skills if it's a JSON string, otherwise split by comma
    let skillsArray = project.skills; // Keep existing skills by default
    if (skills) {
      console.log('Update project - Raw skills input:', skills);
      try {
        // Try to parse as JSON first (frontend sends it as JSON string)
        const parsedSkills = JSON.parse(skills);
        console.log('Update project - Parsed skills:', parsedSkills);
        
        // Ensure we have an array of strings
        if (Array.isArray(parsedSkills)) {
          skillsArray = parsedSkills.map(skill => String(skill).trim()).filter(skill => skill);
        } else if (typeof parsedSkills === 'string') {
          // If it's a string, split by comma
          skillsArray = parsedSkills.split(',').map(skill => skill.trim()).filter(skill => skill);
        } else {
          // If it's neither array nor string, convert to string and split
          skillsArray = String(parsedSkills).split(',').map(skill => skill.trim()).filter(skill => skill);
        }
        console.log('Update project - Final skills array:', skillsArray);
      } catch (e) {
        // If not JSON, split by comma (fallback)
        skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        console.log('Update project - Skills split by comma:', skillsArray);
      }
    }

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        skills: skillsArray,
        description,
        link,
        ...(req.files?.thumbnail?.[0]?.path && { thumbnail: req.files.thumbnail[0].path }),
        ...(req.files?.images && { images: req.files.images.map(file => file.path) })
      },
      { new: true, runValidators: true }
    );

    return SuccessResponse(res, 'Project updated successfully', { project: updatedProject });
  } catch (error) {
    return ServerError(res, 'Server error during project update');
  }
};

// @desc    Delete project
// @route   DELETE /project/delete/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return ResourceNotFound(res, 'Project');
    }

    // Check ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      return AuthError(res, 'Not authorized to delete this project');
    }

    await Project.findByIdAndDelete(id);

    return SuccessResponse(res, 'Project deleted successfully');
  } catch (error) {
    return ServerError(res, 'Server error during project deletion');
  }
};

// @desc    Get projects by user ID
// @route   GET /project/:userId
// @access  Public
const getProjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await Project.find({ userId })
      .sort({ createdAt: -1 });

    return SuccessResponse(res, 'Projects retrieved successfully', { projects, count: projects.length });
  } catch (error) {
    return ServerError(res, 'Server error while fetching projects');
  }
};

// @desc    Get all projects (admin only)
// @route   GET /projects
// @access  Private/Admin
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('userId', 'fullName email isBlocked')
      .sort({ createdAt: -1 });

    return SuccessResponse(res, 'Projects retrieved successfully', { projects, count: projects.length });
  } catch (error) {
    return ServerError(res, 'Server error while fetching projects');
  }
};

export {
  createProject,
  getMyProjects,
  updateProject,
  deleteProject,
  getProjectsByUser,
  getAllProjects
};
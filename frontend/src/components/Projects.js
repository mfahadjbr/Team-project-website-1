import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaEye, FaExternalLinkAlt, FaImage, FaTimes } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    skills: '',
    link: '',
    thumbnail: null,
    images: []
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects...');
      const response = await fetch('http://localhost:5000/api/v1/project/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      console.log('Projects API response:', { status: response.status, data });
      
      if (response.ok) {
        // The API returns: { status: true, message: "...", data: { projects: [...], count: 2 } }
        // So we need to access data.data.projects to get the actual projects array
        const projectsData = data.data?.projects || [];
        console.log('Projects data:', projectsData);
        console.log('Projects count:', projectsData.length);
        
        // Debug each project's skills
        projectsData.forEach((project, index) => {
          console.log(`Project ${index + 1} skills:`, project.skills);
        });
        
        setProjects(Array.isArray(projectsData) ? projectsData : []);
      } else {
        console.error('Failed to fetch projects:', data.message);
        setError(data.message || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects. Please try again.');
      setProjects([]); // Ensure projects is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e, type) => {
    if (type === 'thumbnail') {
      setFormData({
        ...formData,
        thumbnail: e.target.files[0]
      });
    } else if (type === 'images') {
      setFormData({
        ...formData,
        images: Array.from(e.target.files)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] && key !== 'thumbnail' && key !== 'images') {
          if (key === 'skills') {
            // Convert skills string to array
            const skillsArray = formData[key].split(',').map(skill => skill.trim()).filter(skill => skill);
            console.log('Frontend - Skills before JSON.stringify:', skillsArray);
            formDataToSend.append(key, JSON.stringify(skillsArray));
            console.log('Frontend - Skills after JSON.stringify:', JSON.stringify(skillsArray));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Add files
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }
      
      if (formData.images.length > 0) {
        formData.images.forEach(img => {
          formDataToSend.append('images', img);
        });
      }

      const url = editingProject ? 
        `http://localhost:5000/api/v1/project/update/${editingProject._id}` :
        'http://localhost:5000/api/v1/project/add';

      const method = editingProject ? 'PUT' : 'POST';

      console.log('Submitting project:', { url, method, formData: Object.fromEntries(formDataToSend) });
      
      // Debug FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      console.log('Project API response:', { status: response.status, data });

      if (response.ok) {
        setSuccess(data.message || 'Project saved successfully!');
        setShowForm(false);
        setEditingProject(null);
        resetForm();
        console.log('Project saved, fetching updated projects...');
        fetchProjects();
      } else {
        setError(data.message || 'Failed to save project');
      }
    } catch (err) {
      console.error('Project submission error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    
    // Fix skills handling - ensure we get a clean array of skills
    let cleanSkills = '';
    if (project.skills && Array.isArray(project.skills)) {
      cleanSkills = project.skills.join(', ');
    } else if (project.skills && typeof project.skills === 'string') {
      // Handle case where skills might be a JSON string
      try {
        const parsedSkills = JSON.parse(project.skills);
        if (Array.isArray(parsedSkills)) {
          cleanSkills = parsedSkills.join(', ');
        } else {
          cleanSkills = project.skills;
        }
      } catch (e) {
        // If parsing fails, use as is
        cleanSkills = project.skills;
      }
    }
    
    setFormData({
      title: project.title || '',
      summary: project.summary || '',
      description: project.description || '',
      skills: cleanSkills,
      link: project.link || '',
      thumbnail: null,
      images: []
    });
    setShowForm(true);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/v1/project/delete/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Project deleted successfully!');
        fetchProjects();
      } else {
        setError(data.message || 'Failed to delete project');
      }
    } catch (err) {
      setError('Failed to delete project. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      summary: '',
      description: '',
      skills: '',
      link: '',
      thumbnail: null,
      images: []
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
    resetForm();
  };

  if (loading && projects.length === 0) {
    return (
      <div className="projects-loading">
        <div className="spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="projects">
      <div className="projects-header">
        <h1>Project Management</h1>
        <p>Showcase your work and build your portfolio</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="projects-container">
        {!showForm ? (
          <>
            <div className="projects-actions">
              <button 
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                <FaPlus />
                Add New Project
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading projects...</p>
              </div>
            ) : !projects || projects.length === 0 ? (
              <div className="no-projects">
                <div className="no-projects-icon">
                  <FaImage />
                </div>
                <h3>No Projects Yet</h3>
                <p>Start building your portfolio by adding your first project</p>
                <button 
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  <FaPlus />
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="projects-grid">
                {Array.isArray(projects) && projects.map((project) => {
                  console.log('Rendering project card:', project);
                  return (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="project-form-container">
            <div className="form-header">
              <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <p>{editingProject ? 'Update your project information' : 'Create a new project to showcase your work'}</p>
            </div>
            <ProjectForm
              formData={formData}
              onInputChange={handleInputChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              isEdit={!!editingProject}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, onEdit, onDelete }) => {
  console.log('ProjectCard received project:', project);
  
  // Helper function to clean skills data
  const getCleanSkills = (skills) => {
    console.log('getCleanSkills input:', skills);
    if (!skills) return [];
    
    if (Array.isArray(skills)) {
      console.log('Skills is already an array:', skills);
      return skills;
    } else if (typeof skills === 'string') {
      try {
        const parsed = JSON.parse(skills);
        console.log('Skills parsed from string:', parsed);
        return Array.isArray(parsed) ? parsed : [skills];
      } catch (e) {
        console.log('Failed to parse skills as JSON, treating as comma-separated string');
        // If parsing fails, treat as comma-separated string
        return skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      }
    }
    
    return [];
  };

  const cleanSkills = getCleanSkills(project.skills);
  console.log('Final clean skills:', cleanSkills);

  return (
    <div className="project-card">
      <div className="project-thumbnail">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.title} />
        ) : (
          <div className="no-thumbnail">
            <FaImage />
            <span>No Image</span>
          </div>
        )}
      </div>
      
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-summary">{project.summary}</p>
        
        <div className="project-skills">
          {cleanSkills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
        
        <p className="project-description">{project.description}</p>
        
        {project.link && (
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="project-link"
          >
            <FaExternalLinkAlt />
            View Project
          </a>
        )}
        
        <div className="project-actions">
          <button 
            onClick={() => onEdit(project)}
            className="btn btn-outline btn-sm"
          >
            <FaEdit />
            Edit
          </button>
          <button 
            onClick={() => onDelete(project._id)}
            className="btn btn-outline btn-sm delete-btn"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Project Form Component
const ProjectForm = ({ 
  formData, 
  onInputChange, 
  onFileChange, 
  onSubmit, 
  onCancel, 
  loading, 
  isEdit 
}) => {
  return (
    <form onSubmit={onSubmit} className="project-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Project Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            className="form-input"
            placeholder="Enter project title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="link" className="form-label">Project Link</label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={onInputChange}
            className="form-input"
            placeholder="https://github.com/username/project or live URL"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="summary" className="form-label">Summary *</label>
        <input
          type="text"
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={onInputChange}
          className="form-input"
          placeholder="Brief project summary (max 15 words)"
          maxLength="100"
          required
        />
        <small className="form-help">Keep it concise and engaging</small>
      </div>

      <div className="form-group">
        <label htmlFor="skills" className="form-label">Technologies Used</label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={onInputChange}
          className="form-input"
          placeholder="e.g., React, Node.js, MongoDB, Express"
        />
        <small className="form-help">Separate technologies with commas</small>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          className="form-input"
          rows="4"
          placeholder="Describe your project, features, challenges, and what you learned..."
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="thumbnail" className="form-label">Thumbnail Image *</label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            onChange={(e) => onFileChange(e, 'thumbnail')}
            className="form-input"
            accept="image/*"
            required={!isEdit}
          />
          <small className="form-help">Main project image (max 5MB)</small>
        </div>

        <div className="form-group">
          <label htmlFor="images" className="form-label">Additional Images</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={(e) => onFileChange(e, 'images')}
            className="form-input"
            accept="image/*"
            multiple
          />
          <small className="form-help">Up to 3 additional images (max 5MB each)</small>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner-small"></div>
              {isEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <FaPlus />
              {isEdit ? 'Update Project' : 'Create Project'}
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          <FaTimes />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Projects;

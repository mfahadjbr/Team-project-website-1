import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaProjectDiagram, FaCertificate, FaGraduationCap, FaEye, FaEdit, FaTrash, FaPlus, FaUser, FaImages, FaList } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProfiles: 0,
    totalProjects: 0,
    totalCourses: 0
  });
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [carouselContent, setCarouselContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    coursolImages: [],
    categoryImages: [],
    categories: [{ title: '', liveLink: '' }]
  });

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch all data in parallel
      const [usersRes, profilesRes, projectsRes, coursesRes, carouselRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/v1/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/v1/project', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/v1/admin/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/v1/admin/carousel', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      // Update stats after all data is fetched
      let usersData = [];
      let profilesData = [];
      let projectsData = [];
      let coursesData = [];
      let carouselData = [];

      try {
        if (usersRes.ok) {
          const response = await usersRes.json();
          usersData = response.data || [];
        }
        if (profilesRes.ok) {
          const response = await profilesRes.json();
          profilesData = response.data || [];
        }
        if (projectsRes.ok) {
          const response = await projectsRes.json();
          projectsData = response.data || [];
        }
        if (coursesRes.ok) {
          const response = await coursesRes.json();
          coursesData = response.data || [];
        }
        if (carouselRes.ok) {
          const response = await carouselRes.json();
          carouselData = response.data || [];
        }
      } catch (parseError) {
        console.error('Error parsing API responses:', parseError);
      }

      setUsers(usersData);
      setProfiles(profilesData);
      setProjects(projectsData);
      setCourses(coursesData);
      setCarouselContent(carouselData);

      // Update stats with actual data
      setStats({
        totalUsers: usersData.length,
        totalProfiles: profilesData.length,
        totalProjects: projectsData.length,
        totalCourses: coursesData.length
      });

    } catch (err) {
      setError('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user, fetchAdminData]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setUsers(users.filter(user => user._id !== userId));
          setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
        }
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/v1/project/delete/${projectId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setProjects(projects.filter(project => project._id !== projectId));
          setStats(prev => ({ ...prev, totalProjects: prev.totalProjects - 1 }));
        }
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    setUploadForm(prev => ({
      ...prev,
      [field]: files
    }));
  };

  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...uploadForm.categories];
    newCategories[index][field] = value;
    setUploadForm(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  const addCategory = () => {
    setUploadForm(prev => ({
      ...prev,
      categories: [...prev.categories, { title: '', liveLink: '' }]
    }));
  };

  const removeCategory = (index) => {
    setUploadForm(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const handleContentUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Add carousel images
      uploadForm.coursolImages.forEach(file => {
        formData.append('coursolImages', file);
      });

      // Add category images
      uploadForm.categoryImages.forEach(file => {
        formData.append('categoryImages', file);
      });

      // Add categories as JSON string
      formData.append('categories', JSON.stringify(uploadForm.categories));

      const response = await fetch('http://localhost:5000/api/v1/admin/content', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        // Reset form and refresh data
        setUploadForm({
          coursolImages: [],
          categoryImages: [],
          categories: [{ title: '', liveLink: '' }]
        });
        fetchAdminData();
        alert('Content uploaded successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to upload content');
      }
    } catch (err) {
      setError('Failed to upload content');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCarousel = async (carouselId) => {
    if (window.confirm('Are you sure you want to delete this carousel item?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/v1/admin/carousel/${carouselId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setCarouselContent(prev => prev.filter(item => item._id !== carouselId));
        }
      } catch (err) {
        setError('Failed to delete carousel item');
      }
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access the admin dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, profiles, projects, and courses</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaUsers /> Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FaUsers /> Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profiles' ? 'active' : ''}`}
          onClick={() => setActiveTab('profiles')}
        >
          <FaCertificate /> Profiles
        </button>
        <button 
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <FaProjectDiagram /> Projects
        </button>
        <button 
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <FaGraduationCap /> Courses
        </button>
        <button 
          className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          <FaImages /> Content
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="admin-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaCertificate />
              </div>
              <div className="stat-content">
                <h3>{stats.totalProfiles}</h3>
                <p>Active Profiles</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaProjectDiagram />
              </div>
              <div className="stat-content">
                <h3>{stats.totalProjects}</h3>
                <p>Total Projects</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaGraduationCap />
              </div>
              <div className="stat-content">
                <h3>{stats.totalCourses}</h3>
                <p>Available Courses</p>
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-time">2 hours ago</span>
                <span className="activity-text">New user registered: {users[0]?.fullName || 'Unknown'}</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">4 hours ago</span>
                <span className="activity-text">New project added: {projects[0]?.title || 'Unknown'}</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">1 day ago</span>
                <span className="activity-text">Profile updated: {profiles[0]?.user?.fullName || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-users">
          <div className="section-header">
            <h2>All Users</h2>
            <button className="btn btn-primary">
              <FaPlus /> Add User
            </button>
          </div>
          <div className="users-grid">
            {users.map(user => (
              <div key={user._id} className="user-card">
                <div className="user-avatar">
                  <FaUser />
                </div>
                <div className="user-info">
                  <h4>{user.fullName}</h4>
                  <p>{user.email}</p>
                  <p className="user-role">{user.role}</p>
                </div>
                <div className="user-actions">
                  <button className="btn btn-sm btn-outline">
                    <FaEye /> View
                  </button>
                  <button className="btn btn-sm btn-outline">
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profiles Tab */}
      {activeTab === 'profiles' && (
        <div className="admin-profiles">
          <div className="section-header">
            <h2>All Profiles</h2>
          </div>
          <div className="profiles-grid">
            {profiles.map(profile => (
              <div key={profile._id} className="profile-card">
                <div className="profile-image">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" />
                  ) : (
                    <FaUser />
                  )}
                </div>
                <div className="profile-info">
                  <h4>{profile.user?.fullName || 'Unknown'}</h4>
                  <p><strong>Profession:</strong> {profile.profession}</p>
                  <p><strong>Experience:</strong> {profile.yearsOfExperience} years</p>
                  <p><strong>Skills:</strong> {profile.skills?.join(', ') || 'None'}</p>
                </div>
                <div className="profile-actions">
                  <button className="btn btn-sm btn-outline">
                    <FaEye /> View
                  </button>
                  <button className="btn btn-sm btn-outline">
                    <FaEdit /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="admin-projects">
          <div className="section-header">
            <h2>All Projects</h2>
          </div>
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project._id} className="project-card">
                <div className="project-thumbnail">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt="Project" />
                  ) : (
                    <FaProjectDiagram />
                  )}
                </div>
                <div className="project-info">
                  <h4>{project.title}</h4>
                  <p><strong>Summary:</strong> {project.summary}</p>
                  <p><strong>Skills:</strong> {project.skills?.join(', ') || 'None'}</p>
                  <p><strong>By:</strong> {project.user?.fullName || 'Unknown'}</p>
                </div>
                <div className="project-actions">
                  <button className="btn btn-sm btn-outline">
                    <FaEye /> View
                  </button>
                  <button className="btn btn-sm btn-outline">
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="admin-courses">
          <div className="section-header">
            <h2>All Courses</h2>
            <button className="btn btn-primary">
              <FaPlus /> Add Course
            </button>
          </div>
          <div className="courses-grid">
            {courses.length > 0 ? (
              courses.map(course => (
                <div key={course._id} className="course-card">
                  <div className="course-image">
                    {course.image ? (
                      <img src={course.image} alt="Course" />
                    ) : (
                      <FaGraduationCap />
                    )}
                  </div>
                  <div className="course-info">
                    <h4>{course.title}</h4>
                    <p>{course.description}</p>
                    <p><strong>Category:</strong> {course.category}</p>
                    <p><strong>Duration:</strong> {course.duration}</p>
                  </div>
                  <div className="course-actions">
                    <button className="btn btn-sm btn-outline">
                      <FaEye /> View
                    </button>
                    <button className="btn btn-sm btn-outline">
                      <FaEdit /> Edit
                    </button>
                    <button className="btn btn-sm btn-danger">
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-courses">
                <FaGraduationCap />
                <h3>No Courses Available</h3>
                <p>Start by adding some courses to the platform</p>
                <button className="btn btn-primary">
                  <FaPlus /> Add First Course
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Management Tab */}
      {activeTab === 'content' && (
        <div className="admin-content">
          <div className="section-header">
            <h2>Content Management</h2>
            <p>Upload carousel images and manage categories</p>
          </div>

          {/* Upload Form */}
          <div className="upload-section">
            <h3>Upload New Content</h3>
            <form onSubmit={handleContentUpload} className="content-upload-form">
              <div className="form-group">
                <label>Carousel Images:</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'coursolImages')}
                  className="file-input"
                />
                <small>Select multiple carousel images</small>
              </div>

              <div className="form-group">
                <label>Category Images:</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'categoryImages')}
                  className="file-input"
                />
                <small>Select multiple category images</small>
              </div>

              <div className="form-group">
                <label>Categories:</label>
                {uploadForm.categories.map((category, index) => (
                  <div key={index} className="category-input-group">
                    <input
                      type="text"
                      placeholder="Category Title"
                      value={category.title}
                      onChange={(e) => handleCategoryChange(index, 'title', e.target.value)}
                      className="category-input"
                    />
                    <input
                      type="url"
                      placeholder="Live Link"
                      value={category.liveLink}
                      onChange={(e) => handleCategoryChange(index, 'liveLink', e.target.value)}
                      className="category-input"
                    />
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="btn btn-sm btn-danger"
                      disabled={uploadForm.categories.length === 1}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCategory}
                  className="btn btn-sm btn-outline"
                >
                  <FaPlus /> Add Category
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Content'}
              </button>
            </form>
          </div>

          {/* Existing Content */}
          <div className="existing-content">
            <h3>Existing Carousel Content</h3>
            <div className="carousel-grid">
              {carouselContent.length > 0 ? (
                carouselContent.map((item, index) => (
                  <div key={item._id || index} className="carousel-item-card">
                    <div className="carousel-image">
                      {item.image ? (
                        <img src={item.image} alt={`Carousel ${index + 1}`} />
                      ) : (
                        <FaImages />
                      )}
                    </div>
                    <div className="carousel-info">
                      <h4>Carousel Item {index + 1}</h4>
                      <p><strong>Type:</strong> {item.type || 'Carousel'}</p>
                      {item.category && (
                        <p><strong>Category:</strong> {item.category.title}</p>
                      )}
                    </div>
                    <div className="carousel-actions">
                      <button className="btn btn-sm btn-outline">
                        <FaEye /> View
                      </button>
                      <button className="btn btn-sm btn-outline">
                        <FaEdit /> Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteCarousel(item._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-content">
                  <FaImages />
                  <h3>No Carousel Content</h3>
                  <p>Start by uploading some carousel images and categories</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

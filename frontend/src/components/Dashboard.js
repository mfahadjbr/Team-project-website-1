import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEdit, FaPlus, FaProjectDiagram, FaCertificate } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchProjects();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/profile/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.data);
      } else if (response.status === 404) {
        // Profile doesn't exist yet
        setProfile(null);
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Failed to fetch profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/project/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // The API returns: { status: true, message: "...", data: { projects: [...], count: 2 } }
        const projectsData = data.data?.projects || [];
        setProjects(projectsData);
      }
    } catch (err) {
      console.error('Failed to fetch projects for dashboard:', err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.fullName}!</h1>
        <p>Manage your learning profile and track your progress</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="dashboard-grid">
        {/* Profile Status Card */}
        <div className="dashboard-card profile-status">
          <div className="card-header">
            <FaUser className="card-icon" />
            <h3>Profile Status</h3>
          </div>
          <div className="card-content">
            {profile ? (
              <div className="status-success">
                <h4>Profile Complete</h4>
                <p>Your profile is set up and ready to showcase your skills!</p>
                <div className="profile-details">
                  <p><strong>Profession:</strong> {profile.profession}</p>
                  <p><strong>Experience:</strong> {profile.yearsOfExperience} years</p>
                  <p><strong>Skills:</strong> {profile.skills?.join(', ') || 'None specified'}</p>
                </div>
              </div>
            ) : (
              <div className="status-incomplete">
                <h4>Profile Incomplete</h4>
                <p>Complete your profile to showcase your skills and experience</p>
                <button className="btn btn-primary">
                  <FaPlus />
                  Create Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card quick-actions">
          <div className="card-header">
            <FaEdit className="card-icon" />
            <h3>Quick Actions</h3>
          </div>
          <div className="card-content">
            <div className="action-buttons">
              {profile ? (
                <>
                  <button className="btn btn-outline" onClick={() => navigate('/profile')}>
                    <FaEdit />
                    Edit Profile
                  </button>
                  <button className="btn btn-outline" onClick={() => navigate('/profile')}>
                    <FaCertificate />
                    Add Certificates
                  </button>
                  <button className="btn btn-outline" onClick={() => navigate('/projects')}>
                    <FaProjectDiagram />
                    Manage Projects
                  </button>
                </>
              ) : (
                <button className="btn btn-primary">
                  <FaPlus />
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="dashboard-card stats">
          <div className="card-header">
            <FaProjectDiagram className="card-icon" />
            <h3>Your Stats</h3>
          </div>
          <div className="card-content">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{profile ? '1' : '0'}</span>
                <span className="stat-label">Profiles</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{projects.length}</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{profile?.certificates?.length || 0}</span>
                <span className="stat-label">Certificates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="dashboard-card recent-activity">
          <div className="card-header">
            <FaUser className="card-icon" />
            <h3>Recent Activity</h3>
          </div>
          <div className="card-content">
            {profile ? (
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-date">Today</span>
                  <span className="activity-text">Profile created successfully</span>
                </div>
                <div className="activity-item">
                  <span className="activity-date">Today</span>
                  <span className="activity-text">Account verified with OTP</span>
                </div>
              </div>
            ) : (
              <div className="no-activity">
                <p>No recent activity</p>
                <p>Complete your profile to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Welcome Message for New Users */}
      {!profile && (
        <div className="welcome-section">
          <div className="welcome-card">
            <h2>🎉 Welcome to Community Learning Platform!</h2>
            <p>You're just a few steps away from showcasing your skills and connecting with other learners.</p>
            <div className="welcome-steps">
              <div className="step">
                <span className="step-number">1</span>
                <div className="step-content">
                  <h4>Complete Your Profile</h4>
                  <p>Add your profession, skills, and experience</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h4>Upload Certificates</h4>
                  <p>Showcase your achievements and qualifications</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h4>Share Projects</h4>
                  <p>Display your work and get feedback</p>
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-large" onClick={() => navigate('/profile')}>
              <FaPlus />
              Create Your Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

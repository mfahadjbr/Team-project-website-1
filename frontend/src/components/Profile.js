import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEdit, FaSave, FaTimes, FaUpload, FaTrash } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    profession: '',
    skills: '',
    description: '',
    yearsOfExperience: '',
    linkedin: '',
    github: '',
    fiverr: '',
    whatsapp: ''
  });

  const [files, setFiles] = useState({
    profileImage: null,
    certificates: [null, null, null]
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // Debug: Log files state changes
  useEffect(() => {
    console.log('Files state changed:', files);
  }, [files]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/v1/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.data);
        // Populate form data
        setFormData({
          profession: data.data.profession || '',
          skills: data.data.skills?.join(', ') || '',
          description: data.data.description || '',
          yearsOfExperience: data.data.yearsOfExperience || '',
          linkedin: data.data.linkedin || '',
          github: data.data.github || '',
          fiverr: data.data.fiverr || '',
          whatsapp: data.data.whatsapp || ''
        });
      } else if (response.status === 404) {
        setProfile(null);
      } else if (response.status === 401 || response.status === 403) {
        setError('Authentication failed. Please log in again.');
        // Clear invalid token
        localStorage.removeItem('token');
        // You might want to redirect to login here
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Failed to fetch profile. Please try again.');
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

  const handleFileChange = (e, type, index) => {
    console.log('handleFileChange called:', { type, files: e.target.files });
    
    if (type === 'profileImage') {
      const selectedFile = e.target.files[0];
      console.log('Profile image selected:', selectedFile);
      setFiles({
        ...files,
        profileImage: selectedFile
      });
    } else if (type === 'certificates') {
      const selectedFile = e.target.files[0];
      console.log('Certificate selected:', selectedFile);
      
      setFiles(prevFiles => {
        const newCertificates = [...prevFiles.certificates];
        newCertificates[index] = selectedFile;
        return {
          ...prevFiles,
          certificates: newCertificates
        };
      });
    }
    
    // Log the updated files state
    setTimeout(() => {
      console.log('Updated files state:', files);
    }, 100);
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
        if (formData[key]) {
          if (key === 'skills') {
            // Convert skills string to array
            const skillsArray = formData[key].split(',').map(skill => skill.trim()).filter(skill => skill);
            formDataToSend.append(key, JSON.stringify(skillsArray));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Add files
      if (files.profileImage) {
        formDataToSend.append('profileImage', files.profileImage);
      }
      
      // Check if all 3 certificates are selected
      if (files.certificates.every(cert => cert !== null)) {
        files.certificates.forEach((cert, index) => {
          formDataToSend.append('certificates', cert);
        });
      } else {
        throw new Error('Please upload all 3 certificates');
      }

      const url = profile ? 
        `http://localhost:5000/api/v1/profile/update/${profile._id}` :
        'http://localhost:5000/api/v1/profile/add';

      const method = profile ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Profile saved successfully!');
        setProfile(data.data || data.profile);
        setEditing(false);
        setFiles({ profileImage: null, certificates: [null, null, null] });
        // Refresh profile data
        fetchProfile();
      } else if (response.status === 401 || response.status === 403) {
        setError('Authentication failed. Please log in again.');
        localStorage.removeItem('token');
        // You might want to redirect to login here
      } else {
        setError(data.message || 'Failed to save profile');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form data to current profile
    if (profile) {
      setFormData({
        profession: profile.profession || '',
        skills: profile.skills?.join(', ') || '',
        description: profile.description || '',
        yearsOfExperience: profile.yearsOfExperience || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        fiverr: profile.fiverr || '',
        whatsapp: profile.whatsapp || ''
      });
    }
    setFiles({ profileImage: null, certificates: [null, null, null] });
  };

  if (loading && !profile) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Profile Management</h1>
        <p>Manage your professional profile and showcase your skills</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          {error.includes('Authentication failed') && (
            <div style={{ marginTop: '10px' }}>
              <button 
                onClick={() => window.location.href = '/login'} 
                className="btn btn-primary"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="profile-container">
        {!profile && !editing ? (
          // No profile exists - show create form
          <div className="profile-form-container">
            <div className="form-header">
              <h2>Create Your Profile</h2>
              <p>Let's get started by creating your professional profile</p>
            </div>
            <ProfileForm
              formData={formData}
              files={files}
              profile={null}
              onInputChange={handleInputChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
              loading={loading}
              isCreate={true}
            />
          </div>
        ) : profile && !editing ? (
          // Profile exists - show view mode
          <div className="profile-view">
            <div className="profile-actions">
              <button 
                onClick={() => setEditing(true)}
                className="btn btn-primary"
              >
                <FaEdit />
                Edit Profile
              </button>
            </div>
            
            <div className="profile-content">
              <div className="profile-section">
                <h3>Basic Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name:</label>
                    <span>{user?.fullName}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{user?.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Profession:</label>
                    <span>{profile.profession}</span>
                  </div>
                  <div className="info-item">
                    <label>Experience:</label>
                    <span>{profile.yearsOfExperience} years</span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Skills & Description</h3>
                <div className="skills-list">
                  {profile.skills?.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <p className="description">{profile.description}</p>
              </div>

              <div className="profile-section">
                <h3>Social Links</h3>
                <div className="social-links">
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                      LinkedIn
                    </a>
                  )}
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="social-link">
                      GitHub
                    </a>
                  )}
                  {profile.fiverr && (
                    <a href={profile.fiverr} target="_blank" rel="noopener noreferrer" className="social-link">
                      Fiverr
                    </a>
                  )}
                  {profile.whatsapp && (
                    <span className="social-link">WhatsApp: {profile.whatsapp}</span>
                  )}
                </div>
              </div>

              {profile.profileImage && (
                <div className="profile-section">
                  <h3>Profile Image</h3>
                  <img src={profile.profileImage} alt="Profile" className="profile-image" />
                </div>
              )}

              {profile.certificates && profile.certificates.length === 3 && (
                <div className="profile-section">
                  <h3>Certificates</h3>
                  <div className="certificates-grid">
                    {profile.certificates.map((cert, index) => (
                      <div key={index} className="certificate-item">
                        <img src={cert} alt={`Certificate ${index + 1}`} className="certificate-image" />
                        <div className="certificate-info">
                          <span className="certificate-number">Certificate {index + 1}</span>
                          <a 
                            href={cert} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="view-certificate"
                          >
                            View Full Size
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Editing mode
          <div className="profile-form-container">
            <div className="form-header">
              <h2>Edit Profile</h2>
              <p>Update your profile information</p>
            </div>
            <ProfileForm
              formData={formData}
              files={files}
              profile={profile}
              onInputChange={handleInputChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              isCreate={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Profile Form Component
const ProfileForm = ({ 
  formData, 
  files, 
  profile,
  onInputChange, 
  onFileChange, 
  onSubmit, 
  onCancel, 
  loading, 
  isCreate 
}) => {
  // Safety check to ensure profile is defined when needed for editing
  if (!isCreate && !profile) {
    return <div>Loading profile data...</div>;
  }

  // For create mode, profile will be null, which is expected

  const professions = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Software Engineer',
    'Mobile App Developer (iOS/Android)',
    'DevOps Engineer',
    'Cloud Engineer',
    'UI/UX Designer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Cybersecurity Analyst',
    'Network Engineer',
    'Database Administrator',
    'QA Engineer',
    'Technical Writer',
    'Business Analyst',
    'Project Manager'
  ];

  return (
    <form onSubmit={onSubmit} className="profile-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="profession" className="form-label">Profession *</label>
          <select
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={onInputChange}
            className="form-input"
            required
          >
            <option value="">Select your profession</option>
            {professions.map(prof => (
              <option key={prof} value={prof}>{prof}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="yearsOfExperience" className="form-label">Years of Experience *</label>
          <input
            type="number"
            id="yearsOfExperience"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={onInputChange}
            className="form-input"
            min="0"
            max="50"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="skills" className="form-label">Skills</label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={onInputChange}
          className="form-input"
          placeholder="e.g., JavaScript, React, Node.js, MongoDB"
        />
        <small className="form-help">Separate skills with commas</small>
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
          placeholder="Tell us about your professional background, expertise, and what you're passionate about..."
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="linkedin" className="form-label">LinkedIn Profile *</label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={onInputChange}
            className="form-input"
            placeholder="https://linkedin.com/in/yourprofile"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="github" className="form-label">GitHub Profile</label>
          <input
            type="url"
            id="github"
            name="github"
            value={formData.github}
            onChange={onInputChange}
            className="form-input"
            placeholder="https://github.com/yourusername"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fiverr" className="form-label">Fiverr Profile</label>
          <input
            type="url"
            id="fiverr"
            name="fiverr"
            value={formData.fiverr}
            onChange={onInputChange}
            className="form-input"
            placeholder="https://fiverr.com/yourprofile"
          />
        </div>

        <div className="form-group">
          <label htmlFor="whatsapp" className="form-label">WhatsApp Number</label>
          <input
            type="text"
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={onInputChange}
            className="form-input"
            placeholder="+1234567890"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="profileImage" className="form-label">Profile Image</label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            onChange={(e) => onFileChange(e, 'profileImage')}
            className="form-input"
            accept="image/*"
          />
          <small className="form-help">Max 5MB, JPG, PNG, GIF</small>
          
          {/* Profile image preview */}
          {files.profileImage && (
            <div className="profile-image-preview">
              <h4>Selected Image:</h4>
              <div className="image-preview">
                <img 
                  src={URL.createObjectURL(files.profileImage)} 
                  alt="Profile preview" 
                  className="preview-image"
                />
                <div className="image-info">
                  <span className="file-name">{files.profileImage.name}</span>
                  <span className="file-size">({(files.profileImage.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Show current profile image if editing */}
          {!isCreate && profile && profile.profileImage && (
            <div className="current-profile-image">
              <h4>Current Profile Image:</h4>
              <div className="current-image-display">
                <img src={profile.profileImage} alt="Current Profile" className="current-profile-preview" />
                <span className="image-label">Current Image</span>
              </div>
              <small className="form-help">New image will replace the current one</small>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Certificates (Upload all 3) *</label>
          <div className="certificate-inputs">
            {[0, 1, 2].map((index) => (
              <div key={index} className="certificate-input-group">
                <label htmlFor={`certificate${index + 1}`}>Certificate {index + 1} *</label>
                <input
                  type="file"
                  id={`certificate${index + 1}`}
                  name={`certificate${index + 1}`}
                  onChange={(e) => onFileChange(e, 'certificates', index)}
                  className="form-input"
                  accept="image/*"
                  required={!files.certificates[index]}
                />
                {files.certificates[index] && (
                  <div className="certificate-preview">
                    <img 
                      src={URL.createObjectURL(files.certificates[index])} 
                      alt={`Certificate ${index + 1} preview`} 
                      className="certificate-thumbnail"
                    />
                    <div className="file-info">
                      <span className="file-name">{files.certificates[index].name}</span>
                      <span className="file-size">
                        ({(files.certificates[index].size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <small className="form-help">Max 5MB each, JPG, PNG, GIF</small>
          
          {/* Show current certificates if editing */}
          {!isCreate && profile && profile.certificates && profile.certificates.length === 3 && (
            <div className="current-certificates">
              <h4>Current Certificates:</h4>
              <div className="current-certificates-grid">
                {profile.certificates.map((cert, index) => (
                  <div key={index} className="current-certificate">
                    <img src={cert} alt={`Current Certificate ${index + 1}`} className="current-cert-image" />
                    <span className="cert-label">Certificate {index + 1}</span>
                  </div>
                ))}
              </div>
              <small className="form-help">New certificates will replace the current ones</small>
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || files.certificates.includes(null)}
        >
          {loading ? (
            <>
              <div className="spinner-small"></div>
              {isCreate ? 'Creating...' : 'Saving...'}
            </>
          ) : (
            <>
              <FaSave />
              {isCreate ? 'Create Profile' : 'Save Changes'}
            </>
          )}
        </button>
        
        {!isCreate && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            <FaTimes />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default Profile;

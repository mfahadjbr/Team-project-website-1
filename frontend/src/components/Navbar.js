import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaUserPlus, FaLeaf } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FaLeaf className="brand-icon" />
          <span className="brand-text ">Programming Community</span>
        </Link>

        <div className="navbar-center">
          <Link to="/courses" className="nav-link">Courses</Link>
          <Link to="/testimonials" className="nav-link">Testimonials</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>

        <div className="navbar-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

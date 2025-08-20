import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaKey, FaClock } from 'react-icons/fa';
import './Auth.css';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP, resendOTP } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [email, location.state, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the OTP code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyOTP(email, otp);
      
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      const result = await resendOTP(email);
      
      if (result.success) {
        setSuccess(result.message);
        setCountdown(60); // 60 seconds cooldown
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <div className="auth-header">
          <h1>Verify Your Email</h1>
          <p>We've sent a verification code to {email}</p>
        </div>

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="otp" className="form-label">
              <FaKey className="input-icon" />
              Verification Code
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              className="form-input otp-input"
              placeholder="Enter 6-digit code"
              maxLength="6"
              required
            />
            <small className="form-help">
              Enter the 6-digit code sent to your email
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading || !otp.trim()}
          >
            {loading ? (
              <>
                <div className="spinner-small"></div>
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button
              onClick={handleResendOTP}
              className="btn btn-outline"
              disabled={resendLoading || countdown > 0}
            >
              {resendLoading ? (
                <>
                  <div className="spinner-small"></div>
                  Sending...
                </>
              ) : countdown > 0 ? (
                <>
                  <FaClock />
                  Resend in {countdown}s
                </>
              ) : (
                <>
                  <FaEnvelope />
                  Resend Code
                </>
              )}
            </button>
          </div>
          
          <p>
            <button
              onClick={() => navigate('/register')}
              className="auth-link-btn"
            >
              Use different email
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import SEO from '../components/common/SEO';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Full name is required';
    }
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please provide a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register({ name, email, password });
      toast.success('Account created successfully!', { toastId: 'register-success' });
    } catch (error) {
      console.error('Registration error details:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg, { toastId: 'register-error' });
    }
  };

  return (
    <>
      <Header />
      <div className="register-page-wrapper d-flex align-items-center justify-content-center py-5">
        <SEO
          title="Sign Up | SHOP.CO"
          description="Create a new SHOP.CO account to access personalized shopping collections and order histories."
        />
        <div className="register-card p-4 p-md-5 rounded shadow-sm bg-white">
          <div className="text-center mb-4">
            <h2 className="fw-bold heading-integral mb-2">Create Account</h2>
            <p className="text-muted" style={{ fontSize: '14px' }}>Sign up today to discover exclusive style collections.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold text-dark">Full Name</label>
              <input
                type="text"
                id="name"
                className={`form-control rounded-pill px-3 py-2 ${formErrors.name ? 'is-invalid' : ''}`}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              {formErrors.name && <div className="invalid-feedback ps-2">{formErrors.name}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold text-dark">Email Address</label>
              <input
                type="email"
                id="email"
                className={`form-control rounded-pill px-3 py-2 ${formErrors.email ? 'is-invalid' : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              {formErrors.email && <div className="invalid-feedback ps-2">{formErrors.email}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold text-dark">Password</label>
              <input
                type="password"
                id="password"
                className={`form-control rounded-pill px-3 py-2 ${formErrors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {formErrors.password && <div className="invalid-feedback ps-2">{formErrors.password}</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label fw-semibold text-dark">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className={`form-control rounded-pill px-3 py-2 ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              {formErrors.confirmPassword && <div className="invalid-feedback ps-2">{formErrors.confirmPassword}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 rounded-pill py-2 fw-semibold mb-3 d-flex justify-content-center align-items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
              Already have an account? <Link to="/login" className="text-dark fw-bold text-decoration-none">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;

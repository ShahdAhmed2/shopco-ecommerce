import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import SEO from '../components/common/SEO';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const { login, isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to appropriate page
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const data = await login({ email, password });
      toast.success(`Welcome back, ${data.name}!`, { toastId: 'login-success' });
    } catch (error) {
      console.error('Login error details:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMsg, { toastId: 'login-error' });
    }
  };

  return (
    <>
      <Header />
      <div className="login-page-wrapper d-flex align-items-center justify-content-center py-5">
        <SEO 
          title="Sign In | SHOP.CO" 
          description="Log into your SHOP.CO account to access shopping history, cart details, and profile configurations."
        />
        <div className="login-card p-4 p-md-5 rounded shadow-sm bg-white">
          <div className="text-center mb-4">
            <h2 className="fw-bold heading-integral mb-2">Sign In</h2>
            <p className="text-muted" style={{ fontSize: '14px' }}>Welcome back! Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
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

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label htmlFor="password" className="form-label fw-semibold text-dark mb-0">Password</label>
              </div>
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

            <button
              type="submit"
              className="btn btn-dark w-100 rounded-pill py-2 fw-semibold mb-3 d-flex justify-content-center align-items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
              Don't have an account? <Link to="/register" className="text-dark fw-bold text-decoration-none">Sign Up Now</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;

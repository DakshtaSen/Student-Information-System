import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail: formData.email,
          adminPassword: formData.password,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store token and user role in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', formData.role);
        
        // Redirect based on role
        switch (formData.role) {
          case 'SUPERADMIN':
            navigate('/superadmin-dashboard');
            break;
          case 'PI':
            navigate('/pi-dashboard');
            break;
          case 'BM':
            navigate('/bm-dashboard');
            break;
          default:
            navigate('/login');
        }
      } else {
        setErrors({
          submit: data.message || 'Login failed. Please check your credentials.'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        submit: 'Login failed. Please check if the server is running and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`role-select ${errors.role ? 'error' : ''}`}
            >
              <option value="">Select Role</option>
              <option value="SUPERADMIN">Super Admin</option>
              <option value="PI">Program Incharge</option>
              <option value="BM">Batch Mentor</option>
            </select>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>

          {errors.submit && <span className="error-message">{errors.submit}</span>}

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-link">
          <h3>Don't have an account?</h3>
          <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login; 
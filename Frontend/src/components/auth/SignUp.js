import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    course: '',
    batch: '',
    mobileNo: '',
  });

  const [errors, setErrors] = useState({});

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
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.mobileNo) {
      newErrors.mobileNo = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Invalid mobile number';
    }
    if (!formData.role) newErrors.role = 'Role is required';
    if (formData.role !== 'SUPERADMIN' && !formData.course) newErrors.course = 'Course is required';
    if (formData.role === 'BM' && !formData.batch) newErrors.batch = 'Batch is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminName: formData.name,
          adminEmail: formData.email,
          adminPassword: formData.password,
          adminMobileNo: formData.mobileNo,
          adminRole: formData.role,
          course: formData.role !== 'SUPERADMIN' ? formData.course : null,
          batch: formData.role === 'BM' ? formData.batch : null,
        }),
      });

      if (response.ok) {
        alert('Registration successful! Please wait for Super Admin approval.');
        navigate('/login');
      } else {
        const data = await response.text();
        alert(data || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

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
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="mobileNo"
              placeholder="Mobile Number"
              value={formData.mobileNo}
              onChange={handleChange}
              className={errors.mobileNo ? 'error' : ''}
            />
            {errors.mobileNo && <span className="error-message">{errors.mobileNo}</span>}
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

          {formData.role !== 'SUPERADMIN' && (
            <div className="form-group">
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={`role-select ${errors.course ? 'error' : ''}`}
              >
                <option value="">Select Course</option>
                <option value="MCA">MCA</option>
                <option value="MTECH">MTECH</option>
                <option value="MBA">MBA</option>
                <option value="Bcom">Bcom</option>
              </select>
              {errors.course && <span className="error-message">{errors.course}</span>}
            </div>
          )}

          {formData.role === 'BM' && (
            <div className="form-group">
              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className={`role-select ${errors.batch ? 'error' : ''}`}
              >
                <option value="">Select Batch</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
              {errors.batch && <span className="error-message">{errors.batch}</span>}
            </div>
          )}

          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <p className="auth-link">
          <h3> Already have an account?</h3> <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp; 
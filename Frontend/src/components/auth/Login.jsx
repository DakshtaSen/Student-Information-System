import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { useTheme } from '../../context/ThemeContext';
import './Auth.css';

const Login = () => {
  // const { isDarkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
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

    try {
      // Add your API call here
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className='mainbody'>
            <div className="mainheader">
                <div className='clglogo'>
                    <img src='/public/images/iips_logo.png' alt='logo' />
                </div>
                <div className='clgdescription'>
                    <h2>
                        Takshashila Campus<br />
                        Khandwa Road <br />
                        Indore(M.P)<br />
                        452001
                    </h2>
                </div>
                </div>
                
    <div className="auth-container">
      {/* <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button> */}
      <div className="auth-card">
        <h2>Welcome Back</h2>
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

          <button type="submit" className="auth-button">Login</button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Login; 
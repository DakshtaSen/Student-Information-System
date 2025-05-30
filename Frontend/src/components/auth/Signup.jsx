import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { useTheme } from '../../context/ThemeContext';
import './Auth.css';

const Signup = () => {
    // const { isDarkMode, toggleTheme } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
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
            
            console.log('Form submitted:', formData);
            alert('Signup successful!');
            
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: ''
            });
        } catch (error) {
            console.error('Signup error:', error);
            alert('Something went wrong! Please try again.');
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
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="role-select"
                            >
                                <option value="" disabled>Role</option>
                                <option value="PROGRAM_INCHARGE">Program Incharge</option>
                                <option value="BATCH_MENTOR">Batch Mentor</option>
                            </select>
                        </div>

                        <button type="submit" className="auth-button">Sign Up</button>
                    </form>
                    <p className="auth-link">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

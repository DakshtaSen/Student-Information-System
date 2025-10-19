
//checks email duplication

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Container, Paper, Typography, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, useTheme,
  Grid, Avatar, IconButton, InputAdornment
} from '@mui/material';
import { ColorModeContext } from '../../App';

import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import ClassIcon from '@mui/icons-material/Class';
import GroupsIcon from '@mui/icons-material/Groups';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
const baseURL = "https://student-information-system-production-2d2c.up.railway.app";

const SignUp = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [formData, setFormData] = useState({
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
    adminRole: '',
    adminMobileNo: '',
    course: '',
    batch: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.adminName.trim()) newErrors.adminName = 'Name is required';
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Invalid email format';
    }
    if (!formData.adminPassword || formData.adminPassword.length < 6) {
      newErrors.adminPassword = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword || formData.adminPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.adminMobileNo || !/^\d{10}$/.test(formData.adminMobileNo)) {
      newErrors.adminMobileNo = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.adminRole) newErrors.adminRole = 'Role is required';
    if (formData.adminRole !== 'SUPERADMIN' && !formData.course) {
      newErrors.course = 'Course is required';
    }
    if (formData.adminRole === 'BatchMentor' && !formData.batch) {
      newErrors.batch = 'Batch is required';
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
      const response = await axios.post(
        `${baseURL}/api/admin/signup`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );


      if (response.status === 200 || response.status === 201) {
        alert('Registration successful! Awaiting approval.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMsg =
        error.response?.data?.message?.toLowerCase() ||
        error.response?.data?.error?.toLowerCase() ||
        '';

      if (
        error.response?.status === 409 ||
        errorMsg.includes('email already in use') ||
        errorMsg.includes('email exists') ||
        errorMsg.includes('duplicate')
      ) {
        setErrors({ adminEmail: 'Email is already registered' });
      } else {
        const fallback = error.response?.data?.message || 'Signup failed.';
        setErrors({ submit: fallback });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(179deg, #323232 8%, #abb0d3 100%)'
        : 'linear-gradient(179deg, #2a5298 0%, #5f5656 100%)',
      py: 4,
    }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
        }}>
          <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: theme.palette.primary.main }}>
            <SchoolIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Create Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Full Name" name="adminName"
                  value={formData.adminName} onChange={handleChange}
                  error={!!errors.adminName} helperText={errors.adminName} required />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Mobile Number" name="adminMobileNo"
                  value={formData.adminMobileNo} onChange={handleChange}
                  error={!!errors.adminMobileNo} helperText={errors.adminMobileNo} required />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Email Address" name="adminEmail"
                  value={formData.adminEmail} onChange={handleChange}
                  error={!!errors.adminEmail} helperText={errors.adminEmail} required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Password" name="adminPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.adminPassword} onChange={handleChange}
                  error={!!errors.adminPassword} helperText={errors.adminPassword} required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Confirm Password" name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword} onChange={handleChange}
                  error={!!errors.confirmPassword} helperText={errors.confirmPassword} required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }} />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.adminRole}>
                  <InputLabel>Role</InputLabel>
                  <Select name="adminRole" value={formData.adminRole} label="Role" onChange={handleChange} required>
                    <MenuItem value="SUPERADMIN">Super Admin</MenuItem>
                    <MenuItem value="PI">Program Incharge</MenuItem>
                    <MenuItem value="BatchMentor">Batch Mentor</MenuItem>
                  </Select>
                  {errors.adminRole && <Typography variant="caption" color="error">{errors.adminRole}</Typography>}
                </FormControl>
              </Grid>

              {formData.adminRole !== 'SUPERADMIN' && (
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.course}>
                    <InputLabel>Course</InputLabel>
                    <Select name="course" value={formData.course} label="Course" onChange={handleChange} required>
                      <MenuItem value="MCA-5yrs">MCA-5yrs</MenuItem>
                      <MenuItem value="MTech (IT)-5yrs">MTech (IT)-5yrs</MenuItem>
                      <MenuItem value="MTech (CS)-5yrs">MTech (CS)-5yrs</MenuItem>
                      <MenuItem value="MBA (MS)-5yrs">MBA (MS)-5yrs</MenuItem>
                      <MenuItem value="MBA (MS)-2yrs">MBA (MS)-2yrs</MenuItem>
                      <MenuItem value="MBA (T)-5yrs">MBA (T)-5yrs</MenuItem>
                      <MenuItem value="MBA (Eship)">MBA (Eship)</MenuItem>
                      <MenuItem value="MBA (APR)">MBA (APR)</MenuItem>
                      <MenuItem value="Bcom (Hons.)">Bcom (HOns.)</MenuItem>
                      <MenuItem value="Phd (Computer)">Phd (Computer)</MenuItem>
                      <MenuItem value="Phd (Management)">Pdh (Management)</MenuItem>
                    </Select>
                    {errors.course && <Typography variant="caption" color="error">{errors.course}</Typography>}
                  </FormControl>
                </Grid>
              )}

              {formData.adminRole === 'BatchMentor' && (
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.batch}>
                    <InputLabel>Batch</InputLabel>
                    <Select name="batch" value={formData.batch} label="Batch" onChange={handleChange} required>
                      <MenuItem value="2026">2026</MenuItem>
                      <MenuItem value="2025">2025</MenuItem>
                      <MenuItem value="2024">2024</MenuItem>
                      <MenuItem value="2023">2023</MenuItem>
                      <MenuItem value="2022">2022</MenuItem>
                      <MenuItem value="2021">2021</MenuItem>
                      <MenuItem value="2020">2020</MenuItem>
                    </Select>
                    {errors.batch && <Typography variant="caption" color="error">{errors.batch}</Typography>}
                  </FormControl>
                </Grid>
              )}
            </Grid>

            {errors.submit && (
              <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                {errors.submit}
              </Typography>
            )}

            <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Button onClick={() => navigate('/login')} sx={{
                  textTransform: 'none',
                  color: 'white',
                  background: 'linear-gradient(38deg, #2a5298 99%, #3e3337 51%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, rgb(64 84 125) 103%, rgb(19 13 15) 90%)'
                  }
                }}>
                  Login
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;

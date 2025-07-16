// import React, { useState, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { 
//   Box, 
//   Container, 
//   Paper, 
//   Typography, 
//   TextField, 
//   Button, 
//   useTheme,
//   Avatar,
//   Grid,
//   IconButton,
//   InputAdornment,
//   CircularProgress
// } from '@mui/material';
// import { ColorModeContext } from '../../App';
// import SchoolIcon from '@mui/icons-material/School';
// import PersonIcon from '@mui/icons-material/Person';
// import LockIcon from '@mui/icons-material/Lock';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import axios from 'axios';

// const Login = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const colorMode = useContext(ColorModeContext);
//   const [formData, setFormData] = useState({
//     adminEmail: '',
//     adminPassword: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.adminEmail.trim()) {
//       newErrors.adminEmail = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
//       newErrors.adminEmail = 'Please enter a valid email address';
//     }
//     if (!formData.adminPassword) {
//       newErrors.adminPassword = 'Password is required';
//     } else if (formData.adminPassword.length < 6) {
//       newErrors.adminPassword = 'Password must be at least 6 characters';
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsLoading(true);
//     setErrors({}); // Clear previous errors

//     try {
//       const response = await axios.post('http://localhost:8080/api/admin/login', {
//         adminEmail: formData.adminEmail,
//         adminPassword: formData.adminPassword,
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//         timeout: 10000 // 10 second timeout
//       });

//       const data = response.data;

//       if (response.status === 200) {
//         // Store token and user role in localStorage
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('userRole', data.role || 'ADMIN');
//         localStorage.setItem('userName', data.name || 'Admin');

//         // Redirect based on backend-provided role
//         switch((data.role || '').toUpperCase()) {
//           case 'SUPERADMIN':
//             navigate('/superadmin-dashboard');
//             break;
//           case 'PI':
//             navigate('/pi-dashboard');
//             break;
//           case 'BM':
//             navigate('/bm-dashboard');
//             break;
//           default:
//             navigate('/dashboard');
//         }
//       }
//     } catch (error) {
//       if (error.code === 'ECONNABORTED') {
//         setErrors({
//           submit: 'Request timed out. Please check your internet connection and try again.'
//         });
//       } else if (!error.response) {
//         setErrors({
//           submit: 'Network error. Please check your internet connection and try again.'
//         });
//       } else {
//         switch (error.response?.status) {
//           case 404:
//             setErrors({
//               submit: 'Account not found. Please check your email address.'
//             });
//             break;
//           case 401:
//             setErrors({
//               submit: 'Invalid email or password. Please try again.'
//             });
//             break;
//           case 403:
//             setErrors({
//               submit: 'Your account has been disabled. Please contact support.'
//             });
//             break;
//           case 429:
//             setErrors({
//               submit: 'Too many login attempts. Please try again later.'
//             });
//             break;
//           case 500:
//             setErrors({
//               submit: 'Server error. Please try again later.'
//             });
//             break;
//           default:
//             setErrors({
//               submit: error.response?.data?.message || 'An unexpected error occurred. Please try again.'
//             });
//         }
//       }
//       console.error('Login error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         background: theme.palette.mode === 'dark' 
//           ? 'linear-gradient(179deg, #030303 8%, #abb0d3 100%);'
//           : 'linear-gradient(179deg, #2a5298 0%, #5f5656 100%);',
//         py: 4
//       }}
//     >
//       <Container maxWidth="sm">
//         <Paper
//           elevation={3}
//           sx={{
//             p: 4,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             background: theme.palette.mode === 'dark' 
//               ? 'rgba(30, 30, 30, 0.95)'
//               : 'rgba(255, 255, 255, 0.95)',
//             backdropFilter: 'blur(10px)',
//             borderRadius: 2
//           }}
//         >
//           <Avatar
//             sx={{
//               width: 80,
//               height: 80,
//               mb: 2,
//               bgcolor: theme.palette.primary.main,
//               boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
//             }}
//           >
//             <SchoolIcon sx={{ fontSize: 40 }} />
//           </Avatar>

//           <Typography 
//             component="h1" 
//             variant="h4" 
//             sx={{ 
//               mb: 3,
//               color: theme.palette.primary.main,
//               fontWeight: 'bold',
//               textAlign: 'center'
//             }}
//           >
//             Welcome Back
//           </Typography>

//           <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   label="Email Address"
//                   name="adminEmail"
//                   type="email"
//                   value={formData.adminEmail}
//                   onChange={handleChange}
//                   error={!!errors.adminEmail}
//                   helperText={errors.adminEmail}
//                   InputProps={{
//                     startAdornment: <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       '&:hover fieldset': {
//                         borderColor: theme.palette.primary.main,
//                       },
//                     },
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   label="Password"
//                   name="adminPassword"
//                   type={showPassword ? 'text' : 'password'}
//                   value={formData.adminPassword}
//                   onChange={handleChange}
//                   error={!!errors.adminPassword}
//                   helperText={errors.adminPassword}
//                   InputProps={{
//                     startAdornment: <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           aria-label="toggle password visibility"
//                           onClick={handleClickShowPassword}
//                           onMouseDown={handleMouseDownPassword}
//                           edge="end"
//                         >
//                           {showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       '&:hover fieldset': {
//                         borderColor: theme.palette.primary.main,
//                       },
//                     },
//                   }}
//                 />
//               </Grid>

//               {errors.submit && (
//                 <Grid item xs={12}>
//                   <Typography 
//                     color="error" 
//                     variant="body2" 
//                     align="center"
//                     sx={{
//                       backgroundColor: 'rgba(211, 47, 47, 0.1)',
//                       padding: '8px',
//                       borderRadius: '4px',
//                       marginBottom: '8px'
//                     }}
//                   >
//                     {errors.submit}
//                   </Typography>
//                 </Grid>
//               )}

//               <Grid item xs={12}>
//                 <Button
//                   type="submit"
//                   fullWidth
//                   variant="contained"
//                   disabled={isLoading}
//                   sx={{
//                     mt: 2,
//                     mb: 2,
//                     py: 1.5,
//                     position: 'relative',
//                     '&:hover': {
//                       backgroundColor: theme.palette.primary.dark,
//                     },
//                   }}
//                 >
//                   {isLoading ? (
//                     <CircularProgress
//                       size={24}
//                       sx={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         marginTop: '-12px',
//                         marginLeft: '-12px',
//                       }}
//                     />
//                   ) : (
//                     'Login'
//                   )}
//                 </Button>
//               </Grid>

//               <Grid item xs={12}>
//                 <Box sx={{ textAlign: 'center' }}>
//                   <Link 
//                     to="/forgot-password"
//                     style={{
//                       color: theme.palette.primary.main,
//                       textDecoration: 'none',
//                       '&:hover': {
//                         textDecoration: 'underline',
//                       },
//                     }}
//                   >
//                     Forgot Password?
//                   </Link>
//                 </Box>
//               </Grid>

//               <Grid item xs={12}>
//                 <Box sx={{ textAlign: 'center' }}>
//                   <Typography variant="body2" color="text.secondary">
//                     Don't have an account?{' '}
//                     <Button
//                       onClick={() => navigate('/signup')}
//                       sx={{
//                         textTransform: 'none',
//                         color: 'white',
//                         '&:hover': {
//                           background: `linear-gradient(45deg, rgb(64 84 125) 103%, rgb(19 13 15) 90%);`
//                         },
//                         background:' linear-gradient(38deg, #2a5298 99%, #3e3337 51%)',
//                       }}
//                     >
//                       Sign Up
//                     </Button>
//                   </Typography>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Box>
//         </Paper>
//       </Container>
//     </Box>
//   );
// };

// export default Login;




// import React, { useState, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import {
//   Box,
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   useTheme,
//   Avatar,
//   Grid,
//   IconButton,
//   InputAdornment,
//   CircularProgress
// } from '@mui/material';
// import { ColorModeContext } from '../../App';
// import SchoolIcon from '@mui/icons-material/School';
// import PersonIcon from '@mui/icons-material/Person';
// import LockIcon from '@mui/icons-material/Lock';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import axios from 'axios';

// const Login = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const colorMode = useContext(ColorModeContext);
//   const [formData, setFormData] = useState({
//     adminEmail: '',
//     adminPassword: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     // Email validation
//     if (!formData.adminEmail.trim()) {
//       newErrors.adminEmail = 'Email is required';
//     } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.adminEmail)) {
//       newErrors.adminEmail = 'Please enter a valid email address';
//     }
//     // Password validation
//     if (!formData.adminPassword) {
//       newErrors.adminPassword = 'Password is required';
//     } else if (formData.adminPassword.length < 6) {
//       newErrors.adminPassword = 'Password must be at least 6 characters';
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsLoading(true);
//     setErrors({}); // Clear previous errors

//     try {
//       const response = await axios.post(
//         'http://localhost:8080/api/admin/login',
//         {
//           adminEmail: formData.adminEmail,
//           adminPassword: formData.adminPassword,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           withCredentials: true,
//           // timeout: 10000 // (Optional: Can re-add later)
//         }
//       );

//       const data = response.data;

//       // Safely handle response
//       if (response.status === 200 && data.token) {
//         // Log filtered info
//         console.log("Login Success - Role:", data.adminRole, "Name:", data.adminName);

//         // Store token and user info
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('userRole', data.adminRole || 'ADMIN');
//         localStorage.setItem('userName', data.adminName || 'Admin');

//         // Navigate based on role
//         switch ((data.adminRole || '').toUpperCase()) {
//           case 'SUPERADMIN':
//             navigate('/superadmin-dashboard');
//             break;
//           case 'PI':
//             navigate('/pi-dashboard');
//             break;
//           case 'BATCHMENTOR':
//             navigate('/bm-dashboard');
//             break;
//           default:
//             navigate('/dashboard');
//         }
//       } else {
//         console.error("Unexpected response:", response);
//         setErrors({ general: 'Unexpected login response. Please try again.' });
//       }

//     } catch (error) {
//       console.error("Login error:", error);

//       if (error.response) {
//         const status = error.response.status;
//         const message = error.response.data?.error || 'Login failed.';

//         if (status === 403 || status === 401 || status === 404) {
//           setErrors({ general: message });
//         } else if (status === 423 || status === 423) {
//           setErrors({ general: "Account locked. Try again later." });
//         } else {
//           setErrors({ general: "Something went wrong. Try again later." });
//         }
//       } else if (error.code === 'ECONNABORTED') {
//         setErrors({ general: "Request timed out. Server may be down." });
//       } else {
//         setErrors({ general: "Network error. Please check your connection." });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         background: theme.palette.mode === 'dark'
//           ? 'linear-gradient(179deg, #030303 8%, #abb0d3 100%);'
//           : 'linear-gradient(179deg, #2a5298 0%, #5f5656 100%);',
//         py: 4
//       }}
//     >
//       <Container maxWidth="sm">
//         <Paper
//           elevation={3}
//           sx={{
//             p: 4,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             background: theme.palette.mode === 'dark'
//               ? 'rgba(30, 30, 30, 0.95)'
//               : 'rgba(255, 255, 255, 0.95)',
//             backdropFilter: 'blur(10px)',
//             borderRadius: 2
//           }}
//         >
//           <Avatar
//             sx={{
//               width: 80,
//               height: 80,
//               mb: 2,
//               bgcolor: theme.palette.primary.main,
//               boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
//             }}
//           >
//             <SchoolIcon sx={{ fontSize: 40 }} />
//           </Avatar>

//           <Typography
//             component="h1"
//             variant="h4"
//             sx={{
//               mb: 3,
//               color: theme.palette.primary.main,
//               fontWeight: 'bold',
//               textAlign: 'center'
//             }}
//           >
//             Welcome Back
//           </Typography>

//           <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   label="Email Address"
//                   name="adminEmail"
//                   type="email"
//                   value={formData.adminEmail}
//                   onChange={handleChange}
//                   error={!!errors.adminEmail}
//                   helperText={errors.adminEmail}
//                   InputProps={{
//                     startAdornment: <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       '&:hover fieldset': {
//                         borderColor: theme.palette.primary.main,
//                       },
//                     },
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   fullWidth
//                   label="Password"
//                   name="adminPassword"
//                   type={showPassword ? 'text' : 'password'}
//                   value={formData.adminPassword}
//                   onChange={handleChange}
//                   error={!!errors.adminPassword}
//                   helperText={errors.adminPassword}
//                   InputProps={{
//                     startAdornment: <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           aria-label="toggle password visibility"
//                           onClick={handleClickShowPassword}
//                           onMouseDown={handleMouseDownPassword}
//                           edge="end"
//                         >
//                           {showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       '&:hover fieldset': {
//                         borderColor: theme.palette.primary.main,
//                       },
//                     },
//                   }}
//                 />
//               </Grid>

//               {/* {errors.submit && (
//                 <Grid item xs={12}>
//                   <Typography 
//                     color="error" 
//                     variant="body2" 
//                     align="center"
//                     sx={{
//                       backgroundColor: 'rgba(211, 47, 47, 0.1)',
//                       padding: '8px',
//                       borderRadius: '4px',
//                       marginBottom: '8px'
//                     }}
//                   >
//                     {errors.submit}
//                   </Typography>
//                 </Grid>
//               )} */}

//               {errors.general && (
//                 <Grid item xs={12}>
//                   <Typography
//                     color="error"
//                     variant="body2"
//                     align="center"
//                     sx={{
//                       backgroundColor: 'rgba(211, 47, 47, 0.1)',
//                       padding: '8px',
//                       borderRadius: '4px',
//                       marginBottom: '8px'
//                     }}
//                   >
//                     {errors.general}
//                   </Typography>
//                 </Grid>
//               )}


//               <Grid item xs={12}>
//                 <Button
//                   type="submit"
//                   fullWidth
//                   variant="contained"
//                   disabled={isLoading}
//                   sx={{
//                     mt: 2,
//                     mb: 2,
//                     py: 1.5,
//                     position: 'relative',
//                     '&:hover': {
//                       backgroundColor: theme.palette.primary.dark,
//                     },
//                   }}
//                 >
//                   {isLoading ? (
//                     <CircularProgress
//                       size={24}
//                       sx={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         marginTop: '-12px',
//                         marginLeft: '-12px',
//                       }}
//                     />
//                   ) : (
//                     'Login'
//                   )}
//                 </Button>
//               </Grid>

//               <Grid item xs={12}>
//                 <Box sx={{ textAlign: 'center' }}>
//                   <Link
//                     to="/forgot-password"
//                     style={{
//                       color: theme.palette.primary.main,
//                       textDecoration: 'none',
//                       '&:hover': {
//                         textDecoration: 'underline',
//                       },
//                     }}
//                   >
//                     Forgot Password?
//                   </Link>
//                 </Box>
//               </Grid>

//               <Grid item xs={12}>
//                 <Box sx={{ textAlign: 'center' }}>
//                   <Typography variant="body2" color="text.secondary">
//                     Don't have an account?{' '}
//                     <Button
//                       onClick={() => navigate('/signup')}
//                       sx={{
//                         textTransform: 'none',
//                         color: 'white',
//                         '&:hover': {
//                           background: ' linear-gradient(45deg, rgb(64 84 125) 103%, rgb(19 13 15) 90%);'
//                         },
//                         background: ' linear-gradient(38deg, #2a5298 99%, #3e3337 51%)',
//                       }}
//                     >
//                       Sign Up
//                     </Button>
//                   </Typography>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Box>
//         </Paper>
//       </Container>
//     </Box>
//   );
// };

// export default Login;


/// with error handling
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  useTheme,
  Avatar,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { ColorModeContext } from '../../App';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [formData, setFormData] = useState({
    adminEmail: '',
    adminPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Email is required';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Please enter a valid email address';
    }

    if (!formData.adminPassword) {
      newErrors.adminPassword = 'Password is required';
    } else if (formData.adminPassword.length < 6) {
      newErrors.adminPassword = 'Password must be at least 6 characters';
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
    setErrors({});

    try {
      const response = await axios.post(
        'https://student-information-system-production-9468.up.railway.app/api/admin/login',
        {
          adminEmail: formData.adminEmail,
          adminPassword: formData.adminPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      const data = response.data;

      if (response.status === 200 && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.adminRole || 'ADMIN');
        localStorage.setItem('userName', data.adminName || 'Admin');

        switch ((data.adminRole || '').toUpperCase()) {
          case 'SUPERADMIN':
            navigate('/superadmin-dashboard');
            break;
          case 'PI':
            navigate('/pi-dashboard');
            break;
          case 'BATCHMENTOR':
            navigate('/bm-dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        setErrors({ general: 'Unexpected login response. Please try again.' });
      }

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response?.data || 'Login failed.';
        if (status === 403 || status === 401 || status === 404) {
          setErrors({ general: message });
        } else if (status === 423) {
          setErrors({ general: "Account locked. Try again later." });
        } else {
          setErrors({ general: "Something went wrong. Try again later." });
        }
      } else if (error.code === 'ECONNABORTED') {
        setErrors({ general: "Request timed out. Server may be down." });
      } else {
        setErrors({ general: "Network error. Please check your connection." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(179deg, #323232 8%, #abb0d3 100%)'
          : 'linear-gradient(179deg, #2a5298 0%, #5f5656 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: theme.palette.primary.main,
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            <SchoolIcon sx={{ fontSize: 40 }} />
          </Avatar>

          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 3,
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Welcome Back
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={2}>

              {errors.general && (
                <Grid item xs={12}>
                  <Typography
                    color="error"
                    variant="body2"
                    align="center"
                    sx={{
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                      padding: '8px',
                      borderRadius: '4px',
                      marginBottom: '8px'
                    }}
                  >
                    {errors.general}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  error={!!errors.adminEmail}
                  helperText={errors.adminEmail}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="adminPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.adminPassword}
                  onChange={handleChange}
                  error={!!errors.adminPassword}
                  helperText={errors.adminPassword}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    mb: 2,
                    py: 1.5,
                    position: 'relative',
                  }}
                >
                  {isLoading ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  ) : (
                    'Login'
                  )}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    to="/forgot-password"
                    style={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none'
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Button
                      onClick={() => navigate('/signup')}
                      sx={{
                        textTransform: 'none',
                        color: 'white',
                        background: 'linear-gradient(38deg, #2a5298 99%, #3e3337 51%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, rgb(64 84 125) 103%, rgb(19 13 15) 90%)'
                        }
                      }}
                    >
                      Sign Up
                    </Button>
                  </Typography>
                </Box>
              </Grid>

            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;

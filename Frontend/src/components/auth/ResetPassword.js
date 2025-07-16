// import React, { useState, useContext } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Box,
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   useTheme,
//   Avatar,
//   IconButton,
//   InputAdornment,
// } from '@mui/material';
// import { ColorModeContext } from '../../App';
// import LockResetIcon from '@mui/icons-material/LockReset';
// import LockIcon from '@mui/icons-material/Lock';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

// const ResetPassword = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const colorMode = useContext(ColorModeContext);
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get('token');
  
//   const [passwords, setPasswords] = useState({
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (e) => {
//     setPasswords({
//       ...passwords,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleClickShowNewPassword = () => {
//     setShowNewPassword(!showNewPassword);
//   };

//   const handleClickShowConfirmPassword = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     // Validate passwords
//     if (!passwords.newPassword || !passwords.confirmPassword) {
//       setError('All fields are required');
//       return;
//     }

//     if (passwords.newPassword.length < 6) {
//       setError('Password must be at least 6 characters long');
//       return;
//     }

//     if (passwords.newPassword !== passwords.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await axios.post('http://localhost:8080/api/auth/reset-password',
//         {
//           token,
//           newPassword: passwords.newPassword
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           timeout: 10000 // 10 second timeout
//         }
//       );

//       if (response.status === 200) {
//         setSuccess('Password has been reset successfully');
//         setTimeout(() => navigate('/login'), 2000);
//       }
//     } catch (error) {
//       if (error.code === 'ECONNABORTED') {
//         setError('Request timed out. Please try again.');
//       } else if (!error.response) {
//         setError('Network error. Please check your connection and try again.');
//       } else {
//         switch (error.response?.status) {
//           case 400:
//             setError('Invalid password format. Please try again.');
//             break;
//           case 401:
//             setError('Invalid or expired reset token. Please request a new password reset.');
//             break;
//           case 429:
//             setError('Too many attempts. Please try again later.');
//             break;
//           case 500:
//             setError('Server error. Please try again later.');
//             break;
//           default:
//             setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
//         }
//       }
//       console.error('Reset password error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!token) {
//     return (
//       <Box
//         sx={{
//           minHeight: '100vh',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           background: theme.palette.mode === 'dark' 
//           ? 'linear-gradient(179deg, #030303 8%, #abb0d3 100%);'
//           : 'linear-gradient(179deg, #2a5298 0%, #5f5656 100%);',
//         }}
//       >
//         <Typography variant="h6" color="error">
//           Invalid or expired reset link. Please request a new password reset.
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         background: theme.palette.mode === 'dark' 
//           ? 'linear-gradient(135deg,#323232 0%, #abb0d3 100%);'
//           : 'linear-gradient(135deg, #9e97c0 0%, #5f5656 100%);',
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
//             <LockResetIcon sx={{ fontSize: 40 }} />
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
//             Reset Your Password
//           </Typography>

//           <Typography 
//             variant="body1" 
//             sx={{ 
//               mb: 3,
//               textAlign: 'center',
//               color: theme.palette.text.secondary
//             }}
//           >
//             Please enter your new password below.
//           </Typography>

//           <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//             <TextField
//               required
//               fullWidth
//               name="newPassword"
//               label="New Password"
//               type={showNewPassword ? 'text' : 'password'}
//               value={passwords.newPassword}
//               onChange={handleChange}
//               error={!!error}
//               InputProps={{
//                 startAdornment: <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle new password visibility"
//                       onClick={handleClickShowNewPassword}
//                       onMouseDown={handleMouseDownPassword}
//                       edge="end"
//                     >
//                       {showNewPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 mb: 2,
//                 '& .MuiOutlinedInput-root': {
//                   '&:hover fieldset': {
//                     borderColor: theme.palette.primary.main,
//                   },
//                 },
//               }}
//             />

//             <TextField
//               required
//               fullWidth
//               name="confirmPassword"
//               label="Confirm New Password"
//               type={showConfirmPassword ? 'text' : 'password'}
//               value={passwords.confirmPassword}
//               onChange={handleChange}
//               error={!!error}
//               helperText={error}
//               InputProps={{
//                 startAdornment: <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle confirm password visibility"
//                       onClick={handleClickShowConfirmPassword}
//                       onMouseDown={handleMouseDownPassword}
//                       edge="end"
//                     >
//                       {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 mb: 3,
//                 '& .MuiOutlinedInput-root': {
//                   '&:hover fieldset': {
//                     borderColor: theme.palette.primary.main,
//                   },
//                 },
//               }}
//             />

//             {success && (
//               <Typography 
//                 color="success.main" 
//                 sx={{ 
//                   mb: 2, 
//                   textAlign: 'center',
//                   backgroundColor: 'success.light',
//                   color: 'success.contrastText',
//                   p: 1,
//                   borderRadius: 1
//                 }}
//               >
//                 {success}
//               </Typography>
//             )}

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               disabled={isLoading}
//               sx={{
//                 mb: 2,
//                 background: ` linear-gradient(38deg, #2a5298 99%, #3e3337 51%)`,
//                 '&:hover': {
//                   background: `linear-gradient(45deg, rgb(64 84 125) 103%, rgb(19 13 15) 90%)`,
//                 }
//               }}
//             >
//               {isLoading ? 'Resetting...' : 'Reset Password'}
//             </Button>

//             <Button
//               fullWidth
//               variant="text"
//               onClick={() => navigate('/login')}
//               sx={{
//                 color: theme.palette.primary.main,
//                 '&:hover': {
//                   backgroundColor: 'transparent',
//                   textDecoration: 'underline'
//                 }
//               }}
//             >
//               Back to Login
//             </Button>
//           </Box>
//         </Paper>
//       </Container>
//     </Box>
//   );
// };

// export default ResetPassword; 




import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  useTheme,
  Avatar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { ColorModeContext } from '../../App';
import LockResetIcon from '@mui/icons-material/LockReset';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ResetPassword = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords
    if (!passwords.newPassword || !passwords.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('https://student-information-system-production-9468.up.railway.app/api/admin/resetpassword',
        {
          token,
          newPassword: passwords.newPassword
        },
        {
          headers: {
    'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (response.status === 200) {
        setSuccess('Password has been reset successfully');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (!error.response) {
        setError('Network error. Please check your connection and try again.');
      } else {
        switch (error.response?.status) {
          case 400:
            setError('Invalid password format. Please try again.');
            break;
          case 401:
            setError('Invalid or expired reset token. Please request a new password reset.');
            break;
          case 429:
            setError('Too many attempts. Please try again later.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
        }
      }
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(179deg, #030303 8%, #abb0d3 100%);'
          : 'linear-gradient(179deg, #2465b2 0%, #5f5656 100%);',
        }}
      >
        <Typography variant="h6" color="error">
          Invalid or expired reset link. Please request a new password reset.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #030303 0%, #abb0d3 100%);'
          : 'linear-gradient(135deg, #9e97c0 0%, #5f5656 100%);',
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
            <LockResetIcon sx={{ fontSize: 40 }} />
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
            Reset Your Password
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              textAlign: 'center',
              color: theme.palette.text.secondary
            }}
          >
            Please enter your new password below.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={passwords.newPassword}
              onChange={handleChange}
              error={!!error}
              InputProps={{
                startAdornment: <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwords.confirmPassword}
              onChange={handleChange}
              error={!!error}
              helperText={error}
              InputProps={{
                startAdornment: <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            {success && (
              <Typography 
                color="success.main" 
                sx={{ 
                  mb: 2, 
                  textAlign: 'center',
                  backgroundColor: 'success.light',
                  color: 'success.contrastText',
                  p: 1,
                  borderRadius: 1
                }}
              >
                {success}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mb: 2,
                background: ` linear-gradient(38deg, #2a5298 99%, #3e3337 51%)`,
                '&:hover': {
                  background: `linear-gradient(45deg, rgb(64 84 125) 103%, rgb(19 13 15) 90%)`,
                }
              }}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
              sx={{
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
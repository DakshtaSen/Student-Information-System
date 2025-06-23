import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { ColorModeContext } from '../../App';
import LockResetIcon from '@mui/icons-material/LockReset';
import EmailIcon from '@mui/icons-material/Email';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', 
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (response.status === 200) {
        setSuccess('Password reset instructions have been sent to your email');
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (!error.response) {
        setError('Network error. Please check your connection and try again.');
      } else {
        switch (error.response?.status) {
          case 404:
            setError('No account found with this email address.');
            break;
          case 429:
            setError('Too many attempts. Please try again later.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(error.response?.data?.message || 'Failed to process request. Please try again.');
        }
      }
      console.error('Forgot password error:', error);
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
          ? 'linear-gradient(179deg, #030303 8%, #abb0d3 100%);'
          : 'linear-gradient(179deg, #2a5298 0%, #5f5656 100%);',
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
            Reset Password
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              textAlign: 'center',
              color: theme.palette.text.secondary
            }}
          >
            Enter your email address and we'll send you instructions to reset your password.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
              helperText={error}
              InputProps={{
                startAdornment: <EmailIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
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
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
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

export default ForgotPassword; 
// import './App.css';
// // import SuperAdminDashboard from './components/superadmin/SuperAdminDashboard';
// // import Studentsignup from './Studentsignup';
// import MeetOurDeveloper from './components/MeetOurDeveloper';

// function App() {
//   return (
//    <>
//     {/* { <Studentsignup/>} */}
//     {<MeetOurDeveloper/>}
//     {/* <SuperAdminDashboard/> */}
//    </>
//   );
// }
// export default App;


import './App.css';
import { Link } from 'react-router-dom';
import React, { createContext, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
// import Dashboard from './components/dashboard/Dashboard';
import SuperAdminDashboard from './components/superadmin/SuperAdminDashboard';
import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
// import PersonIcon from '@mui/icons-material/Person';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SchoolIcon from '@mui/icons-material/School';

 import Studentsignup from './Studentsignup';
// import Navbar from './components/Navbar';
import ProgramInchargeDashboard from './components/dashboard/ProgramInchargeDashboard';
import BatchMentorDashboard from './components/dashboard/BatchMentorDashboard';
// import StudentDashboard from './components/dashboard/StudentDashboard';
// import StudentSignup from './components/auth/StudentSignup';
import MeetOurDeveloper from './components/MeetOurDeveloper';

// Create theme context
export const ColorModeContext = createContext({ toggleColorMode: () => { } });

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'SUPERADMIN':
        return <Navigate to="/superadmin-dashboard" replace />;
      case 'PI':
        return <Navigate to="/pi-dashboard" replace />;
      case 'BatchMentor':
        return <Navigate to="/bm-dashboard" replace />
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

function App() {
  const [mode, setMode] = useState('dark');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2a5298',
          },
          secondary: {
            main: '#dc004e',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#f5f5f5',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
        },
      }),
    [mode]
  );

  const Navbar = () => {
    const navigate = useNavigate();
    const currentUser = {
      role: localStorage.getItem('userRole') || '',
      id: localStorage.getItem('userId') || '',
      name: localStorage.getItem('userName') || '',
    };

    const handleLogout = () => {
      localStorage.clear();
      navigate('/login');
    };

    const handleNavigation = (path) => {
      navigate(path);
    };

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('token');

    return (
      <AppBar position="static" sx={{
        // background: 'linear-gradient(90deg, #1a237e 0%, #283593 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 16px'
        }}>
          {/* Left section with logo and college info */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{
              width: '60px',
              height: '60px',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <img
                src="/images/iips_logo.png"
                alt="IIPS Logo"
                style={{
                  // width: '100%', 
                  height: '100%',
                  // objectFit: 'cover' 
                }}
              />
            </Box>
            <Box>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                letterSpacing: '0.5px',
                color: '#fff'
              }}>
                IIPS-DAVV INDORE
              </Typography>
              <Typography variant="caption" sx={{
                color: 'rgba(255,255,255,0.8)',
                display: 'block',
                fontSize: '0.75rem'
              }}>
                Takshashila Campus, Khandwa Road, Indore(M.P) 452001
              </Typography>
            </Box>
          </Box>

          {/* Right section with theme toggle and logout */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
           <Button
              component={Link}
              to="/student-signup"
              sx={{
                color: '#fff',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
            Student Registration
            </Button>
            <Button
              component={Link}
              to="/developers"
              sx={{
                color: '#fff',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
             Meet Our Developers
            </Button>

            <IconButton
              onClick={colorMode.toggleColorMode}
              color="inherit"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {isLoggedIn && (
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  },
                  fontWeight: 500,
                  letterSpacing: '0.5px'
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    );
  };

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/student-signup" element={<Studentsignup />} />
                <Route path="/developers" element={<MeetOurDeveloper />} />

                {/* Protected Routes */}
                <Route
                  path="/superadmin-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pi-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['PI']}>
                      <ProgramInchargeDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bm-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['BatchMentor']}>
                      <BatchMentorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Default route - redirect to login if not authenticated */}
                <Route
                  path="/"
                  element={
                    <Navigate
                      to={localStorage.getItem('token') ?
                        (localStorage.getItem('userRole') === 'SUPERADMIN' ? '/superadmin-dashboard' :
                          localStorage.getItem('userRole') === 'PI' ? '/pi-dashboard' :
                            localStorage.getItem('userRole') === 'BatchMentor' ? '/bm-dashboard' : '/login')
                        : '/login'}
                      replace
                    />
                  }
                />

                {/* Catch all route - redirect to login */}
                <Route
                  path="*"
                  element={<Navigate to="/login" replace />}
                />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
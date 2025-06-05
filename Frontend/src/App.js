// import './App.css';
// import SuperAdminDashboard from './components/superadmin/SuperAdminDashboard';
// // import Studentsignup from './Studentsignup';

// function App() {
//   return (
//    <>
//     {/* <Studentsignup/> */}
//     <SuperAdminDashboard/>
//    </>
//   );
// }

// export default App;
import './App.css';
import React, { createContext, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
// import Dashboard from './components/dashboard/Dashboard';
import SuperAdminDashboard from './components/superadmin/SuperAdminDashboard';
import { Box, AppBar, Toolbar, Typography, Button,  IconButton } from '@mui/material';
// import PersonIcon from '@mui/icons-material/Person';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SchoolIcon from '@mui/icons-material/School';

// import Studentsignup from './Studentsignup';
// import Navbar from './components/Navbar';
import ProgramInchargeDashboard from './components/dashboard/ProgramInchargeDashboard';
import BatchMentorDashboard from './components/dashboard/BatchMentorDashboard';
// import StudentDashboard from './components/dashboard/StudentDashboard';
// import StudentSignup from './components/auth/StudentSignup';

// Create theme context
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

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
      case 'BM':
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
            main: '#1976d2',
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

    return (
      <>
      <div className='mainheader'>
      <div className='clglogo'>
        <img src="/images/iips_logo.png" alt="iips logo" />
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
      <AppBar position="static">
        <Toolbar>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
            onClick={() => handleNavigation(currentUser.role === 'SUPERADMIN' ? '/superadmin' : '/dashboard')}
          >
            <SchoolIcon sx={{ fontSize: 30 }} />
            <Typography variant="h6" component="div">
              IIPS-DAVV INDORE
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              sx={{ 
                '&:hover': { 
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      </>
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
                {/* <Route path="/student-signup" element={<StudentSignup />} /> */}

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
                    <ProtectedRoute allowedRoles={['BM']}>
                      <BatchMentorDashboard />
                    </ProtectedRoute>
                  }
                />
               
              

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

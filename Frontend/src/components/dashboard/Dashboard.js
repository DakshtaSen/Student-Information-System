import React from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StudentList from '../students/StudentList';

const Dashboard = () => {
  const currentUser = {
    role: localStorage.getItem('role') || 'PI',
    name: localStorage.getItem('userName') || 'User',
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'auto', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h4" gutterBottom>
                Welcome, {currentUser.name}!
              </Typography>
              <Typography variant="subtitle1">
                {currentUser.role === 'PI' ? 'Principal Investigator' : 'Business Manager'} Dashboard
              </Typography>
            </Paper>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography color="text.secondary" variant="h6">
                  Total Students
                </Typography>
              </Box>
              <Typography component="p" variant="h4">
                24
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SchoolIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography color="text.secondary" variant="h6">
                  Active Projects
                </Typography>
              </Box>
              <Typography component="p" variant="h4">
                8
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AssignmentIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography color="text.secondary" variant="h6">
                  Pending Tasks
                </Typography>
              </Box>
              <Typography component="p" variant="h4">
                12
              </Typography>
            </Paper>
          </Grid>

          {/* Student List */}
          <Grid item xs={12}>
            <StudentList />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 
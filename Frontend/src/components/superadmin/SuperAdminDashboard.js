import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import axios from 'axios';
import './SuperAdminDashboard.css';

/**
 * API Endpoints to be called:
 * 
 * 1. GET /api/users/pi - Get all PI users
 * 2. GET /api/users/bm - Get all BM users
 * 3. GET /api/users/verified - Get all verified users
 * 4. GET /api/users/unverified - Get all unverified users
 * 5. PUT /api/users/:id/role - Update user role
 * 6. PUT /api/users/:id/verify - Verify user
 * 7. DELETE /api/users/:id - Reject user
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SuperAdminDashboard = () => {
  const [value, setValue] = useState(0);
  const [users, setUsers] = useState({
    pi: [],
    bm: [],
    verified: [],
    unverified: [],
  });
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    role: '',
    course: '',
    batch: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Call 1: Fetch all users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // API Call 1: Implementation of fetchUsers
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all users from a single endpoint
      const response = await axios.get(`http://localhost:5000/users`);
      const allUsers = response.data;

      // Filter users based on their roles and verification status
      const piUsers = allUsers.filter(user => user.role === 'PI' && user.isVerified);
      const bmUsers = allUsers.filter(user => user.role === 'BM' && user.isVerified);
      const verifiedUsers = allUsers.filter(user => user.isVerified);
      const unverifiedUsers = allUsers.filter(user => !user.isVerified);

      // Update state with filtered users
      setUsers({
        pi: piUsers,
        bm: bmUsers,
        verified: verifiedUsers,
        unverified: unverifiedUsers,
      });
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      role: user.role,
      course: user.course || '',
      batch: user.batch || ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleRoleChange = (e) => {
    setEditForm({ ...editForm, role: e.target.value });
  };

  const handleCourseChange = (e) => {
    setEditForm({ ...editForm, course: e.target.value });
  };

  const handleBatchChange = (e) => {
    setEditForm({ ...editForm, batch: e.target.value });
  };

  // API Call 2: Update user role
  const handleSubmit = async () => {
    try {
      setError(null);
      // PUT /api/users/:id/role
      await axios.put(
        `${API_BASE_URL}/users/${selectedUser.id}/role`,
        {
          role: editForm.role,
          course: editForm.course,
          batch: editForm.role === 'BM' ? editForm.batch : null
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      // Update local state after successful API call
      const updatedUser = {
        ...selectedUser,
        role: editForm.role,
        course: editForm.course,
        batch: editForm.role === 'BM' ? editForm.batch : null
      };
      const removeUserFromList = (list) => list.filter(user => user.id !== selectedUser.id);
      const addUserToList = (list) => [...list, updatedUser];

      setUsers((prev) => {
        const newUsers = {
          pi: removeUserFromList(prev.pi),
          bm: removeUserFromList(prev.bm),
          verified: removeUserFromList(prev.verified),
          unverified: removeUserFromList(prev.unverified),
        };

        if (editForm.role === 'PI') newUsers.pi = addUserToList(newUsers.pi);
        if (editForm.role === 'BM') newUsers.bm = addUserToList(newUsers.bm);

        if (prev.verified.some(u => u.id === selectedUser.id)) {
          newUsers.verified = addUserToList(newUsers.verified);
        }

        return newUsers;
      });

      handleClose();
    } catch (err) {
      setError('Failed to update user role. Please try again.');
      console.error('Error updating user role:', err);
    }
  };

  // API Call 3: Verify user
  const handleVerify = async (user) => {
    try {
      setError(null);
      // PUT /api/users/:id/verify
      await axios.put(
        `${API_BASE_URL}/users/${user.id}/verify`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      // Update local state after successful API call
      setUsers({
        ...users,
        unverified: users.unverified.filter((u) => u.id !== user.id),
        verified: [...users.verified, user],
      });
    } catch (err) {
      setError('Failed to verify user. Please try again.');
      console.error('Error verifying user:', err);
    }
  };

  // API Call 4: Reject user
  const handleReject = async (user) => {
    try {
      setError(null);
      // DELETE /api/users/:id
      await axios.delete(
        `${API_BASE_URL}/users/${user.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      // Update local state after successful API call
      setUsers({
        ...users,
        unverified: users.unverified.filter((u) => u.id !== user.id),
      });
    } catch (err) {
      setError('Failed to reject user. Please try again.');
      console.error('Error rejecting user:', err);
    }
  };

  const StatCard = ({ title, count, icon, color }) => {
    return (
      <Card className="stat-card">
        <CardContent className="stat-card-content">
          <Avatar className={`stat-avatar stat-avatar-${color}`}>
            {icon}
          </Avatar>
          <Box>
            <Typography className="stat-count">{count}</Typography>
            <Typography className="stat-title" variant="subtitle1">{title}</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderUserList = (userList, showActions = false, isVerified = false) => (
    <TableContainer component={Paper} className="table-container">
      <Table>
        <TableHead>
          <TableRow className="table-header">
            <TableCell className="table-header-cell">Name</TableCell>
            <TableCell className="table-header-cell">Email</TableCell>
            <TableCell className="table-header-cell">Role</TableCell>
            {!isVerified && <TableCell className="table-header-cell">Course</TableCell>}
            {value === 1 && <TableCell className="table-header-cell">Batch</TableCell>}
            {(showActions || isVerified) && <TableCell className="table-header-cell">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {userList.map((user) => (
            <TableRow key={user.id} className="table-row-hover">
              <TableCell>
                <Box className="user-row">
                  <Avatar className={user.role === 'PI' ? 'user-avatar' : 'user-avatar-secondary'}>
                    <PersonIcon />
                  </Avatar>
                  {user.name}
                </Box>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip
                  label={user.role}
                  size="small"
                  icon={user.role === 'PI' ? <SchoolIcon /> : <BusinessIcon />}
                  className={user.role === 'PI' ? 'chip-primary' : 'chip-secondary'}
                />
              </TableCell>
              {!isVerified && (
                <TableCell>
                  <Chip
                    label={user.course || 'Not Assigned'}
                    size="small"
                    color={user.course ? 'success' : 'default'}
                  />
                </TableCell>
              )}
              {value === 1 && (
                <TableCell>
                  <Chip
                    label={user.batch || 'Not Assigned'}
                    size="small"
                    color={user.batch ? 'success' : 'default'}
                  />
                </TableCell>
              )}
              {(showActions || isVerified) && (
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)} className="icon-button-edit">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderUnverifiedList = () => (
    <TableContainer component={Paper} className="table-container">
      <Table>
        <TableHead>
          <TableRow className="table-header">
            <TableCell className="table-header-cell">Name</TableCell>
            <TableCell className="table-header-cell">Email</TableCell>
            <TableCell className="table-header-cell">Role</TableCell>
            <TableCell className="table-header-cell">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.unverified.map((user) => (
            <TableRow key={user.id} className="table-row-hover">
              <TableCell>
                <Box className="user-row">
                  <Avatar className={user.role === 'PI' ? 'user-avatar' : 'user-avatar-secondary'}>
                    <PersonIcon />
                  </Avatar>
                  {user.name}
                </Box>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip
                  label={user.role}
                  size="small"
                  icon={user.role === 'PI' ? <SchoolIcon /> : <BusinessIcon />}
                  className={user.role === 'PI' ? 'chip-primary' : 'chip-secondary'}
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleVerify(user)} className="icon-button-verify">
                  <CheckCircleIcon />
                </IconButton>
                <IconButton onClick={() => handleReject(user)} className="icon-button-reject">
                  <CancelIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      
      <Box className="dashboard-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>


    <Box className="dashboard-container">
     
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom className="dashboard-title">
        <SchoolIcon className="dashboard-title-icon" />
        Super Admin Dashboard
      </Typography>

      <Grid container spacing={3} className="grid-container">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total PIs" 
            count={users.pi.length} 
            icon={<SchoolIcon />} 
            color="primary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total BMs" 
            count={users.bm.length} 
            icon={<BusinessIcon />} 
            color="secondary" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Verified Users" 
            count={users.verified.length} 
            icon={<VerifiedUserIcon />} 
            color="success" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Pending Verification" 
            count={users.unverified.length} 
            icon={<PendingActionsIcon />} 
            color="warning" 
          />
        </Grid>
      </Grid>

      <Paper className="tabs-container">
        <Tabs value={value} onChange={handleChange} variant="fullWidth">
          <Tab className={`tab ${value === 0 ? 'tab-selected' : ''}`} icon={<SchoolIcon />} label="PI List" iconPosition="start" />
          <Tab className={`tab ${value === 1 ? 'tab-selected' : ''}`} icon={<BusinessIcon />} label="BM List" iconPosition="start" />
          <Tab className={`tab ${value === 2 ? 'tab-selected' : ''}`} icon={<VerifiedUserIcon />} label="Verified" iconPosition="start" />
          <Tab className={`tab ${value === 3 ? 'tab-selected' : ''}`} icon={<PendingActionsIcon />} label="Unverified" iconPosition="start" />
        </Tabs>
      </Paper>

      {value === 0 && renderUserList(users.pi, true)}
      {value === 1 && renderUserList(users.bm, true)}
      {value === 2 && renderUserList(users.verified, false, true)}
      {value === 3 && renderUnverifiedList()}

      <Dialog open={open} onClose={handleClose} className="dialog">
        <DialogTitle className="dialog-title">Change User Role</DialogTitle>
        <DialogContent className="dialog-content">
          <FormControl className="form-control">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={editForm.role}
              label="Role"
              onChange={handleRoleChange}
            >
              <MenuItem value="PI" className="menu-item">
                <SchoolIcon color="primary" />
                PI
              </MenuItem>
              <MenuItem value="BM" className="menu-item">
                <BusinessIcon color="secondary" />
                BM
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl className="form-control">
            <InputLabel id="course-label">Course</InputLabel>
            <Select
              labelId="course-label"
              id="course"
              value={editForm.course}
              label="Course"
              onChange={handleCourseChange}
            >
              <MenuItem value="MCA">MCA</MenuItem>
              <MenuItem value="MTECH">MTECH</MenuItem>
              <MenuItem value="MBA">MBA</MenuItem>
              <MenuItem value="Bcom">Bcom</MenuItem>
            </Select>
          </FormControl>

          {editForm.role === 'BM' && (
            <FormControl className="form-control">
              <InputLabel id="batch-label">Batch</InputLabel>
              <Select
                labelId="batch-label"
                id="batch"
                value={editForm.batch}
                label="Batch"
                onChange={handleBatchChange}
              >
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
                <MenuItem value="2022">2022</MenuItem>
                <MenuItem value="2021">2021</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleClose} variant="outlined" className="button-outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" className="button-contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
};

export default SuperAdminDashboard;

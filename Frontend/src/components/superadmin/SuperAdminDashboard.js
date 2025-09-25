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
  CircularProgress,
  Alert,
  useTheme,
  TextField,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';
import './SuperAdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://student-information-system-production-2d2c.up.railway.app';

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

const SuperAdminDashboard = () => {
  const theme = useTheme();
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
  const [filters, setFilters] = useState({
    role: '',
    course: '',
    batch: '',
    name: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Add pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filterUsers = (userList) => {
    return userList.filter(user => {
      const roleMatch = !filters.role || user.adminRole === filters.role;
      const courseMatch = !filters.course || user.course === filters.course;
      const batchMatch = !filters.batch || user.batch === filters.batch;
      const nameMatch = !filters.name ||
        (user.adminName || user.name || '').toLowerCase().includes(filters.name.toLowerCase());
      return roleMatch && courseMatch && batchMatch && nameMatch;
    });
  };

  // Fetch all users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await axios.get(`${API_BASE_URL}/api/superadmin/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!Array.isArray(response.data)) throw new Error('Invalid response format');

      const allUsers = response.data;

      const validUsers = allUsers.filter(
        user =>
          user &&
          typeof user === 'object' &&
          'adminRole' in user &&
          'approved' in user
      );

      setUsers({
        pi: validUsers.filter(user => user.adminRole === 'PI' && user.approved === true),
        bm: validUsers.filter(user => user.adminRole === 'BatchMentor' && user.approved === true),
        verified: validUsers.filter(user => user.approved === true),
        unverified: validUsers.filter(user => user.approved === false),
      });
    } catch (err) {
      let errorMessage = 'Failed to fetch users.';
      if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      role: user.adminRole,
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

  const handleSubmit = async () => {
    try {
      setError(null);

      await axios.put(
        `${API_BASE_URL}/api/superadmin/savechanges/${selectedUser.adminId}`,
        {
          role: editForm.role,
          course: editForm.course,
          batch: editForm.role === 'BatchMentor' ? editForm.batch : null
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      // Update local state to reflect changes
      const updatedUser = {
        ...selectedUser,
        adminRole: editForm.role,
        course: editForm.course,
        batch: editForm.role === 'BatchMentor' ? editForm.batch : null
      };

      setUsers(prev => {
        const removeUser = (list) => list.filter(u => u.adminId !== selectedUser.adminId);
        const addUser = (list) => [...list, updatedUser];

        const newUsers = {
          pi: removeUser(prev.pi),
          bm: removeUser(prev.bm),
          verified: removeUser(prev.verified),
          unverified: removeUser(prev.unverified),
        };

        if (editForm.role.toLowerCase() === 'pi') newUsers.pi = addUser(newUsers.pi);
        if (editForm.role.toLowerCase() === 'BatchMentor') newUsers.bm = addUser(newUsers.bm);

        if (selectedUser.approved === true) {
          newUsers.verified = addUser(newUsers.verified);
        } else {
          newUsers.unverified = addUser(newUsers.unverified);
        }

        return newUsers;
      });

      handleClose();
    } catch (err) {
      setError('Failed to update user role. Please try again.');
    }
  };

  const verifyUser = async (user) => {
    try {
      setError(null);
      await axios.patch(
        `${API_BASE_URL}/api/superadmin/approve/${user.adminId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      const updated = { ...user, approved: true };

      setUsers(prev => ({
        ...prev,
        unverified: prev.unverified.filter(u => u.adminId !== user.adminId),
        verified: [...prev.verified, updated],
        ...(user.adminRole === 'PI' && { pi: [...prev.pi, updated] }),
        ...(user.adminRole === 'BatchMentor' && { bm: [...prev.bm, updated] }),
      }));
    } catch (err) {
      setError('Failed to verify user. Please try again.');
    }
  };

  const handleReject = async (user) => {
    try {
      setError(null);

      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debug: Check if token is present
      if (!token) {
        console.error('No token found in localStorage.');
        setError('Authentication token missing. Please log in again.');
        return;
      }

      await axios.delete(
        `${API_BASE_URL}/api/superadmin/reject/${user.adminId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setUsers(prev => ({
        ...prev,
        unverified: prev.unverified.filter(u => u.adminId !== user.adminId)
      }));
    } catch (err) {
      console.error('Reject error:', err);
      setError('Failed to reject user. Please try again.');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Modify renderUserList to include pagination
  const renderUserList = (userList, showActions = false, isVerified = false) => {
    const filteredUsers = filterUsers(userList);
    const paginatedUsers = filteredUsers.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return (
      <>
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
              {paginatedUsers.map((user) => (
                <TableRow key={user.adminId || user.id} className="table-row-hover">
                  <TableCell>
                    <Box className="user-row">
                      <Avatar className={user.adminRole === 'PI' || user.role === 'PI' ? 'user-avatar' : 'user-avatar-secondary'}>
                        <PersonIcon />
                      </Avatar>
                      {user.adminName || user.name}
                    </Box>
                  </TableCell>
                  <TableCell>{user.adminEmail || user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.adminRole || user.role}
                      size="small"
                      icon={(user.adminRole || user.role) === 'PI' ? <SchoolIcon /> : <BusinessIcon />}
                      className={(user.adminRole || user.role) === 'PI' ? 'chip-primary' : 'chip-secondary'}
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
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </>
    );
  };

  // Modify renderUnverifiedList to include pagination
  const renderUnverifiedList = () => {
    const filteredUsers = filterUsers(users.unverified);
    const paginatedUsers = filteredUsers.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return (
      <>
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
              {paginatedUsers.map((user) => (
                <TableRow key={user.adminId} className="table-row-hover">
                  <TableCell>
                    <Box className="user-row">
                      <Avatar className={user.adminRole === 'PI' ? 'user-avatar' : 'user-avatar-secondary'}>
                        <PersonIcon />
                      </Avatar>
                      {user.adminName}
                    </Box>
                  </TableCell>
                  <TableCell>{user.adminEmail}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.adminRole}
                      size="small"
                      icon={user.adminRole === 'PI' ? <SchoolIcon /> : <BusinessIcon />}
                      className={user.adminRole === 'PI' ? 'chip-primary' : 'chip-secondary'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => verifyUser(user)} className="icon-button-verify">
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
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </>
    );
  };

  if (loading) {
    return (
      <Box className="dashboard-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="dashboard-container">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" className="dashboard-title">
            <SchoolIcon className="dashboard-title-icon" />
            Super Admin Dashboard
          </Typography>

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: `${theme.palette.primary.main}10`
              }
            }}
          >
            Apply Filters
          </Button>
        </Box>

        <Grid container spacing={3} className="grid-container">
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Verification"
              count={users.unverified.length}
              icon={<PendingActionsIcon />}
              color="warning"
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
        </Grid>

        <Paper className="tabs-container">
          <Tabs value={value} onChange={handleChange} variant="fullWidth">
            <Tab className={`tab ${value === 0 ? 'tab-selected' : ''}`} icon={<PendingActionsIcon />} label="Unverified" iconPosition="start" />
            <Tab className={`tab ${value === 1 ? 'tab-selected' : ''}`} icon={<VerifiedUserIcon />} label="Verified" iconPosition="start" />
            <Tab className={`tab ${value === 2 ? 'tab-selected' : ''}`} icon={<SchoolIcon />} label="PI List" iconPosition="start" />
            <Tab className={`tab ${value === 3 ? 'tab-selected' : ''}`} icon={<BusinessIcon />} label="BM List" iconPosition="start" />
          </Tabs>
        </Paper>
        {value === 0 && renderUnverifiedList()}
        {value === 1 && renderUserList(filterUsers(users.verified), false, true)}
        {value === 2 && renderUserList(filterUsers(users.pi), true)}
        {value === 3 && renderUserList(filterUsers(users.bm), true)}

        {/* Filter Section */}
        {showFilters && (
          <Paper
            sx={{
              p: 2,
              width: 280,
              position: 'absolute',
              left: '79%',
              top: '50px',
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.divider}`,
              animation: 'slideIn 0.3s ease-out',
              '@keyframes slideIn': {
                from: {
                  opacity: 0,
                  transform: 'translateX(20px)'
                },
                to: {
                  opacity: 1,
                  transform: 'translateX(0)'
                }
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.primary.main,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  pb: 1,
                }}
              >
                Filters
              </Typography>
              <IconButton
                size="small"
                onClick={() => setShowFilters(false)}
                sx={{
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}10`
                  }
                }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Box>

            <TextField
              fullWidth
              size="small"
              label="Search by Name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={filters.role}
                label="Role"
                onChange={handleFilterChange}
                size="small"
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="PI">PI</MenuItem>
                <MenuItem value="BatchMentor">BM</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Course</InputLabel>
              <Select
                name="course"
                value={filters.course}
                label="Course"
                onChange={handleFilterChange}
                size="small"
              >
                <MenuItem value="">All Courses</MenuItem>
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
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Batch</InputLabel>
              <Select
                name="batch"
                value={filters.batch}
                label="Batch"
                onChange={handleFilterChange}
                size="small"
              >
                <MenuItem value="">All Batches</MenuItem>
                <MenuItem value="2025">2025</MenuItem>
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
                <MenuItem value="2022">2022</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setFilters({ role: '', course: '', batch: '', name: '' });
                  setShowFilters(false);
                }}
                className="clear-button"
              >
                Clear
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setShowFilters(false)}
                className="filter-button"
              >
                Apply Filter
              </Button>
            </Box>
          </Paper>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} className="dialog">
        <DialogTitle className="dialog-title">Change User Role</DialogTitle>
        <DialogContent className="dialog-content">
          <FormControl className="form-control" fullWidth margin="normal">
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
              <MenuItem value="BatchMentor" className="menu-item">
                <BusinessIcon color="secondary" />
                BM
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl className="form-control" fullWidth margin="normal">
            <InputLabel id="course-label">Course</InputLabel>
            <Select
              labelId="course-label"
              id="course"
              value={editForm.course}
              label="Course"
              onChange={handleCourseChange}
            >
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
          </FormControl>

          {editForm.role === 'BatchMentor' && (
            <FormControl className="form-control" fullWidth margin="normal">
              <InputLabel id="batch-label">Batch</InputLabel>
              <Select
                labelId="batch-label"
                id="batch"
                value={editForm.batch}
                label="Batch"
                onChange={handleBatchChange}
              >
                <MenuItem value="2021">2025</MenuItem>
                <MenuItem value="2022">2022</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
                <MenuItem value="2024">2024</MenuItem>
              
               
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
  );
};

export default SuperAdminDashboard;

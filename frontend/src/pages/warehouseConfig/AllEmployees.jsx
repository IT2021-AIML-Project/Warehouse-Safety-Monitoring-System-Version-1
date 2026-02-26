import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Alert,
} from '@mui/material';
import { Search, People, Edit, Delete, Close, WarningAmber } from '@mui/icons-material';

const dummyEmployees = [
  { id: 'EMP-0001', name: 'James Carter', email: 'james.carter@warehouse.com', role: 'Warehouse Staff', status: 'Active', joined: '2024-03-10' },
  { id: 'EMP-0002', name: 'Maria Santos', email: 'maria.santos@warehouse.com', role: 'Warehouse Staff', status: 'Active', joined: '2024-05-22' },
  { id: 'EMP-0003', name: 'David Kim', email: 'david.kim@warehouse.com', role: 'Supervisor', status: 'Active', joined: '2023-11-01' },
  { id: 'EMP-0004', name: 'Priya Patel', email: 'priya.patel@warehouse.com', role: 'Warehouse Staff', status: 'Inactive', joined: '2024-01-15' },
  { id: 'EMP-0005', name: 'Lucas Mendes', email: 'lucas.mendes@warehouse.com', role: 'Forklift Operator', status: 'Active', joined: '2024-07-08' },
  { id: 'EMP-0006', name: 'Aisha Nkosi', email: 'aisha.nkosi@warehouse.com', role: 'Warehouse Staff', status: 'Active', joined: '2024-09-19' },
  { id: 'EMP-0007', name: 'Tom Bradley', email: 'tom.bradley@warehouse.com', role: 'Loading Staff', status: 'Inactive', joined: '2023-08-30' },
];

const getInitials = (name) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase();

const avatarColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

const AllEmployees = () => {
  const [employees, setEmployees] = useState(dummyEmployees);
  const [search, setSearch] = useState('');

  // ── Edit dialog ──
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editError, setEditError] = useState('');

  // ── Delete dialog ──
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
  );

  // ── Edit handlers ──
  const handleEditOpen = (emp) => {
    setEditData({ ...emp });
    setEditError('');
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditData(null);
    setEditError('');
  };

  const handleEditChange = (field) => (e) => {
    setEditData({ ...editData, [field]: e.target.value });
    setEditError('');
  };

  const handleEditSave = () => {
    if (!editData.email.trim()) { setEditError('Email is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) { setEditError('Enter a valid email address.'); return; }
    setEmployees((prev) => prev.map((e) => (e.id === editData.id ? editData : e)));
    handleEditClose();
  };

  // ── Delete handlers ──
  const handleDeleteOpen = (emp) => {
    setDeleteTarget(emp);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const handleDeleteConfirm = () => {
    setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    handleDeleteClose();
  };

  return (
    <Box sx={{ p: 4 }}>

      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        {/* Table Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 2, borderBottom: '1px solid #e2e8f0' }}>
          <People sx={{ color: '#3b82f6', fontSize: 22 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', flex: 1 }}>
            Employee List
          </Typography>
          <TextField
            size="small"
            placeholder="Search by name, ID or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 18, color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 280,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontSize: '14px',
              },
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Employee ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Joined</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((emp, index) => (
                  <TableRow
                    key={emp.id}
                    sx={{
                      '&:hover': { backgroundColor: '#f8fafc' },
                      '&:last-child td': { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            fontSize: '13px',
                            fontWeight: 600,
                            backgroundColor: avatarColors[index % avatarColors.length],
                          }}
                        >
                          {getInitials(emp.name)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                          {emp.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                        {emp.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {emp.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={emp.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '12px',
                          backgroundColor: emp.status === 'Active' ? '#dcfce7' : '#fee2e2',
                          color: emp.status === 'Active' ? '#16a34a' : '#dc2626',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {emp.joined}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" sx={{ color: '#3b82f6' }} onClick={() => handleEditOpen(emp)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" sx={{ color: '#ef4444' }} onClick={() => handleDeleteOpen(emp)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* ── Edit Dialog ── */}
      <Dialog
        open={editOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Edit Employee</Typography>
          <IconButton onClick={handleEditClose} sx={{ color: '#64748b' }}><Close /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {editError && <Alert severity="error" sx={{ mb: 2 }}>{editError}</Alert>}

          {/* Read-only fields */}
          <TextField
            fullWidth label="Employee ID" value={editData?.id || ''}
            disabled variant="outlined" margin="normal"
            sx={{ mb: 1, '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#94a3b8' } }}
          />
          <TextField
            fullWidth label="Employee Name" value={editData?.name || ''}
            disabled variant="outlined" margin="normal"
            sx={{ mb: 2, '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#94a3b8' } }}
          />

          {/* Editable fields */}
          <TextField
            fullWidth label="Email" value={editData?.email || ''}
            onChange={handleEditChange('email')}
            variant="outlined" margin="normal" sx={{ mb: 2 }}
          />
          <TextField
            fullWidth select label="Status" value={editData?.status || ''}
            onChange={handleEditChange('status')}
            variant="outlined" margin="normal"
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button onClick={handleEditClose} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none', minWidth: 100 }}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" sx={{ borderRadius: '8px', textTransform: 'none', minWidth: 100, backgroundColor: '#1d4ed8', '&:hover': { backgroundColor: '#1e40af' } }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmber sx={{ color: '#f59e0b', fontSize: 26 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Delete Employee</Typography>
          </Box>
          <IconButton onClick={handleDeleteClose} sx={{ color: '#64748b' }}><Close /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Alert severity="error" sx={{ mb: 2, fontWeight: 500 }}>This action cannot be undone.</Alert>
          <Typography variant="body1" sx={{ color: '#475569' }}>
            Are you sure you want to delete employee{' '}
            <strong style={{ color: '#1e293b' }}>{deleteTarget?.name}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontFamily: 'monospace', mt: 0.5 }}>
            {deleteTarget?.id}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button onClick={handleDeleteClose} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none', minWidth: 100 }}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{ borderRadius: '8px', textTransform: 'none', minWidth: 120, backgroundColor: '#ef4444', '&:hover': { backgroundColor: '#dc2626' } }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AllEmployees;

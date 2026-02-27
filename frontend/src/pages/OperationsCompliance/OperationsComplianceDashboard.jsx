import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Grid,
} from '@mui/material';
import {
  ExitToApp,
  Lock,
  Person,
  Close,
  Visibility,
  VisibilityOff,
  Warning,
  AccessTime,
  CalendarMonth,
  ShowChart,
  Assignment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ViolationsTable } from './ViolationsTable';
import { SafetyScoreCard } from './SafetyScoreCard';
import { DailyReportsView } from './DailyReportsView';
import { MonthlyReportsView } from './MonthlyReportsView';
import { AnalyticsView } from './AnalyticsView';

const drawerWidth = 260;

/* ─── Mock Data ─────────────────────────────────────────── */
const INITIAL_VIOLATIONS = [
  { id: 'VIO-001', date: '2026-02-27', employee: 'Juan Dela Cruz',  section: 'Storage Block A',      type: 'No Helmet',      confidence: 94, status: 'Pending'       },
  { id: 'VIO-002', date: '2026-02-27', employee: 'Maria Santos',    section: 'Loading Dock 1',        type: 'No Safety Vest', confidence: 88, status: 'Verified'      },
  { id: 'VIO-003', date: '2026-02-27', employee: 'Carlos Reyes',    section: 'Packing Station B',     type: 'No Gloves',      confidence: 91, status: 'Pending'       },
  { id: 'VIO-004', date: '2026-02-27', employee: 'Ana Lopez',       section: 'Restricted Area North', type: 'No Helmet',      confidence: 97, status: 'Verified'      },
  { id: 'VIO-005', date: '2026-02-26', employee: 'Pedro Garcia',    section: 'Storage Block A',       type: 'No Mask',        confidence: 85, status: 'False Positive'},
];

const DAILY_METRICS = {
  violations: 4, complianceScore: 92, safetyScore: 93, totalPeople: 38,
};
const VIOLATION_BREAKDOWN = {
  noHelmet: 2, noMask: 1, noSafetyVest: 1, noGloves: 1, noSafetyBoots: 0,
};
const MONTHLY_METRICS = {
  violations: 47, avgComplianceScore: 91, avgSafetyScore: 92, totalPeople: 35,
};
const HOURLY_DATA = [
  { hour: '9AM',  violations: 2,  complianceScore: 95 },
  { hour: '10AM', violations: 1,  complianceScore: 97 },
  { hour: '11AM', violations: 3,  complianceScore: 92 },
  { hour: '12PM', violations: 0,  complianceScore: 100 },
  { hour: '1PM',  violations: 4,  complianceScore: 89 },
  { hour: '2PM',  violations: 2,  complianceScore: 94 },
  { hour: '3PM',  violations: 1,  complianceScore: 97 },
  { hour: '4PM',  violations: 3,  complianceScore: 91 },
  { hour: '5PM',  violations: 0,  complianceScore: 100 },
];
const DAILY_DATA = [
  { date: 'Feb 21', violations: 5,  complianceScore: 91, safetyScore: 92 },
  { date: 'Feb 22', violations: 3,  complianceScore: 94, safetyScore: 95 },
  { date: 'Feb 23', violations: 7,  complianceScore: 88, safetyScore: 89 },
  { date: 'Feb 24', violations: 2,  complianceScore: 96, safetyScore: 97 },
  { date: 'Feb 25', violations: 4,  complianceScore: 92, safetyScore: 93 },
  { date: 'Feb 26', violations: 6,  complianceScore: 90, safetyScore: 91 },
  { date: 'Feb 27', violations: 4,  complianceScore: 93, safetyScore: 93 },
];

const pageMeta = [
  { label: 'View Violations',  icon: <Warning      sx={{ fontSize: 20, color: '#7c3aed' }} /> },
  { label: 'Daily Reports',    icon: <AccessTime   sx={{ fontSize: 20, color: '#7c3aed' }} /> },
  { label: 'Monthly Reports',  icon: <CalendarMonth sx={{ fontSize: 20, color: '#7c3aed' }} /> },
  { label: 'Analytics',        icon: <ShowChart    sx={{ fontSize: 20, color: '#7c3aed' }} /> },
];

const navItems = [
  { label: 'View Violations',  Icon: Warning       },
  { label: 'Daily Reports',    Icon: AccessTime    },
  { label: 'Monthly Reports',  Icon: CalendarMonth },
  { label: 'Analytics',        Icon: ShowChart     },
];

const OperationsComplianceDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Violations state
  const [violations, setViolations] = useState(INITIAL_VIOLATIONS);
  const handleUpdateViolation = (updated) =>
    setViolations((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  const handleDeleteViolation = (id) =>
    setViolations((prev) => prev.filter((v) => v.id !== id));
  const handleAddViolation = (newV) =>
    setViolations((prev) => [newV, ...prev]);

  // Daily reports state
  const [dailyReports, setDailyReports] = useState([]);
  const handleGenerateDailyReport = (date) => {
    const id = `DR-${Date.now()}`;
    setDailyReports((prev) => [{
      id, date, generatedAt: new Date().toISOString(),
      totalViolations: DAILY_METRICS.violations,
      complianceScore: DAILY_METRICS.complianceScore,
      safetyScore: DAILY_METRICS.safetyScore,
      totalPeople: DAILY_METRICS.totalPeople,
    }, ...prev]);
  };
  const handleDeleteDailyReport = (id) =>
    setDailyReports((prev) => prev.filter((r) => r.id !== id));

  // Monthly reports state
  const [monthlyReports, setMonthlyReports] = useState([]);
  const handleGenerateMonthlyReport = (startDate, endDate) => {
    if (!startDate || !endDate) return;
    const id = `MR-${Date.now()}`;
    setMonthlyReports((prev) => [{
      id, startDate, endDate, generatedAt: new Date().toISOString(),
      totalViolations: MONTHLY_METRICS.violations,
      avgComplianceScore: MONTHLY_METRICS.avgComplianceScore,
      avgSafetyScore: MONTHLY_METRICS.avgSafetyScore,
      totalPeople: MONTHLY_METRICS.totalPeople,
    }, ...prev]);
  };
  const handleDeleteMonthlyReport = (id) =>
    setMonthlyReports((prev) => prev.filter((r) => r.id !== id));

  const handleLogout = () => { logout(); navigate('/'); };

  const handleChangePasswordOpen = () => {
    setChangePasswordOpen(true);
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleChangePasswordClose = () => {
    setChangePasswordOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordInputChange = (field) => (e) =>
    setPasswordForm({ ...passwordForm, [field]: e.target.value });

  const togglePasswordVisibility = (field) =>
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });

  const validatePasswordForm = () => {
    if (!passwordForm.currentPassword) { setPasswordError('Current password is required'); return false; }
    if (!passwordForm.newPassword) { setPasswordError('New password is required'); return false; }
    if (passwordForm.newPassword.length < 6) { setPasswordError('New password must be at least 6 characters'); return false; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPasswordError('New passwords do not match'); return false; }
    if (passwordForm.currentPassword === passwordForm.newPassword) { setPasswordError('New password must be different from current password'); return false; }
    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPasswordSuccess('Password changed successfully!');
      setTimeout(() => handleChangePasswordClose(), 2000);
    } catch {
      setPasswordError('Failed to change password. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>

      {/* ── Sidebar ── */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40, height: 40,
                backgroundColor: '#7c3aed',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              }}
            >
              <Assignment sx={{ fontSize: 22 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '13px', lineHeight: 1.3 }}>
              Operations &amp; Compliance
            </Typography>
          </Box>
        </Box>

        {/* Nav */}
        <List sx={{ pt: 2 }}>          
          {navItems.map((item, index) => {
            const { Icon } = item;
            const isSelected = activeTab === index;
            return (
              <ListItem
                key={index}
                button
                selected={isSelected}
                onClick={() => setActiveTab(index)}
                sx={{
                  mx: 1.5, mb: 0.5, borderRadius: '8px',
                  '&.Mui-selected': {
                    backgroundColor: '#ede9fe', color: '#7c3aed',
                    '& .MuiListItemIcon-root': { color: '#7c3aed' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Icon sx={{ color: isSelected ? '#7c3aed' : '#64748b', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: isSelected ? 700 : 400, fontSize: '13px' }}
                />
              </ListItem>
            );
          })}
        </List>

        {/* Bottom buttons */}
        <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Button
            fullWidth variant="outlined" startIcon={<Lock />}
            onClick={handleChangePasswordOpen}
            sx={{ mb: 1, borderRadius: '8px', textTransform: 'none', fontSize: '13px', borderColor: '#7c3aed', color: '#7c3aed' }}
          >
            Change Password
          </Button>
          <Button
            fullWidth variant="contained" startIcon={<ExitToApp />}
            onClick={handleLogout}
            sx={{ borderRadius: '8px', backgroundColor: '#ef4444', textTransform: 'none', fontSize: '13px', '&:hover': { backgroundColor: '#dc2626' } }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* ── Main Content ── */}
      <Box
        component="main"
        sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f8fafc', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
      >
        {/* Top AppBar */}
        <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', zIndex: 1 }}>
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important', px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pageMeta[activeTab]?.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '18px' }}>
                {pageMeta[activeTab]?.label}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 32, height: 32, backgroundColor: '#ede9fe', color: '#7c3aed', fontSize: '14px' }}>
                <Person sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                Welcome, {user?.name || user?.username || user?.email || 'Officer'}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Safety Score Card — full width top banner (all tabs) */}
        <Box sx={{ px: 3, pt: 3, pb: 0 }}>
          <SafetyScoreCard
            totalPeople={DAILY_METRICS.totalPeople}
            violations={DAILY_METRICS.violations}
            safetyScore={DAILY_METRICS.safetyScore}
            violationBreakdown={VIOLATION_BREAKDOWN}
          />
        </Box>

        {/* Pages */}
        <Box sx={{ p: 3, flexGrow: 1 }}>
          {/* View Violations */}
          {activeTab === 0 && (
            <ViolationsTable
              violations={violations}
              onUpdate={handleUpdateViolation}
              onDelete={handleDeleteViolation}
              onAdd={handleAddViolation}
            />
          )}

          {/* Daily Reports */}
          {activeTab === 1 && (
            <DailyReportsView
              reports={dailyReports}
              onGenerateReport={handleGenerateDailyReport}
              onDeleteReport={handleDeleteDailyReport}
              dailyMetrics={DAILY_METRICS}
            />
          )}

          {/* Monthly Reports */}
          {activeTab === 2 && (
            <MonthlyReportsView
              reports={monthlyReports}
              onGenerateReport={handleGenerateMonthlyReport}
              onDeleteReport={handleDeleteMonthlyReport}
              monthlyMetrics={MONTHLY_METRICS}
            />
          )}

          {/* Analytics */}
          {activeTab === 3 && (
            <AnalyticsView
              hourlyData={HOURLY_DATA}
              dailyData={DAILY_DATA}
            />
          )}
        </Box>
      </Box>

      {/* ── Change Password Dialog ── */}
      <Dialog open={changePasswordOpen} onClose={handleChangePasswordClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px', padding: '8px' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Change Password</Typography>
          <IconButton onClick={handleChangePasswordClose} sx={{ color: '#64748b' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {passwordError   && <Alert severity="error"   sx={{ mb: 2 }}>{passwordError}</Alert>}
          {passwordSuccess && <Alert severity="success" sx={{ mb: 2 }}>{passwordSuccess}</Alert>}
          {[
            { field: 'currentPassword', label: 'Current Password',     key: 'current' },
            { field: 'newPassword',     label: 'New Password',         key: 'new'     },
            { field: 'confirmPassword', label: 'Confirm New Password', key: 'confirm' },
          ].map(({ field, label, key }) => (
            <TextField
              key={field} fullWidth label={label} margin="normal" sx={{ mb: 2 }}
              type={showPasswords[key] ? 'text' : 'password'}
              value={passwordForm[field]}
              onChange={handlePasswordInputChange(field)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => togglePasswordVisibility(key)} edge="end">
                    {showPasswords[key] ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button onClick={handleChangePasswordClose} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none', minWidth: 100 }}>
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword} variant="contained" disabled={passwordSuccess !== ''}
            sx={{ borderRadius: '8px', textTransform: 'none', minWidth: 100, backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6d28d9' } }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OperationsComplianceDashboard;

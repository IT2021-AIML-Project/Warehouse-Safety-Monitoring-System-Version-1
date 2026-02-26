import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Badge,
} from '@mui/material';
import {
  Shield,
  ExitToApp,
  AccountCircle,
  Dashboard,
  HeadsetMic,
  Home,
  Search,
  Notifications,
  NotificationsNone,
  NotificationsActive,
  CheckCircle,
  Settings,
  Close,
  FiberManualRecord,
} from '@mui/icons-material';

const navTabs = [
  { key: 0, label: 'Dashboard', icon: Dashboard },
  { key: 1, label: 'Support & Inquiries', icon: HeadsetMic },
];

// ── Severity styles for notification dots ────────────────────────────────
const severityStyle = {
  warning: { bg: '#fef9c3', color: '#a16207', dot: '#f59e0b' },
  danger:  { bg: '#fee2e2', color: '#dc2626', dot: '#ef4444' },
  info:    { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  success: { bg: '#dcfce7', color: '#16a34a', dot: '#22c55e' },
};

const Navbar = ({
  user,
  onLogout,
  onChangePassword,
  activeTab,
  onTabChange,
  notifications = [],
  onMarkAllRead,
  onMarkRead,
  photoUrl,
  onSeeAllNotifications,
  onViewNotification,
}) => {
  const initials    = (user?.fullName || user?.username || 'E').charAt(0).toUpperCase();
  const displayName = user?.fullName || user?.username || 'Employee';

  const [notifOpen, setNotifOpen] = useState(false);
  const panelRef = useRef(null);
  const bellRef  = useRef(null);
  const unread   = notifications.filter((n) => !n.read).length;

  // Close panel on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        bellRef.current  && !bellRef.current.contains(e.target)
      ) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>

      {/* ── Tier 1: White top bar ── */}
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          px: { xs: 3, md: 5 },
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 54, height: 54, borderRadius: '12px',
              background: 'linear-gradient(135deg, #1e293b 0%, #1d4ed8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Shield sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          {/* Vertical divider line */}
          <Box sx={{ width: '1px', height: 44, backgroundColor: '#cbd5e1', mx: 0.5 }} />
          <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '26px', letterSpacing: '-0.3px' }}>
            Safety<Box component="span" sx={{ color: '#1d4ed8' }}>First</Box>
          </Typography>
        </Box>

        {/* Right: user avatar + name + initials box */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
          {/* Avatar with badge feel */}
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={photoUrl || undefined}
              sx={{
                width: 42, height: 42, fontSize: '16px', fontWeight: 700,
                background: 'linear-gradient(135deg, #1e293b, #1d4ed8)',
                cursor: 'pointer',
              }}
              onClick={onChangePassword}
            >
              {!photoUrl && initials}
            </Avatar>
          </Box>

          {/* Name display */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
              {displayName}
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#64748b' }}>›</Typography>
          </Box>

          <Box sx={{ width: '1px', height: 28, backgroundColor: '#e2e8f0', mx: 0.5 }} />

          {/* 🔔 Bell Icon */}
          <Tooltip title="Notifications">
            <IconButton
              ref={bellRef}
              onClick={() => setNotifOpen((v) => !v)}
              size="small"
              sx={{
                border: '1px solid #e2e8f0', borderRadius: '8px',
                p: '6px',
                backgroundColor: notifOpen ? '#eff6ff' : '#f8fafc',
                color: notifOpen ? '#1d4ed8' : '#475569',
                borderColor: notifOpen ? '#93c5fd' : '#e2e8f0',
                '&:hover': { backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#93c5fd' },
              }}
            >
              <Badge
                badgeContent={unread}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '10px', minWidth: 16, height: 16,
                    top: -2, right: -2, border: '2px solid #fff',
                  },
                }}
              >
                {unread > 0
                  ? <NotificationsActive sx={{ fontSize: 20 }} />
                  : <NotificationsNone sx={{ fontSize: 20 }} />
                }
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Tooltip title="My Profile">
            <IconButton
              onClick={onChangePassword}
              size="small"
              sx={{
                color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px',
                p: '6px', backgroundColor: '#f8fafc',
                '&:hover': { backgroundColor: '#fffbeb', color: '#d97706', borderColor: '#fcd34d' },
              }}
            >
              <AccountCircle sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          {/* Logout */}
          <Button
            variant="contained"
            startIcon={<ExitToApp sx={{ fontSize: '20px !important' }} />}
            onClick={onLogout}
            sx={{
              borderRadius: '8px', textTransform: 'none', fontSize: '15px', fontWeight: 700,
              backgroundColor: '#ef4444', px: 2.5, py: 1,
              '&:hover': { backgroundColor: '#dc2626' },
            }}
          >
            Logout
          </Button>

          {/* ── Notification Panel ── */}
          {notifOpen && (
            <Box
              ref={panelRef}
              sx={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                right: 0,
                width: 400,
                maxHeight: 560,
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.13)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 1300,
              }}
            >
              {/* Panel header */}
              <Box sx={{ px: 2.5, py: 1.8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Notifications sx={{ color: '#1d4ed8', fontSize: 20 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>Notifications</Typography>
                  {unread > 0 && (
                    <Box sx={{ backgroundColor: '#ef4444', borderRadius: '10px', px: 0.9, py: 0.1 }}>
                      <Typography sx={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>{unread}</Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Tooltip title="Mark all as read">
                    <IconButton size="small" onClick={() => onMarkAllRead?.()} sx={{ color: '#64748b', '&:hover': { color: '#16a34a', backgroundColor: '#dcfce7' }, borderRadius: '6px', p: '4px' }}>
                      <CheckCircle sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Notification settings">
                    <IconButton size="small" sx={{ color: '#64748b', '&:hover': { color: '#1d4ed8', backgroundColor: '#dbeafe' }, borderRadius: '6px', p: '4px' }}>
                      <Settings sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Close">
                    <IconButton size="small" onClick={() => setNotifOpen(false)} sx={{ color: '#64748b', '&:hover': { color: '#ef4444', backgroundColor: '#fee2e2' }, borderRadius: '6px', p: '4px' }}>
                      <Close sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Notification list */}
              <Box sx={{ overflowY: 'auto', flex: 1 }}>
                {notifications.length === 0 ? (
                  <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <NotificationsNone sx={{ fontSize: 44, color: '#cbd5e1' }} />
                    <Typography sx={{ color: '#94a3b8', fontSize: '14px' }}>No notifications yet</Typography>
                  </Box>
                ) : (
                  notifications.map((notif, i) => {
                    const style = severityStyle[notif.severity] || severityStyle.info;
                    return (
                      <React.Fragment key={notif.id}>
                        <Box
                          onClick={() => onMarkRead?.(notif.id)}
                          sx={{
                            px: 2.5, py: 1.6,
                            display: 'flex', alignItems: 'flex-start', gap: 1.5,
                            cursor: 'pointer',
                            backgroundColor: notif.read ? '#fff' : '#f8fafc',
                            transition: 'background 0.12s',
                            '&:hover': { backgroundColor: '#f1f5f9' },
                          }}
                        >
                          {/* Unread dot */}
                          <Box sx={{ pt: '7px', flexShrink: 0 }}>
                            <FiberManualRecord sx={{ fontSize: 9, color: notif.read ? 'transparent' : style.dot }} />
                          </Box>
                          {/* Content */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: '13px', fontWeight: notif.read ? 400 : 700, color: '#1e293b', lineHeight: 1.45, mb: 0.4 }}>
                              {notif.title}
                            </Typography>
                            {notif.message && (
                              <Typography sx={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4, mb: 0.5 }}>
                                {notif.message}
                              </Typography>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.3 }}>
                              <Typography sx={{ fontSize: '11px', color: '#94a3b8' }}>{notif.time}</Typography>
                              <Typography
                                onClick={(e) => { e.stopPropagation(); onViewNotification?.(notif.id); setNotifOpen(false); }}
                                sx={{ fontSize: '11px', color: style.color, fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                              >
                                View full notification
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        {i < notifications.length - 1 && <Divider sx={{ borderColor: '#f1f5f9', mx: 2 }} />}
                      </React.Fragment>
                    );
                  })
                )}
              </Box>

              {/* Panel footer */}
              {notifications.length > 0 && (
                <Box sx={{ borderTop: '1px solid #f1f5f9', py: 1.4, textAlign: 'center', backgroundColor: '#f8fafc' }}>
                  <Typography
                    onClick={() => { onSeeAllNotifications?.(); setNotifOpen(false); }}
                    sx={{ color: '#1d4ed8', fontSize: '13px', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  >
                    See all notifications →
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Tier 2: Dark nav bar ── */}
      <Box
        sx={{
          backgroundColor: '#2d3748',
          px: { xs: 2, md: 4 },
          height: 52,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: home + tabs */}
        <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
          {/* Home icon */}
          <Box
            sx={{
              display: 'flex', alignItems: 'center', px: 1.5,
              color: '#94a3b8',
              '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.07)', cursor: 'pointer' },
            }}
          >
            <Home sx={{ fontSize: 18 }} />
          </Box>

          {/* Nav tabs */}
          {navTabs.map((tab) => {
            const IconComp = tab.icon;
            const active = activeTab === tab.key;
            return (
              <Box
                key={tab.key}
                onClick={() => onTabChange && onTabChange(tab.key)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1, px: 3,
                  cursor: 'pointer',
                  color: active ? '#ffffff' : '#94a3b8',
                  fontWeight: active ? 600 : 400,
                  fontSize: '15px',
                  borderBottom: active ? '3px solid #f59e0b' : '3px solid transparent',
                  transition: 'all 0.15s',
                  userSelect: 'none',
                  '&:hover': {
                    color: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                  },
                }}
              >
                <IconComp sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: '15px', fontWeight: 'inherit', color: 'inherit', lineHeight: 1 }}>
                  {tab.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Right: search icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
          <IconButton
            size="small"
            sx={{
              color: '#94a3b8', borderRadius: '6px', p: '5px',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff' },
            }}
          >
            <Search sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;

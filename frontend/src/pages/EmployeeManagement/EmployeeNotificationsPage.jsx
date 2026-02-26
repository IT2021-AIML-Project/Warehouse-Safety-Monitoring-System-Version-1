import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  NotificationsActive,
  NotificationsNone,
  CheckCircle,
  ArrowBack,
  FiberManualRecord,
  WarningAmber,
  ErrorOutline,
  InfoOutlined,
  TaskAlt,
} from '@mui/icons-material';

// ── Severity config ──────────────────────────────────────────────────────────
const severityConfig = {
  warning: {
    dot: '#f59e0b', bg: '#fef9c3', color: '#a16207',
    border: '#fcd34d', lightBg: '#fffbeb',
    icon: WarningAmber, label: 'Warning',
  },
  danger: {
    dot: '#ef4444', bg: '#fee2e2', color: '#dc2626',
    border: '#fca5a5', lightBg: '#fff5f5',
    icon: ErrorOutline, label: 'Alert',
  },
  info: {
    dot: '#3b82f6', bg: '#dbeafe', color: '#1d4ed8',
    border: '#93c5fd', lightBg: '#eff6ff',
    icon: InfoOutlined, label: 'Info',
  },
  success: {
    dot: '#22c55e', bg: '#dcfce7', color: '#16a34a',
    border: '#86efac', lightBg: '#f0fdf4',
    icon: TaskAlt, label: 'Success',
  },
};

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'warning', label: 'Warning' },
  { key: 'danger', label: 'Alert' },
  { key: 'info', label: 'Info' },
  { key: 'success', label: 'Success' },
];

// ── Component ────────────────────────────────────────────────────────────────
const EmployeeNotificationsPage = ({
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onBack,
  selectedNotifId = null,
}) => {
  const [filter, setFilter] = useState('all');
  const selectedRef = useRef(null);

  // Scroll highlighted notification into view
  useEffect(() => {
    if (selectedNotifId && selectedRef.current) {
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
    }
  }, [selectedNotifId]);

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.severity === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>

      {/* ── Page header ── */}
      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '16px', p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#f8fafc' }}>
        <Tooltip title="Back to Dashboard">
          <IconButton
            onClick={onBack}
            sx={{ border: '1px solid #e2e8f0', borderRadius: '10px', p: '7px', color: '#475569', backgroundColor: '#fff', '&:hover': { backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#93c5fd' } }}
          >
            <ArrowBack sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #1e293b 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {unreadCount > 0
            ? <NotificationsActive sx={{ color: '#fff', fontSize: 26 }} />
            : <NotificationsNone sx={{ color: '#fff', fontSize: 26 }} />}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '22px', lineHeight: 1.2 }}>
            Notifications
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '14px' }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </Typography>
        </Box>

        {unreadCount > 0 && (
          <Tooltip title="Mark all as read">
            <Button
              startIcon={<CheckCircle sx={{ fontSize: 17 }} />}
              onClick={onMarkAllRead}
              size="small"
              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '13px', color: '#16a34a', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4', borderRadius: '10px', px: 2, '&:hover': { backgroundColor: '#dcfce7' } }}
            >
              Mark all read
            </Button>
          </Tooltip>
        )}
      </Paper>

      {/* ── Filter tabs ── */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {FILTER_TABS.map((tab) => {
          const count = tab.key === 'all'
            ? notifications.length
            : tab.key === 'unread'
            ? notifications.filter((n) => !n.read).length
            : notifications.filter((n) => n.severity === tab.key).length;

          const active = filter === tab.key;
          const cfg = severityConfig[tab.key];

          return (
            <Chip
              key={tab.key}
              label={`${tab.label}${count > 0 ? ` (${count})` : ''}`}
              onClick={() => setFilter(tab.key)}
              sx={{
                fontWeight: active ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                backgroundColor: active
                  ? cfg ? cfg.bg : '#dbeafe'
                  : '#f1f5f9',
                color: active
                  ? cfg ? cfg.color : '#1d4ed8'
                  : '#64748b',
                border: active
                  ? `1.5px solid ${cfg ? cfg.border : '#93c5fd'}`
                  : '1.5px solid transparent',
                '&:hover': {
                  backgroundColor: cfg ? cfg.bg : '#dbeafe',
                  color: cfg ? cfg.color : '#1d4ed8',
                },
              }}
            />
          );
        })}
      </Box>

      {/* ── Notification cards ── */}
      {filtered.length === 0 ? (
        <Paper elevation={0} sx={{ border: '1px dashed #e2e8f0', borderRadius: '16px', p: 8, textAlign: 'center' }}>
          <NotificationsNone sx={{ fontSize: 52, color: '#cbd5e1', mb: 1.5 }} />
          <Typography sx={{ color: '#94a3b8', fontSize: '15px', fontWeight: 500 }}>No notifications in this category.</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map((notif) => {
            const cfg = severityConfig[notif.severity] || severityConfig.info;
            const SevIcon = cfg.icon;
            const isHighlighted = notif.id === selectedNotifId;

            return (
              <Paper
                key={notif.id}
                ref={isHighlighted ? selectedRef : null}
                elevation={0}
                sx={{
                  border: `1.5px solid ${isHighlighted ? cfg.border : notif.read ? '#e2e8f0' : cfg.border}`,
                  borderLeft: `5px solid ${cfg.dot}`,
                  borderRadius: '14px',
                  p: 3,
                  backgroundColor: isHighlighted ? cfg.lightBg : notif.read ? '#fff' : cfg.lightBg,
                  transition: 'all 0.2s',
                  boxShadow: isHighlighted ? `0 0 0 3px ${cfg.dot}33` : 'none',
                  '&:hover': { boxShadow: `0 4px 20px rgba(0,0,0,0.08)`, borderColor: cfg.border },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>

                  {/* Severity icon */}
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <SevIcon sx={{ fontSize: 22, color: cfg.color }} />
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.6, flexWrap: 'wrap' }}>
                      {!notif.read && (
                        <FiberManualRecord sx={{ fontSize: 9, color: cfg.dot, flexShrink: 0 }} />
                      )}
                      <Typography sx={{ fontWeight: notif.read ? 600 : 800, color: '#1e293b', fontSize: '15px', lineHeight: 1.3 }}>
                        {notif.title}
                      </Typography>
                      <Chip
                        label={cfg.label}
                        size="small"
                        sx={{ fontSize: '11px', fontWeight: 700, backgroundColor: cfg.bg, color: cfg.color, border: 'none', height: 20, px: 0.3 }}
                      />
                      {!notif.read && (
                        <Chip label="Unread" size="small" sx={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#dbeafe', color: '#1d4ed8', border: 'none', height: 20, px: 0.3 }} />
                      )}
                    </Box>

                    <Typography sx={{ color: '#475569', fontSize: '14px', lineHeight: 1.7, mb: 1.5 }}>
                      {notif.message}
                    </Typography>

                    <Divider sx={{ mb: 1.5, borderColor: '#f1f5f9' }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                      <Typography sx={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
                        🕐 {notif.time}
                      </Typography>
                      {!notif.read && (
                        <Button
                          size="small"
                          startIcon={<CheckCircle sx={{ fontSize: 14 }} />}
                          onClick={() => onMarkRead?.(notif.id)}
                          sx={{
                            textTransform: 'none', fontWeight: 700, fontSize: '12px',
                            color: '#16a34a', border: '1px solid #bbf7d0',
                            backgroundColor: '#f0fdf4', borderRadius: '8px', px: 1.5,
                            '&:hover': { backgroundColor: '#dcfce7' },
                          }}
                        >
                          Mark as read
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default EmployeeNotificationsPage;

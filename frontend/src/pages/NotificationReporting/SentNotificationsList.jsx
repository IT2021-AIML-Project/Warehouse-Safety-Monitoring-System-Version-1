import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Collapse,
} from '@mui/material';
import {
  WarningAmber,
  ErrorOutline,
  InfoOutlined,
  TaskAlt,
  EditOutlined,
  DeleteOutline,
  Close,
  CheckCircle,
  NotificationsNone,
  History,
  LocationOn,
  Group,
  Person,
  Save,
  PictureAsPdf,
  Image as ImageIcon,
  InsertDriveFile,
  AttachFile,
  Visibility,
} from '@mui/icons-material';

// ── Severity config ───────────────────────────────────────────────────────────
const SEVERITIES = [
  { value: 'info',    label: 'Info',    color: '#1d4ed8', bg: '#dbeafe', border: '#93c5fd', icon: InfoOutlined  },
  { value: 'warning', label: 'Warning', color: '#a16207', bg: '#fef9c3', border: '#fcd34d', icon: WarningAmber  },
  { value: 'danger',  label: 'Alert',   color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', icon: ErrorOutline  },
  { value: 'success', label: 'Success', color: '#16a34a', bg: '#dcfce7', border: '#86efac', icon: TaskAlt       },
];

const sevCfg = (val) => SEVERITIES.find((s) => s.value === val) || SEVERITIES[0];

// ── File helpers ────────────────────────────────────────────────────────
const getFileIcon = (type) => {
  if (type === 'application/pdf')  return PictureAsPdf;
  if (type?.startsWith('image/'))  return ImageIcon;
  return InsertDriveFile;
};
const getFileColor = (type) => {
  if (type === 'application/pdf')  return { color: '#dc2626', bg: '#fff1f2', border: '#fecaca' };
  if (type?.startsWith('image/'))  return { color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' };
  return                                   { color: '#0f766e', bg: '#f0fdfa', border: '#5eead4' };
};
const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ── Component ─────────────────────────────────────────────────────────────────
const SentNotificationsList = ({ notifications = [], onDelete, onEdit }) => {
  const [deleteId, setDeleteId]       = useState(null);
  const [editNotif, setEditNotif]     = useState(null);
  const [editForm, setEditForm]       = useState({ title: '', message: '', severity: 'info' });
  const [editErrors, setEditErrors]   = useState({});
  const [successMsg, setSuccessMsg]   = useState('');

  // ── Delete flow ──
  const confirmDelete = (id) => setDeleteId(id);
  const handleDelete  = () => {
    onDelete?.(deleteId);
    setDeleteId(null);
  };

  // ── Edit flow ──
  const openEdit = (notif) => {
    setEditNotif(notif);
    setEditForm({ title: notif.title, message: notif.message, severity: notif.severity });
    setEditErrors({});
  };

  const validateEdit = () => {
    const errs = {};
    if (!editForm.title.trim())   errs.title   = 'Title is required.';
    if (!editForm.message.trim()) errs.message = 'Message is required.';
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveEdit = () => {
    if (!validateEdit()) return;
    onEdit?.({ ...editNotif, title: editForm.title.trim(), message: editForm.message.trim(), severity: editForm.severity });
    setSuccessMsg(`"${editForm.title}" updated successfully.`);
    setEditNotif(null);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 3 }, py: 3 }}>

      {/* ── Page header ── */}
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #e2e8f0', borderRadius: '16px', p: 3, mb: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          background: 'linear-gradient(135deg, #fff5f5 0%, #fff 60%)',
        }}
      >
        <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
          <History sx={{ color: '#fff', fontSize: 28 }} />
        </Box>
        <Typography sx={{ color: '#64748b', fontSize: '14px' }}>
          View, edit, or delete previously sent notifications.
        </Typography>
      </Paper>

      {/* ── Success alert ── */}
      <Collapse in={!!successMsg}>
        <Alert icon={<CheckCircle />} severity="success" sx={{ mb: 3, borderRadius: '12px', fontWeight: 600 }}
          action={<IconButton size="small" onClick={() => setSuccessMsg('')}><Close fontSize="small" /></IconButton>}>
          {successMsg}
        </Alert>
      </Collapse>

      {/* ── Empty state ── */}
      {notifications.length === 0 ? (
        <Paper elevation={0} sx={{ border: '1px dashed #e2e8f0', borderRadius: '16px', p: 8, textAlign: 'center' }}>
          <NotificationsNone sx={{ fontSize: 52, color: '#cbd5e1', mb: 1.5 }} />
          <Typography sx={{ color: '#94a3b8', fontSize: '15px', fontWeight: 500 }}>
            No notifications sent yet. Use "Send Notification" to compose one.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {notifications.map((notif) => {
            const cfg   = sevCfg(notif.severity);
            const SevIcon = cfg.icon;
            const recipientLabel =
              notif.recipientMode === 'all'
                ? 'All Employees'
                : notif.zones?.length
                ? `${notif.zones.join(', ')}`
                : `${notif.recipients?.length ?? 0} Employee${(notif.recipients?.length ?? 0) !== 1 ? 's' : ''}`;

            const recipientIcon =
              notif.recipientMode === 'all'
                ? <Group sx={{ fontSize: 14, color: '#16a34a' }} />
                : notif.zones?.length
                ? <LocationOn sx={{ fontSize: 14, color: '#7c3aed' }} />
                : <Person sx={{ fontSize: 14, color: '#ef4444' }} />;

            return (
              <Paper
                key={notif.id}
                elevation={0}
                sx={{
                  border: `1.5px solid ${cfg.border}`,
                  borderLeft: `5px solid ${cfg.color}`,
                  borderRadius: '14px',
                  p: 0,
                  backgroundColor: '#fff',
                  overflow: 'hidden',
                  '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
                  transition: 'box-shadow 0.2s',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 2.5 }}>
                  {/* Severity icon */}
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <SevIcon sx={{ fontSize: 22, color: cfg.color }} />
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
                        {notif.title}
                      </Typography>
                      <Chip label={cfg.label} size="small" sx={{ fontSize: '11px', fontWeight: 700, backgroundColor: cfg.bg, color: cfg.color, border: 'none', height: 20 }} />
                    </Box>
                    <Typography sx={{ color: '#475569', fontSize: '13.5px', lineHeight: 1.6, mb: 1.5 }}>
                      {notif.message}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      {/* Recipients */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                        {recipientIcon}
                        <Typography sx={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                          {recipientLabel}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>🕐 {notif.time}</Typography>
                      {notif.attachments?.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AttachFile sx={{ fontSize: 13, color: '#94a3b8' }} />
                          <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>
                            {notif.attachments.length} attachment{notif.attachments.length !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Attachments strip */}
                    {notif.attachments?.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                        {notif.attachments.map((file) => {
                          const FileIcon = getFileIcon(file.type);
                          const clr = getFileColor(file.type);
                          const isImage = file.type?.startsWith('image/');
                          return (
                            <Tooltip key={file.id} title={`${file.name} (${formatBytes(file.size)})`}>
                              <Box
                                onClick={() => window.open(file.url, '_blank')}
                                sx={{
                                  display: 'flex', alignItems: 'center', gap: 0.8,
                                  border: `1px solid ${clr.border}`, borderRadius: '8px',
                                  backgroundColor: clr.bg, px: 1.2, py: 0.6, cursor: 'pointer',
                                  '&:hover': { opacity: 0.8 },
                                }}
                              >
                                {isImage ? (
                                  <Box
                                    component="img"
                                    src={file.url}
                                    alt={file.name}
                                    sx={{ width: 22, height: 22, borderRadius: '4px', objectFit: 'cover', border: `1px solid ${clr.border}` }}
                                  />
                                ) : (
                                  <FileIcon sx={{ fontSize: 16, color: clr.color }} />
                                )}
                                <Typography sx={{ fontSize: '11px', fontWeight: 600, color: clr.color, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {file.name}
                                </Typography>
                              </Box>
                            </Tooltip>
                          );
                        })}
                      </Box>
                    )}
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    <Tooltip title="Edit notification">
                      <IconButton
                        size="small"
                        onClick={() => openEdit(notif)}
                        sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', p: '6px', color: '#1d4ed8', backgroundColor: '#eff6ff', '&:hover': { backgroundColor: '#dbeafe', borderColor: '#93c5fd' } }}
                      >
                        <EditOutlined sx={{ fontSize: 17 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete notification">
                      <IconButton
                        size="small"
                        onClick={() => confirmDelete(notif.id)}
                        sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', p: '6px', color: '#ef4444', backgroundColor: '#fff1f2', '&:hover': { backgroundColor: '#fee2e2', borderColor: '#fca5a5' } }}
                      >
                        <DeleteOutline sx={{ fontSize: 17 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}

      {/* ── Delete confirmation dialog ── */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '14px', p: 1 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#1e293b' }}>Delete Notification</Typography>
          <IconButton size="small" onClick={() => setDeleteId(null)} sx={{ color: '#64748b' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#475569', fontSize: '14px', lineHeight: 1.7 }}>
            Are you sure you want to delete this notification? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} variant="outlined" sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#e2e8f0', color: '#475569', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" sx={{ textTransform: 'none', borderRadius: '8px', backgroundColor: '#ef4444', fontWeight: 700, '&:hover': { backgroundColor: '#dc2626' } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit dialog ── */}
      <Dialog open={!!editNotif} onClose={() => setEditNotif(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#1e293b' }}>Edit Notification</Typography>
          <IconButton size="small" onClick={() => setEditNotif(null)} sx={{ color: '#64748b' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>

          {/* Severity picker */}
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#475569', mb: 1 }}>Severity / Type</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2.5 }}>
            {SEVERITIES.map((s) => {
              const Icon   = s.icon;
              const active = editForm.severity === s.value;
              return (
                <Chip
                  key={s.value}
                  icon={<Icon sx={{ fontSize: 15, color: active ? s.color : '#94a3b8' }} />}
                  label={s.label}
                  onClick={() => setEditForm((f) => ({ ...f, severity: s.value }))}
                  sx={{
                    fontWeight: active ? 700 : 500, fontSize: '13px', cursor: 'pointer',
                    backgroundColor: active ? s.bg : '#f8fafc',
                    color: active ? s.color : '#64748b',
                    border: active ? `1.5px solid ${s.color}44` : '1.5px solid #e2e8f0',
                    '&:hover': { backgroundColor: s.bg, color: s.color },
                  }}
                />
              );
            })}
          </Box>

          <TextField
            fullWidth label="Title" value={editForm.title}
            onChange={(e) => { setEditForm((f) => ({ ...f, title: e.target.value })); setEditErrors((er) => ({ ...er, title: '' })); }}
            error={!!editErrors.title} helperText={editErrors.title}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
          <TextField
            fullWidth multiline rows={4} label="Message" value={editForm.message}
            onChange={(e) => { setEditForm((f) => ({ ...f, message: e.target.value })); setEditErrors((er) => ({ ...er, message: '' })); }}
            error={!!editErrors.message} helperText={editErrors.message}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setEditNotif(null)} variant="outlined" sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#e2e8f0', color: '#475569', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit} variant="contained"
            startIcon={<Save sx={{ fontSize: 17 }} />}
            sx={{ textTransform: 'none', borderRadius: '8px', backgroundColor: '#1d4ed8', fontWeight: 700, '&:hover': { backgroundColor: '#1e40af' } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SentNotificationsList;

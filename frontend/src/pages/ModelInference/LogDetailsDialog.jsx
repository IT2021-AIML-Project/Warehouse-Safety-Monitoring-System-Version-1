import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Alert,
  Tooltip,
} from '@mui/material';

const LogDetailsDialog = ({ open, onClose, inference }) => {
  if (!inference) return null;

  const hasViolations = inference.detections?.some((d) => d.is_violation) ?? false;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Safety Scan Report</DialogTitle>
      <DialogContent>
        {hasViolations ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            <strong>Safety issues detected</strong> — Immediate attention recommended.
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mb: 3 }}>
            All workers appear compliant.
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Scan ID:</strong> {inference.inference_id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Date & time:</strong> {new Date(inference.timestamp).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Processing speed:</strong> {inference.fps} &nbsp;|&nbsp;{' '}
            <strong>Detection accuracy:</strong> {inference.mAP?.toFixed(2)}
          </Typography>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>Safety observations</Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Observation ID</TableCell>
                <TableCell>What was found</TableCell>
                <TableCell>
                  <Tooltip title="Higher percentage means stronger confidence in the detection.">
                    <span>Confidence</span>
                  </Tooltip>
                </TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inference.detections?.map((d) => (
                <TableRow key={d.detection_id}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {d.detection_id?.slice(0, 8)}...
                  </TableCell>
                  <TableCell>{d.class_label}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{(d.confidence * 100).toFixed(0)}%</Typography>
                      <Typography variant="caption" color="text.secondary">
                        AI certainty level
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={d.is_violation ? '⚠ Action Required' : '✔ Safe'}
                      size="small"
                      color={d.is_violation ? 'error' : 'success'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogDetailsDialog;

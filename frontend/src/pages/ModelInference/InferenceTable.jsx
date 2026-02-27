import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import Delete from '@mui/icons-material/Delete';
import CloudUpload from '@mui/icons-material/CloudUpload';
import LogDetailsDialog from './LogDetailsDialog';

const InferenceTable = ({ inferences, onDelete }) => {
  const [selectedInference, setSelectedInference] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleView = (inference) => {
    setSelectedInference(inference);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedInference(null);
  };

  if (!inferences?.length) {
    return (
      <Card
        elevation={0}
        sx={{
          py: 6,
          px: 3,
          textAlign: 'center',
          backgroundColor: 'action.hover',
          borderRadius: 2,
        }}
      >
        <CardContent>
          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No safety scans yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload an image above and click &quot;Run Analysis&quot; to begin monitoring.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell><strong>Scan ID</strong></TableCell>
              <TableCell><strong>Date & Time</strong></TableCell>
              <TableCell>
                <Tooltip title="Processing speed (technical: frames per second)">
                  <span><strong>Processing Speed</strong></span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="How accurately the AI detected safety equipment">
                  <span><strong>Detection Accuracy</strong></span>
                </Tooltip>
              </TableCell>
              <TableCell><strong>Safety Observations</strong></TableCell>
              <TableCell><strong>Safety Issues</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inferences.map((row) => {
              const violations = row.detections?.filter((d) => d.is_violation).length ?? 0;
              return (
                <TableRow key={row.inference_id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {row.inference_id?.slice(0, 8)}...
                  </TableCell>
                  <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{row.fps}</TableCell>
                  <TableCell>{row.mAP?.toFixed(2)}</TableCell>
                  <TableCell>{row.detections?.length ?? 0}</TableCell>
                  <TableCell>{violations}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleView(row)}
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => onDelete?.(row.inference_id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <LogDetailsDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        inference={selectedInference}
      />
    </>
  );
};

export default InferenceTable;

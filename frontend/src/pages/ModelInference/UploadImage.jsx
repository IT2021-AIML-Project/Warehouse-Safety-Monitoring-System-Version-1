import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import CloudUpload from '@mui/icons-material/CloudUpload';

const CLASS_LABELS = ['Helmet', 'No Helmet', 'Vest', 'No Vest'];

const generateId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);

const randomInRange = (min, max) => min + Math.random() * (max - min);

const runSimulatedInference = () => {
  const inference_id = generateId();
  const timestamp = new Date().toISOString();
  const fps = Math.floor(randomInRange(5, 30));
  const mAP = Number((randomInRange(0.8, 0.95)).toFixed(2));
  const numDetections = Math.floor(randomInRange(1, 3)) + 1;

  const detections = [];
  for (let i = 0; i < numDetections; i++) {
    const class_label = CLASS_LABELS[Math.floor(Math.random() * CLASS_LABELS.length)];
    const is_violation = class_label === 'No Helmet' || class_label === 'No Vest';
    const w = 15 + randomInRange(0, 25);
    const h = 15 + randomInRange(0, 25);
    const x = Math.min(85 - w, randomInRange(5, 70));
    const y = Math.min(85 - h, randomInRange(5, 70) + i * 20);
    detections.push({
      detection_id: generateId(),
      class_label,
      confidence: Number((randomInRange(0.6, 0.99)).toFixed(2)),
      is_violation,
      bbox: { x, y, width: w, height: h },
    });
  }

  return {
    inference_id,
    timestamp,
    fps,
    mAP,
    detections,
  };
};

const UploadImage = ({ onInferenceComplete }) => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [lastInference, setLastInference] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setLastInference(null);
    setShowSuccess(false);
  };

  const handleRunInference = () => {
    setLoading(true);
    setShowSuccess(false);
    setTimeout(() => {
      const inference = runSimulatedInference();
      setLastInference(inference);
      onInferenceComplete?.(inference);
      setLoading(false);
      setShowSuccess(true);
    }, 1200);
  };

  const steps = ['Upload Image', 'Click Run Analysis', 'View Safety Report'];

  return (
    <Card elevation={3} sx={{ borderRadius: '16px' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Run a Safety Check
        </Typography>

        <Stepper activeStep={preview ? (lastInference ? 2 : 1) : 0} sx={{ pt: 2, pb: 3 }}>
          <Step>
            <StepLabel>Step 1: Upload Image</StepLabel>
          </Step>
          <Step>
            <StepLabel>Step 2: Click Run Analysis</StepLabel>
          </Step>
          <Step>
            <StepLabel>Step 3: View Safety Report</StepLabel>
          </Step>
        </Stepper>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Upload a warehouse image to check safety compliance.
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            sx={{ mb: 1 }}
          >
            Choose Image
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Button>
        </Box>

        {preview && (
          <Box
            sx={{
              mt: 2,
              position: 'relative',
              display: 'inline-block',
              maxWidth: '100%',
            }}
          >
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 8, display: 'block', verticalAlign: 'top' }}
            />
            {lastInference?.detections?.map((d) => {
              const b = d.bbox || {};
              const isViolation = d.is_violation;
              return (
                <Box
                  key={d.detection_id}
                  sx={{
                    position: 'absolute',
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: `${b.width}%`,
                    height: `${b.height}%`,
                    border: `3px solid ${isViolation ? '#d32f2f' : '#2e7d32'}`,
                    borderRadius: 1,
                    backgroundColor: isViolation ? 'rgba(211, 47, 47, 0.15)' : 'rgba(46, 125, 50, 0.15)',
                    boxSizing: 'border-box',
                    pointerEvents: 'none',
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      position: 'absolute',
                      top: -22,
                      left: 0,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: isViolation ? '#b71c1c' : '#1b5e20',
                      whiteSpace: 'nowrap',
                      textShadow: '0 0 2px #fff, 0 0 4px #fff',
                    }}
                  >
                    {d.class_label} ({(d.confidence * 100).toFixed(0)}%)
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}

        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="The system will analyze the image for safety equipment (helmets, vests) and flag any issues.">
            <span>
              <Button
                variant="contained"
                onClick={handleRunInference}
                disabled={!preview || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Running Analysis…' : 'Run Analysis'}
              </Button>
            </span>
          </Tooltip>
          {loading && (
            <Typography variant="body2" color="text.secondary">
              Analyzing image…
            </Typography>
          )}
        </Box>

        {showSuccess && lastInference && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Safety check complete. View the report below and in the Safety Scan History table.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadImage;

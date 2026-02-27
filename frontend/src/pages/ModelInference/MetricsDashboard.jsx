import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import Security from '@mui/icons-material/Security';
import Warning from '@mui/icons-material/Warning';
import Speed from '@mui/icons-material/Speed';
import Analytics from '@mui/icons-material/Analytics';
import FilterCenterFocus from '@mui/icons-material/FilterCenterFocus';

const ICON_COLORS = {
  Security: '#1976D2',
  FilterCenterFocus: '#00ACC1',
  Warning: '#f44336',
  Analytics: '#4CAF50',
  Speed: '#7B1FA2',
};

const MetricCard = ({ title, value, subtitle, icon: Icon, iconKey }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 2,
      height: '100%',
      border: 'none',
      boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
      transition: 'transform 0.3s ease',
      '&:hover': { transform: 'translateY(-4px)' },
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      p: 1.5,
    }}
  >
    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          backgroundColor: ICON_COLORS[iconKey] || '#1976D2',
          borderRadius: '10px',
          mx: 'auto',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {Icon && <Icon sx={{ fontSize: '1.2rem', color: 'white' }} />}
      </Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.25, color: '#333' }}>
        {value}
      </Typography>
      <Typography variant="subtitle2" fontWeight="600" sx={{ color: '#333', mb: 0.25 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3, display: 'block' }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const MetricsDashboard = ({ inferences = [] }) => {
  const totalInferences = inferences.length;
  const totalDetections = inferences.reduce((acc, inf) => acc + (inf.detections?.length ?? 0), 0);
  const totalViolations = inferences.reduce(
    (acc, inf) => acc + (inf.detections?.filter((d) => d.is_violation).length ?? 0),
    0
  );
  const avgMAP = totalInferences
    ? (inferences.reduce((acc, inf) => acc + (inf.mAP ?? 0), 0) / totalInferences).toFixed(2)
    : '0.00';
  const avgFPS = totalInferences
    ? (inferences.reduce((acc, inf) => acc + (inf.fps ?? 0), 0) / totalInferences).toFixed(1)
    : '0';

  return (
    <Grid container spacing={1.5} justifyContent="center" sx={{ flexWrap: 'nowrap' }}>
      <Grid item xs>
        <MetricCard
          title="Total Scans"
          value={totalInferences}
          subtitle="Number of images analyzed"
          icon={Security}
          iconKey="Security"
        />
      </Grid>
      <Grid item xs>
        <MetricCard
          title="Safety Observations"
          value={totalDetections}
          subtitle="Total items checked (e.g. helmet, vest)"
          icon={FilterCenterFocus}
          iconKey="FilterCenterFocus"
        />
      </Grid>
      <Grid item xs>
        <MetricCard
          title="Safety Issues Detected"
          value={totalViolations}
          subtitle="Number of times required PPE was missing"
          icon={Warning}
          iconKey="Warning"
        />
      </Grid>
      <Grid item xs>
        <MetricCard
          title="Detection Accuracy"
          value={avgMAP}
          subtitle="AI confidence level (higher is better)"
          icon={Analytics}
          iconKey="Analytics"
        />
      </Grid>
      <Grid item xs>
        <MetricCard
          title="Processing Speed"
          value={avgFPS}
          subtitle="Speed of analysis (frames per second)"
          icon={Speed}
          iconKey="Speed"
        />
      </Grid>
    </Grid>
  );
};

export default MetricsDashboard;

import React, { useState } from 'react';
import {
  Box, Paper, Typography, Button, Grid, Chip, Divider, IconButton, Collapse,
} from '@mui/material';
import {
  Warning, TrendingUp, Group, FileDownload, Delete, ExpandMore, ExpandLess,
  BarChart as BarChartIcon, AccessTime,
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';

const tooltipStyle = { backgroundColor: '#fff', border: '2px solid #BDE8F5', borderRadius: 12, padding: 12 };

const statCards = (dm) => [
  { label: 'Total Violations', value: dm.violations,          sub: 'Today',          icon: <Warning />,     bg: 'linear-gradient(135deg,#EF4444,#DC2626)', shadow: 'rgba(239,68,68,0.3)' },
  { label: 'Compliance Score', value: `${dm.complianceScore}%`, sub: 'Current status', icon: <TrendingUp />,  bg: 'linear-gradient(135deg,#22C55E,#16A34A)', shadow: 'rgba(34,197,94,0.3)' },
  { label: 'Safety Score',     value: `${dm.safetyScore}%`,   sub: 'Daily average',  icon: <TrendingUp />,  bg: 'linear-gradient(135deg,#1C4D8D,#4988C4)', shadow: 'rgba(28,77,141,0.3)' },
  { label: 'Total People',     value: dm.totalPeople,         sub: 'Present today',  icon: <Group />,       bg: 'linear-gradient(135deg,#8B5CF6,#7C3AED)', shadow: 'rgba(139,92,246,0.3)' },
];

function ComplianceChip({ value }) {
  const color = value >= 95 ? 'success' : value >= 90 ? 'warning' : 'error';
  return <Chip label={`${value}%`} size="small" color={color} sx={{ fontWeight: 700 }} />;
}

export function DailyReportsView({ reports, onGenerateReport, onDeleteReport, dailyMetrics }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCharts, setShowCharts] = useState(false);

  const handleExport = (report) => {
    const content = [
      `Daily Report — ${report.date}`,
      `Generated: ${new Date(report.generatedAt).toLocaleString()}`,
      `Total Violations: ${report.totalViolations}`,
      `Compliance Score: ${report.complianceScore}%`,
      `Safety Score: ${report.safetyScore}%`,
      `Total People: ${report.totalPeople}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-report-${report.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const dm = dailyMetrics;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Stat Cards — full width, centered, equal flex */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap', width: '100%' }}>
        {statCards(dm).map((card) => (
          <Paper elevation={0} key={card.label} sx={{ p: 2.5, borderRadius: 3, background: card.bg, boxShadow: `0 8px 24px ${card.shadow}`, color: '#fff', flex: 1, transition: 'all .3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 32px ${card.shadow}` } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{card.label}</Typography>
                <Typography sx={{ fontSize: '2rem', fontWeight: 900, mt: 0.5, lineHeight: 1 }}>{card.value}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{card.sub}</Typography>
              </Box>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.icon}
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Generate Report */}
      <Paper elevation={0} sx={{ p: 3, border: '2px solid #BDE8F5', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <AccessTime sx={{ color: '#1C4D8D' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F2854' }}>Generate Daily Report</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto', flexWrap: 'wrap' }}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '2px solid #BDE8F5', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
            />
            <Button
              variant="contained"
              onClick={() => onGenerateReport(selectedDate)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, background: 'linear-gradient(135deg,#1C4D8D,#4988C4)' }}
            >
              Generate
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowCharts((v) => !v)}
              startIcon={showCharts ? <ExpandLess /> : <BarChartIcon />}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, borderColor: '#1C4D8D', color: '#1C4D8D' }}
            >
              {showCharts ? 'Hide Charts' : 'Show Charts'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Charts */}
      <Collapse in={showCharts}>
        <Paper elevation={0} sx={{ p: 3, border: '2px solid #BDE8F5', borderRadius: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F2854', mb: 2 }}>Daily Violations vs Compliance</Typography>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={reports.slice(-7).map((r) => ({ date: r.date, violations: r.totalViolations, compliance: r.complianceScore }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#BDE8F5" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="violations" fill="#EF4444" radius={[6,6,0,0]} name="Violations" maxBarSize={50} />
              <Bar dataKey="compliance" fill="#4988C4" radius={[6,6,0,0]} name="Compliance %" maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Collapse>

      {/* Reports List */}
      <Paper elevation={0} sx={{ border: '2px solid #BDE8F5', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, background: 'linear-gradient(135deg,#F0F8FB,#fff)', borderBottom: '1px solid #BDE8F5' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F2854' }}>Generated Reports</Typography>
        </Box>
        {reports.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: '#94a3b8' }}>
            <Typography>No reports generated yet. Select a date and click Generate.</Typography>
          </Box>
        ) : (
          reports.map((report, i) => (
            <Box key={report.id || i}>
              {i > 0 && <Divider />}
              <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, '&:hover': { background: '#F0F8FB' } }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F2854' }}>Report — {report.date}</Typography>
                  <Typography variant="caption" color="text.secondary">Generated: {new Date(report.generatedAt).toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <ComplianceChip value={report.complianceScore} />
                  <Typography variant="body2" sx={{ color: '#EF4444', fontWeight: 700 }}>{report.totalViolations} violations</Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>{report.totalPeople} people</Typography>
                  <Button size="small" startIcon={<FileDownload />} onClick={() => handleExport(report)} sx={{ textTransform: 'none', fontWeight: 600, color: '#1C4D8D' }}>Export</Button>
                  <IconButton size="small" onClick={() => onDeleteReport(report.id)} sx={{ color: '#EF4444' }}><Delete fontSize="small" /></IconButton>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}

export default DailyReportsView;

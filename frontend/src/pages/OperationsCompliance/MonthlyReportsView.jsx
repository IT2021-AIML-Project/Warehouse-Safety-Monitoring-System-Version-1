import React, { useState } from 'react';
import {
  Box, Paper, Typography, Button, Grid, Chip, Divider, IconButton, Collapse,
} from '@mui/material';
import {
  Warning, TrendingUp, Group, FileDownload, Delete, BarChart as BarChartIcon,
  CalendarMonth, ExpandLess,
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';

const tooltipStyle = { backgroundColor: '#fff', border: '2px solid #BDE8F5', borderRadius: 12, padding: 12 };

function ComplianceChip({ value }) {
  const color = value >= 95 ? 'success' : value >= 90 ? 'warning' : 'error';
  return <Chip label={`${value}%`} size="small" color={color} sx={{ fontWeight: 700 }} />;
}

export function MonthlyReportsView({ reports, onGenerateReport, onDeleteReport, monthlyMetrics }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCharts, setShowCharts] = useState(false);

  const mm = monthlyMetrics;

  const statCards = [
    { label: 'Total Violations', value: mm.violations,          sub: 'This month',      icon: <Warning />,    bg: 'linear-gradient(135deg,#1C4D8D,#4988C4)', shadow: 'rgba(28,77,141,0.3)' },
    { label: 'Avg Compliance',   value: `${mm.avgComplianceScore}%`, sub: 'Monthly average', icon: <TrendingUp />, bg: 'linear-gradient(135deg,#22C55E,#16A34A)', shadow: 'rgba(34,197,94,0.3)' },
    { label: 'Safety Score',     value: `${mm.avgSafetyScore}%`,    sub: 'Monthly average', icon: <TrendingUp />, bg: 'linear-gradient(135deg,#8B5CF6,#7C3AED)', shadow: 'rgba(139,92,246,0.3)' },
    { label: 'Total People',     value: mm.totalPeople,          sub: 'Per day average', icon: <Group />,      bg: 'linear-gradient(135deg,#F97316,#EA580C)', shadow: 'rgba(249,115,22,0.3)' },
  ];

  const handleExport = (report) => {
    const content = [
      `Monthly Report — ${report.startDate} to ${report.endDate}`,
      `Generated: ${new Date(report.generatedAt).toLocaleString()}`,
      `Total Violations: ${report.totalViolations}`,
      `Avg Compliance: ${report.avgComplianceScore}%`,
      `Avg Safety Score: ${report.avgSafetyScore}%`,
      `Total People: ${report.totalPeople}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-report-${report.startDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Stat Cards — full width, equal flex */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap', width: '100%' }}>
        {statCards.map((card) => (
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
          <CalendarMonth sx={{ color: '#1C4D8D' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F2854' }}>Generate Monthly Report</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto', flexWrap: 'wrap' }}>
            <input
              type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              style={{ padding: '8px 12px', borderRadius: 8, border: '2px solid #BDE8F5', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
            />
            <Typography variant="body2" color="text.secondary">to</Typography>
            <input
              type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              style={{ padding: '8px 12px', borderRadius: 8, border: '2px solid #BDE8F5', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
            />
            <Button
              variant="contained"
              onClick={() => onGenerateReport(startDate, endDate)}
              disabled={!startDate || !endDate}
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
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F2854', mb: 2 }}>Monthly Trend Overview</Typography>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={reports.map((r) => ({ date: r.startDate, violations: r.totalViolations, compliance: r.avgComplianceScore }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#BDE8F5" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontWeight: 600 }} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="violations"  stroke="#EF4444" strokeWidth={3} name="Violations"    dot={{ fill: '#EF4444', r: 5 }} />
              <Line type="monotone" dataKey="compliance"  stroke="#10B981" strokeWidth={3} name="Compliance %"  dot={{ fill: '#10B981', r: 5 }} />
            </LineChart>
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
            <Typography>No reports generated yet. Select a date range and click Generate.</Typography>
          </Box>
        ) : (
          reports.map((report, i) => (
            <Box key={report.id || i}>
              {i > 0 && <Divider />}
              <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, '&:hover': { background: '#F0F8FB' } }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F2854' }}>
                    {report.startDate} → {report.endDate}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Generated: {new Date(report.generatedAt).toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <ComplianceChip value={report.avgComplianceScore} />
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

export default MonthlyReportsView;

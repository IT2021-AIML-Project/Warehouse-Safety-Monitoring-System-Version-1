import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Security,
  Assessment,
  VerifiedUser,
  Timeline,
  People,
  Menu as MenuIcon,
  Close as CloseIcon,
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = ['Features', 'How It Works', 'Reports', 'Contact'];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem button key={item}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
        <ListItem button onClick={() => navigate('/login')}>
          <ListItemText primary="SIGN IN" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          color: '#333',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Security sx={{ color: '#1976D2', fontSize: 32, mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976D2' }}>
                SafetyFirst
              </Typography>
            </Box>

            {!isMobile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item}
                    sx={{
                      color: '#666',
                      fontWeight: 500,
                      '&:hover': { color: '#1976D2' }
                    }}
                  >
                    {item}
                  </Button>
                ))}
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    backgroundColor: '#1976D2',
                    borderRadius: '25px',
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#1565C0' }
                  }}
                >
                  SIGN IN
                </Button>
              </Box>
            ) : (
              <IconButton onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%), url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          pt: 10,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 800,
                  color: '#333',
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                Warehouse PPE
                <br />
                <span style={{ color: '#1976D2' }}>Monitoring System</span>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  color: '#666',
                  mb: 4,
                  lineHeight: 1.6,
                  maxWidth: '500px'
                }}
              >
                An AI-powered system for real-time detection,
                monitoring, and reporting of Personal Protective Equipment
                (PPE) compliance in warehouse environments.
              </Typography>

              {/* Stats */}
              <Grid container spacing={4} sx={{ mb: 5 }}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976D2' }}>
                    50+
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                    COMPANIES
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976D2' }}>
                    15K+
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                    EMPLOYEES
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976D2' }}>
                    50K+
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                    SAFETY CHECKS
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976D2' }}>
                    05%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                    COMPLIANCE
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    backgroundColor: '#eb7c21',
                    color: 'white',
                    borderRadius: '30px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#f3a323' }
                  }}
                >
                  GET STARTED WITH US
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  width: '100%',
                  height: '600px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: { xs: 1, md: 1 },
                }}
              >
                <img
                  src="/images/warehouse-dashboard.png"
                  alt="Smart Warehouse Safety Management Dashboard - Real-time PPE monitoring, incident tracking, and safety compliance analytics with workers in high-visibility vests"
                  style={{
                    width: '100%',
                    maxWidth: '780px',
                    height: 'auto',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(25, 118, 210, 0.3)',
                    border: '3px solid #1976D2',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <Box
                  sx={{
                    display: 'none',
                    width: '100%',
                    maxWidth: '750px',
                    height: '500px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(25, 118, 210, 0.3)',
                    border: '3px solid #1976D2',
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    p: 3,
                  }}
                >
                  <Box>
                    <Security sx={{ fontSize: '4rem', mb: 2, color: '#00E5FF' }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      Warehouse Safety Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Real-time PPE monitoring and safety analytics
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                backgroundColor: '#1976D2',
                color: 'white',
                px: 3,
                py: 1,
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                mb: 3,
                display: 'inline-block'
              }}
            >
              FEATURES
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                color: '#333',
                mb: 3,
              }}
            >
              Powerful Features for Smart Safety
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: '#666',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              The system provides a set of AI-driven and management-oriented features designed to improve PPE compliance, safety monitoring, and decision-making within warehouse environments.
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
            <Grid item xs={4} sx={{ minWidth: 0, flex: 1 }}>
              <Card
                sx={{
                  p: 4,
                  height: '350px',
                  textAlign: 'center',
                  borderRadius: '20px',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-10px)' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#1976D2',
                    borderRadius: '16px',
                    mx: 'auto',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <VerifiedUser sx={{ fontSize: '2.5rem', color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                  PPE Compliance Monitoring
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Real-time detection of Personal Protective Equipment (PPE) such as helmets, safety vests, and masks using a YOLO-based object detection model.
                  The system identifies non-compliance events from CCTV video streams and records violations with confidence scores for further analysis.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={4} sx={{ minWidth: 0, flex: 1 }}>
              <Card
                sx={{
                  p: 4,
                  height: '350px',
                  textAlign: 'center',
                  borderRadius: '20px',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-10px)' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#00ACC1',
                    borderRadius: '16px',
                    mx: 'auto',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Timeline sx={{ fontSize: '2.5rem', color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                  Real-Time Incident Tracking
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Automatically logs detected safety violations with timestamps, warehouse zones, and employee associations.
                  Supports continuous monitoring and enables supervisors to review, verify, or dismiss detected incidents through the system interface.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={4} sx={{ minWidth: 0, flex: 1 }}>
              <Card
                sx={{
                  p: 4,
                  height: '350px',
                  textAlign: 'center',
                  borderRadius: '20px',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-10px)' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#4CAF50',
                    borderRadius: '16px',
                    mx: 'auto',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Assessment sx={{ fontSize: '2.5rem', color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                  Smart Analytics Dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Provides visual summaries of PPE compliance levels, violation trends, and safety performance metrics.
                  Includes charts and reports to support management-level decision making and monthly safety evaluations.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 10, backgroundColor: 'white' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                backgroundColor: '#1976D2',
                color: 'white',
                px: 3,
                py: 1,
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                mb: 3,
                display: 'inline-block'
              }}
            >
              PROCESS
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                color: '#333',
                mb: 3,
              }}
            >
              How SafetyFirst Works
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: '#666',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Simple, fast, and intelligent safety management in just four easy steps.
              Experience the seamless journey from setup to full compliance monitoring.
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
            <Grid item xs={4} sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#1976D2',
                    borderRadius: '50%',
                    mx: 'auto',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'white'
                  }}
                >
                  1
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                  Setup & Configure
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  The system is initialized by registering employees, defining warehouse zones, and configuring CCTV camera inputs. PPE requirements and system rules are set to ensure accurate monitoring and role-based access within the warehouse environment.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4} sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#00ACC1',
                    borderRadius: '50%',
                    mx: 'auto',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'white'
                  }}
                >
                  2
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                  Monitor & Track
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  The system continuously monitors live video streams to detect PPE compliance in real time. Safety violations are automatically identified, logged with relevant details, and tracked across different zones and work shifts.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4} sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#4CAF50',
                    borderRadius: '50%',
                    mx: 'auto',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'white'
                  }}
                >
                  3
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                  Analyze & Improve
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Collected compliance data is analyzed to generate visual reports and safety summaries. The system helps identify risk patterns and supports management in making informed decisions to improve overall workplace safety.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#475569', color: 'white', py: 6 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="flex-start" sx={{ justifyContent: 'space-between' }}>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ color: '#1976D2', fontSize: 24, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                  SafetyFirst
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.5, fontSize: '0.875rem' }}>
                Revolutionary smart safety management solution making warehouse operations safer and more efficient. <br />Experience the future of workplace safety today.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                <IconButton sx={{ color: '#1976D2', fontSize: '1.25rem' }}>
                  <Facebook />
                </IconButton>
                <IconButton sx={{ color: '#1976D2', fontSize: '1.25rem' }}>
                  <Twitter />
                </IconButton>
                <IconButton sx={{ color: '#1976D2', fontSize: '1.25rem' }}>
                  <Instagram />
                </IconButton>
                <IconButton sx={{ color: '#1976D2', fontSize: '1.25rem' }}>
                  <LinkedIn />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white', fontSize: '1rem' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {['Features', 'How It Works', 'Reviews', 'Get Started'].map((item) => (
                  <Button
                    key={item}
                    sx={{
                      color: '#cbd5e1',
                      justifyContent: 'flex-start',
                      p: 0,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      '&:hover': { color: '#1976D2' }
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white', fontSize: '1rem' }}>
                Support
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <Button
                    key={item}
                    sx={{
                      color: '#cbd5e1',
                      justifyContent: 'flex-start',
                      p: 0,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      '&:hover': { color: '#1976D2' }
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white', fontSize: '1rem' }}>
                Contact Info
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: '#1976D2', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                    support@safetyfirst.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ color: '#1976D2', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                    +71 123 654 45
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ color: '#1976D2', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                    123 kollupitiya Road, Colombo, Sri Lanka
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ color: '#1976D2', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                    24/7 Smart Safety Support
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              borderTop: '1px solid #64748b',
              mt: 4,
              pt: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
              © 2026 SafetyFirst. All rights reserved. | Revolutionary smart safety management solution.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
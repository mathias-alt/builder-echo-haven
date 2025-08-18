import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  alpha,
  useScrollTrigger,
  Slide,
  Fade,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  Groups,
  Analytics,
  AutoAwesome,
  Business,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AppTheme from '../shared-theme/AppTheme';

interface Props {
  window?: () => Window;
  children?: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children!}
    </Slide>
  );
}

function ScrollTriggeredFade({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [trigger, setTrigger] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setTrigger(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref}>
      <Fade in={trigger} timeout={800}>
        <div>{children}</div>
      </Fade>
    </div>
  );
}

function Navigation() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <HideOnScroll>
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          backgroundColor: alpha(theme.palette.background.default, 0.8),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Flourishing Business Canvas
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  textTransform: 'none',
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </HideOnScroll>
  );
}

function HeroSection() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        pt: { xs: 12, md: 16 },
        pb: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          <Fade in={true} timeout={1000}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 700,
                mb: 3,
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
              }}
            >
              Transform Your Business Strategy
            </Typography>
          </Fade>
          
          <Fade in={true} timeout={1200} style={{ transitionDelay: '200ms' }}>
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.secondary,
                mb: 4,
                fontWeight: 400,
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Visualize, plan, and optimize your business model with our innovative canvas tool. 
              Turn complex strategies into clear, actionable insights.
            </Typography>
          </Fade>
          
          <Fade in={true} timeout={1000} style={{ transitionDelay: '400ms' }}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                mb: 6,
              }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/signup')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Start Building Your Canvas
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                Watch Demo
              </Button>
            </Box>
          </Fade>
          
          <Fade in={true} timeout={1000} style={{ transitionDelay: '600ms' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.text.secondary,
                fontSize: '0.9rem',
              }}
            >
              <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
              <Typography variant="body2">Free 14-day trial</Typography>
              <Typography variant="body2" sx={{ mx: 1 }}>•</Typography>
              <CheckCircle sx={{ fontSize: 18, color: theme.palette.success.main }} />
              <Typography variant="body2">No credit card required</Typography>
            </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
}

function FeaturesSection() {
  const theme = useTheme();
  
  const features = [
    {
      icon: <TrendingUp />,
      title: 'Strategic Planning',
      description: 'Create comprehensive business models with our intuitive canvas interface. Map out value propositions, customer segments, and revenue streams.',
    },
    {
      icon: <Groups />,
      title: 'Team Collaboration',
      description: 'Work together in real-time with your team. Share insights, gather feedback, and iterate on your business strategy collaboratively.',
    },
    {
      icon: <Analytics />,
      title: 'Data-Driven Insights',
      description: 'Analyze your business model with built-in metrics and KPI tracking. Make informed decisions based on real data.',
    },
    {
      icon: <AutoAwesome />,
      title: 'AI-Powered Recommendations',
      description: 'Get intelligent suggestions to optimize your business model. Our AI helps identify opportunities and potential risks.',
    },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: theme.palette.background.paper }}>
      <Container maxWidth="lg">
        <ScrollTriggeredFade>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme.palette.text.primary,
              }}
            >
              Everything you need to succeed
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Powerful features designed to help you build, iterate, and scale your business model effectively.
            </Typography>
          </Box>
        </ScrollTriggeredFade>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <ScrollTriggeredFade key={index} delay={index * 200}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: theme.palette.background.default,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <IconButton
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      mb: 2,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.15),
                      },
                    }}
                  >
                    {feature.icon}
                  </IconButton>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </ScrollTriggeredFade>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

function CTASection() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
      }}
    >
      <Container maxWidth="md">
        <ScrollTriggeredFade>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme.palette.text.primary,
              }}
            >
              Ready to flourish?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                mb: 4,
                fontWeight: 400,
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              Join thousands of entrepreneurs and business leaders who trust our platform to build successful ventures.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/signup')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.2rem',
                px: 5,
                py: 2,
                borderRadius: 3,
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Start Your Free Trial
            </Button>
          </Box>
        </ScrollTriggeredFade>
      </Container>
    </Box>
  );
}

function Footer() {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        py: 6,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              Flourishing Business Canvas
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            © 2024 Flourishing Business Canvas. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default function LandingPage() {
  return (
    <AppTheme>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </Box>
    </AppTheme>
  );
}

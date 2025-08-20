import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import {
  Business,
  Settings,
  People,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface CompanyWidgetProps {
  companyName: string;
  memberCount?: number;
  logo?: string;
  hasCompany?: boolean;
}

export default function CompanyWidget({
  companyName,
  memberCount = 0,
  logo,
  hasCompany = true,
}: CompanyWidgetProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  if (!hasCompany) {
    return (
      <Card
        sx={{
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
          },
          transition: 'all 0.3s ease',
        }}
        onClick={() => navigate('/company/create')}
      >
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              mx: 'auto',
              mb: 2,
            }}
          >
            <Add sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Create Your Company
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Set up your company profile to start collaborating with your team
          </Typography>
          <Button variant="contained" startIcon={<Business />}>
            Get Started
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={logo}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: theme.palette.primary.main,
              mr: 2,
              fontSize: '1.2rem',
              fontWeight: 600,
            }}
          >
            {!logo && companyName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {companyName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <People sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {memberCount} members
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Settings />}
            onClick={() => navigate('/company/settings')}
            fullWidth
          >
            Settings
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<People />}
            onClick={() => navigate('/team')}
            fullWidth
          >
            Team
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

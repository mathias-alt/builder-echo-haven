import * as React from 'react';
import {
  Box,
  CssBaseline,
  alpha,
} from '@mui/material';
import AppTheme from '../shared-theme/AppTheme';
import TopNavigation from './components/TopNavigation';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

export default function BusinessCanvasDashboard() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [selectedCompany, setSelectedCompany] = React.useState('Acme Corp');

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const companies = [
    'Acme Corp',
    'TechStart Inc',
    'Innovation Labs',
    'Future Ventures'
  ];

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
        <Sidebar 
          open={sidebarOpen} 
          onToggle={handleSidebarToggle}
        />
        
        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            height: 'auto',
            alignSelf: 'stretch',
            transition: 'margin-left 0.3s ease',
            marginLeft: sidebarOpen ? 0 : { md: '-280px' },
          }}
        >
          {/* Top Navigation */}
          <TopNavigation
            onSidebarToggle={handleSidebarToggle}
            selectedCompany={selectedCompany}
            companies={companies}
            onCompanyChange={setSelectedCompany}
          />
          
          {/* Main Dashboard Content */}
          <Box
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: 'auto',
              p: 3,
            })}
          >
            <MainContent selectedCompany={selectedCompany} />
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}

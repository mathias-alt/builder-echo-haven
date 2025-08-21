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
import { UserCompany } from '../components/CompanySwitcher';
import { useNavigate } from 'react-router-dom';

export default function BusinessCanvasDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [selectedCompany, setSelectedCompany] = React.useState('company-1');
  const [switchingCompany, setSwitchingCompany] = React.useState(false);

  React.useEffect(() => {
    document.title = 'Dashboard - Flourishing Business Canvas';
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const companies: UserCompany[] = [
    {
      id: 'company-1',
      name: 'Acme Corp',
      role: 'owner',
      memberCount: 12,
      plan: 'pro',
      lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isActive: true,
    },
    {
      id: 'company-2',
      name: 'TechStart Inc',
      role: 'admin',
      memberCount: 8,
      plan: 'free',
      lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isActive: false,
    },
    {
      id: 'company-3',
      name: 'Innovation Labs',
      role: 'member',
      memberCount: 25,
      plan: 'enterprise',
      lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isActive: false,
    },
    {
      id: 'company-4',
      name: 'Future Ventures',
      role: 'viewer',
      memberCount: 5,
      plan: 'free',
      lastAccessed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      isActive: false,
    },
  ];

  const handleCompanySwitch = async (companyId: string) => {
    setSwitchingCompany(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update active company
      const updatedCompanies = companies.map(company => ({
        ...company,
        isActive: company.id === companyId,
        lastAccessed: company.id === companyId ? new Date() : company.lastAccessed,
      }));

      setSelectedCompany(companyId);
      console.log('Switched to company:', companyId);
    } catch (error) {
      console.error('Failed to switch company:', error);
    } finally {
      setSwitchingCompany(false);
    }
  };

  const handleCreateCompany = () => {
    navigate('/company/create');
  };

  const currentCompany = companies.find(c => c.id === selectedCompany);

  return (
    <>
      <CssBaseline enableColorScheme />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        height: 'auto',
        flexGrow: 0,
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
            flexGrow: 0,
            display: 'flex',
            flexDirection: 'column',
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
            onCompanyChange={handleCompanySwitch}
            onCreateCompany={handleCreateCompany}
          />
          
          {/* Main Dashboard Content */}
          <Box
            sx={(theme) => ({
              flexGrow: 0,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: 'auto',
              height: 'auto',
              padding: '24px 24px 24px 310px',
            })}
          >
            <MainContent selectedCompany={currentCompany?.name || 'Company'} />
          </Box>
        </Box>
      </Box>
    </>
  );
}

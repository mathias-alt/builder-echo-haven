export default {
  // Define the correct routes for Builder.io to detect
  routes: [
    {
      path: '/',
      name: 'Home',
      component: './src/landing/LandingPage.tsx'
    },
    {
      path: '/login',
      name: 'Login',
      component: './src/auth/LoginPage.tsx'
    },
    {
      path: '/signup',
      name: 'Sign Up',
      component: './src/auth/SignupPage.tsx'
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: './src/dashboard/BusinessCanvasDashboard.tsx'
    },
    {
      path: '/crm',
      name: 'CRM',
      component: './src/crm/CrmDashboard.tsx'
    }
  ],
  // Exclude CRM page components from being detected as individual routes
  exclude: [
    './src/crm/pages/**/*'
  ]
};

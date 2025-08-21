import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { inputsCustomizations } from "./customizations/inputs";
import { dataDisplayCustomizations } from "./customizations/dataDisplay";
import { feedbackCustomizations } from "./customizations/feedback";
import { navigationCustomizations } from "./customizations/navigation";
import { surfacesCustomizations } from "./customizations/surfaces";
import { colorSchemes, typography, shadows, shape } from "./themePrimitives";

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          palette: {
            mode: 'light',
            primary: {
              main: '#2cc7d0', // Teal/cyan color
              light: '#65d6db',
              dark: '#1f969e',
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#f50057',
              light: '#ff5983',
              dark: '#c51162',
              contrastText: '#ffffff',
            },
            background: {
              default: '#fafafa',
              paper: '#ffffff',
            },
            text: {
              primary: '#212121',
              secondary: '#757575',
            },
            grey: {
              50: '#fafafa',
              100: '#f5f5f5',
              200: '#eeeeee',
              300: '#e0e0e0',
              400: '#bdbdbd',
              500: '#9e9e9e',
              600: '#757575',
              700: '#616161',
              800: '#424242',
              900: '#212121',
            },
            divider: 'rgba(0, 0, 0, 0.12)',
            success: {
              main: '#4caf50',
              light: '#81c784',
              dark: '#388e3c',
              contrastText: '#ffffff',
            },
            warning: {
              main: '#ff9800',
              light: '#ffb74d',
              dark: '#f57c00',
              contrastText: '#000000',
            },
            error: {
              main: '#f44336',
              light: '#e57373',
              dark: '#d32f2f',
              contrastText: '#ffffff',
            },
            info: {
              main: '#2196f3',
              light: '#64b5f6',
              dark: '#1976d2',
              contrastText: '#ffffff',
            },
          },
          typography: {
            fontFamily: 'Inter, sans-serif',
            h1: {
              fontSize: '2.5rem',
              fontWeight: 600,
              lineHeight: 1.2,
            },
            h2: {
              fontSize: '2rem',
              fontWeight: 600,
              lineHeight: 1.2,
            },
            h3: {
              fontSize: '1.75rem',
              fontWeight: 600,
              lineHeight: 1.2,
            },
            h4: {
              fontSize: '1.5rem',
              fontWeight: 600,
              lineHeight: 1.5,
            },
            h5: {
              fontSize: '1.25rem',
              fontWeight: 600,
            },
            h6: {
              fontSize: '1.125rem',
              fontWeight: 600,
            },
            body1: {
              fontSize: '1rem',
            },
            body2: {
              fontSize: '0.875rem',
            },
          },
          shape: {
            borderRadius: 8,
          },
          components: {
            MuiCssBaseline: {
              styleOverrides: {
                body: {
                  backgroundColor: '#fafafa',
                  color: '#212121',
                },
              },
            },
            // Override any component that might use dark theme
            MuiPaper: {
              styleOverrides: {
                root: {
                  backgroundColor: '#ffffff',
                  color: '#212121',
                },
              },
            },
            MuiAppBar: {
              styleOverrides: {
                root: {
                  backgroundColor: '#ffffff',
                  color: '#212121',
                },
              },
            },
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

import React from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  text?: string;
  sx?: SxProps<Theme>;
  color?: string;
  textVariant?: 'h4' | 'h5' | 'h6' | 'subtitle1' | 'body1';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  showText = true,
  text = 'Business Canvas',
  sx,
  color = 'currentColor',
  textVariant = 'h6'
}) => {
  // Size configurations
  const sizeConfig = {
    small: { width: 24, height: 27, fontSize: '1rem' },
    medium: { width: 32, height: 36, fontSize: '1.25rem' },
    large: { width: 43, height: 48, fontSize: '1.5rem' }
  };

  const { width, height } = sizeConfig[size];
  const viewBoxWidth = 43;
  const viewBoxHeight = 48;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: showText ? 1.5 : 0,
        ...sx 
      }}
    >
      {/* Logo SVG */}
      <Box
        component="svg"
        sx={{
          width,
          height,
          flexShrink: 0,
          fill: color === 'currentColor' ? 'currentColor' : color,
        }}
        width={width}
        height={height}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Business Canvas Logo"
      >
        <path d="M21.4947 4.66723L29.7037 9.27318L33.866 6.94467L21.4947 0L0.830335 11.6017L4.97161 13.9302L21.4947 4.66723Z" fill="currentColor"/>
        <path d="M38.0074 9.27319L21.4948 18.5362L13.2859 13.9302L9.13407 16.2587L21.4948 23.1932L42.1697 11.6017L38.0074 9.27319Z" fill="currentColor"/>
        <path d="M4.15179 24.8579L0 22.5294L0 36.3983L20.6643 48V43.343L4.15179 34.0698V24.8579Z" fill="currentColor"/>
        <path d="M0 17.8722L16.5126 27.1352V36.3471L20.6643 38.6858V24.8067L0 13.2152L0 17.8722Z" fill="currentColor"/>
        <path d="M34.6965 22.5293V17.8723L22.3252 24.8068V47.9999L26.477 45.6714V27.1353L34.6965 22.5293Z" fill="currentColor"/>
        <path d="M38.8377 15.5437V34.0696L30.6287 38.6858V43.3428L43 36.3981V13.2152L38.8377 15.5437Z" fill="currentColor"/>
      </Box>

      {/* Logo Text */}
      {showText && (
        <Typography
          variant={textVariant}
          sx={{
            fontWeight: 600,
            color: 'inherit',
            lineHeight: 1.2,
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Logo;

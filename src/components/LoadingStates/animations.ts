import { keyframes } from '@mui/material/styles';
import { AnimationConfig } from './types';

// Standard animation timing configuration
export const animationConfig: AnimationConfig = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

// Loading spinner animations
export const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const pulseAnimation = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
`;

export const waveAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

export const skeletonShimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export const dotsAnimation = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.3;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

export const barsAnimation = keyframes`
  0%, 40%, 100% {
    transform: scaleY(0.4);
    opacity: 0.7;
  }
  20% {
    transform: scaleY(1);
    opacity: 1;
  }
`;

export const fadeInAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeOutAnimation = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

export const slideInAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const scaleInAnimation = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const checkmarkAnimation = keyframes`
  0% {
    stroke-dasharray: 0 50;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dasharray: 50 50;
    stroke-dashoffset: -50;
  }
`;

export const successPulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
`;

export const confettiAnimation = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(720deg);
    opacity: 0;
  }
`;

export const progressFillAnimation = keyframes`
  0% {
    width: 0%;
  }
  100% {
    width: var(--progress-width, 0%);
  }
`;

export const elasticAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

// Brand-specific loading animation
export const brandLoaderAnimation = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
  25% {
    transform: rotate(90deg) scale(1.1);
    opacity: 0.8;
  }
  50% {
    transform: rotate(180deg) scale(1);
    opacity: 1;
  }
  75% {
    transform: rotate(270deg) scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 1;
  }
`;

// Error shake animation
export const shakeAnimation = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
`;

// Floating animation for illustrations
export const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

// Network quality animations
export const slowConnectionAnimation = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
`;

export default animationConfig;

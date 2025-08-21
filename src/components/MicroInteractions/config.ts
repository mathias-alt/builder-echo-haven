import { keyframes } from '@mui/material/styles';

// Consistent easing curves for all animations
export const easingCurves = {
  // Standard Material Design curves
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Most common for general purpose
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)', // Elements entering the screen
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)', // Elements leaving the screen
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)', // Sharp, focused transitions
  
  // Custom curves for specific interactions
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Playful bounce effect
  elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Elastic spring
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Very smooth transition
  snappy: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)', // Quick and snappy
  gentle: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Gentle, organic feel
} as const;

// Timing configuration for different types of interactions
export const timings = {
  // Micro-interactions (100-300ms)
  instant: 100, // Immediate feedback
  quick: 150, // Button hover, form focus
  fast: 200, // Click animations, small transitions
  
  // Standard transitions (300-500ms)
  standard: 300, // Default for most transitions
  moderate: 400, // Card hover, menu open/close
  smooth: 500, // Page transitions, large movements
  
  // Complex animations (500ms+)
  slow: 600, // Complex state changes
  dramatic: 800, // Page transitions, large effects
  cinematic: 1000, // Special effects, celebrations
} as const;

// Animation configuration for different interaction types
export const animationConfig = {
  button: {
    hover: {
      duration: timings.quick,
      easing: easingCurves.smooth,
      scale: 1.02,
      elevation: 2,
    },
    click: {
      duration: timings.instant,
      easing: easingCurves.sharp,
      scale: 0.98,
    },
    loading: {
      duration: timings.standard,
      easing: easingCurves.standard,
    },
  },
  
  form: {
    focus: {
      duration: timings.quick,
      easing: easingCurves.smooth,
      borderScale: 1.02,
      labelMove: -20,
    },
    error: {
      duration: timings.fast,
      easing: easingCurves.bounce,
      shake: 8,
    },
    success: {
      duration: timings.moderate,
      easing: easingCurves.gentle,
    },
  },
  
  page: {
    transition: {
      duration: timings.smooth,
      easing: easingCurves.standard,
      slideDistance: 30,
    },
    fade: {
      duration: timings.moderate,
      easing: easingCurves.gentle,
    },
  },
  
  scroll: {
    reveal: {
      duration: timings.moderate,
      easing: easingCurves.decelerate,
      slideDistance: 50,
      stagger: 100, // Delay between elements
    },
    parallax: {
      intensity: 0.5, // Parallax movement ratio
    },
  },
  
  dragDrop: {
    pickup: {
      duration: timings.quick,
      easing: easingCurves.sharp,
      scale: 1.05,
      elevation: 8,
    },
    drop: {
      duration: timings.standard,
      easing: easingCurves.bounce,
    },
    hover: {
      duration: timings.fast,
      easing: easingCurves.smooth,
    },
  },
  
  toast: {
    enter: {
      duration: timings.standard,
      easing: easingCurves.decelerate,
      slideDistance: 100,
    },
    exit: {
      duration: timings.fast,
      easing: easingCurves.accelerate,
      slideDistance: 50,
    },
  },
  
  tooltip: {
    enter: {
      duration: timings.quick,
      easing: easingCurves.decelerate,
      scale: 0.8,
    },
    exit: {
      duration: timings.instant,
      easing: easingCurves.accelerate,
    },
  },
  
  menu: {
    open: {
      duration: timings.moderate,
      easing: easingCurves.decelerate,
      slideDistance: 20,
      stagger: 50,
    },
    close: {
      duration: timings.fast,
      easing: easingCurves.accelerate,
    },
  },
} as const;

// Keyframe animations
export const keyframeAnimations = {
  // Button animations
  buttonPulse: keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `,
  
  buttonRipple: keyframes`
    0% { 
      transform: scale(0);
      opacity: 1;
    }
    100% { 
      transform: scale(4);
      opacity: 0;
    }
  `,
  
  // Form animations
  fieldShake: keyframes`
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-${animationConfig.form.error.shake}px); }
    20%, 40%, 60%, 80% { transform: translateX(${animationConfig.form.error.shake}px); }
  `,
  
  fieldGlow: keyframes`
    0%, 100% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0); }
    50% { box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.3); }
  `,
  
  // Page transitions
  slideInRight: keyframes`
    from {
      transform: translateX(${animationConfig.page.transition.slideDistance}px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  `,
  
  slideInLeft: keyframes`
    from {
      transform: translateX(-${animationConfig.page.transition.slideDistance}px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  `,
  
  slideInUp: keyframes`
    from {
      transform: translateY(${animationConfig.page.transition.slideDistance}px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  `,
  
  slideInDown: keyframes`
    from {
      transform: translateY(-${animationConfig.page.transition.slideDistance}px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  `,
  
  // Scroll animations
  fadeInUp: keyframes`
    from {
      transform: translateY(${animationConfig.scroll.reveal.slideDistance}px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  `,
  
  fadeInScale: keyframes`
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  `,
  
  // Drag and drop animations
  pickupScale: keyframes`
    from {
      transform: scale(1);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    to {
      transform: scale(${animationConfig.dragDrop.pickup.scale});
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }
  `,
  
  dropBounce: keyframes`
    0% {
      transform: scale(${animationConfig.dragDrop.pickup.scale});
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  `,
  
  // Loading animations
  spin: keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `,
  
  pulse: keyframes`
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(0.95);
    }
  `,
  
  // Success/Error animations
  successBounce: keyframes`
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  `,
  
  errorShake: keyframes`
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  `,
  
  // Tooltip animations
  tooltipSlideUp: keyframes`
    from {
      transform: translateY(8px) scale(0.8);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  `,
  
  tooltipSlideDown: keyframes`
    from {
      transform: translateY(-8px) scale(0.8);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  `,
  
  // Menu animations
  menuSlideDown: keyframes`
    from {
      transform: translateY(-${animationConfig.menu.open.slideDistance}px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  `,
  
  menuItemStagger: keyframes`
    from {
      transform: translateX(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  `,
};

// Responsive animation preferences
export const responsiveConfig = {
  // Reduce motion for users who prefer reduced motion
  reduceMotion: {
    duration: timings.instant,
    easing: easingCurves.standard,
    disableComplex: true,
  },
  
  // Mobile optimizations
  mobile: {
    touch: {
      duration: timings.instant, // Faster feedback for touch
      scale: 0.95, // Slightly less scale on mobile
    },
  },
  
  // Performance thresholds
  performance: {
    lowEnd: {
      simplifyAnimations: true,
      reduceDuration: 0.7, // 30% faster
      skipNonEssential: true,
    },
  },
};

// Z-index layers for animations
export const zIndexLayers = {
  tooltip: 1500,
  modal: 1400,
  drawer: 1300,
  toast: 1200,
  overlay: 1100,
  sticky: 1050,
  appBar: 1100,
  fab: 1050,
} as const;

export default {
  easingCurves,
  timings,
  animationConfig,
  keyframeAnimations,
  responsiveConfig,
  zIndexLayers,
};

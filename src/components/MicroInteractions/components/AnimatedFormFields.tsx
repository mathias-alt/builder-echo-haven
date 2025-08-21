import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  TextField,
  TextFieldProps,
  Box,
  alpha,
  useTheme,
  InputLabel,
  FormControl,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { animationConfig, easingCurves, timings, keyframeAnimations } from '../config';

interface AnimatedTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  glowEffect?: boolean;
  scaleOnFocus?: boolean;
  floatingAnimation?: boolean;
  shakeOnError?: boolean;
  successAnimation?: boolean;
  borderPulse?: boolean;
  labelSlide?: boolean;
  validationState?: 'idle' | 'validating' | 'success' | 'error';
  onValidationChange?: (state: 'idle' | 'validating' | 'success' | 'error') => void;
}

export const AnimatedTextField: React.FC<AnimatedTextFieldProps> = ({
  glowEffect = true,
  scaleOnFocus = true,
  floatingAnimation = true,
  shakeOnError = true,
  successAnimation = true,
  borderPulse = false,
  labelSlide = true,
  validationState = 'idle',
  onValidationChange,
  error,
  helperText,
  label,
  onFocus,
  onBlur,
  onChange,
  value,
  sx,
  ...textFieldProps
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update hasValue when value prop changes
  useEffect(() => {
    setHasValue(Boolean(value));
  }, [value]);

  // Handle focus
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [onFocus]);

  // Handle blur
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  }, [onBlur]);

  // Handle change
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(Boolean(event.target.value));
    onChange?.(event);
  }, [onChange]);

  // Trigger shake animation on error
  useEffect(() => {
    if (error && shakeOnError) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, animationConfig.form.error.duration);
      
      return () => clearTimeout(timer);
    }
  }, [error, shakeOnError]);

  // Get animation styles
  const getAnimationStyles = () => {
    const styles: any = {
      transition: `all ${timings.quick}ms ${easingCurves.smooth}`,
    };

    // Scale on focus
    if (scaleOnFocus && isFocused) {
      styles.transform = `scale(${animationConfig.form.focus.borderScale})`;
    }

    // Glow effect
    if (glowEffect && isFocused) {
      const glowColor = error 
        ? alpha(theme.palette.error.main, 0.3)
        : alpha(theme.palette.primary.main, 0.3);
      styles.boxShadow = `0 0 0 4px ${glowColor}`;
    }

    // Shake animation on error
    if (isAnimating && error && shakeOnError) {
      styles.animation = `${keyframeAnimations.fieldShake} ${animationConfig.form.error.duration}ms ${animationConfig.form.error.easing}`;
    }

    // Success animation
    if (validationState === 'success' && successAnimation) {
      styles.animation = `${keyframeAnimations.successBounce} ${timings.moderate}ms ${easingCurves.bounce}`;
    }

    // Border pulse for validation
    if (validationState === 'validating' && borderPulse) {
      styles.animation = `${keyframeAnimations.fieldGlow} 1.5s ease-in-out infinite`;
    }

    return styles;
  };

  // Get label animation styles
  const getLabelStyles = () => {
    if (!labelSlide) return {};

    const shouldFloat = isFocused || hasValue;
    
    return {
      transform: shouldFloat 
        ? `translateY(${animationConfig.form.focus.labelMove}px) scale(0.75)`
        : 'translateY(0) scale(1)',
      transformOrigin: 'top left',
      transition: `all ${timings.quick}ms ${easingCurves.smooth}`,
      color: isFocused 
        ? (error ? theme.palette.error.main : theme.palette.primary.main)
        : theme.palette.text.secondary,
    };
  };

  // Get validation icon
  const getValidationIcon = () => {
    switch (validationState) {
      case 'validating':
        return (
          <Box
            sx={{
              width: 20,
              height: 20,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              borderTop: `2px solid ${theme.palette.primary.main}`,
              borderRadius: '50%',
              animation: `${keyframeAnimations.spin} 1s linear infinite`,
            }}
          />
        );
      case 'success':
        return (
          <CheckCircle
            sx={{
              color: theme.palette.success.main,
              animation: successAnimation 
                ? `${keyframeAnimations.successBounce} ${timings.moderate}ms ${easingCurves.bounce}`
                : 'none',
            }}
          />
        );
      case 'error':
        return (
          <ErrorIcon
            sx={{
              color: theme.palette.error.main,
              animation: shakeOnError && isAnimating
                ? `${keyframeAnimations.errorShake} ${timings.fast}ms ${easingCurves.sharp}`
                : 'none',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TextField
      ref={inputRef}
      variant="outlined"
      error={error}
      helperText={helperText}
      label={label}
      value={value}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      InputProps={{
        endAdornment: getValidationIcon() ? (
          <InputAdornment position="end">
            {getValidationIcon()}
          </InputAdornment>
        ) : undefined,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          ...getAnimationStyles(),
          '& fieldset': {
            transition: `border-color ${timings.quick}ms ${easingCurves.smooth}`,
          },
          '&:hover fieldset': {
            borderColor: error 
              ? theme.palette.error.main 
              : alpha(theme.palette.primary.main, 0.7),
          },
          '&.Mui-focused fieldset': {
            borderWidth: 2,
            borderColor: error 
              ? theme.palette.error.main 
              : theme.palette.primary.main,
          },
        },
        '& .MuiInputLabel-root': {
          ...getLabelStyles(),
          '&.Mui-focused': {
            color: error 
              ? theme.palette.error.main 
              : theme.palette.primary.main,
          },
        },
        '& .MuiFormHelperText-root': {
          transition: `all ${timings.quick}ms ${easingCurves.smooth}`,
          animation: error && isAnimating
            ? `${keyframeAnimations.fadeInUp} ${timings.fast}ms ${easingCurves.decelerate}`
            : 'none',
        },
        ...sx,
      }}
      {...textFieldProps}
    />
  );
};

// Floating label input with advanced animations
export const FloatingLabelInput: React.FC<AnimatedTextFieldProps> = (props) => {
  return (
    <AnimatedTextField
      floatingAnimation={true}
      labelSlide={true}
      glowEffect={true}
      scaleOnFocus={true}
      {...props}
    />
  );
};

// Password field with animated visibility toggle
export const AnimatedPasswordField: React.FC<AnimatedTextFieldProps & {
  showPasswordIcon?: boolean;
}> = ({ 
  showPasswordIcon = true,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleTogglePassword = useCallback(() => {
    setIsToggling(true);
    setShowPassword(prev => !prev);
    
    setTimeout(() => {
      setIsToggling(false);
    }, timings.fast);
  }, []);

  return (
    <AnimatedTextField
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: showPasswordIcon ? (
          <InputAdornment position="end">
            <IconButton
              onClick={handleTogglePassword}
              edge="end"
              sx={{
                transition: `all ${timings.quick}ms ${easingCurves.smooth}`,
                transform: isToggling 
                  ? `rotate(180deg) scale(${animationConfig.button.click.scale})`
                  : 'rotate(0deg) scale(1)',
                '&:hover': {
                  transform: `scale(${animationConfig.button.hover.scale})`,
                  backgroundColor: alpha('#000', 0.04),
                },
              }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
      {...props}
    />
  );
};

// Search field with animated magnifying glass
export const AnimatedSearchField: React.FC<AnimatedTextFieldProps & {
  onSearch?: (value: string) => void;
  searchDelay?: number;
}> = ({ 
  onSearch,
  searchDelay = 300,
  ...props 
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (onSearch) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(value);
        setIsSearching(false);
      }, searchDelay);
    }

    props.onChange?.(event);
  }, [onSearch, searchDelay, props.onChange]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AnimatedTextField
      value={searchValue}
      onChange={handleChange}
      validationState={isSearching ? 'validating' : 'idle'}
      placeholder="Search..."
      {...props}
    />
  );
};

// Multi-line text area with animated resize
export const AnimatedTextArea: React.FC<AnimatedTextFieldProps & {
  autoResize?: boolean;
  maxRows?: number;
}> = ({ 
  autoResize = true,
  maxRows = 6,
  ...props 
}) => {
  const [rows, setRows] = useState(1);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (autoResize) {
      const textareaLineHeight = 24;
      const previousRows = event.target.rows;
      event.target.rows = 1;

      const currentRows = Math.min(
        Math.max(Math.floor(event.target.scrollHeight / textareaLineHeight), 1),
        maxRows
      );

      if (currentRows === previousRows) {
        event.target.rows = currentRows;
      }

      setRows(currentRows);
    }

    props.onChange?.(event);
  }, [autoResize, maxRows, props.onChange]);

  return (
    <AnimatedTextField
      multiline
      rows={rows}
      onChange={handleChange}
      sx={{
        '& .MuiOutlinedInput-root': {
          transition: `all ${timings.standard}ms ${easingCurves.smooth}`,
        },
        ...props.sx,
      }}
      {...props}
    />
  );
};

// Form field with validation animation
export const ValidatedFormField: React.FC<AnimatedTextFieldProps & {
  validator?: (value: string) => Promise<{ isValid: boolean; message?: string }>;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  debounceTime?: number;
}> = ({
  validator,
  validateOnBlur = true,
  validateOnChange = false,
  debounceTime = 500,
  onValidationChange,
  ...props
}) => {
  const [validationState, setValidationState] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [validationMessage, setValidationMessage] = useState<string>('');
  const validationTimeoutRef = useRef<NodeJS.Timeout>();

  const performValidation = useCallback(async (value: string) => {
    if (!validator || !value) return;

    setValidationState('validating');
    onValidationChange?.('validating');

    try {
      const result = await validator(value);
      const newState = result.isValid ? 'success' : 'error';
      
      setValidationState(newState);
      setValidationMessage(result.message || '');
      onValidationChange?.(newState);
    } catch (error) {
      setValidationState('error');
      setValidationMessage('Validation failed');
      onValidationChange?.('error');
    }
  }, [validator, onValidationChange]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    
    if (validateOnChange && validator) {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }

      validationTimeoutRef.current = setTimeout(() => {
        performValidation(value);
      }, debounceTime);
    } else {
      setValidationState('idle');
      setValidationMessage('');
      onValidationChange?.('idle');
    }

    props.onChange?.(event);
  }, [validateOnChange, validator, debounceTime, performValidation, props.onChange, onValidationChange]);

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    if (validateOnBlur && validator) {
      performValidation(event.target.value);
    }
    props.onBlur?.(event);
  }, [validateOnBlur, validator, performValidation, props.onBlur]);

  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AnimatedTextField
      validationState={validationState}
      onValidationChange={onValidationChange}
      error={validationState === 'error'}
      helperText={validationMessage || props.helperText}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  );
};

export default AnimatedTextField;

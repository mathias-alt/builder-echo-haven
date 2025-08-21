import { useEffect, useRef, useState } from 'react';

export interface MobileKeyboardConfig {
  autoFocus: boolean;
  hideOnSubmit: boolean;
  showDoneButton: boolean;
  adjustViewport: boolean;
  preventZoom: boolean;
}

export function useMobileKeyboard(config: MobileKeyboardConfig = {
  autoFocus: false,
  hideOnSubmit: true,
  showDoneButton: true,
  adjustViewport: true,
  preventZoom: true
}) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const originalViewportHeight = useRef(window.innerHeight);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = originalViewportHeight.current - currentHeight;
      
      // Consider keyboard visible if viewport shrank by more than 150px
      const keyboardVisible = heightDifference > 150;
      
      setIsKeyboardVisible(keyboardVisible);
      setViewportHeight(currentHeight);
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Prevent zoom on input focus for mobile Safari
        if (config.preventZoom) {
          const meta = document.querySelector('meta[name="viewport"]');
          if (meta) {
            meta.setAttribute('content', 
              'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            );
          }
        }

        // Scroll input into view with delay to account for keyboard animation
        setTimeout(() => {
          target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 300);
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Restore zoom capability
        if (config.preventZoom) {
          const meta = document.querySelector('meta[name="viewport"]');
          if (meta) {
            meta.setAttribute('content', 
              'width=device-width, initial-scale=1.0, user-scalable=yes'
            );
          }
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Enter key behavior
      if (event.key === 'Enter') {
        const target = event.target as HTMLElement;
        
        if (target.tagName === 'INPUT' && config.hideOnSubmit) {
          (target as HTMLInputElement).blur();
        }
        
        // For textarea, allow Shift+Enter for new line
        if (target.tagName === 'TEXTAREA' && !event.shiftKey && config.hideOnSubmit) {
          event.preventDefault();
          (target as HTMLTextAreaElement).blur();
        }
      }
      
      // Handle Done button (iOS) - this is usually captured by the 'blur' event
      if (event.key === 'Done' || event.keyCode === 13) {
        const target = event.target as HTMLElement;
        if (config.hideOnSubmit) {
          (target as HTMLInputElement | HTMLTextAreaElement).blur();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [config]);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      
      // For mobile, ensure cursor is at the end
      if ('setSelectionRange' in inputRef.current) {
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
      }
    }
  };

  const blurInput = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const getKeyboardAdjustedStyle = () => {
    if (!config.adjustViewport || !isKeyboardVisible) {
      return {};
    }

    return {
      height: `${viewportHeight}px`,
      overflow: 'hidden'
    };
  };

  const getInputProps = () => ({
    ref: inputRef,
    autoFocus: config.autoFocus,
    autoComplete: 'off',
    autoCorrect: 'off',
    autoCapitalize: 'off',
    spellCheck: false,
    // Add iOS-specific attributes
    'data-keyboard-type': 'text',
    style: {
      fontSize: '16px', // Prevent zoom on iOS
      lineHeight: '1.4'
    }
  });

  return {
    isKeyboardVisible,
    viewportHeight,
    originalViewportHeight: originalViewportHeight.current,
    keyboardHeight: originalViewportHeight.current - viewportHeight,
    focusInput,
    blurInput,
    getKeyboardAdjustedStyle,
    getInputProps,
    inputRef
  };
}

// Hook specifically for note editing
export function useMobileNoteEditor() {
  const keyboard = useMobileKeyboard({
    autoFocus: true,
    hideOnSubmit: true,
    showDoneButton: true,
    adjustViewport: true,
    preventZoom: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');

  const startEditing = (initialContent: string = '') => {
    setContent(initialContent);
    setIsEditing(true);
    // Small delay to ensure the input is rendered before focusing
    setTimeout(() => {
      keyboard.focusInput();
    }, 100);
  };

  const stopEditing = () => {
    setIsEditing(false);
    keyboard.blurInput();
  };

  const handleKeyPress = (event: React.KeyboardEvent, onSave?: (content: string) => void) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (onSave) {
        onSave(content);
      }
      stopEditing();
    }
  };

  return {
    ...keyboard,
    isEditing,
    content,
    setContent,
    startEditing,
    stopEditing,
    handleKeyPress
  };
}

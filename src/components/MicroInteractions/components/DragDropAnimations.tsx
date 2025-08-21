import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Paper,
  useTheme,
  alpha,
  Portal,
} from '@mui/material';
import { animationConfig, easingCurves, timings, keyframeAnimations } from '../config';

interface DragDropState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  dragPosition: { x: number; y: number };
  dragStartPosition: { x: number; y: number };
  draggedElement: HTMLElement | null;
}

interface DraggableProps {
  children: React.ReactNode;
  dragData?: any;
  disabled?: boolean;
  constrainToParent?: boolean;
  dragPreview?: React.ReactNode;
  onDragStart?: (data: any, event: React.DragEvent) => void;
  onDragEnd?: (data: any, event: React.DragEvent) => void;
  onDrag?: (data: any, position: { x: number; y: number }) => void;
  className?: string;
  sx?: object;
}

interface DroppableProps {
  children: React.ReactNode;
  onDrop?: (dragData: any, event: React.DragEvent) => void;
  onDragOver?: (dragData: any, event: React.DragEvent) => void;
  onDragEnter?: (dragData: any, event: React.DragEvent) => void;
  onDragLeave?: (dragData: any, event: React.DragEvent) => void;
  acceptTypes?: string[];
  disabled?: boolean;
  highlightOnHover?: boolean;
  className?: string;
  sx?: object;
}

interface SortableListProps {
  children: React.ReactNode[];
  onReorder?: (fromIndex: number, toIndex: number) => void;
  direction?: 'vertical' | 'horizontal';
  disabled?: boolean;
  placeholder?: React.ReactNode;
  handle?: string; // CSS selector for drag handle
}

// Global drag state
let globalDragState: DragDropState = {
  isDragging: false,
  dragOffset: { x: 0, y: 0 },
  dragPosition: { x: 0, y: 0 },
  dragStartPosition: { x: 0, y: 0 },
  draggedElement: null,
};

// Draggable component
export const Draggable: React.FC<DraggableProps> = ({
  children,
  dragData,
  disabled = false,
  constrainToParent = false,
  dragPreview,
  onDragStart,
  onDragEnd,
  onDrag,
  className,
  sx,
}) => {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  const dragPreviewRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((event: React.DragEvent) => {
    if (disabled) return;

    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    globalDragState = {
      isDragging: true,
      dragOffset: { x: offsetX, y: offsetY },
      dragPosition: { x: event.clientX, y: event.clientY },
      dragStartPosition: { x: event.clientX, y: event.clientY },
      draggedElement: element,
    };

    setIsDragging(true);
    setDragPosition({ x: event.clientX, y: event.clientY });

    // Set drag data
    event.dataTransfer.setData('application/json', JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = 'move';

    // Create custom drag preview if provided
    if (dragPreview && dragPreviewRef.current) {
      event.dataTransfer.setDragImage(dragPreviewRef.current, offsetX, offsetY);
    }

    onDragStart?.(dragData, event);
  }, [disabled, dragData, dragPreview, onDragStart]);

  const handleDrag = useCallback((event: React.DragEvent) => {
    if (!isDragging || disabled) return;

    // Update global drag state
    globalDragState.dragPosition = { x: event.clientX, y: event.clientY };
    setDragPosition({ x: event.clientX, y: event.clientY });

    onDrag?.(dragData, { x: event.clientX, y: event.clientY });
  }, [isDragging, disabled, dragData, onDrag]);

  const handleDragEnd = useCallback((event: React.DragEvent) => {
    setIsDragging(false);
    globalDragState.isDragging = false;
    globalDragState.draggedElement = null;

    onDragEnd?.(dragData, event);
  }, [dragData, onDragEnd]);

  // Get drag styles
  const getDragStyles = () => {
    const baseStyles = {
      cursor: disabled ? 'default' : 'grab',
      userSelect: 'none' as const,
      transition: `all ${timings.quick}ms ${easingCurves.smooth}`,
      willChange: 'transform, box-shadow',
    };

    if (isDragging) {
      return {
        ...baseStyles,
        cursor: 'grabbing',
        transform: `scale(${animationConfig.dragDrop.pickup.scale}) rotate(2deg)`,
        boxShadow: `0 ${animationConfig.dragDrop.pickup.elevation * 2}px ${animationConfig.dragDrop.pickup.elevation * 4}px ${alpha(theme.palette.common.black, 0.2)}`,
        zIndex: theme.zIndex.modal,
        opacity: 0.9,
      };
    }

    return {
      ...baseStyles,
      '&:hover': !disabled ? {
        transform: 'scale(1.02)',
        boxShadow: theme.shadows[2],
      } : {},
    };
  };

  return (
    <>
      <Box
        ref={elementRef}
        draggable={!disabled}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className={className}
        sx={{
          ...getDragStyles(),
          ...sx,
        }}
      >
        {children}
      </Box>

      {/* Custom drag preview */}
      {dragPreview && (
        <Portal>
          <Box
            ref={dragPreviewRef}
            sx={{
              position: 'fixed',
              top: -1000,
              left: -1000,
              pointerEvents: 'none',
              zIndex: -1,
            }}
          >
            {dragPreview}
          </Box>
        </Portal>
      )}
    </>
  );
};

// Droppable component
export const Droppable: React.FC<DroppableProps> = ({
  children,
  onDrop,
  onDragOver,
  onDragEnter,
  onDragLeave,
  acceptTypes = ['application/json'],
  disabled = false,
  highlightOnHover = true,
  className,
  sx,
}) => {
  const theme = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isValidDrop, setIsValidDrop] = useState(false);
  const dragEnterCountRef = useRef(0);

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    if (disabled) return;

    dragEnterCountRef.current++;
    
    if (dragEnterCountRef.current === 1) {
      setIsDragOver(true);
      
      // Check if drag data type is accepted
      const hasValidType = acceptTypes.some(type => 
        event.dataTransfer.types.includes(type)
      );
      setIsValidDrop(hasValidType);

      if (hasValidType) {
        try {
          const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
          onDragEnter?.(dragData, event);
        } catch {
          onDragEnter?.(null, event);
        }
      }
    }
  }, [disabled, acceptTypes, onDragEnter]);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    if (disabled) return;

    dragEnterCountRef.current--;
    
    if (dragEnterCountRef.current === 0) {
      setIsDragOver(false);
      setIsValidDrop(false);

      try {
        const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
        onDragLeave?.(dragData, event);
      } catch {
        onDragLeave?.(null, event);
      }
    }
  }, [disabled, onDragLeave]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    if (disabled) return;

    event.preventDefault();
    
    if (isValidDrop) {
      event.dataTransfer.dropEffect = 'move';
      
      try {
        const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
        onDragOver?.(dragData, event);
      } catch {
        onDragOver?.(null, event);
      }
    } else {
      event.dataTransfer.dropEffect = 'none';
    }
  }, [disabled, isValidDrop, onDragOver]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    if (disabled) return;

    event.preventDefault();
    setIsDragOver(false);
    setIsValidDrop(false);
    dragEnterCountRef.current = 0;

    if (isValidDrop) {
      try {
        const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
        onDrop?.(dragData, event);
      } catch {
        onDrop?.(null, event);
      }
    }
  }, [disabled, isValidDrop, onDrop]);

  // Get drop zone styles
  const getDropStyles = () => {
    const baseStyles = {
      transition: `all ${timings.fast}ms ${easingCurves.smooth}`,
      willChange: 'border-color, background-color, transform',
    };

    if (isDragOver && isValidDrop && highlightOnHover) {
      return {
        ...baseStyles,
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        transform: 'scale(1.02)',
        borderStyle: 'dashed',
        borderWidth: 2,
      };
    }

    if (isDragOver && !isValidDrop && highlightOnHover) {
      return {
        ...baseStyles,
        borderColor: theme.palette.error.main,
        backgroundColor: alpha(theme.palette.error.main, 0.04),
        borderStyle: 'dashed',
        borderWidth: 2,
      };
    }

    return baseStyles;
  };

  return (
    <Box
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={className}
      sx={{
        ...getDropStyles(),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

// Sortable list component
export const SortableList: React.FC<SortableListProps> = ({
  children,
  onReorder,
  direction = 'vertical',
  disabled = false,
  placeholder,
  handle,
}) => {
  const theme = useTheme();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [draggedElement, setDraggedElement] = useState<React.ReactNode>(null);

  const handleDragStart = useCallback((index: number) => (event: React.DragEvent) => {
    if (disabled) return;

    setDraggedIndex(index);
    setDraggedElement(children[index]);
    event.dataTransfer.setData('text/plain', index.toString());
    event.dataTransfer.effectAllowed = 'move';
  }, [disabled, children]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDropIndex(null);
    setDraggedElement(null);
  }, []);

  const handleDragOver = useCallback((index: number) => (event: React.DragEvent) => {
    if (disabled || draggedIndex === null) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    if (index !== draggedIndex) {
      setDropIndex(index);
    }
  }, [disabled, draggedIndex]);

  const handleDrop = useCallback((index: number) => (event: React.DragEvent) => {
    if (disabled || draggedIndex === null) return;

    event.preventDefault();
    
    if (index !== draggedIndex) {
      onReorder?.(draggedIndex, index);
    }
    
    handleDragEnd();
  }, [disabled, draggedIndex, onReorder, handleDragEnd]);

  const getItemStyles = (index: number) => {
    const baseStyles = {
      transition: `all ${timings.fast}ms ${easingCurves.smooth}`,
      willChange: 'transform, opacity',
    };

    if (index === draggedIndex) {
      return {
        ...baseStyles,
        opacity: 0.5,
        transform: `scale(${animationConfig.dragDrop.pickup.scale})`,
      };
    }

    if (index === dropIndex) {
      return {
        ...baseStyles,
        transform: direction === 'vertical' 
          ? 'translateY(-4px)' 
          : 'translateX(-4px)',
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
      };
    }

    return baseStyles;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: 1,
      }}
    >
      {children.map((child, index) => (
        <Box
          key={index}
          draggable={!disabled}
          onDragStart={handleDragStart(index)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver(index)}
          onDrop={handleDrop(index)}
          sx={{
            cursor: disabled ? 'default' : 'grab',
            userSelect: 'none',
            ...getItemStyles(index),
            '&:hover': !disabled ? {
              transform: 'scale(1.02)',
            } : {},
            '&:active': !disabled ? {
              cursor: 'grabbing',
            } : {},
          }}
        >
          {child}
          
          {/* Placeholder for drop zone */}
          {dropIndex === index && draggedIndex !== null && (
            <Box
              sx={{
                height: direction === 'vertical' ? 4 : '100%',
                width: direction === 'horizontal' ? 4 : '100%',
                backgroundColor: theme.palette.primary.main,
                borderRadius: 1,
                animation: `${keyframeAnimations.pulse} 1s ease-in-out infinite`,
                mb: direction === 'vertical' ? 1 : 0,
                mr: direction === 'horizontal' ? 1 : 0,
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

// Drag ghost component (follows cursor during drag)
export const DragGhost: React.FC<{
  children: React.ReactNode;
  show: boolean;
  position: { x: number; y: number };
  offset?: { x: number; y: number };
}> = ({ children, show, position, offset = { x: 0, y: 0 } }) => {
  if (!show) return null;

  return (
    <Portal>
      <Box
        sx={{
          position: 'fixed',
          left: position.x - offset.x,
          top: position.y - offset.y,
          pointerEvents: 'none',
          zIndex: 9999,
          transform: `scale(${animationConfig.dragDrop.pickup.scale}) rotate(3deg)`,
          opacity: 0.8,
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
        }}
      >
        {children}
      </Box>
    </Portal>
  );
};

// File drop zone component
export const FileDropZone: React.FC<{
  onFileDrop: (files: FileList) => void;
  acceptedTypes?: string[];
  multiple?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  placeholder?: React.ReactNode;
  className?: string;
  sx?: object;
}> = ({
  onFileDrop,
  acceptedTypes = [],
  multiple = true,
  disabled = false,
  children,
  placeholder,
  className,
  sx,
}) => {
  const theme = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isValidDrop, setIsValidDrop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    if (disabled) return;

    event.preventDefault();
    setIsDragOver(true);

    // Check if dropped items are files
    const hasFiles = Array.from(event.dataTransfer.items).some(
      item => item.kind === 'file'
    );
    setIsValidDrop(hasFiles);
  }, [disabled]);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    if (disabled) return;

    event.preventDefault();
    setIsDragOver(false);
    setIsValidDrop(false);
  }, [disabled]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    if (disabled) return;
    event.preventDefault();
  }, [disabled]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    if (disabled) return;

    event.preventDefault();
    setIsDragOver(false);
    setIsValidDrop(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      onFileDrop(files);
    }
  }, [disabled, onFileDrop]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onFileDrop(files);
    }
  }, [onFileDrop]);

  return (
    <Box
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      className={className}
      sx={{
        border: `2px dashed ${isDragOver && isValidDrop 
          ? theme.palette.primary.main 
          : theme.palette.divider}`,
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        cursor: disabled ? 'default' : 'pointer',
        backgroundColor: isDragOver && isValidDrop
          ? alpha(theme.palette.primary.main, 0.04)
          : 'transparent',
        transition: `all ${timings.fast}ms ${easingCurves.smooth}`,
        '&:hover': !disabled ? {
          borderColor: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
        } : {},
        ...sx,
      }}
    >
      {children || placeholder || (
        <Typography color="text.secondary">
          Drop files here or click to upload
        </Typography>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default {
  Draggable,
  Droppable,
  SortableList,
  DragGhost,
  FileDropZone,
};

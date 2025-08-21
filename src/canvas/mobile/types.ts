export interface MobileCanvasState {
  activeSection: string;
  isFullscreen: boolean;
  showBottomSheet: boolean;
  bottomSheetContent: 'actions' | 'navigation' | 'noteActions' | null;
  selectedNote: string | null;
  isSwipeEnabled: boolean;
  gestureMode: boolean;
}

export interface SwipeDirection {
  deltaX: number;
  deltaY: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  velocity: number;
}

export interface TouchGesture {
  type: 'tap' | 'longPress' | 'swipe' | 'pinch';
  target: string;
  data?: any;
}

export interface MobileToolbarAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  primary?: boolean;
  disabled?: boolean;
}

export interface BottomSheetAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export interface MobileCanvasProps {
  sections: any[];
  onAddNote: (sectionId: string) => void;
  onUpdateNote: (sectionId: string, noteId: string, content: string) => void;
  onDeleteNote: (sectionId: string, noteId: string) => void;
  onMoveNote?: (noteId: string, fromSection: string, toSection: string) => void;
  canvasName: string;
  onCanvasNameChange: (name: string) => void;
  autoSaveStatus: 'saved' | 'saving' | 'error';
}

export interface KeyboardConfig {
  autoFocus: boolean;
  hideKeyboardOnSubmit: boolean;
  showDoneButton: boolean;
  multiline: boolean;
  expandOnType: boolean;
}

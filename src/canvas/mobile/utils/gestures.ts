export interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  velocity: number;
  distance: number;
  duration: number;
}

export interface PinchGesture {
  scale: number;
  velocity: number;
  center: { x: number; y: number };
}

export interface LongPressGesture {
  point: TouchPoint;
  duration: number;
}

export class GestureRecognizer {
  private static readonly SWIPE_THRESHOLD = 50;
  private static readonly SWIPE_VELOCITY_THRESHOLD = 0.3;
  private static readonly LONG_PRESS_DURATION = 500;
  private static readonly TAP_MAX_DURATION = 200;
  private static readonly TAP_MAX_DISTANCE = 10;

  static detectSwipe(start: TouchPoint, end: TouchPoint): SwipeGesture | null {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = end.time - start.time;
    const velocity = distance / duration;

    if (distance < this.SWIPE_THRESHOLD || velocity < this.SWIPE_VELOCITY_THRESHOLD) {
      return null;
    }

    let direction: 'left' | 'right' | 'up' | 'down';
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    return {
      direction,
      velocity,
      distance,
      duration
    };
  }

  static detectTap(start: TouchPoint, end: TouchPoint): boolean {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = end.time - start.time;

    return duration < this.TAP_MAX_DURATION && distance < this.TAP_MAX_DISTANCE;
  }

  static detectLongPress(start: TouchPoint, current: TouchPoint): boolean {
    const duration = current.time - start.time;
    const deltaX = current.x - start.x;
    const deltaY = current.y - start.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    return duration >= this.LONG_PRESS_DURATION && distance < this.TAP_MAX_DISTANCE;
  }

  static calculatePinchScale(touches1: TouchPoint[], touches2: TouchPoint[]): number {
    if (touches1.length !== 2 || touches2.length !== 2) {
      return 1;
    }

    const distance1 = Math.sqrt(
      Math.pow(touches1[1].x - touches1[0].x, 2) + 
      Math.pow(touches1[1].y - touches1[0].y, 2)
    );

    const distance2 = Math.sqrt(
      Math.pow(touches2[1].x - touches2[0].x, 2) + 
      Math.pow(touches2[1].y - touches2[0].y, 2)
    );

    return distance2 / distance1;
  }

  static getPinchCenter(touches: TouchPoint[]): { x: number; y: number } {
    if (touches.length !== 2) {
      return { x: 0, y: 0 };
    }

    return {
      x: (touches[0].x + touches[1].x) / 2,
      y: (touches[0].y + touches[1].y) / 2
    };
  }
}

export class TouchHandler {
  private startTouches: TouchPoint[] = [];
  private currentTouches: TouchPoint[] = [];
  private longPressTimer: NodeJS.Timeout | null = null;

  constructor(
    private onTap?: (point: TouchPoint) => void,
    private onLongPress?: (point: TouchPoint) => void,
    private onSwipe?: (gesture: SwipeGesture) => void,
    private onPinch?: (gesture: PinchGesture) => void
  ) {}

  handleTouchStart(event: TouchEvent) {
    this.startTouches = Array.from(event.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }));

    this.currentTouches = [...this.startTouches];

    // Start long press timer for single touch
    if (this.startTouches.length === 1 && this.onLongPress) {
      this.longPressTimer = setTimeout(() => {
        if (this.onLongPress && this.currentTouches.length === 1) {
          const current = this.currentTouches[0];
          const start = this.startTouches[0];
          
          if (GestureRecognizer.detectLongPress(start, current)) {
            this.onLongPress(current);
          }
        }
      }, 500);
    }
  }

  handleTouchMove(event: TouchEvent) {
    this.currentTouches = Array.from(event.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }));

    // Cancel long press if moved too much
    if (this.longPressTimer && this.startTouches.length === 1) {
      const start = this.startTouches[0];
      const current = this.currentTouches[0];
      const distance = Math.sqrt(
        Math.pow(current.x - start.x, 2) + Math.pow(current.y - start.y, 2)
      );
      
      if (distance > 10) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
    }

    // Handle pinch gesture
    if (this.currentTouches.length === 2 && this.startTouches.length === 2 && this.onPinch) {
      const scale = GestureRecognizer.calculatePinchScale(this.startTouches, this.currentTouches);
      const center = GestureRecognizer.getPinchCenter(this.currentTouches);
      
      this.onPinch({
        scale,
        velocity: 0, // Could calculate this based on time
        center
      });
    }
  }

  handleTouchEnd(event: TouchEvent) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const endTouches = Array.from(event.changedTouches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }));

    // Handle single touch gestures
    if (this.startTouches.length === 1 && endTouches.length === 1) {
      const start = this.startTouches[0];
      const end = endTouches[0];

      // Check for tap
      if (GestureRecognizer.detectTap(start, end) && this.onTap) {
        this.onTap(end);
      }
      // Check for swipe
      else {
        const swipe = GestureRecognizer.detectSwipe(start, end);
        if (swipe && this.onSwipe) {
          this.onSwipe(swipe);
        }
      }
    }

    // Reset touches
    this.startTouches = [];
    this.currentTouches = [];
  }

  cleanup() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }
}

// Haptic feedback utility
export class HapticFeedback {
  static light() {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  static medium() {
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  }

  static heavy() {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  static success() {
    if (navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }
  }

  static error() {
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  }
}

// Configuration
export { default as microInteractionsConfig, easingCurves, timings, animationConfig, keyframeAnimations, responsiveConfig, zIndexLayers } from './config';

// Button animations
export {
  default as AnimatedButton,
  PrimaryAnimatedButton,
  SecondaryAnimatedButton,
  FloatingActionAnimatedButton,
  IconAnimatedButton,
  LoadingAnimatedButton,
  SuccessAnimatedButton,
  ErrorAnimatedButton,
} from './components/AnimatedButton';

// Form field animations
export {
  default as AnimatedTextField,
  FloatingLabelInput,
  AnimatedPasswordField,
  AnimatedSearchField,
  AnimatedTextArea,
  ValidatedFormField,
} from './components/AnimatedFormFields';

// Page transitions
export {
  default as PageTransitions,
  RouteTransition,
  AnimatedPage,
  FadeTransition,
  SlideTransition,
  ZoomTransition,
  GrowTransition,
  CustomSlideTransition,
  StaggeredTransition,
  LoadingTransition,
  usePageTransition,
  useNavigationDirection,
} from './components/PageTransitions';

// Scroll animations
export {
  default as ScrollAnimations,
  ScrollAnimation,
  Parallax,
  RevealAnimation,
  FadeInOnScroll,
  SlideUpOnScroll,
  ScaleInOnScroll,
  StaggeredList,
  ScrollProgressIndicator,
  ScrollToTopButton,
  InfiniteScrollLoader,
  useIntersectionObserver,
  useScrollPosition,
  useParallax,
} from './components/ScrollAnimations';

// Drag and drop animations
export {
  default as DragDropAnimations,
  Draggable,
  Droppable,
  SortableList,
  DragGhost,
  FileDropZone,
} from './components/DragDropAnimations';

// Toast notifications
export {
  default as AnimatedToasts,
  ToastProvider,
  useToast,
  useQuickToast,
  AnimatedSnackbar,
  SuccessToast,
  ErrorToast,
} from './components/AnimatedToasts';

// Tooltip animations
export {
  default as AnimatedTooltips,
  AnimatedTooltip,
  RichTooltipContent,
  HoverTooltip,
  ClickTooltip,
  BounceTooltip,
  SlideTooltip,
  RichTooltip,
  CustomTooltip,
  useTooltip,
} from './components/AnimatedTooltips';

// Menu transitions
export {
  default as MenuTransitions,
  AnimatedMenu,
  StaggeredMenuItem,
  ExpandableMenuItem,
  NestedMenu,
  ContextMenu,
  DropdownMenu,
} from './components/MenuTransitions';

// Integration utilities
export { default as MicroInteractionsProvider } from './MicroInteractionsProvider';
export { default as IntegrationExamples } from './examples/IntegrationExamples';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { Heart, Plus, Trash2, Check, Eye } from 'lucide-react';

interface SwipeAction {
  id: string;
  icon: React.ReactNode;
  color: string;
  label: string;
  onAction: () => void;
}

interface SwipeCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipeComplete?: (direction: 'left' | 'right', actionId: string) => void;
  threshold?: number;
  className?: string;
}

export function SwipeCard({
  children,
  leftActions = [],
  rightActions = [],
  onSwipeComplete,
  threshold = 80,
  className = '',
}: SwipeCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);

  // Calculate which action is triggered based on x position
  const getTriggeredAction = (xValue: number): { direction: 'left' | 'right'; action: SwipeAction } | null => {
    if (xValue > threshold && leftActions.length > 0) {
      const index = Math.min(
        Math.floor((xValue - threshold) / 60),
        leftActions.length - 1
      );
      return { direction: 'left', action: leftActions[index] };
    }
    if (xValue < -threshold && rightActions.length > 0) {
      const index = Math.min(
        Math.floor((-xValue - threshold) / 60),
        rightActions.length - 1
      );
      return { direction: 'right', action: rightActions[index] };
    }
    return null;
  };

  // Transform values for action buttons
  const leftOpacity = useTransform(x, [0, threshold], [0, 1]);
  const rightOpacity = useTransform(x, [-threshold, 0], [1, 0]);
  const leftScale = useTransform(x, [0, threshold, threshold + 40], [0.5, 1, 1.1]);
  const rightScale = useTransform(x, [-threshold - 40, -threshold, 0], [1.1, 1, 0.5]);

  const handleDragEnd = (_: never, info: PanInfo) => {
    setIsDragging(false);
    const triggered = getTriggeredAction(info.offset.x);

    if (triggered) {
      triggered.action.onAction();
      onSwipeComplete?.(triggered.direction, triggered.action.id);
    }
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden rounded-3xl ${className}`}>
      {/* Left actions (revealed when swiping right) */}
      <motion.div
        className="absolute inset-y-0 left-0 flex items-center px-4 gap-2"
        style={{ opacity: leftOpacity }}
      >
        {leftActions.map((action, index) => (
          <motion.button
            key={action.id}
            style={{ scale: leftScale }}
            whileTap={{ scale: 0.9 }}
            onClick={action.onAction}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: action.color }}
          >
            {action.icon}
          </motion.button>
        ))}
      </motion.div>

      {/* Right actions (revealed when swiping left) */}
      <motion.div
        className="absolute inset-y-0 right-0 flex items-center px-4 gap-2"
        style={{ opacity: rightOpacity }}
      >
        {rightActions.map((action, index) => (
          <motion.button
            key={action.id}
            style={{ scale: rightScale }}
            whileTap={{ scale: 0.9 }}
            onClick={action.onAction}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: action.color }}
          >
            {action.icon}
          </motion.button>
        ))}
      </motion.div>

      {/* Main content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative z-10 bg-white dark:bg-[#1d1d1f]"
      >
        {children}
      </motion.div>

      {/* Drag indicator */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-rose-500/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Pre-configured swipe card for shopping list items
interface SwipeableListItemProps {
  children: React.ReactNode;
  onAddToList?: () => void;
  onFavorite?: () => void;
  onDelete?: () => void;
  onQuickLook?: () => void;
  isFavorite?: boolean;
  isInList?: boolean;
}

export function SwipeableListItem({
  children,
  onAddToList,
  onFavorite,
  onDelete,
  onQuickLook,
  isFavorite = false,
  isInList = false,
}: SwipeableListItemProps) {
  const leftActions: SwipeAction[] = [];
  const rightActions: SwipeAction[] = [];

  if (onFavorite) {
    leftActions.push({
      id: 'favorite',
      icon: <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />,
      color: '#f43f5e',
      label: 'Favorit',
      onAction: onFavorite,
    });
  }

  if (onQuickLook) {
    leftActions.push({
      id: 'quicklook',
      icon: <Eye className="w-5 h-5" />,
      color: '#3b82f6',
      label: 'Quick Look',
      onAction: onQuickLook,
    });
  }

  if (onAddToList) {
    rightActions.push({
      id: 'add',
      icon: isInList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />,
      color: '#10b981',
      label: isInList ? 'Tilføjet' : 'Tilføj',
      onAction: onAddToList,
    });
  }

  if (onDelete) {
    rightActions.push({
      id: 'delete',
      icon: <Trash2 className="w-5 h-5" />,
      color: '#ef4444',
      label: 'Slet',
      onAction: onDelete,
    });
  }

  return (
    <SwipeCard leftActions={leftActions} rightActions={rightActions}>
      {children}
    </SwipeCard>
  );
}

// Dismissible card that can be swiped away
interface DismissibleCardProps {
  children: React.ReactNode;
  onDismiss: () => void;
  dismissDirection?: 'left' | 'right' | 'both';
  className?: string;
}

export function DismissibleCard({
  children,
  onDismiss,
  dismissDirection = 'both',
  className = '',
}: DismissibleCardProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);

  const handleDragEnd = (_: never, info: PanInfo) => {
    const threshold = 100;
    const shouldDismiss =
      (dismissDirection === 'left' || dismissDirection === 'both') && info.offset.x < -threshold ||
      (dismissDirection === 'right' || dismissDirection === 'both') && info.offset.x > threshold;

    if (shouldDismiss) {
      setIsDismissed(true);
      setTimeout(onDismiss, 200);
    }
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          style={{ x, opacity, rotate }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Swipeable horizontal carousel
interface SwipeCarouselProps {
  children: React.ReactNode[];
  gap?: number;
  className?: string;
}

export function SwipeCarousel({ children, gap = 16, className = '' }: SwipeCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        ref={containerRef}
        drag="x"
        dragConstraints={containerRef}
        className="flex cursor-grab active:cursor-grabbing"
        style={{ gap }}
      >
        {children.map((child, index) => (
          <motion.div
            key={index}
            className="flex-shrink-0"
            whileTap={{ scale: 0.98 }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingCart, Bell, Heart, AlertCircle } from 'lucide-react';

export type IslandType = 'success' | 'cart' | 'alert' | 'favorite' | 'notification';

interface IslandNotification {
  id: string;
  type: IslandType;
  title: string;
  subtitle?: string;
  duration?: number;
}

interface DynamicIslandProps {
  notification: IslandNotification | null;
  onClose: () => void;
}

const iconMap = {
  success: Check,
  cart: ShoppingCart,
  alert: AlertCircle,
  favorite: Heart,
  notification: Bell,
};

const colorMap = {
  success: 'from-emerald-500 to-green-600',
  cart: 'from-blue-500 to-indigo-600',
  alert: 'from-amber-500 to-orange-600',
  favorite: 'from-rose-500 to-pink-600',
  notification: 'from-violet-500 to-purple-600',
};

const bgColorMap = {
  success: 'bg-emerald-500',
  cart: 'bg-blue-500',
  alert: 'bg-amber-500',
  favorite: 'bg-rose-500',
  notification: 'bg-violet-500',
};

export function DynamicIsland({ notification, onClose }: DynamicIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (notification) {
      // Expand after a tiny delay for the pill animation
      const expandTimer = setTimeout(() => setIsExpanded(true), 100);

      // Auto-close after duration
      const closeTimer = setTimeout(() => {
        setIsExpanded(false);
        setTimeout(onClose, 300);
      }, notification.duration || 2500);

      return () => {
        clearTimeout(expandTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [notification, onClose]);

  const Icon = notification ? iconMap[notification.type] : Check;

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          className="fixed top-4 left-1/2 z-[200]"
          initial={{ x: '-50%', y: -100, opacity: 0 }}
          animate={{ x: '-50%', y: 0, opacity: 1 }}
          exit={{ x: '-50%', y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <motion.div
            className="bg-black dark:bg-[#1c1c1e] rounded-[28px] overflow-hidden cursor-pointer shadow-2xl shadow-black/30"
            onClick={() => {
              setIsExpanded(false);
              setTimeout(onClose, 300);
            }}
            initial={{ width: 120, height: 36 }}
            animate={{
              width: isExpanded ? 320 : 120,
              height: isExpanded ? 72 : 36,
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 400,
            }}
          >
            <motion.div
              className="flex items-center h-full px-3 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Icon with animated background */}
              <motion.div
                className={`relative flex items-center justify-center rounded-full ${bgColorMap[notification.type]}`}
                initial={{ width: 28, height: 28 }}
                animate={{
                  width: isExpanded ? 48 : 28,
                  height: isExpanded ? 48 : 28,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                {/* Animated ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${notification.type === 'success' ? '#10b981' : '#3b82f6'}, transparent)`,
                  }}
                />

                {/* Checkmark with drawing animation */}
                {notification.type === 'success' ? (
                  <motion.svg
                    width={isExpanded ? 24 : 16}
                    height={isExpanded ? 24 : 16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M4 12 L9 17 L20 6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    />
                  </motion.svg>
                ) : (
                  <Icon className="text-white" size={isExpanded ? 24 : 16} />
                )}
              </motion.div>

              {/* Text content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="flex-1 min-w-0"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-white font-semibold text-sm truncate">
                      {notification.title}
                    </p>
                    {notification.subtitle && (
                      <p className="text-white/60 text-xs truncate">
                        {notification.subtitle}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for easy Dynamic Island triggering
let globalSetNotification: ((notification: IslandNotification | null) => void) | null = null;

export function useDynamicIsland() {
  const [notification, setNotification] = useState<IslandNotification | null>(null);

  useEffect(() => {
    globalSetNotification = setNotification;
    return () => {
      globalSetNotification = null;
    };
  }, []);

  const show = (type: IslandType, title: string, subtitle?: string, duration?: number) => {
    setNotification({
      id: Date.now().toString(),
      type,
      title,
      subtitle,
      duration,
    });
  };

  const close = () => setNotification(null);

  return { notification, show, close, DynamicIsland: () => <DynamicIsland notification={notification} onClose={close} /> };
}

// Global function to show notification from anywhere
export function showIslandNotification(type: IslandType, title: string, subtitle?: string, duration?: number) {
  if (globalSetNotification) {
    globalSetNotification({
      id: Date.now().toString(),
      type,
      title,
      subtitle,
      duration,
    });
  }
}

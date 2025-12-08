import { motion, useScroll, useSpring } from 'framer-motion';

interface ScrollProgressProps {
  color?: string;
  height?: number;
  showOnlyOnScroll?: boolean;
}

export function ScrollProgress({
  color = '#10b981',
  height = 3,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  // Smooth the progress with spring physics
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[200] origin-left"
      style={{
        scaleX,
        height,
        background: `linear-gradient(90deg, ${color}, ${color}dd)`,
        boxShadow: `0 0 10px ${color}80`,
      }}
    />
  );
}

// Circular progress variant
export function CircularScrollProgress({
  size = 48,
  strokeWidth = 3,
  color = '#10b981',
}: {
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const { scrollYProgress } = useScroll();

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <motion.div
      className="fixed bottom-24 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            pathLength,
            strokeDasharray: circumference,
            strokeDashoffset: 0,
          }}
        />
      </svg>
    </motion.div>
  );
}

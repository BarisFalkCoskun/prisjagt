import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: string;
  intensity?: number;
}

export function TiltCard({
  children,
  className = '',
  onClick,
  glowColor = 'rgba(16, 185, 129, 0.4)',
  intensity = 10
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring config for smooth, Apple-like feel
  const springConfig = { damping: 20, stiffness: 300 };

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]), springConfig);

  // Spotlight effect position
  const spotlightX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const spotlightY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="relative w-full h-full"
      >
        {/* Spotlight/glow effect */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.6 : 0,
            background: `radial-gradient(circle at ${spotlightX.get()}% ${spotlightY.get()}%, ${glowColor} 0%, transparent 60%)`,
          }}
        />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-20 opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.15 : 0,
            background: `linear-gradient(
              105deg,
              transparent 40%,
              rgba(255, 255, 255, 0.8) 45%,
              rgba(255, 255, 255, 0.8) 50%,
              transparent 55%
            )`,
            backgroundSize: '200% 200%',
            backgroundPosition: `${spotlightX.get()}% ${spotlightY.get()}%`,
          }}
        />

        {children}
      </motion.div>
    </motion.div>
  );
}

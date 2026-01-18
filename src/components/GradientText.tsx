import { motion } from 'framer-motion';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animate?: boolean;
  duration?: number;
}

export function GradientText({
  children,
  className = '',
  colors = ['#10b981', '#3b82f6', '#8b5cf6', '#10b981'],
  animate = true,
  duration = 5,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
    backgroundSize: animate ? '200% auto' : '100% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  if (animate) {
    return (
      <motion.span
        className={className}
        style={gradientStyle}
        animate={{
          backgroundPosition: ['0% center', '200% center'],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={className} style={gradientStyle}>
      {children}
    </span>
  );
}

// Text that reveals character by character
export function RevealText({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.03,
}: {
  children: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}) {
  const characters = children.split('');

  return (
    <span className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: delay + index * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// Text that types out like a typewriter
export function TypewriterText({
  children,
  className = '',
  speed = 50,
  delay = 0,
}: {
  children: string;
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const characters = children.split('');

  return (
    <span className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0,
            delay: delay + (index * speed) / 1000,
          }}
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </span>
  );
}

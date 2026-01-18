import { motion } from 'framer-motion';

interface AnimatedGradientProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

export function AnimatedGradient({
  className = '',
  colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
  speed = 15,
}: AnimatedGradientProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Animated gradient blobs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-30"
        style={{ background: colors[0] }}
        animate={{
          x: ['-10%', '30%', '10%', '-10%'],
          y: ['-10%', '20%', '40%', '-10%'],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-25"
        style={{ background: colors[1] }}
        animate={{
          x: ['10%', '-20%', '5%', '10%'],
          y: ['20%', '-10%', '30%', '20%'],
          scale: [1.1, 0.9, 1.2, 1.1],
        }}
        transition={{
          duration: speed * 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
        style={{ background: colors[2] }}
        animate={{
          x: ['0%', '30%', '-20%', '0%'],
          y: ['0%', '-30%', '10%', '0%'],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{
          duration: speed * 0.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

// Mesh gradient variant - more Apple-like
export function MeshGradient({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-950/20 dark:via-black dark:to-blue-950/20" />

      {/* Animated orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-400/30 dark:bg-emerald-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/15 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-400/10 dark:bg-violet-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  );
}

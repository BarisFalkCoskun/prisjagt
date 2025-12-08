import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  origin?: { x: number; y: number };
}

const colors = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
];

export function Confetti({
  isActive,
  duration = 2000,
  particleCount = 50,
  origin = { x: 0.5, y: 0.5 }
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < particleCount; i++) {
        newPieces.push({
          id: i,
          x: origin.x * 100,
          y: origin.y * 100,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle',
        });
      }
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, particleCount, duration, origin.x, origin.y]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {pieces.map((piece) => {
            const endX = piece.x + (Math.random() - 0.5) * 100;
            const endY = piece.y + Math.random() * 60 + 20;

            return (
              <motion.div
                key={piece.id}
                initial={{
                  left: `${piece.x}%`,
                  top: `${piece.y}%`,
                  scale: 0,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  left: `${endX}%`,
                  top: `${endY}%`,
                  scale: piece.scale,
                  rotate: piece.rotation + Math.random() * 720,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: duration / 1000,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="absolute"
                style={{ originX: 0.5, originY: 0.5 }}
              >
                {piece.shape === 'circle' && (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: piece.color }}
                  />
                )}
                {piece.shape === 'square' && (
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: piece.color }}
                  />
                )}
                {piece.shape === 'triangle' && (
                  <div
                    className="w-0 h-0"
                    style={{
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: `10px solid ${piece.color}`,
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}

// Hook for easy confetti triggering
export function useConfetti() {
  const [isActive, setIsActive] = useState(false);
  const [origin, setOrigin] = useState({ x: 0.5, y: 0.5 });

  const trigger = (originPoint?: { x: number; y: number }) => {
    if (originPoint) {
      setOrigin(originPoint);
    }
    setIsActive(true);
    setTimeout(() => setIsActive(false), 100);
  };

  return { isActive, origin, trigger, Confetti: () => <Confetti isActive={isActive} origin={origin} /> };
}

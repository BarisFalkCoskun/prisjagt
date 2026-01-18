import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Segment {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  segments: Segment[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function SegmentedControl({
  segments,
  value,
  onChange,
  size = 'md',
}: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-2.5 px-5',
  };

  const containerPadding = {
    sm: 'p-1',
    md: 'p-1',
    lg: 'p-1.5',
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeIndex = segments.findIndex((s) => s.id === value);
    const buttons = container.querySelectorAll('button');
    const activeButton = buttons[activeIndex];

    if (activeButton) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [value, segments]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-xl ${containerPadding[size]}`}
    >
      {/* Sliding indicator */}
      <motion.div
        className="absolute top-1 bottom-1 bg-white dark:bg-[#3a3a3c] rounded-lg shadow-sm"
        initial={false}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 35,
        }}
      />

      {/* Segments */}
      {segments.map((segment) => (
        <button
          key={segment.id}
          onClick={() => onChange(segment.id)}
          className={`relative z-10 flex items-center gap-1.5 font-medium transition-colors duration-200 ${sizeClasses[size]} ${
            value === segment.id
              ? 'text-[#1d1d1f] dark:text-white'
              : 'text-[#86868b] hover:text-[#6e6e73]'
          }`}
        >
          {segment.icon}
          {segment.label}
        </button>
      ))}
    </div>
  );
}

// Pill variant - more compact, single selection
export function PillSelector({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => (
        <motion.button
          key={option.id}
          onClick={() => onChange(option.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            value === option.id
              ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-black shadow-lg'
              : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]'
          }`}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}

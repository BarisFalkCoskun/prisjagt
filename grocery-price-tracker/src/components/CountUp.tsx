import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  separator?: string;
  className?: string;
  once?: boolean;
}

export function CountUp({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  decimals = 0,
  suffix = '',
  prefix = '',
  separator = '.',
  className = '',
  once = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: '-100px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  const springValue = useSpring(start, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });

  const displayValue = useTransform(springValue, (current) => {
    const formatted = current.toFixed(decimals);
    // Add thousand separators
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join(',');
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        springValue.set(end);
        setHasAnimated(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, end, delay, springValue, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
}

// Slot machine style counter for dramatic reveals
interface SlotCounterProps {
  value: number;
  className?: string;
  digitClassName?: string;
}

export function SlotCounter({ value, className = '', digitClassName = '' }: SlotCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const digits = value.toString().split('');

  return (
    <div ref={ref} className={`flex overflow-hidden ${className}`}>
      {digits.map((digit, index) => (
        <motion.div
          key={index}
          initial={{ y: '100%' }}
          animate={isInView ? { y: 0 } : { y: '100%' }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            delay: index * 0.1,
          }}
          className={digitClassName}
        >
          {digit}
        </motion.div>
      ))}
    </div>
  );
}

// Apple-style ticker for prices with smooth digit transitions
interface PriceTickerProps {
  price: number;
  previousPrice?: number;
  currency?: string;
  className?: string;
}

export function PriceTicker({
  price,
  previousPrice,
  currency = 'kr',
  className = '',
}: PriceTickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const priceStr = price.toFixed(2).replace('.', ',');
  const digits = priceStr.split('');

  return (
    <div ref={ref} className={`inline-flex items-baseline ${className}`}>
      <div className="flex overflow-hidden">
        {digits.map((char, index) => (
          <motion.span
            key={`${index}-${char}`}
            initial={{ y: previousPrice ? 20 : 0, opacity: previousPrice ? 0 : 1 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              delay: index * 0.03,
            }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </div>
      <motion.span
        initial={{ opacity: 0, x: -5 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: digits.length * 0.03 + 0.1 }}
        className="ml-1 text-[0.6em] text-[#86868b]"
      >
        {currency}
      </motion.span>
    </div>
  );
}

// Stats card with animated counter - Apple-style
interface StatCardProps {
  value: number;
  label: string;
  suffix?: string;
  icon?: React.ReactNode;
  color?: string;
  decimals?: number;
}

export function StatCard({
  value,
  label,
  suffix = '',
  icon,
  color = '#10b981',
  decimals = 0,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="relative p-6 rounded-3xl bg-white dark:bg-[#1d1d1f] border border-[#e8e8ed] dark:border-[#38383a] overflow-hidden group"
    >
      {/* Background glow */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />

      {/* Icon */}
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </motion.div>
      )}

      {/* Value */}
      <div className="text-4xl font-bold text-[#1d1d1f] dark:text-white mb-1">
        <CountUp
          end={value}
          duration={1.5}
          delay={0.3}
          decimals={decimals}
          suffix={suffix}
        />
      </div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className="text-[#86868b] text-sm font-medium"
      >
        {label}
      </motion.p>
    </motion.div>
  );
}

// Circular progress with animated percentage
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
  label?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#10b981',
  showLabel = true,
  label,
}: CircularProgressProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
  });

  const strokeDashoffset = useTransform(
    springValue,
    (v) => circumference - (v / 100) * circumference
  );

  useEffect(() => {
    if (isInView) {
      springValue.set(percentage);
    }
  }, [isInView, percentage, springValue]);

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-[#f5f5f7] dark:text-[#2c2c2e]"
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
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>

      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#1d1d1f] dark:text-white">
            <CountUp end={value} duration={1.5} />
          </span>
          {label && <span className="text-xs text-[#86868b]">{label}</span>}
        </div>
      )}
    </div>
  );
}

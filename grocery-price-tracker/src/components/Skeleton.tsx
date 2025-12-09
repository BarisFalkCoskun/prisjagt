import { motion } from 'framer-motion';

// Base skeleton with Apple-style shimmer
interface SkeletonProps {
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

export function Skeleton({ className = '', rounded = 'lg' }: SkeletonProps) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#f5f5f7] dark:bg-[#2c2c2e] ${roundedClasses[rounded]} ${className}`}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
        animate={{
          translateX: ['100%', '-100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 0.5,
        }}
      />
    </div>
  );
}

// Product card skeleton matching ProductCard layout
export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl border border-[#e8e8ed] dark:border-[#38383a] overflow-hidden">
      {/* Image area */}
      <div className="aspect-square bg-gradient-to-br from-[#fafafa] to-[#f0f0f2] dark:from-[#2c2c2e] dark:to-[#1d1d1f] relative">
        <Skeleton className="absolute inset-8" rounded="2xl" />
        {/* Store badge skeleton */}
        <Skeleton className="absolute bottom-3 left-3 w-16 h-6" rounded="full" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <Skeleton className="h-3 w-16 mb-2" rounded="full" />

        {/* Title */}
        <Skeleton className="h-5 w-full mb-1.5" rounded="lg" />
        <Skeleton className="h-5 w-3/4 mb-4" rounded="lg" />

        {/* Price */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <Skeleton className="h-3 w-14 mb-1" rounded="full" />
            <Skeleton className="h-8 w-20" rounded="lg" />
          </div>
          <Skeleton className="h-5 w-12" rounded="lg" />
        </div>

        {/* Store prices */}
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="flex-1 h-14" rounded="xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Recipe card skeleton
export function RecipeCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl border border-[#e8e8ed] dark:border-[#38383a] overflow-hidden">
      {/* Image */}
      <Skeleton className="aspect-video w-full" rounded="none" />

      {/* Content */}
      <div className="p-5">
        {/* Category and time */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-16" rounded="full" />
          <Skeleton className="h-4 w-12" rounded="full" />
        </div>

        {/* Title */}
        <Skeleton className="h-6 w-full mb-2" rounded="lg" />
        <Skeleton className="h-6 w-2/3 mb-3" rounded="lg" />

        {/* Description */}
        <Skeleton className="h-4 w-full mb-1" rounded="lg" />
        <Skeleton className="h-4 w-4/5" rounded="lg" />
      </div>
    </div>
  );
}

// Grid of product card skeletons
interface ProductGridSkeletonProps {
  count?: number;
  columns?: number;
}

export function ProductGridSkeleton({ count = 8, columns = 4 }: ProductGridSkeletonProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colClasses[columns as keyof typeof colClasses] || colClasses[4]} gap-5`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <ProductCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

// Stats skeleton for dashboard
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="p-6 rounded-3xl bg-white dark:bg-[#1d1d1f] border border-[#e8e8ed] dark:border-[#38383a]"
        >
          <Skeleton className="w-12 h-12 mb-4" rounded="2xl" />
          <Skeleton className="h-8 w-20 mb-2" rounded="lg" />
          <Skeleton className="h-4 w-16" rounded="full" />
        </motion.div>
      ))}
    </div>
  );
}

// Text line skeleton with realistic word-like widths
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  const widths = ['100%', '85%', '70%', '90%', '60%'];

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          rounded="full"
          style={{ width: widths[i % widths.length] }}
        />
      ))}
    </div>
  );
}

// Avatar skeleton
export function AvatarSkeleton({ size = 40 }: { size?: number }) {
  return (
    <Skeleton
      className="flex-shrink-0"
      rounded="full"
      style={{ width: size, height: size }}
    />
  );
}

// List item skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <AvatarSkeleton size={48} />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" rounded="full" />
        <Skeleton className="h-3 w-1/2" rounded="full" />
      </div>
      <Skeleton className="h-6 w-16" rounded="full" />
    </div>
  );
}

// Pulse animation skeleton (alternative style)
export function PulseSkeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-xl ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <div className="relative min-h-[600px] bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-8 md:p-12">
      <div className="max-w-5xl mx-auto pt-20">
        {/* Badge */}
        <Skeleton className="h-10 w-48 mb-6 bg-white/20" rounded="full" />

        {/* Title */}
        <Skeleton className="h-16 w-full max-w-xl mb-4 bg-white/20" rounded="xl" />
        <Skeleton className="h-16 w-full max-w-md mb-8 bg-white/20" rounded="xl" />

        {/* Description */}
        <Skeleton className="h-8 w-full max-w-lg mb-2 bg-white/20" rounded="lg" />
        <Skeleton className="h-8 w-4/5 max-w-lg mb-8 bg-white/20" rounded="lg" />

        {/* Search */}
        <Skeleton className="h-14 w-full max-w-xl mb-12 bg-white/20" rounded="full" />

        {/* Stats */}
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-32 bg-white/20" rounded="2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

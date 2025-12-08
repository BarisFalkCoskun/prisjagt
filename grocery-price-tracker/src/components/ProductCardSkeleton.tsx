import { motion } from 'framer-motion';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1d1d1f] rounded-3xl border border-[#e8e8ed] dark:border-[#38383a] overflow-hidden">
      {/* Image skeleton */}
      <div className="relative aspect-square bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] dark:from-[#2c2c2e] dark:to-[#1d1d1f] p-8">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        {/* Category */}
        <div className="h-3 w-16 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-full overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.1 }}
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-full overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.2 }}
            />
          </div>
          <div className="h-4 w-2/3 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-full overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.3 }}
            />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="h-3 w-12 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-full" />
            <div className="h-8 w-20 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-lg overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.4 }}
              />
            </div>
          </div>
          <div className="h-5 w-12 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-lg" />
        </div>

        {/* Store comparison */}
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 h-12 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-xl overflow-hidden relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.1 * i }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

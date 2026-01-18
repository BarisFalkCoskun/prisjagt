import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Flame, Clock, TrendingDown, ChevronRight, Sparkles, X } from 'lucide-react';
import type { Product } from '../types';

interface TodayWidgetProps {
  title: string;
  subtitle?: string;
  products: Product[];
  variant?: 'featured' | 'deals' | 'trending';
  onProductClick: (product: Product) => void;
}

export function TodayWidget({
  title,
  subtitle,
  products,
  variant = 'featured',
  onProductClick,
}: TodayWidgetProps) {
  const [expandedProduct, setExpandedProduct] = useState<Product | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });

  const gradients = {
    featured: 'from-violet-500 via-purple-500 to-fuchsia-500',
    deals: 'from-rose-500 via-red-500 to-orange-500',
    trending: 'from-emerald-500 via-green-500 to-teal-500',
  };

  const icons = {
    featured: <Sparkles className="w-5 h-5" />,
    deals: <Flame className="w-5 h-5" />,
    trending: <TrendingDown className="w-5 h-5" />,
  };

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[variant]} flex items-center justify-center text-white shadow-lg`}>
            {icons[variant]}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#1d1d1f] dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-[#86868b]">{subtitle}</p>}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400"
        >
          Se alle
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide snap-x snap-mandatory"
      >
        {products.map((product, index) => (
          <TodayCard
            key={product.id}
            product={product}
            index={index}
            variant={variant}
            onClick={() => onProductClick(product)}
            onExpand={() => setExpandedProduct(product)}
          />
        ))}
      </div>

      {/* Scroll progress indicator */}
      <div className="flex justify-center gap-1.5 mt-4">
        {products.map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 rounded-full bg-[#e8e8ed] dark:bg-[#3a3a3c] overflow-hidden"
            style={{ width: i === 0 ? 24 : 8 }}
          >
            <motion.div
              className={`h-full bg-gradient-to-r ${gradients[variant]}`}
              style={{
                scaleX: useTransform(
                  scrollXProgress,
                  [i / products.length, (i + 1) / products.length],
                  [0, 1]
                ),
                transformOrigin: 'left',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Expanded view */}
      <AnimatePresence>
        {expandedProduct && (
          <ExpandedProductView
            product={expandedProduct}
            onClose={() => setExpandedProduct(null)}
            onClick={() => {
              onProductClick(expandedProduct);
              setExpandedProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

interface TodayCardProps {
  product: Product;
  index: number;
  variant: 'featured' | 'deals' | 'trending';
  onClick: () => void;
  onExpand: () => void;
}

function TodayCard({ product, index, variant, onClick, onExpand }: TodayCardProps) {
  const sortedPrices = [...product.storePrices].sort((a, b) => a.currentPrice - b.currentPrice);
  const lowestPrice = sortedPrices[0];
  const highestPrice = sortedPrices[sortedPrices.length - 1];
  const savings = highestPrice.currentPrice - lowestPrice.currentPrice;

  const backgroundGradients = {
    featured: 'from-violet-500 to-purple-600',
    deals: 'from-rose-500 to-red-600',
    trending: 'from-emerald-500 to-green-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 snap-center"
    >
      <motion.article
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="relative w-[280px] h-[360px] rounded-3xl overflow-hidden cursor-pointer group"
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${backgroundGradients[variant]} opacity-90`} />

        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -bottom-20 -left-20 w-40 h-40 bg-black/10 rounded-full blur-xl"
          />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col p-6">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-auto">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
              {variant === 'deals' ? 'TILBUD' : variant === 'trending' ? 'TRENDING' : 'UDVALGT'}
            </span>
            {savings > 2 && (
              <span className="px-3 py-1 rounded-full bg-white text-rose-500 text-xs font-bold">
                Spar {savings.toFixed(0)} kr
              </span>
            )}
          </div>

          {/* Product image */}
          <div className="flex-1 flex items-center justify-center py-4">
            <motion.img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-32 object-contain drop-shadow-2xl"
              whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </div>

          {/* Info */}
          <div className="mt-auto">
            <p className="text-white/70 text-xs font-medium mb-1">{product.category}</p>
            <h3 className="text-white text-lg font-semibold leading-tight mb-2 line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/60 text-xs">Bedste pris</p>
                <p className="text-white text-2xl font-bold">
                  {lowestPrice.currentPrice.toFixed(2).replace('.', ',')}
                  <span className="text-sm font-normal ml-1">kr</span>
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: lowestPrice.store.color }}
              >
                <span className="text-white text-[10px] font-bold">
                  {lowestPrice.store.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center"
        >
          <motion.button
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className="px-6 py-3 rounded-full bg-white text-[#1d1d1f] font-semibold shadow-xl"
          >
            Quick Look
          </motion.button>
        </motion.div>
      </motion.article>
    </motion.div>
  );
}

interface ExpandedProductViewProps {
  product: Product;
  onClose: () => void;
  onClick: () => void;
}

function ExpandedProductView({ product, onClose, onClick }: ExpandedProductViewProps) {
  const sortedPrices = [...product.storePrices].sort((a, b) => a.currentPrice - b.currentPrice);
  const lowestPrice = sortedPrices[0];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[101] md:w-full md:max-w-lg bg-white dark:bg-[#1d1d1f] rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header image */}
        <div className="relative h-64 bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
          <motion.img
            src={product.image}
            alt={product.name}
            className="max-w-[200px] max-h-[180px] object-contain drop-shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-1">
            {product.category}
          </p>
          <h2 className="text-2xl font-semibold text-[#1d1d1f] dark:text-white mb-2">
            {product.name}
          </h2>
          <p className="text-[#86868b] mb-6 line-clamp-2">{product.description}</p>

          {/* Price comparison */}
          <div className="space-y-2 mb-6">
            {sortedPrices.map((sp, index) => (
              <div
                key={sp.store.id}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  index === 0
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500'
                    : 'bg-[#f5f5f7] dark:bg-[#2c2c2e]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sp.store.color }}
                  />
                  <span className="font-medium text-[#1d1d1f] dark:text-white">
                    {sp.store.name}
                  </span>
                </div>
                <span
                  className={`font-semibold ${
                    index === 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-[#1d1d1f] dark:text-white'
                  }`}
                >
                  {sp.currentPrice.toFixed(2)} kr
                </span>
              </div>
            ))}
          </div>

          {/* Action button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-lg shadow-green-500/25"
          >
            Se detaljer
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

// Countdown timer for deals
interface DealCountdownProps {
  endsAt: Date;
  label?: string;
}

export function DealCountdown({ endsAt, label = 'Tilbud slutter om' }: DealCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const diff = endsAt.getTime() - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
      <Clock className="w-5 h-5 text-rose-500" />
      <div>
        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{label}</p>
        <div className="flex items-center gap-1 font-mono text-lg font-bold text-rose-600 dark:text-rose-400">
          <span>{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="animate-pulse">:</span>
          <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="animate-pulse">:</span>
          <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}

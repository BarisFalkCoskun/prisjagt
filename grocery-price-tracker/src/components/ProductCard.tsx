import { useState, useMemo } from 'react';
import { Image } from '@heroui/react';
import { Heart, Plus, TrendingDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../types';
import { useShoppingList } from '../context/ShoppingListContext';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const { addItem, isInList } = useShoppingList();

  const sortedPrices = [...product.storePrices].sort((a, b) => a.currentPrice - b.currentPrice);
  const lowestStorePrice = sortedPrices[0];
  const highestStorePrice = sortedPrices[sortedPrices.length - 1];

  const priceDiff = highestStorePrice.currentPrice - lowestStorePrice.currentPrice;
  const hasSale = product.storePrices.some(sp => sp.isOnSale);
  const inList = isInList(product.id);

  // Deterministic price change based on product id (consistent across renders)
  const priceChangeSeed = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < product.id.length; i++) {
      hash = ((hash << 5) - hash) + product.id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }, [product.id]);

  const priceChangePercent = ((priceChangeSeed % 30) - 10); // -10 to +20
  const isPriceDown = priceChangePercent < 0;

  // Generate deterministic sparkline data
  const sparklineData = useMemo(() => {
    const data: number[] = [];
    let value = lowestStorePrice.currentPrice;
    for (let i = 0; i < 7; i++) {
      const seed = (priceChangeSeed + i * 13) % 100;
      value += (seed - 50) / 10;
      data.push(Math.max(value, lowestStorePrice.currentPrice * 0.8));
    }
    // End with current price
    data[6] = lowestStorePrice.currentPrice;
    return data;
  }, [priceChangeSeed, lowestStorePrice.currentPrice]);

  // Smart badge logic - only show max 2 badges, prioritized
  const badges = useMemo(() => {
    const allBadges: { type: string; priority: number; content: React.ReactNode }[] = [];

    // Price drop is highest priority
    if (isPriceDown && Math.abs(priceChangePercent) > 5) {
      allBadges.push({
        type: 'priceDrop',
        priority: 1,
        content: (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-green-500/25"
          >
            <TrendingDown className="w-3 h-3" />
            {Math.abs(priceChangePercent).toFixed(0)}%
          </motion.span>
        ),
      });
    }

    // Sale badge
    if (hasSale) {
      allBadges.push({
        type: 'sale',
        priority: 2,
        content: (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-red-500/25 uppercase tracking-wide">
            Tilbud
          </span>
        ),
      });
    }

    // Savings badge (only if significant and no price drop shown)
    if (priceDiff > 3 && !isPriceDown) {
      allBadges.push({
        type: 'savings',
        priority: 3,
        content: (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-green-500/25">
            Spar {priceDiff.toFixed(0)} kr
          </span>
        ),
      });
    }

    // Sort by priority and take max 2
    return allBadges.sort((a, b) => a.priority - b.priority).slice(0, 2);
  }, [isPriceDown, priceChangePercent, hasSale, priceDiff]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 1500);
  };

  // Sparkline component
  const Sparkline = ({ data }: { data: number[] }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 50;
    const height = 20;
    const points = data.map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    const trendColor = data[6] <= data[0] ? '#10b981' : '#f43f5e';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={trendColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r="2"
          fill={trendColor}
        />
      </svg>
    );
  };

  // Get glow color from store
  const glowColor = lowestStorePrice.store.color;

  return (
    <motion.article
      onClick={onClick}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group cursor-pointer bg-white dark:bg-[#1d1d1f] rounded-3xl border border-[#e8e8ed] dark:border-[#38383a] overflow-hidden relative"
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* Hover glow effect */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `0 8px 40px -8px ${glowColor}40, 0 0 0 1px ${glowColor}20`,
        }}
      />

      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-[#fafafa] to-[#f0f0f2] dark:from-[#2c2c2e] dark:to-[#1d1d1f] p-8 overflow-hidden">
        {/* Decorative gradient blob */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-all duration-700"
          style={{ backgroundColor: `${glowColor}30` }}
        />

        <Image
          alt={product.name}
          src={product.image}
          className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110 relative z-10"
          fallbackSrc="https://via.placeholder.com/400x400?text=No+Image"
        />

        {/* Top Left Actions */}
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            className={`p-2.5 rounded-full transition-all duration-200 shadow-lg ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-rose-500/30'
                : 'bg-white/90 dark:bg-[#2c2c2e]/90 backdrop-blur-sm text-[#86868b] opacity-0 group-hover:opacity-100 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>

          {/* Add to List Button */}
          <AnimatePresence mode="wait">
            {showAddedFeedback ? (
              <motion.div
                key="added"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="p-2.5 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              >
                <Check className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.button
                key="add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToList}
                className={`p-2.5 rounded-full transition-all duration-200 shadow-lg ${
                  inList
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                    : 'bg-white/90 dark:bg-[#2c2c2e]/90 backdrop-blur-sm text-[#86868b] opacity-0 group-hover:opacity-100 hover:text-emerald-500'
                }`}
              >
                <Plus className={`w-4 h-4 transition-transform ${inList ? 'rotate-45' : ''}`} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Badges - Max 2, smartly chosen */}
        {badges.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end z-20">
            {badges.map((badge) => (
              <div key={badge.type}>{badge.content}</div>
            ))}
          </div>
        )}

        {/* Best price store indicator - Bottom left */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white shadow-lg z-20"
          style={{
            backgroundColor: lowestStorePrice.store.color,
            boxShadow: `0 4px 14px -2px ${lowestStorePrice.store.color}50`
          }}
        >
          {lowestStorePrice.store.name}
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <p className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">
          {product.category}
        </p>

        {/* Product Name */}
        <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-white leading-snug mb-4 line-clamp-2 min-h-[44px] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {product.name}
        </h3>

        {/* Price Display with Sparkline */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mb-0.5">Bedste pris</p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">
                {lowestStorePrice.currentPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-sm font-medium text-[#86868b]">kr</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Sparkline data={sparklineData} />
            {priceDiff > 0 && (
              <p className="text-[10px] text-[#86868b]">
                op til {highestStorePrice.currentPrice.toFixed(0)},-
              </p>
            )}
          </div>
        </div>

        {/* Store Price Comparison */}
        <div className="flex gap-1.5">
          {sortedPrices.map((sp, index) => {
            const shortName = sp.store.name === 'Rema 1000' ? 'Rema' : sp.store.name;

            return (
              <motion.div
                key={sp.store.id}
                whileHover={{ scale: 1.05 }}
                className={`flex-1 py-2 px-1 rounded-xl text-center transition-all relative overflow-hidden cursor-default ${
                  index === 0
                    ? 'bg-gradient-to-b from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 ring-1 ring-emerald-200 dark:ring-emerald-800'
                    : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] hover:bg-[#ebebed] dark:hover:bg-[#3a3a3c]'
                }`}
              >
                {/* Store Color Bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
                  style={{ backgroundColor: sp.store.color }}
                />
                <p className="text-[8px] font-semibold text-[#86868b] mt-1 mb-0.5 truncate">
                  {shortName}
                </p>
                <p className={`text-[11px] font-bold ${
                  index === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#1d1d1f] dark:text-white'
                }`}>
                  {sp.currentPrice.toFixed(0)},-
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}

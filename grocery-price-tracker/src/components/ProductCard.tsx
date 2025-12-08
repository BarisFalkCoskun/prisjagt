import { useState } from 'react';
import { Image } from '@heroui/react';
import { Heart, Plus, TrendingDown, TrendingUp, Check } from 'lucide-react';
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

  // Simulate price change data (in real app, this would come from price history)
  const priceChange = lowestStorePrice.priceHistory
    ? lowestStorePrice.priceHistory[0]?.price - lowestStorePrice.currentPrice
    : Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 3;
  const priceChangePercent = (priceChange / (lowestStorePrice.currentPrice + priceChange)) * 100;
  const isPriceDown = priceChange > 0;
  const isLowestEver = Math.random() > 0.7; // Simulated - would check history

  // Generate mini sparkline data
  const sparklineData = lowestStorePrice.priceHistory?.slice(0, 7).reverse() ||
    Array.from({ length: 7 }, () => lowestStorePrice.currentPrice + (Math.random() - 0.5) * 10);

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

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={isPriceDown ? '#10b981' : '#f43f5e'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* End dot */}
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r="2"
          fill={isPriceDown ? '#10b981' : '#f43f5e'}
        />
      </svg>
    );
  };

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-[#1d1d1f] rounded-3xl border border-[#e8e8ed] dark:border-[#38383a] transition-all duration-300 hover:shadow-2xl hover:shadow-black/8 dark:hover:shadow-black/30 hover:-translate-y-2 hover:border-transparent overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-[#fafafa] to-[#f0f0f2] dark:from-[#2c2c2e] dark:to-[#1d1d1f] p-8 overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
            className={`p-2 rounded-full transition-all duration-200 ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-white/80 dark:bg-[#2c2c2e]/80 backdrop-blur-sm text-[#86868b] opacity-0 group-hover:opacity-100 hover:bg-white dark:hover:bg-[#3a3a3c] hover:text-rose-500'
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
                className="p-2 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              >
                <Check className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.button
                key="add"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToList}
                className={`p-2 rounded-full transition-all duration-200 ${
                  inList
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-white/80 dark:bg-[#2c2c2e]/80 backdrop-blur-sm text-[#86868b] opacity-0 group-hover:opacity-100 hover:bg-white dark:hover:bg-[#3a3a3c] hover:text-emerald-500'
                }`}
              >
                <Plus className={`w-4 h-4 ${inList ? 'rotate-45' : ''}`} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Badges - Stacked in top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end z-20">
          {/* Price Drop Badge */}
          {isPriceDown && Math.abs(priceChangePercent) > 3 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-green-500/25"
            >
              <TrendingDown className="w-3 h-3" />
              {Math.abs(priceChangePercent).toFixed(0)}%
            </motion.span>
          )}
          {/* Price Up indicator (subtle) */}
          {!isPriceDown && Math.abs(priceChangePercent) > 3 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <TrendingUp className="w-3 h-3" />
              {Math.abs(priceChangePercent).toFixed(0)}%
            </span>
          )}
          {hasSale && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-red-500/25 uppercase tracking-wide">
              Tilbud
            </span>
          )}
          {isLowestEver && (
            <span className="px-2 py-1 rounded-full text-[9px] font-bold bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-purple-500/25">
              Laveste pris
            </span>
          )}
          {priceDiff > 1 && !isPriceDown && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-green-500/25">
              Spar {priceDiff.toFixed(0)} kr
            </span>
          )}
        </div>

        {/* Best price store indicator - Bottom left */}
        <div
          className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white shadow-lg z-20"
          style={{
            backgroundColor: lowestStorePrice.store.color,
            boxShadow: `0 4px 14px -2px ${lowestStorePrice.store.color}50`
          }}
        >
          {lowestStorePrice.store.name}
        </div>
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
            {/* Sparkline */}
            <Sparkline data={sparklineData.map(p => typeof p === 'number' ? p : p.price)} />
            {priceDiff > 0 && (
              <p className="text-[10px] text-[#86868b]">
                op til {highestStorePrice.currentPrice.toFixed(0)},-
              </p>
            )}
          </div>
        </div>

        {/* Store Price Comparison - With Store Names */}
        <div className="flex gap-1.5">
          {sortedPrices.map((sp, index) => {
            // Get short store name
            const shortName = sp.store.name === 'Rema 1000' ? 'Rema' : sp.store.name;

            return (
              <div
                key={sp.store.id}
                className={`flex-1 py-2 px-1 rounded-xl text-center transition-all relative overflow-hidden ${
                  index === 0
                    ? 'bg-gradient-to-b from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 ring-1 ring-emerald-200 dark:ring-emerald-800'
                    : 'bg-[#f5f5f7] dark:bg-[#2c2c2e]'
                }`}
              >
                {/* Store Color Bar at Top */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: sp.store.color }}
                />
                {/* Store Name */}
                <p className="text-[8px] font-semibold text-[#86868b] mt-1 mb-0.5 truncate">
                  {shortName}
                </p>
                {/* Price */}
                <p className={`text-[11px] font-bold ${
                  index === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#1d1d1f] dark:text-white'
                }`}>
                  {sp.currentPrice.toFixed(0)},-
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

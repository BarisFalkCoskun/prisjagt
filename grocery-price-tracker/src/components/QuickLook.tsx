import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShoppingCart, Heart, TrendingDown, Check } from 'lucide-react';
import type { Product } from '../types';
import { useShoppingList } from '../context';

interface QuickLookProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickLook({ product, isOpen, onClose }: QuickLookProps) {
  const navigate = useNavigate();
  const { addItem, isInList } = useShoppingList();

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  const sortedPrices = [...product.storePrices].sort((a, b) => a.currentPrice - b.currentPrice);
  const lowestPrice = sortedPrices[0];
  const highestPrice = sortedPrices[sortedPrices.length - 1];
  const savings = highestPrice.currentPrice - lowestPrice.currentPrice;
  const inList = isInList(product.id);

  const handleAddToList = () => {
    addItem(product);
  };

  const handleViewDetails = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[101] md:w-full md:max-w-3xl md:max-h-[85vh] bg-white dark:bg-[#1d1d1f] rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="flex flex-col md:flex-row h-full">
              {/* Product Image */}
              <div className="relative md:w-1/2 aspect-square md:aspect-auto bg-gradient-to-br from-[#fafafa] to-[#f0f0f2] dark:from-[#2c2c2e] dark:to-[#1d1d1f] flex items-center justify-center p-8">
                {/* Background glow */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `radial-gradient(circle at center, ${lowestPrice.store.color}40, transparent 70%)`,
                  }}
                />

                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: 'spring', damping: 20 }}
                  src={product.image}
                  alt={product.name}
                  className="relative z-10 max-w-full max-h-full object-contain"
                />

                {/* Sale badge */}
                {product.storePrices.some(sp => sp.isOnSale) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-red-500 text-white text-sm font-bold shadow-lg"
                  >
                    TILBUD
                  </motion.div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {/* Category */}
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">
                    {product.category}
                  </p>

                  {/* Name */}
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] dark:text-white mb-3">
                    {product.name}
                  </h2>

                  {/* Description */}
                  <p className="text-[#86868b] mb-6 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-end gap-3 mb-6">
                    <div>
                      <p className="text-xs text-[#86868b] mb-1">Bedste pris hos {lowestPrice.store.name}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-[#1d1d1f] dark:text-white">
                          {lowestPrice.currentPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-lg text-[#86868b]">kr</span>
                      </div>
                    </div>

                    {savings > 1 && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm font-semibold">Spar {savings.toFixed(0)} kr</span>
                      </div>
                    )}
                  </div>

                  {/* Store Prices */}
                  <div className="space-y-2 mb-6">
                    <p className="text-sm font-medium text-[#1d1d1f] dark:text-white mb-3">
                      Sammenlign priser
                    </p>
                    {sortedPrices.map((sp, index) => (
                      <motion.div
                        key={sp.store.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className={`flex items-center justify-between p-3 rounded-xl ${
                          index === 0
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500'
                            : 'bg-[#f5f5f7] dark:bg-[#2c2c2e]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: sp.store.color }}
                          />
                          <span className="font-medium text-[#1d1d1f] dark:text-white">
                            {sp.store.name}
                          </span>
                          {sp.isOnSale && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                              TILBUD
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`font-semibold ${index === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#1d1d1f] dark:text-white'}`}>
                            {sp.currentPrice.toFixed(2)} kr
                          </span>
                          {sp.previousPrice && (
                            <span className="ml-2 text-sm text-[#86868b] line-through">
                              {sp.previousPrice.toFixed(2)} kr
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToList}
                      disabled={inList}
                      className={`flex-1 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                        inList
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                      }`}
                    >
                      {inList ? (
                        <>
                          <Check className="w-5 h-5" />
                          På listen
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Tilføj til liste
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] hover:text-rose-500 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleViewDetails}
                      className="p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Keyboard hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-white/60">
              <kbd className="px-2 py-1 rounded bg-black/30 font-mono">Space</kbd>
              <span>eller</span>
              <kbd className="px-2 py-1 rounded bg-black/30 font-mono">Esc</kbd>
              <span>for at lukke</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

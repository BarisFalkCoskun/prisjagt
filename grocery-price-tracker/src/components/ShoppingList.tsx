import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { useShoppingList } from '../context/ShoppingListContext';
import { AnimatedCounter } from './AnimatedCounter';

interface ShoppingListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingList({ isOpen, onClose }: ShoppingListProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    toggleChecked,
    clearChecked,
    totalsByStore,
    bestStore,
    totalSavings,
  } = useShoppingList();

  const checkedCount = items.filter((item) => item.checked).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#1d1d1f] z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#e8e8ed] dark:border-[#38383a]">
              <div>
                <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-white">
                  Indkøbsliste
                </h2>
                <p className="text-sm text-[#86868b]">
                  {items.length} {items.length === 1 ? 'vare' : 'varer'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Best Store Banner */}
            {bestStore && items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/80 text-sm">Bedste butik</p>
                    <p className="font-semibold text-lg">{bestStore.storeName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm">Total</p>
                    <p className="font-bold text-xl">
                      <AnimatedCounter value={bestStore.total} decimals={0} suffix=" kr" />
                    </p>
                  </div>
                </div>
                {totalSavings > 0 && (
                  <p className="mt-2 text-sm text-white/80">
                    Du sparer <span className="font-semibold text-white">{totalSavings.toFixed(0)} kr</span> vs. dyreste butik
                  </p>
                )}
              </motion.div>
            )}

            {/* Store Comparison */}
            {totalsByStore.length > 1 && (
              <div className="px-6 mt-4">
                <p className="text-xs font-medium text-[#86868b] mb-2">Sammenlign butikker</p>
                <div className="flex gap-2">
                  {totalsByStore.map((store, index) => (
                    <div
                      key={store.storeId}
                      className={`flex-1 py-2 px-2 rounded-xl text-center relative overflow-hidden ${
                        index === 0
                          ? 'bg-gradient-to-b from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 ring-1 ring-emerald-200 dark:ring-emerald-800'
                          : 'bg-[#f5f5f7] dark:bg-[#2c2c2e]'
                      }`}
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{ backgroundColor: store.storeColor }}
                      />
                      <p className="text-[9px] font-semibold text-[#86868b] mt-1 truncate">
                        {store.storeName === 'Rema 1000' ? 'Rema' : store.storeName}
                      </p>
                      <p className={`text-sm font-bold ${
                        index === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#1d1d1f] dark:text-white'
                      }`}>
                        {store.total.toFixed(0)},-
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-3xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-[#86868b]" />
                  </div>
                  <p className="text-lg font-semibold text-[#1d1d1f] dark:text-white mb-1">
                    Listen er tom
                  </p>
                  <p className="text-sm text-[#86868b]">
                    Tilføj produkter fra forsiden
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => {
                      const lowestPrice = Math.min(
                        ...item.product.storePrices.map((sp) => sp.currentPrice)
                      );

                      return (
                        <motion.div
                          key={item.product.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8, x: -100 }}
                          className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                            item.checked
                              ? 'bg-[#f5f5f7] dark:bg-[#2c2c2e] border-transparent opacity-60'
                              : 'bg-white dark:bg-[#1d1d1f] border-[#e8e8ed] dark:border-[#38383a]'
                          }`}
                        >
                          {/* Checkbox */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleChecked(item.product.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              item.checked
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'border-[#d2d2d7] dark:border-[#48484a] hover:border-emerald-500'
                            }`}
                          >
                            {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
                          </motion.button>

                          {/* Product Image */}
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className={`w-12 h-12 object-contain rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] p-1 ${
                              item.checked ? 'grayscale' : ''
                            }`}
                          />

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm truncate ${
                              item.checked
                                ? 'text-[#86868b] line-through'
                                : 'text-[#1d1d1f] dark:text-white'
                            }`}>
                              {item.product.name}
                            </p>
                            <p className="text-xs text-[#86868b]">
                              {lowestPrice.toFixed(2).replace('.', ',')} kr
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center text-[#86868b] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </motion.button>
                            <span className="w-6 text-center font-medium text-[#1d1d1f] dark:text-white">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center text-[#86868b] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>

                          {/* Delete */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item.product.id)}
                            className="p-2 rounded-full text-[#86868b] hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#e8e8ed] dark:border-[#38383a]">
                {checkedCount > 0 && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearChecked}
                    className="w-full mb-3 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white font-medium hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-colors"
                  >
                    Fjern {checkedCount} afkrydsede
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-lg shadow-green-500/25"
                >
                  Del liste
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

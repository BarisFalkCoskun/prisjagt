import { motion } from 'framer-motion';
import { TrendingDown, ShoppingCart, Target, Sparkles } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { useShoppingList } from '../context/ShoppingListContext';

interface SavingsDashboardProps {
  onOpenList: () => void;
}

export function SavingsDashboard({ onOpenList }: SavingsDashboardProps) {
  const { itemCount, totalSavings, bestStore, totalsByStore } = useShoppingList();

  // Demo savings data (in a real app, this would come from user history)
  const monthlySavings = 347;
  const savingsGoal = 500;
  const progress = Math.min((monthlySavings / savingsGoal) * 100, 100);

  // SVG circle properties
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (itemCount === 0 && monthlySavings === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Savings Ring */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-6 text-white relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

          <div className="flex items-center gap-5 relative z-10">
            {/* Progress Ring */}
            <div className="relative">
              <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="white"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                  style={{
                    strokeDasharray: circumference,
                  }}
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">
                  <AnimatedCounter value={progress} decimals={0} suffix="%" />
                </span>
                <span className="text-[10px] text-white/70">af mål</span>
              </div>
            </div>

            <div>
              <p className="text-white/70 text-sm mb-1">Sparet denne måned</p>
              <p className="text-3xl font-bold tracking-tight">
                <AnimatedCounter value={monthlySavings} suffix=" kr" />
              </p>
              <p className="text-white/60 text-xs mt-1">
                Mål: {savingsGoal} kr
              </p>
            </div>
          </div>
        </motion.div>

        {/* Shopping List Summary */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenList}
          className="bg-white dark:bg-[#1d1d1f] rounded-3xl p-6 border border-[#e8e8ed] dark:border-[#38383a] text-left relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-[#86868b]">Indkøbsliste</span>
              </div>

              <p className="text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">
                <AnimatedCounter value={itemCount} /> {itemCount === 1 ? 'vare' : 'varer'}
              </p>

              {bestStore && (
                <div className="mt-3 flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: bestStore.storeColor }}
                  />
                  <span className="text-sm text-[#86868b]">
                    Bedst hos <span className="font-medium text-[#1d1d1f] dark:text-white">{bestStore.storeName}</span>
                  </span>
                </div>
              )}
            </div>

            {totalSavings > 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full">
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Spar <AnimatedCounter value={totalSavings} decimals={0} suffix=" kr" />
                </span>
              </div>
            )}
          </div>

          {/* Store comparison preview */}
          {totalsByStore.length > 0 && (
            <div className="mt-4 flex gap-2">
              {totalsByStore.slice(0, 4).map((store, index) => (
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
                  <p className={`text-xs font-bold ${
                    index === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#1d1d1f] dark:text-white'
                  }`}>
                    {store.total.toFixed(0)},-
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.button>

        {/* Quick Stats */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-3xl p-6 border border-orange-100 dark:border-orange-900/30 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-[#86868b]">Dagens tip</span>
            </div>

            <p className="text-[#1d1d1f] dark:text-white font-medium leading-relaxed">
              3 varer på din liste er på tilbud i dag. Du kan spare 24 kr ved at handle hos Netto.
            </p>

            <div className="mt-4 flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-medium">Se tilbud</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

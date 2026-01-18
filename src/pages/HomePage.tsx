import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ShoppingCart, ArrowUpDown, TrendingDown, DollarSign, SortAsc } from 'lucide-react';
import { ProductCard, SavingsDashboard, ShoppingList, MobileNav, GlassSearch, useDynamicIsland, SegmentedControl, GradientText, MagneticButton, QuickLook, SpotlightSearch, useSpotlight, MorphingHeader, TodayWidget, ScrollProgress } from '../components';
import { products, categories, searchProducts } from '../data/products';
import type { Product } from '../types';
import { useShoppingList } from '../context';

type SortOption = 'default' | 'price-low' | 'price-high' | 'savings' | 'name';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const }
  }
};

// Search suggestions for GlassSearch
const searchSuggestions = [
  { id: '1', text: 'Mælk', type: 'trending' as const },
  { id: '2', text: 'Smør', type: 'trending' as const },
  { id: '3', text: 'Æg', type: 'suggestion' as const },
  { id: '4', text: 'Ost', type: 'suggestion' as const },
];

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [isListOpen, setIsListOpen] = useState(false);
  const [quickLookProduct, setQuickLookProduct] = useState<Product | null>(null);
  const { itemCount } = useShoppingList();
  const { DynamicIsland } = useDynamicIsland();
  const spotlight = useSpotlight();

  // Scroll-based hero parallax
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      result = searchProducts(searchQuery);
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => {
          const aMin = Math.min(...a.storePrices.map(sp => sp.currentPrice));
          const bMin = Math.min(...b.storePrices.map(sp => sp.currentPrice));
          return aMin - bMin;
        });
        break;
      case 'price-high':
        result = [...result].sort((a, b) => {
          const aMin = Math.min(...a.storePrices.map(sp => sp.currentPrice));
          const bMin = Math.min(...b.storePrices.map(sp => sp.currentPrice));
          return bMin - aMin;
        });
        break;
      case 'savings':
        result = [...result].sort((a, b) => {
          const aSavings = Math.max(...a.storePrices.map(sp => sp.currentPrice)) - Math.min(...a.storePrices.map(sp => sp.currentPrice));
          const bSavings = Math.max(...b.storePrices.map(sp => sp.currentPrice)) - Math.min(...b.storePrices.map(sp => sp.currentPrice));
          return bSavings - aSavings;
        });
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'da'));
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const topSavings = [...products]
    .map((p) => {
      const prices = p.storePrices.map((sp) => sp.currentPrice);
      const savings = Math.max(...prices) - Math.min(...prices);
      return { ...p, savings };
    })
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 4);

  const topSavingsIds = new Set(topSavings.map(p => p.id));

  const productsOnSale = products
    .filter((p) => !topSavingsIds.has(p.id))
    .filter((p) => p.storePrices.some((sp) => sp.isOnSale));

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-black">
      {/* Dynamic Island Notifications */}
      <DynamicIsland />

      <MorphingHeader onOpenSpotlight={spotlight.open} />
      <ScrollProgress />

      {/* Hero Section - Apple-style with Mesh Gradient */}
      {!searchQuery && !selectedCategory && (
        <section className="pt-14 relative overflow-hidden">
          <motion.div
            style={{ y: heroY }}
            className="relative min-h-[600px] md:min-h-[700px] bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600"
          >
            {/* Mesh gradient background */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute top-20 left-20 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]"
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, 50, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-teal-400/20 rounded-full blur-[80px]"
                animate={{
                  scale: [1.2, 1, 1.2],
                  x: [0, -40, 0],
                  y: [0, 40, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-300/15 rounded-full blur-[120px]"
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            <motion.div
              style={{ opacity: heroOpacity }}
              className="relative max-w-5xl mx-auto px-6 py-20 md:py-28"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-2 mb-6"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium text-white">Smart prissammenligning</span>
                </motion.div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-5xl md:text-7xl font-semibold text-white tracking-tight leading-[1.05] mb-6"
              >
                Find de bedste priser.
                <br />
                <GradientText
                  colors={['#ffffff', '#a7f3d0', '#34d399', '#a7f3d0', '#ffffff']}
                  duration={4}
                  className="text-5xl md:text-7xl font-semibold tracking-tight"
                >
                  Spar penge hver dag.
                </GradientText>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-emerald-50/90 max-w-2xl leading-relaxed mb-8"
              >
                Sammenlign priser fra Netto, Rema 1000, Bilka og Føtex.
                Se prishistorik og find de bedste tilbud.
              </motion.p>

              {/* Glass Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="max-w-xl mb-12"
              >
                <GlassSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={setSearchQuery}
                  placeholder="Søg efter produkter..."
                  suggestions={searchSuggestions}
                />
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 shadow-lg"
                >
                  <span className="text-3xl font-semibold text-white">{products.length}</span>
                  <span className="text-emerald-100">produkter</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 shadow-lg"
                >
                  <span className="text-3xl font-semibold text-white">4</span>
                  <span className="text-emerald-100">butikker</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 shadow-lg"
                >
                  <span className="text-3xl font-semibold text-yellow-300">{productsOnSale.length + topSavings.length}</span>
                  <span className="text-emerald-100">tilbud</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Category Pills */}
      <section className={`sticky top-12 z-40 bg-white/95 dark:bg-[#1d1d1f]/95 backdrop-blur-xl border-b border-[#d2d2d7]/50 dark:border-[#38383a]/50 ${searchQuery || selectedCategory ? 'pt-14' : ''}`}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                  : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]'
              }`}
            >
              Alle
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                    : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]'
                }`}
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Deals Widget - App Store Style */}
      {!searchQuery && !selectedCategory && (
        <div className="bg-white dark:bg-[#1d1d1f]">
          <div className="max-w-5xl mx-auto">
            <TodayWidget
              title="Dagens tilbud"
              subtitle="De bedste priser lige nu"
              products={topSavings}
              variant="deals"
              onProductClick={(product) => navigate(`/product/${product.id}`)}
            />
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 pb-24">
        {/* Savings Dashboard */}
        {!searchQuery && !selectedCategory && (
          <section className="pt-8">
            <SavingsDashboard onOpenList={() => setIsListOpen(true)} />
          </section>
        )}

        {/* Top Savings Section */}
        {!searchQuery && !selectedCategory && (
          <section className="py-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="flex items-center gap-4 mb-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
                  Største besparelser
                </h2>
                <p className="text-[#86868b]">
                  Her kan du spare mest ved at vælge den rigtige butik.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {topSavings.map((product) => (
                <motion.div key={product.id} variants={cardVariants}>
                  <ProductCard
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                    onQuickLook={() => setQuickLookProduct(product)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* On Sale Section */}
        {!searchQuery && !selectedCategory && productsOnSale.length > 0 && (
          <section className="py-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className="rounded-3xl bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 p-8 md:p-10 border border-rose-100 dark:border-rose-900/30"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
                  <span className="text-2xl">🏷️</span>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
                    Aktuelle tilbud
                  </h2>
                  <p className="text-[#86868b]">
                    Produkter på tilbud lige nu.
                  </p>
                </div>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {productsOnSale.slice(0, 4).map((product) => (
                  <motion.div key={product.id} variants={cardVariants}>
                    <ProductCard
                      product={product}
                      onClick={() => navigate(`/product/${product.id}`)}
                      onQuickLook={() => setQuickLookProduct(product)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>
        )}

        {/* All Products */}
        <section className="py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight mb-1">
                {searchQuery
                  ? `Resultater for "${searchQuery}"`
                  : selectedCategory
                  ? selectedCategory
                  : 'Alle produkter'}
              </h2>
              <p className="text-[#86868b]">
                {filteredProducts.length} produkter
              </p>
            </div>

            {/* Sort Control - Apple-style Segmented */}
            <SegmentedControl
              segments={[
                { id: 'default', label: 'Alle', icon: <ArrowUpDown className="w-3.5 h-3.5" /> },
                { id: 'price-low', label: 'Pris', icon: <DollarSign className="w-3.5 h-3.5" /> },
                { id: 'savings', label: 'Spar', icon: <TrendingDown className="w-3.5 h-3.5" /> },
                { id: 'name', label: 'A-Z', icon: <SortAsc className="w-3.5 h-3.5" /> },
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as SortOption)}
              size="sm"
            />
          </motion.div>

          {filteredProducts.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={cardVariants}>
                  <ProductCard
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                    onQuickLook={() => setQuickLookProduct(product)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-2xl font-semibold text-[#1d1d1f] dark:text-white mb-2">
                Ingen resultater
              </p>
              <p className="text-[#86868b]">
                Prøv en anden søgning eller fjern filteret.
              </p>
            </motion.div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1d1d1f]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <span className="text-white font-semibold">P</span>
              </div>
              <span className="text-lg font-semibold text-white">PrisJagt</span>
            </div>
            <p className="text-sm text-[#86868b]">
              Priserne opdateres dagligt. Alle priser er vejledende.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Shopping List Button - Desktop only */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="fixed bottom-6 right-6 z-40 hidden md:block"
      >
        <MagneticButton
          onClick={() => setIsListOpen(true)}
          strength={0.4}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center"
        >
          <ShoppingCart className="w-6 h-6" />
          {itemCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center shadow-lg"
            >
              {itemCount > 9 ? '9+' : itemCount}
            </motion.span>
          )}
        </MagneticButton>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        onOpenSearch={spotlight.open}
        onOpenList={() => setIsListOpen(true)}
        activeTab="home"
      />

      {/* Shopping List Panel */}
      <ShoppingList isOpen={isListOpen} onClose={() => setIsListOpen(false)} />

      {/* Quick Look Modal */}
      <QuickLook
        product={quickLookProduct}
        isOpen={!!quickLookProduct}
        onClose={() => setQuickLookProduct(null)}
      />

      {/* Spotlight Search Modal */}
      <SpotlightSearch
        isOpen={spotlight.isOpen}
        onClose={spotlight.close}
      />
    </div>
  );
}

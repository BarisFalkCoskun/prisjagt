import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Header, ProductCard } from '../components';
import { products, categories, searchProducts } from '../data/products';

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
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
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
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');

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
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero Section - Colorful but Clean */}
      {!searchQuery && !selectedCategory && (
        <section className="pt-14">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600">
            {/* Animated background shapes */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, 20, 0],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute bottom-10 right-20 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  x: [0, -30, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute top-40 right-40 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-2 mb-6"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium text-white">Smart prissammenligning</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-5xl md:text-7xl font-semibold text-white tracking-tight leading-[1.05] mb-6"
              >
                Find de bedste priser.
                <br />
                <span className="text-emerald-100">Spar penge hver dag.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-emerald-50/90 max-w-2xl leading-relaxed mb-10"
              >
                Sammenlign priser fra Netto, Rema 1000, Bilka og Føtex.
                Se prishistorik og find de bedste tilbud.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-6"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20"
                >
                  <span className="text-3xl font-semibold text-white">{products.length}</span>
                  <span className="text-emerald-100">produkter</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20"
                >
                  <span className="text-3xl font-semibold text-white">4</span>
                  <span className="text-emerald-100">butikker</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20"
                >
                  <span className="text-3xl font-semibold text-yellow-300">{productsOnSale.length + topSavings.length}</span>
                  <span className="text-emerald-100">tilbud</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Category Pills */}
      <section className={`sticky top-14 z-40 bg-white/95 dark:bg-[#1d1d1f]/95 backdrop-blur-xl border-b border-[#d2d2d7]/50 dark:border-[#38383a]/50 shadow-sm ${searchQuery || selectedCategory ? 'pt-14' : ''}`}>
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

      <main className="max-w-5xl mx-auto px-6 pb-24">
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

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-[#f5f5f7] dark:bg-[#2c2c2e] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 cursor-pointer transition-colors"
              >
                <option value="default">Sortering</option>
                <option value="price-low">Pris: Lav-Høj</option>
                <option value="price-high">Pris: Høj-Lav</option>
                <option value="savings">Besparelse</option>
                <option value="name">Navn</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none" />
            </div>
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
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Header, ProductCard } from '../components';
import { products, categories, searchProducts } from '../data/products';

type SortOption = 'default' | 'price-low' | 'price-high' | 'savings' | 'name';

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
    <div className="min-h-screen bg-[#fbfbfd]">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero Section - Colorful but Clean */}
      {!searchQuery && !selectedCategory && (
        <section className="pt-14">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600">
            {/* Animated background shapes */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-20 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl"></div>
              <div className="absolute top-40 right-40 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium text-white">Smart prissammenligning</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tight leading-[1.05] mb-6">
                Find de bedste priser.
                <br />
                <span className="text-emerald-100">Spar penge hver dag.</span>
              </h1>

              <p className="text-xl md:text-2xl text-emerald-50/90 max-w-2xl leading-relaxed mb-10">
                Sammenlign priser fra Netto, Rema 1000, Bilka og Fotex.
                Se prishistorik og find de bedste tilbud.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20">
                  <span className="text-3xl font-semibold text-white">{products.length}</span>
                  <span className="text-emerald-100">produkter</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20">
                  <span className="text-3xl font-semibold text-white">4</span>
                  <span className="text-emerald-100">butikker</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20">
                  <span className="text-3xl font-semibold text-yellow-300">{productsOnSale.length + topSavings.length}</span>
                  <span className="text-emerald-100">tilbud</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Pills */}
      <section className={`sticky top-14 z-40 bg-white/95 backdrop-blur-xl border-b border-[#d2d2d7]/50 shadow-sm ${searchQuery || selectedCategory ? 'pt-14' : ''}`}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                  : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
              }`}
            >
              Alle
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                    : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                }`}
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        {/* Top Savings Section */}
        {!searchQuery && !selectedCategory && (
          <section className="py-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                  Storste besparelser
                </h2>
                <p className="text-[#86868b]">
                  Her kan du spare mest ved at vaelge den rigtige butik.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {topSavings.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* On Sale Section */}
        {!searchQuery && !selectedCategory && productsOnSale.length > 0 && (
          <section className="py-16">
            <div className="rounded-3xl bg-gradient-to-br from-rose-50 to-orange-50 p-8 md:p-10 border border-rose-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
                  <span className="text-2xl">🏷️</span>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                    Aktuelle tilbud
                  </h2>
                  <p className="text-[#86868b]">
                    Produkter pa tilbud lige nu.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {productsOnSale.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Products */}
        <section className="py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight mb-1">
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
                className="appearance-none bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-green-500/30 cursor-pointer transition-colors"
              >
                <option value="default">Sortering</option>
                <option value="price-low">Pris: Lav-Hoj</option>
                <option value="price-high">Pris: Hoj-Lav</option>
                <option value="savings">Besparelse</option>
                <option value="name">Navn</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none" />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-2xl font-semibold text-[#1d1d1f] mb-2">
                Ingen resultater
              </p>
              <p className="text-[#86868b]">
                Prov en anden sogning eller fjern filteret.
              </p>
            </div>
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

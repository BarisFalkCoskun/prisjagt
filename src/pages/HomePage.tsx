import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
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

      {/* Hero Section - Apple Style */}
      {!searchQuery && !selectedCategory && (
        <section className="pt-20 pb-8">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-semibold text-[#1d1d1f] tracking-tight leading-[1.05] mb-6">
              Find de bedste priser.
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Spar penge hver dag.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#86868b] max-w-2xl mx-auto leading-relaxed mb-8">
              Sammenlign priser fra Netto, Rema 1000, Bilka og Fotex.
              Se prishistorik og find de bedste tilbud.
            </p>

            {/* Subtle Stats */}
            <div className="flex items-center justify-center gap-8 text-sm text-[#86868b]">
              <span><strong className="text-[#1d1d1f]">{products.length}</strong> produkter</span>
              <span className="w-1 h-1 rounded-full bg-[#d2d2d7]"></span>
              <span><strong className="text-[#1d1d1f]">4</strong> butikker</span>
              <span className="w-1 h-1 rounded-full bg-[#d2d2d7]"></span>
              <span><strong className="text-emerald-600">{productsOnSale.length + topSavings.length}</strong> tilbud</span>
            </div>
          </div>
        </section>
      )}

      {/* Category Pills */}
      <section className={`sticky top-14 z-40 bg-[#fbfbfd]/80 backdrop-blur-xl border-b border-[#d2d2d7]/30 ${searchQuery || selectedCategory ? 'pt-20' : ''}`}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-[#1d1d1f] text-white'
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
                    ? 'bg-[#1d1d1f] text-white'
                    : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                }`}
              >
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
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
                Storste besparelser
              </h2>
              <p className="text-lg text-[#86868b]">
                Her kan du spare mest ved at vaelge den rigtige butik.
              </p>
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
          <section className="py-16 border-t border-[#d2d2d7]/30">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
                Aktuelle tilbud
              </h2>
              <p className="text-lg text-[#86868b]">
                Produkter pa tilbud lige nu.
              </p>
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
          </section>
        )}

        {/* All Products */}
        <section className={`py-16 ${!searchQuery && !selectedCategory ? 'border-t border-[#d2d2d7]/30' : ''}`}>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
                {searchQuery
                  ? `Resultater for "${searchQuery}"`
                  : selectedCategory
                  ? selectedCategory
                  : 'Alle produkter'}
              </h2>
              <p className="text-lg text-[#86868b]">
                {filteredProducts.length} produkter
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-lg px-4 py-2 pr-9 text-sm font-medium text-[#1d1d1f] focus:outline-none cursor-pointer transition-colors"
              >
                <option value="default">Sortering</option>
                <option value="price-low">Pris: Lav-Hoj</option>
                <option value="price-high">Pris: Hoj-Lav</option>
                <option value="savings">Besparelse</option>
                <option value="name">Navn</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none" />
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

      {/* Footer - Apple Style */}
      <footer className="border-t border-[#d2d2d7]/30 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <p className="text-xs text-[#86868b] text-center">
            Priserne opdateres dagligt. Alle priser er vejledende.
          </p>
        </div>
      </footer>
    </div>
  );
}

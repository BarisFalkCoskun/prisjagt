import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingDown, Percent } from 'lucide-react';
import { Header, ProductCard } from '../components';
import { products, categories, searchProducts } from '../data/products';

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      result = searchProducts(searchQuery);
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    return result;
  }, [searchQuery, selectedCategory]);

  const productsOnSale = products.filter((p) =>
    p.storePrices.some((sp) => sp.isOnSale)
  );

  const topSavings = [...products]
    .map((p) => {
      const prices = p.storePrices.map((sp) => sp.currentPrice);
      const savings = Math.max(...prices) - Math.min(...prices);
      return { ...p, savings };
    })
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero Section */}
      {!searchQuery && !selectedCategory && (
        <section className="pt-16">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-10 md:p-16 shadow-2xl shadow-green-500/25">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm font-medium text-white">
                      Smart prissammenligning
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Find de bedste priser
                  <br />
                  <span className="text-green-200">pa dagligvarer</span>
                </h1>

                <p className="text-xl text-green-100 max-w-xl mb-10">
                  Sammenlign priser fra Netto, Rema 1000, Bilka og Fotex.
                  Se prishistorik og find de bedste tilbud.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 max-w-md">
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                    <p className="text-3xl font-bold text-white">{products.length}</p>
                    <p className="text-sm text-green-200">Produkter</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                    <p className="text-3xl font-bold text-white">4</p>
                    <p className="text-sm text-green-200">Butikker</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                    <p className="text-3xl font-bold text-yellow-300">{productsOnSale.length}</p>
                    <p className="text-sm text-green-200">Tilbud</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Pills */}
      <section className={`sticky top-12 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 ${searchQuery || selectedCategory ? 'pt-16' : ''}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === null
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/25'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alle produkter
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === category.name
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/25'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        {/* Top Savings Section */}
        {!searchQuery && !selectedCategory && (
          <section className="py-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Storste prisforskelle
                </h2>
                <p className="text-gray-500">
                  Her kan du spare mest ved at vaelge den rigtige butik
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topSavings.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* On Sale Section */}
        {!searchQuery && !selectedCategory && productsOnSale.length > 0 && (
          <section className="py-12 border-t border-gray-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/25">
                <Percent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Aktuelle tilbud
                </h2>
                <p className="text-gray-500">
                  Produkter pa tilbud lige nu
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsOnSale.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section className="py-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery
                  ? `Sogeresultater for "${searchQuery}"`
                  : selectedCategory
                  ? selectedCategory
                  : 'Alle produkter'}
              </h2>
              <p className="text-gray-500">
                {filteredProducts.length} produkter fundet
              </p>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <TrendingDown className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ingen produkter fundet
              </h3>
              <p className="text-gray-500">
                Prov at soge efter noget andet eller fjern filteret
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">PrisJagt</span>
            </div>
            <p className="text-sm text-gray-500">
              Priserne opdateres dagligt. Alle priser er vejledende.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

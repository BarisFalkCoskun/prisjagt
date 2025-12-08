import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingDown, Percent } from 'lucide-react';
import { Header, CategoryPills, ProductCard } from '../components';
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {!searchQuery && !selectedCategory && (
          <section className="mb-12 animate-fadeIn">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 p-8 md:p-12">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMTZjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTE2IDBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-green-200" />
                  <span className="text-sm font-medium text-green-100">
                    Smart prissammenligning
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                  Find de bedste priser
                  <br />
                  <span className="text-green-200">pa dagligvarer</span>
                </h1>
                <p className="text-lg text-green-100 max-w-xl">
                  Sammenlign priser fra Netto, Rema 1000, Bilka og Fotex.
                  Se prishistorik og find de bedste tilbud.
                </p>
              </div>

              {/* Stats */}
              <div className="relative z-10 grid grid-cols-3 gap-4 mt-8 max-w-lg">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-white">{products.length}</p>
                  <p className="text-sm text-green-200">Produkter</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-white">4</p>
                  <p className="text-sm text-green-200">Butikker</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-white">
                    {productsOnSale.length}
                  </p>
                  <p className="text-sm text-green-200">Tilbud</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="mb-8">
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </section>

        {/* Top Savings Section */}
        {!searchQuery && !selectedCategory && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-purple-100">
                <TrendingDown className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Storste prisforskelle
                </h2>
                <p className="text-sm text-gray-500">
                  Her kan du spare mest ved at vaelge den rigtige butik
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topSavings.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-slideUp"
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
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-red-100">
                <Percent className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Aktuelle tilbud
                </h2>
                <p className="text-sm text-gray-500">
                  Produkter pa tilbud lige nu
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsOnSale.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-slideUp"
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

        {/* All Products / Search Results */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {searchQuery
                  ? `Sogeresultater for "${searchQuery}"`
                  : selectedCategory
                  ? selectedCategory
                  : 'Alle produkter'}
              </h2>
              <p className="text-sm text-gray-500">
                {filteredProducts.length} produkter fundet
              </p>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-slideUp"
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
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <TrendingDown className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
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
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">PrisJagt</span>
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

import { useParams, useNavigate } from 'react-router-dom';
import { Image } from '@heroui/react';
import { ArrowLeft, Bell, TrendingDown, BarChart3, Tag, Sparkles } from 'lucide-react';
import { PriceChart } from '../components';
import { getProductById } from '../data/products';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || '');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <TrendingDown className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Produkt ikke fundet
          </h1>
          <p className="text-gray-500 mb-6">
            Det produkt du leder efter findes ikke.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all"
          >
            Tilbage til forsiden
          </button>
        </div>
      </div>
    );
  }

  const sortedStorePrices = [...product.storePrices].sort(
    (a, b) => a.currentPrice - b.currentPrice
  );
  const lowestPrice = sortedStorePrices[0];
  const savings = sortedStorePrices[sortedStorePrices.length - 1].currentPrice - sortedStorePrices[0].currentPrice;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Tilbage</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full hover:bg-amber-100 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">Prisalarm</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-14">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Product Image */}
              <div className="animate-scale-in">
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 shadow-inner">
                  <Image
                    alt={product.name}
                    src={product.image}
                    className="object-contain w-full h-full"
                    fallbackSrc="https://via.placeholder.com/500x500?text=No+Image"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="animate-fade-in-up">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{product.category}</p>
                <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  {product.description}
                </p>

                {/* Price Highlight */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 mb-6 border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-green-500 rounded-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-green-700">Bedste pris</p>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-green-600">
                      {lowestPrice.currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-2xl text-green-500">kr</span>
                  </div>
                  <p className="text-sm text-green-600">
                    hos <span className="font-semibold">{lowestPrice.store.name}</span>
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-4">
                  <button
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] transition-all"
                    style={{ backgroundColor: lowestPrice.store.color }}
                  >
                    Ga til {lowestPrice.store.name}
                  </button>
                  <button className="px-4 py-4 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors border border-amber-200">
                    <Bell className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Price Comparison */}
        <section className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Priser i alle butikker
                </h2>
                <p className="text-gray-500">
                  Sammenlign og find den bedste pris
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sortedStorePrices.map((sp, index) => (
                <div
                  key={sp.store.id}
                  className={`rounded-2xl p-6 transition-all hover:scale-[1.02] cursor-pointer ${
                    index === 0
                      ? 'bg-gradient-to-br from-emerald-50 to-green-50 ring-2 ring-green-200 shadow-lg shadow-green-500/10'
                      : 'bg-white shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: sp.store.color }}
                    >
                      {sp.store.name}
                    </div>
                    {index === 0 && (
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        Billigst
                      </span>
                    )}
                    {sp.isOnSale && index !== 0 && (
                      <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                        Tilbud
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${
                      index === 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {sp.currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-sm text-gray-500">kr</span>
                  </div>
                  {sp.previousPrice && (
                    <p className="text-sm text-gray-400 line-through mt-1">
                      {sp.previousPrice.toFixed(2).replace('.', ',')} kr
                    </p>
                  )}
                  <p className={`text-xs mt-3 font-medium ${sp.inStock ? 'text-green-600' : 'text-red-500'}`}>
                    {sp.inStock ? '✓ Pa lager' : '✗ Ikke pa lager'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Price History */}
        <section className="border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Prisudvikling over tid
                </h2>
                <p className="text-gray-500">
                  Se hvordan priserne har udviklet sig
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <PriceChart priceHistory={product.priceHistory} />
            </div>
          </div>
        </section>

        {/* Price Stats */}
        <section>
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Prisstatistik
                </h2>
                <p className="text-gray-500">
                  Indsigt i prisudviklingen de seneste 90 dage
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-green-100">
                <p className="text-sm font-medium text-green-700 mb-2">Laveste (90 dage)</p>
                <p className="text-3xl font-bold text-green-600">
                  {product.lowestPrice.toFixed(2).replace('.', ',')} kr
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                <p className="text-sm font-medium text-red-700 mb-2">Hojeste (90 dage)</p>
                <p className="text-3xl font-bold text-red-600">
                  {product.highestPrice.toFixed(2).replace('.', ',')} kr
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-2">Gennemsnit</p>
                <p className="text-3xl font-bold text-gray-900">
                  {product.averagePrice.toFixed(2).replace('.', ',')} kr
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <p className="text-sm font-medium text-blue-700 mb-2">Mulig besparelse</p>
                <p className="text-3xl font-bold text-blue-600">
                  {savings.toFixed(2).replace('.', ',')} kr
                </p>
              </div>
            </div>
          </div>
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

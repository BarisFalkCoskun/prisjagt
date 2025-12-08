import { useParams, useNavigate } from 'react-router-dom';
import { Image } from '@heroui/react';
import { ArrowLeft, Bell, TrendingDown, BarChart3, Zap } from 'lucide-react';
import { PriceChart } from '../components';
import { getProductById } from '../data/products';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || '');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-2xl font-semibold text-[#1d1d1f] mb-2">
            Produkt ikke fundet
          </p>
          <p className="text-[#86868b] mb-6">
            Det produkt du leder efter findes ikke.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-green-500/25"
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
    <div className="min-h-screen bg-[#fbfbfd]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#d2d2d7]/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between h-12">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Tilbage</span>
            </button>
            <button className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:opacity-90 transition-opacity text-sm font-medium shadow-lg shadow-amber-500/25">
              <Bell className="w-3.5 h-3.5" />
              <span>Prisalarm</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-12">
        {/* Hero Section */}
        <section className="bg-white border-b border-[#d2d2d7]/30">
          <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] rounded-3xl p-12 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"></div>

                <Image
                  alt={product.name}
                  src={product.image}
                  className="object-contain w-full h-full relative z-10"
                  fallbackSrc="https://via.placeholder.com/500x500?text=No+Image"
                />
              </div>

              {/* Product Info */}
              <div>
                <p className="text-sm font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <h1 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight leading-tight mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-[#86868b] mb-8 leading-relaxed">
                  {product.description}
                </p>

                {/* Price Highlight */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 mb-6 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-emerald-700">Bedste pris</p>
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-bold text-emerald-600 tracking-tight">
                      {lowestPrice.currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-2xl text-emerald-500">kr</span>
                  </div>
                  <p className="text-sm text-emerald-600">
                    hos <span className="font-semibold">{lowestPrice.store.name}</span>
                    {savings > 1 && (
                      <span className="ml-2 px-2 py-0.5 bg-emerald-100 rounded-full text-xs font-semibold">
                        Spar {savings.toFixed(0)} kr
                      </span>
                    )}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="flex gap-3">
                  <button
                    className="flex-1 px-6 py-4 text-white text-base font-semibold rounded-2xl transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
                    style={{
                      backgroundColor: lowestPrice.store.color,
                      boxShadow: `0 10px 40px -10px ${lowestPrice.store.color}50`
                    }}
                  >
                    Ga til {lowestPrice.store.name}
                  </button>
                  <button className="px-5 py-4 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-amber-500/25">
                    <Bell className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Price Comparison */}
        <section className="border-b border-[#d2d2d7]/30">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-2xl">🏪</span>
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                  Sammenlign priser
                </h2>
                <p className="text-[#86868b]">
                  Se priser i alle butikker.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {sortedStorePrices.map((sp, index) => (
                <div
                  key={sp.store.id}
                  className={`rounded-2xl p-5 transition-all hover:scale-[1.02] cursor-pointer ${
                    index === 0
                      ? 'bg-gradient-to-br from-emerald-50 to-green-50 ring-2 ring-emerald-200 shadow-lg shadow-emerald-500/10'
                      : 'bg-white border border-[#e8e8ed] hover:border-transparent hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: sp.store.color }}
                    />
                    {index === 0 && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Billigst
                      </span>
                    )}
                    {sp.isOnSale && index !== 0 && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Tilbud
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#1d1d1f] mb-2">
                    {sp.store.name}
                  </p>
                  <div className="flex items-baseline gap-0.5">
                    <span className={`text-3xl font-bold tracking-tight ${
                      index === 0 ? 'text-emerald-600' : 'text-[#1d1d1f]'
                    }`}>
                      {sp.currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-sm text-[#86868b]">kr</span>
                  </div>
                  {sp.previousPrice && (
                    <p className="text-xs text-[#86868b] line-through mt-1">
                      {sp.previousPrice.toFixed(2).replace('.', ',')} kr
                    </p>
                  )}
                  <p className={`text-[11px] mt-3 font-medium ${sp.inStock ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {sp.inStock ? '✓ Pa lager' : '✗ Ikke pa lager'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Price History */}
        <section className="border-b border-[#d2d2d7]/30 bg-gradient-to-b from-white to-[#fbfbfd]">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                  Prishistorik
                </h2>
                <p className="text-[#86868b]">
                  Se prisudvikling over tid.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#e8e8ed] shadow-sm">
              <PriceChart priceHistory={product.priceHistory} />
            </div>
          </div>
        </section>

        {/* Price Stats */}
        <section>
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                  Statistik
                </h2>
                <p className="text-[#86868b]">
                  Indsigt fra de seneste 90 dage.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-100">
                <p className="text-sm font-medium text-emerald-700 mb-1">Laveste pris</p>
                <p className="text-3xl font-bold text-emerald-600 tracking-tight">
                  {product.lowestPrice.toFixed(2).replace('.', ',')} kr
                </p>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-5 border border-rose-100">
                <p className="text-sm font-medium text-rose-700 mb-1">Hojeste pris</p>
                <p className="text-3xl font-bold text-rose-600 tracking-tight">
                  {product.highestPrice.toFixed(2).replace('.', ',')} kr
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-5 border border-slate-200">
                <p className="text-sm font-medium text-slate-600 mb-1">Gennemsnit</p>
                <p className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
                  {product.averagePrice.toFixed(2).replace('.', ',')} kr
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                <p className="text-sm font-medium text-blue-700 mb-1">Mulig besparelse</p>
                <p className="text-3xl font-bold text-blue-600 tracking-tight">
                  {savings.toFixed(2).replace('.', ',')} kr
                </p>
              </div>
            </div>
          </div>
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

import { useParams, useNavigate } from 'react-router-dom';
import { Image } from '@heroui/react';
import { ArrowLeft, Bell } from 'lucide-react';
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
          <p className="text-2xl font-semibold text-[#1d1d1f] mb-2">
            Produkt ikke fundet
          </p>
          <p className="text-[#86868b] mb-6">
            Det produkt du leder efter findes ikke.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-[#0071e3] text-white text-sm font-medium rounded-full hover:bg-[#0077ed] transition-colors"
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fbfbfd]/80 backdrop-blur-xl border-b border-[#d2d2d7]/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between h-12">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-[#0071e3] hover:opacity-70 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Tilbage</span>
            </button>
            <button className="flex items-center gap-1.5 text-[#0071e3] hover:opacity-70 transition-opacity">
              <Bell className="w-4 h-4" />
              <span className="text-sm">Prisalarm</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-12">
        {/* Hero Section */}
        <section className="bg-white border-b border-[#d2d2d7]/30">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Product Image */}
              <div className="aspect-square bg-[#f5f5f7] rounded-3xl p-12">
                <Image
                  alt={product.name}
                  src={product.image}
                  className="object-contain w-full h-full"
                  fallbackSrc="https://via.placeholder.com/500x500?text=No+Image"
                />
              </div>

              {/* Product Info */}
              <div>
                <p className="text-sm font-medium text-[#86868b] uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <h1 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight leading-tight mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-[#86868b] mb-8 leading-relaxed">
                  {product.description}
                </p>

                {/* Price Highlight */}
                <div className="mb-8">
                  <p className="text-sm text-[#86868b] mb-1">Bedste pris</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-semibold text-[#1d1d1f] tracking-tight">
                      {lowestPrice.currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-2xl text-[#86868b]">kr</span>
                  </div>
                  <p className="text-sm text-[#86868b]">
                    hos {lowestPrice.store.name}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="flex gap-3">
                  <button
                    className="flex-1 px-6 py-3.5 text-white text-base font-medium rounded-xl transition-all hover:opacity-90"
                    style={{ backgroundColor: lowestPrice.store.color }}
                  >
                    Ga til {lowestPrice.store.name}
                  </button>
                  <button className="px-4 py-3.5 bg-[#f5f5f7] text-[#1d1d1f] rounded-xl hover:bg-[#e8e8ed] transition-colors">
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
            <div className="mb-10">
              <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
                Sammenlign priser
              </h2>
              <p className="text-lg text-[#86868b]">
                Se priser i alle butikker.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {sortedStorePrices.map((sp, index) => (
                <div
                  key={sp.store.id}
                  className={`rounded-2xl p-5 transition-all ${
                    index === 0
                      ? 'bg-[#34c759]/5 ring-1 ring-[#34c759]/20'
                      : 'bg-[#f5f5f7]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: sp.store.color }}
                    />
                    {index === 0 && (
                      <span className="text-[10px] font-semibold text-[#34c759] uppercase tracking-wider">
                        Billigst
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[#1d1d1f] mb-2">
                    {sp.store.name}
                  </p>
                  <div className="flex items-baseline gap-0.5">
                    <span className={`text-2xl font-semibold tracking-tight ${
                      index === 0 ? 'text-[#34c759]' : 'text-[#1d1d1f]'
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
                  <p className={`text-[11px] mt-2 ${sp.inStock ? 'text-[#34c759]' : 'text-[#ff3b30]'}`}>
                    {sp.inStock ? 'Pa lager' : 'Ikke pa lager'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Price History */}
        <section className="border-b border-[#d2d2d7]/30">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="mb-10">
              <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
                Prishistorik
              </h2>
              <p className="text-lg text-[#86868b]">
                Se prisudvikling over tid.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#d2d2d7]/30">
              <PriceChart priceHistory={product.priceHistory} />
            </div>
          </div>
        </section>

        {/* Price Stats */}
        <section>
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="mb-10">
              <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
                Statistik
              </h2>
              <p className="text-lg text-[#86868b]">
                Indsigt fra de seneste 90 dage.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#f5f5f7] rounded-2xl p-5">
                <p className="text-sm text-[#86868b] mb-1">Laveste pris</p>
                <p className="text-2xl font-semibold text-[#34c759] tracking-tight">
                  {product.lowestPrice.toFixed(2).replace('.', ',')} kr
                </p>
              </div>
              <div className="bg-[#f5f5f7] rounded-2xl p-5">
                <p className="text-sm text-[#86868b] mb-1">Hojeste pris</p>
                <p className="text-2xl font-semibold text-[#ff3b30] tracking-tight">
                  {product.highestPrice.toFixed(2).replace('.', ',')} kr
                </p>
              </div>
              <div className="bg-[#f5f5f7] rounded-2xl p-5">
                <p className="text-sm text-[#86868b] mb-1">Gennemsnit</p>
                <p className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                  {product.averagePrice.toFixed(2).replace('.', ',')} kr
                </p>
              </div>
              <div className="bg-[#f5f5f7] rounded-2xl p-5">
                <p className="text-sm text-[#86868b] mb-1">Mulig besparelse</p>
                <p className="text-2xl font-semibold text-[#0071e3] tracking-tight">
                  {savings.toFixed(2).replace('.', ',')} kr
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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

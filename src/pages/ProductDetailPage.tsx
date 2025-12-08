import { useParams, useNavigate } from 'react-router-dom';
import { Button, Image, Chip } from '@heroui/react';
import { ArrowLeft, ExternalLink, Bell, Share2 } from 'lucide-react';
import { StorePriceCard, PriceChart, PriceStats } from '../components';
import { getProductById } from '../data/products';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || '');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Produkt ikke fundet
          </h1>
          <p className="text-gray-500 mb-4">
            Det produkt du leder efter findes ikke.
          </p>
          <Button
            color="primary"
            onPress={() => navigate('/')}
            startContent={<ArrowLeft className="w-4 h-4" />}
          >
            Tilbage til forsiden
          </Button>
        </div>
      </div>
    );
  }

  const lowestPrice = product.storePrices.reduce((min, sp) =>
    sp.currentPrice < min.currentPrice ? sp : min
  );

  const sortedStorePrices = [...product.storePrices].sort(
    (a, b) => a.currentPrice - b.currentPrice
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="glass border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="light"
              onPress={() => navigate('/')}
              startContent={<ArrowLeft className="w-4 h-4" />}
              className="text-gray-700"
            >
              Tilbage
            </Button>
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                variant="flat"
                className="bg-gray-100"
              >
                <Bell className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                isIconOnly
                variant="flat"
                className="bg-gray-100"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Header */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div className="animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="aspect-square relative">
                <Image
                  alt={product.name}
                  src={product.image}
                  className="object-contain w-full h-full"
                  fallbackSrc="https://via.placeholder.com/500x500?text=No+Image"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-slideUp">
            <div className="flex items-center gap-2 mb-3">
              <Chip size="sm" variant="flat" className="bg-gray-100 text-gray-600">
                {product.category}
              </Chip>
              {product.storePrices.some((sp) => sp.isOnSale) && (
                <Chip size="sm" className="bg-red-500 text-white">
                  TILBUD
                </Chip>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              {product.name}
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Best Price Highlight */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-100">
              <p className="text-sm font-medium text-green-700 mb-1">
                Bedste pris lige nu
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-green-600 price-tag">
                  {lowestPrice.currentPrice.toFixed(2)}
                </span>
                <span className="text-xl text-green-600">kr</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: lowestPrice.store.bgColor,
                    color: lowestPrice.store.color,
                  }}
                >
                  {lowestPrice.store.name.charAt(0)}
                </div>
                <span className="text-sm text-gray-600">
                  hos {lowestPrice.store.name}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-gray-900 text-white font-semibold h-14"
                endContent={<ExternalLink className="w-4 h-4" />}
              >
                Ga til {lowestPrice.store.name}
              </Button>
              <Button
                size="lg"
                variant="flat"
                className="bg-gray-100 h-14 px-6"
                startContent={<Bell className="w-4 h-4" />}
              >
                Prisalarm
              </Button>
            </div>
          </div>
        </section>

        {/* Price Stats */}
        <section className="mb-12 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Prisoversigt
          </h2>
          <PriceStats product={product} />
        </section>

        {/* Store Prices */}
        <section className="mb-12 animate-slideUp" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sammenlign butikspriser
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedStorePrices.map((storePrice, index) => (
              <StorePriceCard
                key={storePrice.store.id}
                storePrice={storePrice}
                isLowest={index === 0}
              />
            ))}
          </div>
        </section>

        {/* Price History Chart */}
        <section className="mb-12 animate-slideUp" style={{ animationDelay: '300ms' }}>
          <PriceChart priceHistory={product.priceHistory} />
        </section>

        {/* Price Insights */}
        <section className="mb-12 animate-slideUp" style={{ animationDelay: '400ms' }}>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Prisindsigt
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-blue-50">
                <p className="text-sm font-medium text-blue-700 mb-1">
                  Laveste pris (90 dage)
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {product.lowestPrice.toFixed(2)} kr
                </p>
              </div>
              <div className="p-4 rounded-xl bg-orange-50">
                <p className="text-sm font-medium text-orange-700 mb-1">
                  Hojeste pris (90 dage)
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {product.highestPrice.toFixed(2)} kr
                </p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50">
                <p className="text-sm font-medium text-purple-700 mb-1">
                  Gennemsnitspris (90 dage)
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {product.averagePrice.toFixed(2)} kr
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            Priserne opdateres dagligt. Alle priser er vejledende.
          </p>
        </div>
      </footer>
    </div>
  );
}

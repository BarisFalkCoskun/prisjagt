import { Card, CardBody, Chip, Image } from '@heroui/react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const lowestStorePrice = product.storePrices.reduce((min, sp) =>
    sp.currentPrice < min.currentPrice ? sp : min
  );

  const highestStorePrice = product.storePrices.reduce((max, sp) =>
    sp.currentPrice > max.currentPrice ? sp : max
  );

  const priceDiff = highestStorePrice.currentPrice - lowestStorePrice.currentPrice;
  const savingsPercent = Math.round((priceDiff / highestStorePrice.currentPrice) * 100);

  const hasSale = product.storePrices.some(sp => sp.isOnSale);

  // Determine price trend (mock for now)
  const trend = Math.random() > 0.5 ? 'down' : Math.random() > 0.5 ? 'up' : 'stable';

  return (
    <Card
      isPressable
      onPress={onClick}
      className="card-hover bg-white border-0 shadow-sm hover:shadow-xl overflow-hidden"
    >
      <CardBody className="p-0">
        {/* Image Section */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <Image
            alt={product.name}
            src={product.image}
            className="object-contain w-full h-full"
            fallbackSrc="https://via.placeholder.com/300x300?text=No+Image"
          />

          {/* Sale Badge */}
          {hasSale && (
            <div className="absolute top-3 left-3">
              <Chip
                size="sm"
                className="bg-red-500 text-white font-semibold px-2"
              >
                TILBUD
              </Chip>
            </div>
          )}

          {/* Trend Indicator */}
          <div className="absolute top-3 right-3">
            <div
              className={`
                flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                ${trend === 'down' ? 'bg-green-100 text-green-700' : ''}
                ${trend === 'up' ? 'bg-red-100 text-red-700' : ''}
                ${trend === 'stable' ? 'bg-gray-100 text-gray-600' : ''}
              `}
            >
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'stable' && <Minus className="w-3 h-3" />}
              {trend === 'down' && 'Faldende'}
              {trend === 'up' && 'Stigende'}
              {trend === 'stable' && 'Stabil'}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-3">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Fra</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900 price-tag">
                  {lowestStorePrice.currentPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">kr</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {lowestStorePrice.store.name}
              </p>
            </div>

            {/* Savings */}
            {savingsPercent > 0 && (
              <div className="text-right">
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50">
                  <span className="text-sm font-semibold text-green-600">
                    Spar {priceDiff.toFixed(2)} kr
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  vs. {highestStorePrice.store.name}
                </p>
              </div>
            )}
          </div>

          {/* Store Price Preview */}
          <div className="flex gap-1 mt-4">
            {product.storePrices.slice(0, 4).map((sp) => (
              <div
                key={sp.store.id}
                className="flex-1 py-1.5 px-2 rounded-lg text-center"
                style={{ backgroundColor: sp.store.bgColor }}
              >
                <p className="text-[10px] font-medium text-gray-600 truncate">
                  {sp.store.name}
                </p>
                <p
                  className="text-xs font-bold"
                  style={{ color: sp.store.color }}
                >
                  {sp.currentPrice.toFixed(0)} kr
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

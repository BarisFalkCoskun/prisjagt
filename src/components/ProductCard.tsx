import { Image } from '@heroui/react';
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
  const hasSale = product.storePrices.some(sp => sp.isOnSale);

  // Mock trend
  const trend = Math.random() > 0.5 ? 'down' : Math.random() > 0.5 ? 'up' : 'stable';

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <Image
          alt={product.name}
          src={product.image}
          className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
          fallbackSrc="https://via.placeholder.com/400x400?text=No+Image"
        />

        {/* Top badges row - Sale on left, Trend on right */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {/* Sale Badge */}
          {hasSale ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-lg">
              TILBUD
            </span>
          ) : (
            <span></span>
          )}

          {/* Trend Badge */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${
            trend === 'down' ? 'bg-green-100 text-green-700' :
            trend === 'up' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'stable' && <Minus className="w-3 h-3" />}
            {trend === 'down' && 'Faldende'}
            {trend === 'up' && 'Stigende'}
            {trend === 'stable' && 'Stabil'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {product.category}
        </p>

        {/* Product Name */}
        <h3 className="text-base font-semibold text-gray-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Fra</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {lowestStorePrice.currentPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-sm text-gray-500">kr</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {lowestStorePrice.store.name}
            </p>
          </div>

          {/* Savings */}
          {priceDiff > 0 && (
            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 border border-green-100">
                <span className="text-sm font-bold text-green-600">
                  Spar {priceDiff.toFixed(2).replace('.', ',')} kr
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Store Price Pills */}
        <div className="grid grid-cols-4 gap-1.5">
          {product.storePrices
            .sort((a, b) => a.currentPrice - b.currentPrice)
            .slice(0, 4)
            .map((sp, index) => (
              <div
                key={sp.store.id}
                className={`py-2 px-1 rounded-xl text-center transition-all ${
                  index === 0 ? 'ring-2 ring-green-400/50 bg-green-50' : 'bg-gray-50'
                }`}
              >
                <div
                  className="w-full h-1 rounded-full mb-1.5"
                  style={{ backgroundColor: sp.store.color }}
                />
                <p className="text-[9px] font-medium text-gray-500 mb-0.5 truncate">
                  {sp.store.name}
                </p>
                <p
                  className={`text-sm font-bold ${index === 0 ? 'text-green-600' : 'text-gray-800'}`}
                >
                  {sp.currentPrice.toFixed(0)},-
                </p>
              </div>
            ))}
        </div>
      </div>
    </article>
  );
}

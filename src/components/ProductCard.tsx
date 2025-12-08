import { Image } from '@heroui/react';
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

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[#f5f5f7] rounded-t-2xl p-6 overflow-hidden">
        <Image
          alt={product.name}
          src={product.image}
          className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
          fallbackSrc="https://via.placeholder.com/400x400?text=No+Image"
        />

        {/* Sale Badge - Minimal */}
        {hasSale && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#ff3b30] text-white">
              Tilbud
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider mb-1">
          {product.category}
        </p>

        {/* Product Name */}
        <h3 className="text-[15px] font-semibold text-[#1d1d1f] leading-snug mb-3 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Price Row */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[11px] text-[#86868b] mb-0.5">fra</p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                {lowestStorePrice.currentPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-sm text-[#86868b]">kr</span>
            </div>
          </div>

          {/* Savings Badge */}
          {priceDiff > 1 && (
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-[#34c759]/10 text-[#34c759]">
                Spar {priceDiff.toFixed(0)} kr
              </span>
            </div>
          )}
        </div>

        {/* Store Prices - Clean Grid */}
        <div className="grid grid-cols-4 gap-1">
          {product.storePrices
            .sort((a, b) => a.currentPrice - b.currentPrice)
            .map((sp, index) => (
              <div
                key={sp.store.id}
                className={`relative py-2 px-1 rounded-lg text-center ${
                  index === 0 ? 'bg-[#34c759]/8' : 'bg-[#f5f5f7]'
                }`}
              >
                {/* Store Color Indicator */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                  style={{ backgroundColor: sp.store.color }}
                />
                <p className="text-[9px] font-medium text-[#86868b] mt-1 mb-0.5 truncate">
                  {sp.store.name}
                </p>
                <p className={`text-xs font-semibold ${index === 0 ? 'text-[#34c759]' : 'text-[#1d1d1f]'}`}>
                  {sp.currentPrice.toFixed(0)},-
                </p>
              </div>
            ))}
        </div>
      </div>
    </article>
  );
}

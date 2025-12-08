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
      className="group cursor-pointer bg-white rounded-2xl border border-[#e8e8ed] transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 hover:border-transparent overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] p-6 overflow-hidden">
        <Image
          alt={product.name}
          src={product.image}
          className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
          fallbackSrc="https://via.placeholder.com/400x400?text=No+Image"
        />

        {/* Sale Badge */}
        {hasSale && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-red-500/30">
              TILBUD
            </span>
          </div>
        )}

        {/* Savings Badge - Top Right */}
        {priceDiff > 1 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-green-500/30">
              Spar {priceDiff.toFixed(0)} kr
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">
          {product.category}
        </p>

        {/* Product Name */}
        <h3 className="text-[15px] font-semibold text-[#1d1d1f] leading-snug mb-3 line-clamp-2 min-h-[40px] group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>

        {/* Price Row */}
        <div className="mb-4">
          <p className="text-[11px] text-[#86868b] mb-0.5">fra</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
              {lowestStorePrice.currentPrice.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-sm text-[#86868b]">kr</span>
            <span className="text-xs text-[#86868b] ml-1">
              ({lowestStorePrice.store.name})
            </span>
          </div>
        </div>

        {/* Store Prices - Colorful Pills */}
        <div className="grid grid-cols-4 gap-1.5">
          {product.storePrices
            .sort((a, b) => a.currentPrice - b.currentPrice)
            .map((sp, index) => (
              <div
                key={sp.store.id}
                className={`relative py-2.5 px-1 rounded-xl text-center transition-all ${
                  index === 0
                    ? 'bg-gradient-to-b from-emerald-50 to-green-50 ring-2 ring-emerald-500/20'
                    : 'bg-[#f5f5f7] hover:bg-[#e8e8ed]'
                }`}
              >
                {/* Store Color Bar */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full"
                  style={{ backgroundColor: sp.store.color }}
                />
                <p className="text-[9px] font-medium text-[#86868b] mt-1 mb-0.5 truncate px-0.5">
                  {sp.store.name}
                </p>
                <p className={`text-sm font-bold ${
                  index === 0 ? 'text-emerald-600' : 'text-[#1d1d1f]'
                }`}>
                  {sp.currentPrice.toFixed(0)},-
                </p>
              </div>
            ))}
        </div>
      </div>
    </article>
  );
}

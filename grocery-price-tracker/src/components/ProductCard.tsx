import { Image } from '@heroui/react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const sortedPrices = [...product.storePrices].sort((a, b) => a.currentPrice - b.currentPrice);
  const lowestStorePrice = sortedPrices[0];
  const highestStorePrice = sortedPrices[sortedPrices.length - 1];

  const priceDiff = highestStorePrice.currentPrice - lowestStorePrice.currentPrice;
  const hasSale = product.storePrices.some(sp => sp.isOnSale);

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-3xl border border-[#e8e8ed] transition-all duration-300 hover:shadow-2xl hover:shadow-black/8 hover:-translate-y-2 hover:border-transparent overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-[#fafafa] to-[#f0f0f2] p-8 overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <Image
          alt={product.name}
          src={product.image}
          className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110 relative z-10"
          fallbackSrc="https://via.placeholder.com/400x400?text=No+Image"
        />

        {/* Badges - Stacked in top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end z-20">
          {hasSale && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-red-500/25 uppercase tracking-wide">
              Tilbud
            </span>
          )}
          {priceDiff > 1 && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-green-500/25">
              Spar {priceDiff.toFixed(0)} kr
            </span>
          )}
        </div>

        {/* Best price store indicator - Bottom left */}
        <div
          className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white shadow-lg z-20"
          style={{
            backgroundColor: lowestStorePrice.store.color,
            boxShadow: `0 4px 14px -2px ${lowestStorePrice.store.color}50`
          }}
        >
          {lowestStorePrice.store.name}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <p className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">
          {product.category}
        </p>

        {/* Product Name */}
        <h3 className="text-base font-semibold text-[#1d1d1f] leading-snug mb-4 line-clamp-2 min-h-[44px] group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>

        {/* Price Display */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] font-medium text-emerald-600 mb-0.5">Bedste pris</p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
                {lowestStorePrice.currentPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-sm font-medium text-[#86868b]">kr</span>
            </div>
          </div>
          {priceDiff > 0 && (
            <div className="text-right">
              <p className="text-[10px] text-[#86868b] mb-0.5">Højeste</p>
              <p className="text-sm font-semibold text-[#86868b]">
                {highestStorePrice.currentPrice.toFixed(2).replace('.', ',')} kr
              </p>
            </div>
          )}
        </div>

        {/* Store Price Comparison - Cleaner Design */}
        <div className="flex gap-1">
          {sortedPrices.map((sp, index) => (
            <div
              key={sp.store.id}
              className={`flex-1 py-2 rounded-xl text-center transition-all relative overflow-hidden ${
                index === 0
                  ? 'bg-gradient-to-b from-emerald-50 to-green-50'
                  : 'bg-[#f5f5f7]'
              }`}
            >
              {/* Store Color Indicator */}
              <div
                className="w-2 h-2 rounded-full mx-auto mb-1"
                style={{ backgroundColor: sp.store.color }}
              />
              <p className={`text-xs font-bold ${
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

import { useState } from 'react';
import { Image } from '@heroui/react';
import { Heart } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const sortedPrices = [...product.storePrices].sort((a, b) => a.currentPrice - b.currentPrice);
  const lowestStorePrice = sortedPrices[0];
  const highestStorePrice = sortedPrices[sortedPrices.length - 1];

  const priceDiff = highestStorePrice.currentPrice - lowestStorePrice.currentPrice;
  const hasSale = product.storePrices.some(sp => sp.isOnSale);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

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

        {/* Favorite Button - Top Left */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 left-3 z-20 p-2 rounded-full transition-all duration-200 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-100'
              : 'bg-white/80 backdrop-blur-sm text-[#86868b] opacity-0 group-hover:opacity-100 hover:bg-white hover:text-rose-500 hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

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

        {/* Store Price Comparison - With Store Names */}
        <div className="flex gap-1.5">
          {sortedPrices.map((sp, index) => {
            // Get short store name
            const shortName = sp.store.name === 'Rema 1000' ? 'Rema' : sp.store.name;

            return (
              <div
                key={sp.store.id}
                className={`flex-1 py-2 px-1 rounded-xl text-center transition-all relative overflow-hidden ${
                  index === 0
                    ? 'bg-gradient-to-b from-emerald-50 to-green-50 ring-1 ring-emerald-200'
                    : 'bg-[#f5f5f7]'
                }`}
              >
                {/* Store Color Bar at Top */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: sp.store.color }}
                />
                {/* Store Name */}
                <p className="text-[8px] font-semibold text-[#86868b] mt-1 mb-0.5 truncate">
                  {shortName}
                </p>
                {/* Price */}
                <p className={`text-[11px] font-bold ${
                  index === 0 ? 'text-emerald-600' : 'text-[#1d1d1f]'
                }`}>
                  {sp.currentPrice.toFixed(0)},-
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

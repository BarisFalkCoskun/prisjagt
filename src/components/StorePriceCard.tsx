import { Card, CardBody, Chip } from '@heroui/react';
import { Check, X, TrendingDown } from 'lucide-react';
import type { StorePrice } from '../types';

interface StorePriceCardProps {
  storePrice: StorePrice;
  isLowest: boolean;
}

export function StorePriceCard({ storePrice, isLowest }: StorePriceCardProps) {
  const { store, currentPrice, previousPrice, isOnSale, pricePerUnit, inStock } = storePrice;

  return (
    <Card
      className={`
        border-2 transition-all duration-300
        ${isLowest
          ? 'border-green-500 bg-green-50/50 shadow-lg shadow-green-500/10'
          : 'border-transparent bg-white shadow-sm hover:shadow-md'
        }
      `}
    >
      <CardBody className="p-4">
        <div className="flex items-start justify-between">
          {/* Store Info */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: store.bgColor, color: store.color }}
            >
              {store.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{store.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                {inStock ? (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <Check className="w-3 h-3" />
                    Pa lager
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-500">
                    <X className="w-3 h-3" />
                    Ikke pa lager
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="flex items-center gap-2">
              {isOnSale && previousPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {previousPrice.toFixed(2)} kr
                </span>
              )}
              <span
                className={`text-2xl font-bold price-tag ${
                  isLowest ? 'text-green-600' : 'text-gray-900'
                }`}
              >
                {currentPrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">kr</span>
            </div>
            {pricePerUnit && (
              <p className="text-xs text-gray-400 mt-0.5">{pricePerUnit}</p>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mt-3">
          {isLowest && (
            <Chip
              size="sm"
              startContent={<TrendingDown className="w-3 h-3" />}
              className="bg-green-500 text-white"
            >
              Laveste pris
            </Chip>
          )}
          {isOnSale && (
            <Chip
              size="sm"
              className="bg-red-500 text-white"
            >
              Tilbud
            </Chip>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

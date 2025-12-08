import { TrendingDown, TrendingUp, Activity, DollarSign } from 'lucide-react';
import type { Product } from '../types';

interface PriceStatsProps {
  product: Product;
}

export function PriceStats({ product }: PriceStatsProps) {
  const lowestPrice = product.storePrices.reduce(
    (min, sp) => (sp.currentPrice < min ? sp.currentPrice : min),
    Infinity
  );
  const highestPrice = product.storePrices.reduce(
    (max, sp) => (sp.currentPrice > max ? sp.currentPrice : max),
    0
  );
  const avgPrice =
    product.storePrices.reduce((sum, sp) => sum + sp.currentPrice, 0) /
    product.storePrices.length;

  const stats = [
    {
      label: 'Laveste pris nu',
      value: `${lowestPrice.toFixed(2)} kr`,
      icon: TrendingDown,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Hojeste pris nu',
      value: `${highestPrice.toFixed(2)} kr`,
      icon: TrendingUp,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Gennemsnitspris',
      value: `${avgPrice.toFixed(2)} kr`,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Mulig besparelse',
      value: `${(highestPrice - lowestPrice).toFixed(2)} kr`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 price-tag">
            {stat.value}
          </p>
          <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

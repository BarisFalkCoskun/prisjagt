import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PricePoint } from '../types';
import { stores } from '../data/stores';

interface PriceChartProps {
  priceHistory: PricePoint[];
}

type TimeRange = '7d' | '30d' | '90d';

export function PriceChart({ priceHistory }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedStores, setSelectedStores] = useState<string[]>(
    stores.map((s) => s.id)
  );

  const filterByTimeRange = (days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return priceHistory.filter((p) => new Date(p.date) >= cutoff);
  };

  const getDays = (range: TimeRange) => {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
    }
  };

  const filteredData = filterByTimeRange(getDays(timeRange));

  const groupedData = filteredData.reduce((acc, point) => {
    const existing = acc.find((d) => d.date === point.date);
    if (existing) {
      existing[point.store] = point.price;
    } else {
      acc.push({
        date: point.date,
        [point.store]: point.price,
      });
    }
    return acc;
  }, [] as Record<string, number | string>[]);

  groupedData.sort(
    (a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime()
  );

  const toggleStore = (storeId: string) => {
    setSelectedStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('da-DK', { day: 'numeric', month: 'short' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl p-4 shadow-lg border border-[#d2d2d7]/30">
          <p className="text-xs font-medium text-[#86868b] mb-3">
            {formatDate(label)}
          </p>
          <div className="space-y-2">
            {payload
              .sort((a: any, b: any) => a.value - b.value)
              .map((entry: any) => {
                const store = stores.find((s) => s.id === entry.dataKey);
                return (
                  <div
                    key={entry.dataKey}
                    className="flex items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: store?.color }}
                      />
                      <span className="text-sm text-[#1d1d1f]">
                        {store?.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#1d1d1f]">
                      {entry.value.toFixed(2).replace('.', ',')} kr
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      );
    }
    return null;
  };

  const storeColors: Record<string, string> = {
    netto: '#FFD700',
    rema1000: '#BA0C2F',
    bilka: '#00A0E3',
    foetex: '#002855',
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Time Range */}
        <div className="flex gap-1 p-1 bg-[#f5f5f7] rounded-lg">
          {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              {range === '7d' && '7 dage'}
              {range === '30d' && '30 dage'}
              {range === '90d' && '90 dage'}
            </button>
          ))}
        </div>

        {/* Store Filters */}
        <div className="flex gap-2">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => toggleStore(store.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedStores.includes(store.id)
                  ? 'bg-[#1d1d1f] text-white'
                  : 'bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: selectedStores.includes(store.id)
                    ? 'white'
                    : store.color,
                }}
              />
              {store.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={groupedData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e8e8ed"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: '#86868b', fontSize: 12 }}
              axisLine={{ stroke: '#e8e8ed' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#86868b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}`}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip content={<CustomTooltip />} />
            {stores.map((store) =>
              selectedStores.includes(store.id) ? (
                <Line
                  key={store.id}
                  type="monotone"
                  dataKey={store.id}
                  stroke={storeColors[store.id] || store.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: storeColors[store.id] || store.color,
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

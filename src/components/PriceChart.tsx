import { useState } from 'react';
import { Button, ButtonGroup } from '@heroui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

  // Filter data by time range
  const filterByTimeRange = (days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return priceHistory.filter((p) => new Date(p.date) >= cutoff);
  };

  const getDays = (range: TimeRange) => {
    switch (range) {
      case '7d':
        return 7;
      case '30d':
        return 30;
      case '90d':
        return 90;
    }
  };

  const filteredData = filterByTimeRange(getDays(timeRange));

  // Group data by date for the chart
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

  // Sort by date
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
        <div className="glass rounded-xl p-4 shadow-xl border border-gray-200/50">
          <p className="text-sm font-medium text-gray-600 mb-2">
            {formatDate(label)}
          </p>
          <div className="space-y-1.5">
            {payload
              .sort((a: any, b: any) => a.value - b.value)
              .map((entry: any) => {
                const store = stores.find((s) => s.id === entry.dataKey);
                return (
                  <div
                    key={entry.dataKey}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: store?.color }}
                      />
                      <span className="text-sm text-gray-700">
                        {store?.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {entry.value.toFixed(2)} kr
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Prishistorik</h3>
          <p className="text-sm text-gray-500">
            Sammenlign priser over tid pa tvaers af butikker
          </p>
        </div>

        {/* Time Range Selector */}
        <ButtonGroup>
          {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              size="sm"
              variant={timeRange === range ? 'solid' : 'flat'}
              className={
                timeRange === range
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700'
              }
              onPress={() => setTimeRange(range)}
            >
              {range === '7d' && '7 dage'}
              {range === '30d' && '30 dage'}
              {range === '90d' && '90 dage'}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Store Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {stores.map((store) => (
          <button
            key={store.id}
            onClick={() => toggleStore(store.id)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200
              ${selectedStores.includes(store.id)
                ? 'shadow-md'
                : 'opacity-40 hover:opacity-60'
              }
            `}
            style={{
              backgroundColor: selectedStores.includes(store.id)
                ? store.bgColor
                : '#f3f4f6',
              color: selectedStores.includes(store.id) ? store.color : '#9ca3af',
            }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: selectedStores.includes(store.id)
                  ? store.color
                  : '#9ca3af',
              }}
            />
            {store.name}
          </button>
        ))}
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
              stroke="#E5E5E7"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: '#86868B', fontSize: 12 }}
              axisLine={{ stroke: '#E5E5E7' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#86868B', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value} kr`}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                const store = stores.find((s) => s.id === value);
                return (
                  <span className="text-sm text-gray-600">{store?.name}</span>
                );
              }}
            />
            {stores.map((store) =>
              selectedStores.includes(store.id) ? (
                <Line
                  key={store.id}
                  type="monotone"
                  dataKey={store.id}
                  stroke={store.color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: store.color,
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


import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useEthPriceHistory } from '@/hooks/useEthPriceHistory';

const chartConfig = {
  price: {
    label: "ETH Price",
    color: "#8B5CF6",
  },
};

export function EthPriceChart() {
  const { data, isLoading, error } = useEthPriceHistory(7);

  console.log('Chart data:', data);
  console.log('Chart loading:', isLoading);
  console.log('Chart error:', error);

  if (isLoading) {
    return (
      <div className="min-h-[200px] w-full flex items-center justify-center">
        <div className="text-everstake-gray-light">Loading price data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-[200px] w-full flex items-center justify-center">
        <div className="text-everstake-gray-light">No data available</div>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart data={data}>
        <XAxis 
          dataKey="time" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <YAxis 
          domain={['dataMin - 50', 'dataMax + 50']}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
        />
        <ChartTooltip 
          content={<ChartTooltipContent />} 
          formatter={(value) => [`$${value}`, 'ETH Price']}
          labelFormatter={(label) => `Time: ${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="var(--color-price)" 
          strokeWidth={2}
          dot={{ fill: "var(--color-price)", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "var(--color-price)", strokeWidth: 2 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

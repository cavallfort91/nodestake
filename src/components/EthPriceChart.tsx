
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const ethPriceData = [
  { time: '7 days ago', price: 2280 },
  { time: '6 days ago', price: 2310 },
  { time: '5 days ago', price: 2295 },
  { time: '4 days ago', price: 2350 },
  { time: '3 days ago', price: 2320 },
  { time: '2 days ago', price: 2380 },
  { time: 'Yesterday', price: 2345 },
  { time: 'Today', price: 2345.67 },
];

const chartConfig = {
  price: {
    label: "ETH Price",
    color: "#8B5CF6",
  },
};

export function EthPriceChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart data={ethPriceData}>
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

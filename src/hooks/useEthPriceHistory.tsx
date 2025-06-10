
import { useState, useEffect } from 'react';

interface PriceHistoryData {
  time: string;
  price: number;
}

interface EthPriceHistoryData {
  data: PriceHistoryData[];
  isLoading: boolean;
  error: string | null;
}

export function useEthPriceHistory(days: number = 7): EthPriceHistoryData {
  const [data, setData] = useState<PriceHistoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPriceHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${days}&interval=daily`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch ETH price history');
      }
      
      const result = await response.json();
      
      // Transform the data to our format
      const transformedData = result.prices.map((price: [number, number], index: number) => {
        const date = new Date(price[0]);
        const daysAgo = days - index;
        
        let timeLabel;
        if (daysAgo === 0) {
          timeLabel = 'Today';
        } else if (daysAgo === 1) {
          timeLabel = 'Yesterday';
        } else {
          timeLabel = `${daysAgo} days ago`;
        }
        
        return {
          time: timeLabel,
          price: Math.round(price[1] * 100) / 100 // Round to 2 decimal places
        };
      });
      
      setData(transformedData);
      console.log('ETH price history updated:', transformedData);
    } catch (err) {
      console.error('Error fetching ETH price history:', err);
      setError('Failed to load price history');
      // Fallback to mock data
      setData([
        { time: '7 days ago', price: 2280 },
        { time: '6 days ago', price: 2310 },
        { time: '5 days ago', price: 2295 },
        { time: '4 days ago', price: 2350 },
        { time: '3 days ago', price: 2320 },
        { time: '2 days ago', price: 2380 },
        { time: 'Yesterday', price: 2345 },
        { time: 'Today', price: 2345.67 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceHistory();
    
    // Update price history every 5 minutes
    const interval = setInterval(fetchPriceHistory, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [days]);

  return { data, isLoading, error };
}

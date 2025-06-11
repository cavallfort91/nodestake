
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

  const generateFallbackData = () => {
    const fallbackData = [];
    const basePrice = 2345.67;
    
    for (let i = days - 1; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 100; // Random variation of ±50
      const price = Math.round((basePrice + variation) * 100) / 100;
      
      let timeLabel;
      if (i === 0) {
        timeLabel = 'Today';
      } else if (i === 1) {
        timeLabel = 'Yesterday';
      } else {
        timeLabel = `${i} days ago`;
      }
      
      fallbackData.push({
        time: timeLabel,
        price: price
      });
    }
    
    return fallbackData;
  };

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
      // Use generated fallback data
      const fallbackData = generateFallbackData();
      setData(fallbackData);
      console.log('Using fallback data:', fallbackData);
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

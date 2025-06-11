
import { useState, useEffect, useRef } from 'react';

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
  const lastFetchTime = useRef<number>(0);
  const retryCount = useRef<number>(0);
  const maxRetries = 3;

  // Mock data as fallback
  const mockData = [
    { time: '7 days ago', price: 2280 },
    { time: '6 days ago', price: 2310 },
    { time: '5 days ago', price: 2295 },
    { time: '4 days ago', price: 2350 },
    { time: '3 days ago', price: 2320 },
    { time: '2 days ago', price: 2380 },
    { time: 'Yesterday', price: 2345 },
    { time: 'Today', price: 2827.96 },
  ];

  const fetchPriceHistory = async (shouldSetLoading = true) => {
    const now = Date.now();
    // Don't fetch if we fetched less than 2 minutes ago
    if (now - lastFetchTime.current < 2 * 60 * 1000 && data.length > 0) {
      console.log('Skipping fetch - using recent data');
      return;
    }

    try {
      if (shouldSetLoading) {
        setIsLoading(true);
      }
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${days}&interval=daily`,
        { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.prices || !Array.isArray(result.prices)) {
        throw new Error('Invalid API response format');
      }
      
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
      lastFetchTime.current = now;
      retryCount.current = 0;
      console.log('ETH price history updated successfully:', transformedData.length, 'data points');
    } catch (err) {
      console.error('Error fetching ETH price history:', err);
      
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timeout - using cached data');
      } else if (retryCount.current < maxRetries) {
        retryCount.current++;
        setError(`Retry ${retryCount.current}/${maxRetries} - using cached data`);
        // Retry after a delay
        setTimeout(() => fetchPriceHistory(false), 5000 * retryCount.current);
      } else {
        setError('API unavailable - using cached data');
      }
      
      // Use mock data if we don't have any real data
      if (data.length === 0) {
        setData(mockData);
        console.log('Using fallback mock data');
      }
    } finally {
      if (shouldSetLoading) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPriceHistory();
    
    // Update price history every 10 minutes instead of 5
    const interval = setInterval(() => fetchPriceHistory(false), 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [days]);

  // Set initial mock data if no data and not loading
  useEffect(() => {
    if (data.length === 0 && !isLoading) {
      setData(mockData);
    }
  }, []);

  return { data, isLoading, error };
}


import { useState, useEffect } from 'react';

interface EthPriceData {
  price: string;
  isLoading: boolean;
  error: string | null;
}

export function useEthPrice(): EthPriceData {
  const [price, setPrice] = useState('$0.00');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEthPrice = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      
      if (!response.ok) {
        throw new Error('Failed to fetch ETH price');
      }
      
      const data = await response.json();
      const ethPrice = data.ethereum.usd;
      
      setPrice(`$${ethPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      
      console.log('ETH price updated:', ethPrice);
    } catch (err) {
      console.error('Error fetching ETH price:', err);
      setError('Failed to load price');
      setPrice('$--');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEthPrice();
    
    // Actualizar el precio cada 30 segundos
    const interval = setInterval(fetchEthPrice, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { price, isLoading, error };
}


import { Bell, Search, ChevronDown, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

export function Header() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Not connected');

  useEffect(() => {
    // Check if wallet is already connected
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          setIsConnected(true);
          setStatus('Connected');
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setStatus("⚠️ MetaMask is not installed.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      setWalletAddress(address);
      setIsConnected(true);
      setStatus("✅ Connected");
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to connect wallet.");
      setIsConnected(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-everstake-bg-secondary border-b border-everstake-gray-dark/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <h1 className="text-white text-xl font-semibold">Dashboard</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-everstake-gray-light" size={16} />
            <Input
              placeholder="Search validators, transactions..."
              className="pl-10 w-80 bg-everstake-bg-card border-everstake-gray-dark/30 text-white placeholder:text-everstake-gray-light"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Network Selector */}
          <div className="flex items-center space-x-2 bg-everstake-bg-card px-3 py-2 rounded-lg border border-everstake-gray-dark/30">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">Ξ</span>
            </div>
            <span className="text-white text-sm">Ethereum</span>
            <ChevronDown size={16} className="text-everstake-gray-light" />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="text-everstake-gray-light hover:text-white">
            <Bell size={20} />
          </Button>

          {/* Wallet Connection */}
          <Button 
            onClick={connectWallet}
            className="bg-everstake-purple-primary hover:bg-everstake-purple-secondary text-white flex items-center space-x-2"
          >
            <Wallet size={16} />
            <span>
              {isConnected ? formatAddress(walletAddress) : 'Connect Wallet'}
            </span>
          </Button>

          {/* Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-everstake-purple-primary to-everstake-purple-secondary rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Status indicator (optional, can be removed) */}
      {status !== 'Connected' && status !== 'Not connected' && (
        <div className="mt-2 text-sm text-everstake-gray-light">
          {status}
        </div>
      )}
    </header>
  );
}

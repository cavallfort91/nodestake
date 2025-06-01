
import { Bell, Search, ChevronDown, Wallet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { WalletSelector } from './WalletSelector';

export function Header() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Not connected');
  const [connectedWallet, setConnectedWallet] = useState<string>('');

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
          // Try to identify the wallet
          if (window.ethereum.isCoinbaseWallet) {
            setConnectedWallet('Coinbase Wallet');
          } else if (window.ethereum.isTrust) {
            setConnectedWallet('Trust Wallet');
          } else {
            setConnectedWallet('MetaMask');
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const handleWalletConnect = (address: string, walletName: string) => {
    setWalletAddress(address);
    setIsConnected(true);
    setStatus("✅ Connected");
    setConnectedWallet(walletName);
  };

  const handleWalletError = (error: string) => {
    setStatus(`❌ ${error}`);
    setIsConnected(false);
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setStatus('Disconnected');
    setConnectedWallet('');
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
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-everstake-purple-primary hover:bg-everstake-purple-secondary text-white flex items-center space-x-2">
                  <Wallet size={16} />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-everstake-gray-light">{connectedWallet}</span>
                    <span>{formatAddress(walletAddress)}</span>
                  </div>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-everstake-bg-card border-everstake-gray-dark/30">
                <DropdownMenuItem 
                  onClick={disconnectWallet}
                  className="text-white hover:bg-everstake-bg-secondary cursor-pointer flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <WalletSelector onConnect={handleWalletConnect} onError={handleWalletError} />
          )}

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

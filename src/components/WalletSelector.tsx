
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wallet, ChevronRight } from 'lucide-react';
import { wallets, getAvailableWallets } from '@/utils/walletConnectors';

interface WalletSelectorProps {
  onConnect: (address: string, walletName: string) => void;
  onError: (error: string) => void;
}

export function WalletSelector({ onConnect, onError }: WalletSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const availableWallets = getAvailableWallets();

  const handleWalletConnect = async (wallet: any) => {
    setIsConnecting(wallet.name);
    try {
      const { address } = await wallet.connector();
      onConnect(address, wallet.name);
      setIsOpen(false);
    } catch (error: any) {
      onError(error.message || `Failed to connect to ${wallet.name}`);
    } finally {
      setIsConnecting(null);
    }
  };

  if (availableWallets.length === 1) {
    // Si solo hay una cartera disponible, conectar directamente
    return (
      <Button 
        onClick={() => handleWalletConnect(availableWallets[0])}
        disabled={isConnecting !== null}
        className="bg-everstake-purple-primary hover:bg-everstake-purple-secondary text-white flex items-center space-x-2"
      >
        <Wallet size={16} />
        <span>
          {isConnecting ? 'Connecting...' : `Connect ${availableWallets[0].name}`}
        </span>
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-everstake-purple-primary hover:bg-everstake-purple-secondary text-white flex items-center space-x-2">
          <Wallet size={16} />
          <span>Connect Wallet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-everstake-bg-card border-everstake-gray-dark/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Choose a Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {availableWallets.length > 0 ? (
            availableWallets.map((wallet) => (
              <Button
                key={wallet.name}
                variant="outline"
                onClick={() => handleWalletConnect(wallet)}
                disabled={isConnecting !== null}
                className="w-full h-16 border-everstake-gray-dark/30 hover:bg-everstake-bg-secondary text-white justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{wallet.icon}</span>
                  <span className="font-medium">{wallet.name}</span>
                </div>
                {isConnecting === wallet.name ? (
                  <span className="text-sm text-everstake-gray-light">Connecting...</span>
                ) : (
                  <ChevronRight size={16} className="text-everstake-gray-light" />
                )}
              </Button>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-everstake-gray-light mb-4">No wallets detected</p>
              <p className="text-sm text-everstake-gray-light">
                Please install MetaMask, Coinbase Wallet, or Trust Wallet to continue
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wallet, ChevronRight } from 'lucide-react';
import { wallets, getAvailableWallets } from '@/utils/walletConnectors';
import { AddressSelector } from './AddressSelector';

interface WalletSelectorProps {
  onConnect: (address: string, walletName: string) => void;
  onError: (error: string) => void;
}

export function WalletSelector({ onConnect, onError }: WalletSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
  const [currentWalletName, setCurrentWalletName] = useState('');

  const availableWallets = getAvailableWallets();

  const handleWalletConnect = async (wallet: any) => {
    setIsConnecting(wallet.name);
    try {
      console.log(`Attempting to connect to ${wallet.name}...`);
      const { address, accounts } = await wallet.connector();
      console.log(`Successfully connected to ${wallet.name}:`, address);
      console.log('Available accounts:', accounts);
      
      // Si hay múltiples cuentas, mostrar el selector
      if (accounts && accounts.length > 1) {
        setAvailableAccounts(accounts);
        setCurrentWalletName(wallet.name);
        setShowAddressSelector(true);
        setIsOpen(false);
      } else {
        // Si solo hay una cuenta, conectar directamente
        onConnect(address, wallet.name);
        setIsOpen(false);
      }
    } catch (error: any) {
      console.log(`Connection to ${wallet.name} failed:`, error);
      
      // Manejar diferentes tipos de errores de cancelación
      const errorMessage = error.message || `Failed to connect to ${wallet.name}`;
      
      if (error.code === 4001 || 
          error.code === 'ACTION_REJECTED' || 
          errorMessage.includes('User rejected') ||
          errorMessage.includes('rejected') ||
          errorMessage.includes('cancelled') ||
          errorMessage.includes('canceled')) {
        console.log('User cancelled the connection');
        // No mostrar error para cancelaciones del usuario, solo resetear estado
      } else {
        onError(errorMessage);
      }
    } finally {
      // Siempre resetear el estado de connecting
      setIsConnecting(null);
    }
  };

  const handleAddressSelect = (address: string) => {
    onConnect(address, currentWalletName);
    setShowAddressSelector(false);
    setAvailableAccounts([]);
    setCurrentWalletName('');
  };

  const handleAddressSelectorClose = () => {
    setShowAddressSelector(false);
    setAvailableAccounts([]);
    setCurrentWalletName('');
    setIsOpen(true); // Volver a mostrar el selector de wallets
  };

  if (availableWallets.length === 1) {
    // Si solo hay una cartera disponible, conectar directamente
    return (
      <>
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
        
        <AddressSelector
          isOpen={showAddressSelector}
          onClose={handleAddressSelectorClose}
          accounts={availableAccounts}
          walletName={currentWalletName}
          onSelectAddress={handleAddressSelect}
        />
      </>
    );
  }

  return (
    <>
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

      <AddressSelector
        isOpen={showAddressSelector}
        onClose={handleAddressSelectorClose}
        accounts={availableAccounts}
        walletName={currentWalletName}
        onSelectAddress={handleAddressSelect}
      />
    </>
  );
}


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Wallet } from 'lucide-react';

interface AddressSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: string[];
  walletName: string;
  onSelectAddress: (address: string) => void;
}

export function AddressSelector({ 
  isOpen, 
  onClose, 
  accounts, 
  walletName, 
  onSelectAddress 
}: AddressSelectorProps) {
  const [selectedAddress, setSelectedAddress] = useState(accounts[0] || '');

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getAccountLabel = (address: string, index: number) => {
    // Intentar identificar si es una dirección de Ledger
    // En MetaMask, las direcciones de Ledger suelen estar al final de la lista
    if (walletName === 'Ledger' || (index >= 2 && accounts.length > 2)) {
      return `Ledger ${index - 1}`;
    }
    return `Account ${index + 1}`;
  };

  const handleConfirm = () => {
    if (selectedAddress) {
      onSelectAddress(selectedAddress);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-everstake-bg-card border-everstake-gray-dark/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Wallet size={20} />
            <span>Select Address from {walletName}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <p className="text-everstake-gray-light text-sm">
            Choose which address you want to connect:
          </p>
          
          <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
            {accounts.map((address, index) => (
              <div key={address} className="flex items-center space-x-3 p-3 border border-everstake-gray-dark/30 rounded-lg hover:bg-everstake-bg-secondary">
                <RadioGroupItem value={address} id={address} />
                <Label htmlFor={address} className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">
                      {getAccountLabel(address, index)}
                    </span>
                    <span className="text-everstake-gray-light text-sm">
                      {formatAddress(address)}
                    </span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="flex space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-everstake-gray-dark/30 text-white hover:bg-everstake-bg-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedAddress}
              className="flex-1 bg-everstake-purple-primary hover:bg-everstake-purple-secondary text-white"
            >
              Connect
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

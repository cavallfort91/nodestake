
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ArrowRight } from 'lucide-react';
import { ethers } from 'ethers';
import { toast } from '@/components/ui/sonner';

export function StakeWidget() {
  const [amount, setAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);

  const STAKING_CONTRACT_ADDRESS = '0x3D640e9C3534518828535d1fc8DDa15c41979705';

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount to stake');
      return;
    }

    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask is not installed');
      return;
    }

    setIsStaking(true);

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Convert amount to wei
      const amountInWei = ethers.parseEther(amount);

      // Create transaction
      const transaction = {
        to: STAKING_CONTRACT_ADDRESS,
        value: amountInWei,
        gasLimit: 21000, // Standard gas limit for ETH transfer
      };

      console.log('Sending transaction:', transaction);
      
      // Send transaction
      const txResponse = await signer.sendTransaction(transaction);
      
      toast.success(`Transaction sent! Hash: ${txResponse.hash}`);
      console.log('Transaction hash:', txResponse.hash);
      
      // Wait for confirmation
      const receipt = await txResponse.wait();
      
      if (receipt?.status === 1) {
        toast.success('Staking successful! Transaction confirmed.');
        setAmount(''); // Clear the amount after successful staking
      } else {
        toast.error('Transaction failed');
      }
      
    } catch (error: any) {
      console.error('Staking error:', error);
      
      if (error.code === 'ACTION_REJECTED') {
        toast.error('Transaction was rejected by user');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        toast.error('Insufficient funds for transaction');
      } else {
        toast.error(`Staking failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <Card className="bg-everstake-bg-card border-everstake-gray-dark/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Wallet size={20} />
          <span>Stake ETH</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="text-everstake-gray-light text-sm mb-2 block">Amount to Stake</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-everstake-bg-primary border-everstake-gray-dark/30 text-white pr-12 text-lg"
              disabled={isStaking}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-everstake-gray-light">ETH</span>
          </div>
          <div className="flex justify-between text-xs text-everstake-gray-light mt-2">
            <span>Min: 0.01 ETH</span>
            <span>Balance: 5.24 ETH</span>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {['25%', '50%', '75%', 'MAX'].map((percentage) => (
            <Button
              key={percentage}
              variant="outline"
              size="sm"
              className="border-everstake-gray-dark/30 text-everstake-gray-light hover:bg-everstake-bg-primary"
              disabled={isStaking}
              onClick={() => {
                const maxAmount = 5.24;
                if (percentage === 'MAX') {
                  setAmount(maxAmount.toString());
                } else {
                  const percent = parseInt(percentage) / 100;
                  setAmount((maxAmount * percent).toFixed(2));
                }
              }}
            >
              {percentage}
            </Button>
          ))}
        </div>

        {/* Staking Details */}
        <div className="space-y-3 p-4 bg-everstake-bg-primary/50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-everstake-gray-light">Estimated APY</span>
            <span className="text-everstake-green font-medium">4.2%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-everstake-gray-light">Validator Fee</span>
            <span className="text-white">5%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-everstake-gray-light">Annual Rewards</span>
            <span className="text-white font-medium">
              {amount ? `~${(parseFloat(amount) * 0.042).toFixed(4)} ETH` : '0 ETH'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-everstake-gray-light">Unstaking Period</span>
            <span className="text-white">~7 days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-everstake-gray-light">Contract Address</span>
            <span className="text-white text-xs font-mono">
              {STAKING_CONTRACT_ADDRESS.slice(0, 6)}...{STAKING_CONTRACT_ADDRESS.slice(-4)}
            </span>
          </div>
        </div>

        {/* Stake Button */}
        <Button
          className="w-full bg-everstake-purple-primary hover:bg-everstake-purple-secondary text-white flex items-center justify-center space-x-2"
          disabled={!amount || parseFloat(amount) <= 0 || isStaking}
          onClick={handleStake}
        >
          {isStaking ? (
            <span>Processing...</span>
          ) : (
            <>
              <span>Stake ETH</span>
              <ArrowRight size={16} />
            </>
          )}
        </Button>

        {/* Connection Status */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-everstake-green text-sm">
            <div className="w-2 h-2 bg-everstake-green rounded-full"></div>
            <span>Wallet Connected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

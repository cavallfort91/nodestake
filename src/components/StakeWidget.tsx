import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ArrowRight } from 'lucide-react';
import { ethers } from 'ethers';
import { toast } from '@/components/ui/sonner';
import { WalletSelector } from './WalletSelector';

export function StakeWidget() {
  const [amount, setAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [walletBalance, setWalletBalance] = useState('0.00');
  const [userAddress, setUserAddress] = useState<string>('');
  const [walletName, setWalletName] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  const STAKING_CONTRACT_ADDRESS = '0x3D640e9C3534518828535d1fc8DDa15c41979705';
  const MIN_STAKE_AMOUNT = 0.1;

  // Función para obtener el balance de la wallet
  const fetchWalletBalance = async () => {
    try {
      if (typeof window.ethereum === 'undefined' || !userAddress) {
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(userAddress);
      const balanceInEth = ethers.formatEther(balance);
      setWalletBalance(parseFloat(balanceInEth).toFixed(4));
      
      console.log('Wallet balance updated:', balanceInEth, 'ETH');
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  // Efecto para obtener el balance cuando se conecta la wallet
  useEffect(() => {
    if (isConnected && userAddress) {
      fetchWalletBalance();
    }
  }, [isConnected, userAddress]);

  // Función para manejar la conexión de la wallet
  const handleWalletConnect = (address: string, wallet: string) => {
    setUserAddress(address);
    setWalletName(wallet);
    setIsConnected(true);
    console.log(`Connected to ${wallet} with address: ${address}`);
  };

  // Función para manejar errores de conexión
  const handleWalletError = (error: string) => {
    toast.error(error);
  };

  const handleStake = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount to stake');
      return;
    }

    const amountFloat = parseFloat(amount);
    const balanceFloat = parseFloat(walletBalance);

    if (amountFloat < MIN_STAKE_AMOUNT) {
      toast.error(`Minimum stake amount is ${MIN_STAKE_AMOUNT} ETH`);
      return;
    }

    if (balanceFloat < MIN_STAKE_AMOUNT) {
      toast.error(`Wallet balance must be at least ${MIN_STAKE_AMOUNT} ETH to stake`);
      return;
    }

    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask is not installed');
      return;
    }

    // Verificar que hay suficiente balance
    if (amountFloat > balanceFloat) {
      toast.error('Insufficient balance for this transaction');
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
        // Actualizar el balance después de la transacción exitosa
        setTimeout(() => {
          fetchWalletBalance();
        }, 2000);
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

  const balanceFloat = parseFloat(walletBalance);
  const isBalanceSufficient = balanceFloat >= MIN_STAKE_AMOUNT;

  return (
    <Card className="bg-everstake-bg-card border-everstake-gray-dark/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Wallet size={20} />
          <span>Stake ETH</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Input - Always visible */}
        <div>
          <label className="text-everstake-gray-light text-sm mb-2 block">Amount to Stake</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-everstake-bg-primary border-everstake-gray-dark/30 text-white pr-12 text-lg"
              disabled={!isConnected || isStaking || (isConnected && !isBalanceSufficient)}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-everstake-gray-light">ETH</span>
          </div>
          <div className="flex justify-between text-xs text-everstake-gray-light mt-2">
            <span>Min: {MIN_STAKE_AMOUNT} ETH</span>
            <span>Balance: {isConnected ? `${walletBalance} ETH` : 'Connect wallet'}</span>
          </div>
          {isConnected && !isBalanceSufficient && (
            <p className="text-red-400 text-xs mt-1">
              Insufficient balance. Minimum {MIN_STAKE_AMOUNT} ETH required.
            </p>
          )}
          {!isConnected && (
            <p className="text-everstake-gray-light text-xs mt-1">
              Connect your wallet to see your balance and start staking.
            </p>
          )}
        </div>

        {/* Quick Amount Buttons - Always visible */}
        <div className="grid grid-cols-4 gap-2">
          {['25%', '50%', '75%', 'MAX'].map((percentage) => (
            <Button
              key={percentage}
              variant="outline"
              size="sm"
              className="border-everstake-gray-dark/30 text-everstake-gray-light hover:bg-everstake-bg-primary"
              disabled={!isConnected || isStaking || (isConnected && !isBalanceSufficient)}
              onClick={() => {
                if (!isConnected) return;
                const maxAmount = parseFloat(walletBalance);
                if (percentage === 'MAX') {
                  setAmount(maxAmount.toString());
                } else {
                  const percent = parseInt(percentage) / 100;
                  setAmount((maxAmount * percent).toFixed(4));
                }
              }}
            >
              {percentage}
            </Button>
          ))}
        </div>

        {/* Staking Details - Always visible */}
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
        </div>

        {/* Connect Wallet or Stake Button */}
        {!isConnected ? (
          <div className="space-y-4">
            <WalletSelector onConnect={handleWalletConnect} onError={handleWalletError} />
            <p className="text-center text-everstake-gray-light text-sm">
              Connect your wallet to start staking and earn rewards
            </p>
          </div>
        ) : (
          <>
            {/* Stake Button */}
            <Button
              className="w-full bg-everstake-purple-primary hover:bg-everstake-purple-secondary text-white flex items-center justify-center space-x-2"
              disabled={!amount || parseFloat(amount) <= 0 || isStaking || !isBalanceSufficient || parseFloat(amount) < MIN_STAKE_AMOUNT}
              onClick={handleStake}
            >
              {isStaking ? (
                <span>Processing...</span>
              ) : !isBalanceSufficient ? (
                <span>Insufficient Balance</span>
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
                <span>{walletName} Connected</span>
              </div>
              <p className="text-everstake-gray-light text-xs mt-1">{userAddress}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

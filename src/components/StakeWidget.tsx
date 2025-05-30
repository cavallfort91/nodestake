
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ArrowRight } from 'lucide-react';

export function StakeWidget() {
  const [amount, setAmount] = useState('');

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
        </div>

        {/* Stake Button */}
        <Button
          className="w-full bg-everstake-purple-primary hover:bg-everstake-purple-secondary text-white flex items-center justify-center space-x-2"
          disabled={!amount || parseFloat(amount) <= 0}
        >
          <span>Stake ETH</span>
          <ArrowRight size={16} />
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

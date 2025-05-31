
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Clock, Shield, Coins } from 'lucide-react';

export function StakingInfo() {
  return (
    <div className="space-y-6">
      {/* Network Stats */}
      <Card className="bg-everstake-bg-card border-everstake-gray-dark/20">
        <CardHeader>
          <CardTitle className="text-white text-lg">Network Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-everstake-gray-light">ETH Price</span>
            <span className="text-white font-medium">$2,345.67</span>
          </div>
          <div className="flex justify-between">
            <span className="text-everstake-gray-light">Total Staked</span>
            <span className="text-white font-medium">28.5M ETH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-everstake-gray-light">Active Validators</span>
            <span className="text-white font-medium">891,234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-everstake-gray-light">Average APY</span>
            <span className="text-everstake-green font-medium">4.2%</span>
          </div>
        </CardContent>
      </Card>

      {/* Staking Guide */}
      <Card className="bg-everstake-bg-card border-everstake-gray-dark/20">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center space-x-2">
            <Info size={20} />
            <span>Staking Guide</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-everstake-purple-primary/10 rounded-lg">
              <Coins size={16} className="text-everstake-purple-primary" />
            </div>
            <div>
              <h4 className="text-white font-medium">Choose Amount</h4>
              <p className="text-everstake-gray-light text-sm">Minimum 0.01 ETH required</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-everstake-purple-primary/10 rounded-lg">
              <Shield size={16} className="text-everstake-purple-primary" />
            </div>
            <div>
              <h4 className="text-white font-medium">Select Validator</h4>
              <p className="text-everstake-gray-light text-sm">Choose from our trusted validators</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-everstake-purple-primary/10 rounded-lg">
              <Clock size={16} className="text-everstake-purple-primary" />
            </div>
            <div>
              <h4 className="text-white font-medium">Earn Rewards</h4>
              <p className="text-everstake-gray-light text-sm">Start earning after activation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

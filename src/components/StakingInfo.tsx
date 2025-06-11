
import { Info, ExternalLink, Shield, Clock, Zap } from 'lucide-react';
import { EthPriceChart } from './EthPriceChart';

export function StakingInfo() {
  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
          <Info size={20} className="mr-2" />
          Performance Overview
        </h3>
        <EthPriceChart />
      </div>

      {/* Staking Information */}
      <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Staking Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-everstake-gray-light">Minimum Stake</span>
            <span className="text-white font-medium">32 ETH</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-everstake-gray-light">Lock Period</span>
            <span className="text-white font-medium">Until ETH 2.0 merge</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-everstake-gray-light">Reward Frequency</span>
            <span className="text-white font-medium">Every epoch (~6.4 min)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-everstake-gray-light">Slashing Risk</span>
            <span className="text-everstake-green font-medium">Low</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="text-everstake-purple-primary" size={16} />
              <span className="text-everstake-gray-light text-sm">Network Security</span>
            </div>
            <span className="text-white font-medium">99.9%</span>
          </div>
        </div>

        <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="text-everstake-blue" size={16} />
              <span className="text-everstake-gray-light text-sm">Avg Block Time</span>
            </div>
            <span className="text-white font-medium">12.1s</span>
          </div>
        </div>

        <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="text-everstake-green" size={16} />
              <span className="text-everstake-gray-light text-sm">Active Validators</span>
            </div>
            <span className="text-white font-medium">500K+</span>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Need Help?</h3>
        <div className="space-y-3">
          <a 
            href="mailto:support@nodestake.pro" 
            className="flex items-center text-everstake-purple-primary hover:text-everstake-purple-secondary transition-colors"
          >
            <ExternalLink size={16} className="mr-2" />
            Contact Support
          </a>
          <a 
            href="#" 
            className="flex items-center text-everstake-purple-primary hover:text-everstake-purple-secondary transition-colors"
          >
            <ExternalLink size={16} className="mr-2" />
            Documentation
          </a>
          <a 
            href="#" 
            className="flex items-center text-everstake-purple-primary hover:text-everstake-purple-secondary transition-colors"
          >
            <ExternalLink size={16} className="mr-2" />
            FAQ
          </a>
        </div>
      </div>
    </div>
  );
}


import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StakingPoolProps {
  name: string;
  validator: string;
  apy: string;
  staked: string;
  status: 'active' | 'pending' | 'inactive';
}

export function StakingPool({ name, validator, apy, staked, status }: StakingPoolProps) {
  const statusColor = {
    active: 'bg-everstake-green/20 text-everstake-green',
    pending: 'bg-yellow-500/20 text-yellow-400',
    inactive: 'bg-red-500/20 text-red-400'
  }[status];

  return (
    <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-6 hover-scale">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">{name}</h3>
          <p className="text-everstake-gray-light text-sm">{validator}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-everstake-gray-light text-xs mb-1">APY</p>
          <p className="text-everstake-green font-bold flex items-center">
            <TrendingUp size={16} className="mr-1" />
            {apy}
          </p>
        </div>
        <div>
          <p className="text-everstake-gray-light text-xs mb-1">Staked</p>
          <p className="text-white font-bold">{staked}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button size="sm" className="flex-1 bg-everstake-purple-primary hover:bg-everstake-purple-secondary text-white">
          Manage
        </Button>
        <Button size="sm" variant="outline" className="flex-1 border-everstake-gray-dark/30 text-white hover:bg-everstake-bg-primary">
          Details
        </Button>
      </div>
    </div>
  );
}

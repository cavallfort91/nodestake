
import { Check } from 'lucide-react';

interface ValidatorCardProps {
  name: string;
  fee: string;
  apy: string;
  staked: string;
  uptime: string;
  isSelected: boolean;
}

export function ValidatorCard({ name, fee, apy, staked, uptime, isSelected }: ValidatorCardProps) {
  return (
    <div
      className={`bg-everstake-bg-card border rounded-lg p-4 cursor-pointer transition-all hover:border-everstake-purple-primary/50 ${
        isSelected 
          ? 'border-everstake-purple-primary bg-everstake-purple-primary/5' 
          : 'border-everstake-gray-dark/20'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-white font-medium">{name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-everstake-green text-sm font-medium">{apy} APY</span>
            <span className="text-everstake-gray-light text-sm">• {fee} fee</span>
          </div>
        </div>
        {isSelected && (
          <div className="p-1 bg-everstake-purple-primary rounded-full">
            <Check size={12} className="text-white" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-everstake-gray-light">Staked</p>
          <p className="text-white font-medium">{staked}</p>
        </div>
        <div>
          <p className="text-everstake-gray-light">Uptime</p>
          <p className="text-everstake-green font-medium">{uptime}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-everstake-gray-dark/20">
        <div className="flex items-center justify-between text-xs text-everstake-gray-light">
          <span>Commission: {fee}</span>
        </div>
      </div>
    </div>
  );
}


import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  gradient?: boolean;
}

export function StatCard({ title, value, change, changeType, icon: Icon, gradient }: StatCardProps) {
  const changeColor = {
    positive: 'text-everstake-green',
    negative: 'text-red-400',
    neutral: 'text-everstake-gray-light'
  }[changeType];

  return (
    <div className={`${gradient ? 'gradient-card' : 'bg-everstake-bg-card border border-everstake-gray-dark/20'} rounded-lg p-6 hover-scale animate-fade-in`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-everstake-purple-primary/10 rounded-lg">
          <Icon className="text-everstake-purple-primary" size={24} />
        </div>
        <span className={`text-sm ${changeColor}`}>{change}</span>
      </div>
      
      <div>
        <p className="text-everstake-gray-light text-sm mb-1">{title}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

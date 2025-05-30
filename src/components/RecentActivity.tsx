
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

interface ActivityItem {
  type: 'stake' | 'unstake' | 'reward';
  amount: string;
  validator: string;
  time: string;
  hash: string;
}

const activities: ActivityItem[] = [
  {
    type: 'stake',
    amount: '32.0 ETH',
    validator: 'Everstake Validator #1',
    time: '2 hours ago',
    hash: '0x1234...5678'
  },
  {
    type: 'reward',
    amount: '0.045 ETH',
    validator: 'Everstake Validator #2',
    time: '5 hours ago',
    hash: '0x9876...1234'
  },
  {
    type: 'unstake',
    amount: '16.0 ETH',
    validator: 'Everstake Validator #3',
    time: '1 day ago',
    hash: '0x5678...9012'
  }
];

export function RecentActivity() {
  return (
    <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-6">
      <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.type === 'stake' ? ArrowUpRight : 
                     activity.type === 'unstake' ? ArrowDownLeft : Clock;
          
          const color = activity.type === 'stake' ? 'text-everstake-green' :
                       activity.type === 'unstake' ? 'text-red-400' : 'text-everstake-purple-primary';

          return (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-everstake-bg-primary/50 transition-colors">
              <div className={`p-2 rounded-full bg-opacity-20 ${color.replace('text-', 'bg-')}`}>
                <Icon size={16} className={color} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium capitalize">{activity.type}</p>
                    <p className="text-everstake-gray-light text-sm">{activity.validator}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${color}`}>{activity.amount}</p>
                    <p className="text-everstake-gray-light text-xs">{activity.time}</p>
                  </div>
                </div>
                <p className="text-everstake-gray-light text-xs mt-1">{activity.hash}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

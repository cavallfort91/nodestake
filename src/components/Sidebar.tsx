
import { useState } from 'react';
import { Home, Layers, TrendingUp, Settings, Wallet, BarChart3, Users, HelpCircle, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: Layers, label: 'Staking', active: false },
  { icon: TrendingUp, label: 'Portfolio', active: false },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: Users, label: 'Validators', active: false },
  { icon: Wallet, label: 'Wallet', active: false },
  { icon: Settings, label: 'Settings', active: false },
  { icon: HelpCircle, label: 'Support', active: false },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-everstake-bg-secondary border-r border-everstake-gray-dark/20 transition-all duration-300 flex flex-col h-screen`}>
      {/* Logo and Toggle */}
      <div className="p-4 border-b border-everstake-gray-dark/20 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-everstake-purple-primary to-everstake-purple-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-white font-semibold text-lg">Everstake</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-everstake-gray-light hover:text-white"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              item.active
                ? 'bg-everstake-purple-primary/20 text-everstake-purple-primary border border-everstake-purple-primary/30'
                : 'text-everstake-gray-light hover:text-white hover:bg-everstake-bg-card'
            }`}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-everstake-gray-dark/20">
          <div className="bg-gradient-to-r from-everstake-purple-primary/10 to-everstake-purple-secondary/10 border border-everstake-purple-primary/20 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Upgrade to Pro</h4>
            <p className="text-everstake-gray-light text-xs mb-3">
              Get advanced features and priority support
            </p>
            <Button className="w-full bg-everstake-purple-primary hover:bg-everstake-purple-secondary text-white text-xs">
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

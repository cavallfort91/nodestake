
import { Home, Layers, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Ethereum', icon: Layers, path: '/ethereum' },
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Help', icon: HelpCircle, path: '/help' },
  ];

  return (
    <div className="w-64 bg-everstake-bg-secondary border-r border-everstake-gray-dark/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-everstake-gray-dark/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-everstake-purple-primary to-everstake-purple-secondary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="text-white text-xl font-bold">NodeStake</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-everstake-purple-primary text-white'
                    : 'text-everstake-gray-light hover:bg-everstake-bg-card hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

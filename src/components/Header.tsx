
import { Bell, Search, User, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-everstake-bg-secondary border-b border-everstake-gray-dark/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-everstake-gray-light" size={18} />
            <Input
              placeholder="Search validators, transactions..."
              className="pl-10 bg-everstake-bg-primary border-everstake-gray-dark/30 text-white"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Help Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/help')}
            className="text-everstake-gray-light hover:text-white hover:bg-everstake-bg-primary/50 flex items-center space-x-2"
          >
            <HelpCircle size={18} />
            <span>Help</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="text-everstake-gray-light hover:text-white hover:bg-everstake-bg-primary/50">
            <Bell size={18} />
          </Button>

          {/* User Profile */}
          <Button variant="ghost" size="sm" className="text-everstake-gray-light hover:text-white hover:bg-everstake-bg-primary/50">
            <User size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}

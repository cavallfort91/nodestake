
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { StakingPool } from '@/components/StakingPool';
import { RecentActivity } from '@/components/RecentActivity';
import { EthPriceChart } from '@/components/EthPriceChart';
import { useEthPrice } from '@/hooks/useEthPrice';
import { useToast } from '@/hooks/use-toast';
import { Wallet, TrendingUp, DollarSign, Zap } from 'lucide-react';

const Index = () => {
  const { price: ethPrice, isLoading } = useEthPrice();
  const { toast } = useToast();

  const handleQuickAction = (action: string) => {
    toast({
      title: "No active staking found",
      description: `Cannot ${action.toLowerCase()} - no active staking positions found.`,
    });
  };

  return (
    <div className="min-h-screen bg-everstake-bg-primary flex w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-white text-2xl font-bold mb-2">Welcome back!</h2>
            <p className="text-everstake-gray-light">Here's your staking portfolio overview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Staked"
              value="0 ETH"
              change="0%"
              changeType="neutral"
              icon={Wallet}
              gradient={true}
            />
            <StatCard
              title="Total Rewards"
              value="0 ETH"
              change="0%"
              changeType="neutral"
              icon={TrendingUp}
            />
            <StatCard
              title="USD Value"
              value="$0"
              change="0%"
              changeType="neutral"
              icon={DollarSign}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Staking Pools */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-white text-lg font-semibold mb-4">Active Staking Pools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StakingPool
                    name="Ethereum 2.0"
                    validator="NodeStake Validator #1"
                    apy="4.2%"
                    staked="32.0 ETH"
                    status="active"
                  />
                  <StakingPool
                    name="Ethereum 2.0"
                    validator="NodeStake Validator #2"
                    apy="4.1%"
                    staked="32.0 ETH"
                    status="active"
                  />
                  <StakingPool
                    name="Ethereum 2.0"
                    validator="NodeStake Validator #3"
                    apy="4.3%"
                    staked="32.0 ETH"
                    status="pending"
                  />
                  <StakingPool
                    name="Ethereum 2.0"
                    validator="NodeStake Validator #4"
                    apy="4.0%"
                    staked="32.5 ETH"
                    status="active"
                  />
                </div>
              </div>

              <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Performance Overview - ETH Price (7 Days)</h3>
                  <div className="flex space-x-2">
                    <button className="text-everstake-purple-primary text-sm font-medium">7D</button>
                  </div>
                </div>
                <EthPriceChart />
              </div>
            </div>

            {/* Right Column - Activity & Quick Actions */}
            <div className="space-y-6">
              <RecentActivity />
              
              {/* Quick Actions */}
              <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleQuickAction('Stake More ETH')}
                    className="w-full bg-everstake-bg-card border border-everstake-gray-dark/30 text-white hover:bg-everstake-purple-primary hover:border-everstake-purple-primary py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Zap size={16} />
                    <span>Stake More ETH</span>
                  </button>
                  <button 
                    onClick={() => handleQuickAction('Claim Rewards')}
                    className="w-full bg-everstake-bg-card border border-everstake-gray-dark/30 text-white hover:bg-everstake-purple-primary hover:border-everstake-purple-primary py-3 rounded-lg transition-colors"
                  >
                    Claim Rewards
                  </button>
                  <button 
                    onClick={() => handleQuickAction('Transaction History')}
                    className="w-full bg-everstake-bg-card border border-everstake-gray-dark/30 text-white hover:bg-everstake-purple-primary hover:border-everstake-purple-primary py-3 rounded-lg transition-colors"
                  >
                    Transaction History
                  </button>
                </div>
              </div>

              {/* Network Status */}
              <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Network Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-everstake-gray-light text-sm">ETH Price</span>
                    <span className="text-white font-medium">
                      {isLoading ? 'Loading...' : ethPrice}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-everstake-gray-light text-sm">Network APY</span>
                    <span className="text-everstake-green font-medium">4.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-everstake-gray-light text-sm">Total Staked</span>
                    <span className="text-white font-medium">28.5M ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-everstake-gray-light text-sm">Validators</span>
                    <span className="text-white font-medium">891,234</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

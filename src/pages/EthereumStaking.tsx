
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { StakeWidget } from '@/components/StakeWidget';
import { ValidatorCard } from '@/components/ValidatorCard';
import { StakingInfo } from '@/components/StakingInfo';
import { Zap, Shield, TrendingUp, Award, ExternalLink } from 'lucide-react';

const EthereumStaking = () => {
  const [selectedValidator, setSelectedValidator] = useState(1);

  const validators = [
    {
      id: 1,
      name: "NodeStake Validator #1",
      fee: "5%",
      apy: "4.2%",
      staked: "1,247 ETH",
      uptime: "99.8%"
    },
    {
      id: 2,
      name: "NodeStake Validator #2",
      fee: "5%",
      apy: "4.1%",
      staked: "1,189 ETH",
      uptime: "99.9%"
    },
    {
      id: 3,
      name: "NodeStake Validator #3",
      fee: "5%",
      apy: "4.3%",
      staked: "1,056 ETH",
      uptime: "99.7%"
    }
  ];

  return (
    <div className="min-h-screen bg-everstake-bg-primary flex w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">Ξ</span>
              </div>
              <div>
                <h1 className="text-white text-3xl font-bold">Ethereum Staking</h1>
                <p className="text-everstake-gray-light">Secure the network and earn rewards</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Staking Widget */}
            <div className="lg:col-span-1">
              <StakeWidget />
            </div>

            {/* Middle Column - Validators */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-white text-xl font-semibold mb-4">Select Validator</h2>
                <div className="space-y-4">
                  {validators.map((validator) => (
                    <div key={validator.id} onClick={() => setSelectedValidator(validator.id)}>
                      <ValidatorCard
                        name={validator.name}
                        fee={validator.fee}
                        apy={validator.apy}
                        staked={validator.staked}
                        uptime={validator.uptime}
                        isSelected={selectedValidator === validator.id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="lg:col-span-1">
              <StakingInfo />
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-12">
            <h2 className="text-white text-2xl font-bold mb-6">Why Stake with NodeStake?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-6 text-center">
                <div className="p-3 bg-everstake-purple-primary/10 rounded-full inline-block mb-4">
                  <Shield className="text-everstake-purple-primary" size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">Secure</h3>
                <p className="text-everstake-gray-light text-sm">Enterprise-grade security with 24/7 monitoring</p>
              </div>

              <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-6 text-center">
                <div className="p-3 bg-everstake-green/10 rounded-full inline-block mb-4">
                  <TrendingUp className="text-everstake-green" size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">High APY</h3>
                <p className="text-everstake-gray-light text-sm">Competitive rewards up to 4.3% annually</p>
              </div>

              <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-6 text-center">
                <div className="p-3 bg-everstake-blue/10 rounded-full inline-block mb-4">
                  <Zap className="text-everstake-blue" size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">Fast Setup</h3>
                <p className="text-everstake-gray-light text-sm">Start staking in minutes with our simple interface</p>
              </div>

              <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-6 text-center">
                <div className="p-3 bg-yellow-500/10 rounded-full inline-block mb-4">
                  <Award className="text-yellow-400" size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">Trusted</h3>
                <p className="text-everstake-gray-light text-sm">Trusted by thousands of stakers worldwide</p>
              </div>
            </div>
          </div>

          {/* Security Audit Section */}
          <div className="mt-16 mb-8">
            <div className="bg-everstake-bg-card border border-everstake-gray-dark/20 rounded-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-white text-2xl font-bold mb-4">Security First</h2>
                <p className="text-everstake-gray-light max-w-2xl mx-auto">
                  Our platform has been thoroughly audited by leading security firms to ensure the highest level of protection for your staked assets.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* ChainSecurity */}
                <div className="bg-everstake-bg-primary/50 rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="text-white" size={24} />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">ChainSecurity</h3>
                    <p className="text-everstake-gray-light text-sm mb-4">
                      Comprehensive smart contract audit ensuring protocol security and reliability.
                    </p>
                  </div>
                  <a 
                    href="#" 
                    className="inline-flex items-center space-x-2 text-everstake-purple-primary hover:text-everstake-purple-secondary transition-colors text-sm font-medium"
                  >
                    <span>View Audit Report</span>
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Ackee */}
                <div className="bg-everstake-bg-primary/50 rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="text-white" size={24} />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">Ackee Blockchain</h3>
                    <p className="text-everstake-gray-light text-sm mb-4">
                      Independent security assessment validating our infrastructure and processes.
                    </p>
                  </div>
                  <a 
                    href="#" 
                    className="inline-flex items-center space-x-2 text-everstake-purple-primary hover:text-everstake-purple-secondary transition-colors text-sm font-medium"
                  >
                    <span>View Audit Report</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-everstake-gray-light text-sm">
                  All audit reports are publicly available for transparency and community verification.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EthereumStaking;

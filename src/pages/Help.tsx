import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { HelpCircle, Mail } from 'lucide-react';

const Help = () => {
  const faqData = [
    {
      question: "What is Ethereum staking?",
      answer: "Ethereum staking is the process of depositing ETH to activate validator software. As a validator, you'll be responsible for storing data, processing transactions, and adding new blocks to the blockchain."
    },
    {
      question: "What is the minimum amount to stake?",
      answer: "The minimum amount to run your own validator is 32 ETH. However, with NodeStake you can start staking with as little as 0.01 ETH through our pooled staking service."
    },
    {
      question: "What are the rewards for staking?",
      answer: "Current APY ranges from 4.0% to 4.3% depending on network conditions and validator performance. Rewards are distributed automatically to your staking account."
    },
    {
      question: "How long does it take to start earning rewards?",
      answer: "After staking, there's an activation queue. Once your validator is activated (usually 1-7 days), you'll start earning rewards immediately."
    },
    {
      question: "Can I unstake my ETH anytime?",
      answer: "Yes, you can request to unstake your ETH at any time. The withdrawal process typically takes 1-5 days depending on the exit queue length."
    },
    {
      question: "What are the risks of staking?",
      answer: "Main risks include slashing (penalties for validator misbehavior), technical risks, and smart contract risks. Our professional infrastructure minimizes these risks."
    },
    {
      question: "What fees does NodeStake charge?",
      answer: "We charge a 5% commission on staking rewards. There are no hidden fees or upfront costs. You only pay when you earn rewards."
    },
    {
      question: "How is my stake secured?",
      answer: "Your stake is secured by Ethereum's proof-of-stake consensus mechanism and our enterprise-grade infrastructure with 24/7 monitoring and redundancy."
    },
    {
      question: "What wallets are supported?",
      answer: "We support MetaMask, Ledger, WalletConnect, and other popular Ethereum wallets. Your private keys always remain under your control."
    },
    {
      question: "Can I track my staking performance?",
      answer: "Yes, our dashboard provides real-time tracking of your staking performance, rewards earned, validator status, and detailed analytics."
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
              <div className="w-12 h-12 bg-gradient-to-br from-everstake-purple-primary to-everstake-purple-secondary rounded-full flex items-center justify-center">
                <HelpCircle className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-white text-3xl font-bold">Help & Support</h1>
                <p className="text-everstake-gray-light">Find answers to common questions about staking</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ Table */}
            <div className="lg:col-span-2">
              <Card className="bg-everstake-bg-card border-everstake-gray-dark/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-everstake-gray-dark/20">
                        <TableHead className="text-everstake-gray-light font-medium">Question</TableHead>
                        <TableHead className="text-everstake-gray-light font-medium">Answer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faqData.map((faq, index) => (
                        <TableRow key={index} className="border-everstake-gray-dark/20 hover:bg-everstake-bg-primary/50">
                          <TableCell className="text-white font-medium align-top min-w-[200px]">
                            {faq.question}
                          </TableCell>
                          <TableCell className="text-everstake-gray-light leading-relaxed">
                            {faq.answer}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Contact & Support */}
            <div className="space-y-6">
              <Card className="bg-everstake-bg-card border-everstake-gray-dark/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Need More Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-everstake-purple-primary/10 rounded-lg">
                      <Mail size={16} className="text-everstake-purple-primary" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Email Support</h4>
                      <p className="text-everstake-gray-light text-sm">support@nodestake.pro</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;

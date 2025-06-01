

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  isCoinbaseWallet?: boolean;
  isTrust?: boolean;
  isLedgerConnect?: boolean;
  providers?: EthereumProvider[];
  _metamask?: {
    isUnlocked?: boolean;
  };
}

declare global {
  interface Window {
    ethereum?: EthereumProvider & {
      isCoinbaseWallet?: boolean;
      isTrust?: boolean;
      isMetaMask?: boolean;
      isLedgerConnect?: boolean;
      providers?: EthereumProvider[];
    };
  }
}

export {};


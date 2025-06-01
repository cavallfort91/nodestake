
export interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  isCoinbaseWallet?: boolean;
  isTrust?: boolean;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider & {
      isCoinbaseWallet?: boolean;
      isTrust?: boolean;
      isMetaMask?: boolean;
    };
  }
}

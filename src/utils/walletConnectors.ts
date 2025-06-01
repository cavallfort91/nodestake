
export interface WalletInfo {
  name: string;
  icon: string;
  connector: () => Promise<{ address: string; provider: any }>;
  isInstalled: () => boolean;
}

export const connectMetaMask = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask is not installed");
  }
  
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  return { address: accounts[0], provider: window.ethereum };
};

export const connectCoinbaseWallet = async () => {
  // @ts-ignore
  if (typeof window.ethereum?.isCoinbaseWallet === "undefined") {
    throw new Error("Coinbase Wallet is not installed");
  }
  
  // @ts-ignore
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  // @ts-ignore
  return { address: accounts[0], provider: window.ethereum };
};

export const connectTrustWallet = async () => {
  // @ts-ignore
  if (typeof window.ethereum?.isTrust === "undefined") {
    throw new Error("Trust Wallet is not installed");
  }
  
  // @ts-ignore
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  // @ts-ignore
  return { address: accounts[0], provider: window.ethereum };
};

export const wallets: WalletInfo[] = [
  {
    name: "MetaMask",
    icon: "🦊",
    connector: connectMetaMask,
    isInstalled: () => typeof window.ethereum !== "undefined" && !window.ethereum.isCoinbaseWallet && !window.ethereum.isTrust
  },
  {
    name: "Coinbase Wallet",
    icon: "🔵",
    connector: connectCoinbaseWallet,
    isInstalled: () => typeof window.ethereum?.isCoinbaseWallet !== "undefined"
  },
  {
    name: "Trust Wallet",
    icon: "🛡️",
    connector: connectTrustWallet,
    isInstalled: () => typeof window.ethereum?.isTrust !== "undefined"
  }
];

export const getAvailableWallets = () => {
  return wallets.filter(wallet => wallet.isInstalled());
};

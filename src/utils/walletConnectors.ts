

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
  if (typeof window.ethereum === "undefined" || !window.ethereum.isCoinbaseWallet) {
    throw new Error("Coinbase Wallet is not installed");
  }
  
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  return { address: accounts[0], provider: window.ethereum };
};

export const connectTrustWallet = async () => {
  if (typeof window.ethereum === "undefined" || !window.ethereum.isTrust) {
    throw new Error("Trust Wallet is not installed");
  }
  
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  return { address: accounts[0], provider: window.ethereum };
};

export const connectLedger = async () => {
  // Verificar si hay múltiples proveedores
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Ethereum provider found");
  }

  // Si hay múltiples proveedores, buscar Ledger
  if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
    const ledgerProvider = window.ethereum.providers.find((provider: any) => 
      provider.isLedgerConnect || provider._metamask?.isUnlocked === false
    );
    
    if (ledgerProvider) {
      const accounts = await ledgerProvider.request({ method: "eth_requestAccounts" });
      return { address: accounts[0], provider: ledgerProvider };
    }
  }
  
  // Intentar conectar directamente y verificar si es Ledger por el user agent
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return { address: accounts[0], provider: window.ethereum };
  } catch (error) {
    throw new Error("Ledger connection failed. Please make sure Ledger Live is running and connected.");
  }
};

export const wallets: WalletInfo[] = [
  {
    name: "MetaMask",
    icon: "🦊",
    connector: connectMetaMask,
    isInstalled: () => {
      if (typeof window.ethereum === "undefined") return false;
      
      // Si hay múltiples proveedores, verificar si MetaMask está entre ellos
      if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
        return window.ethereum.providers.some((provider: any) => provider.isMetaMask);
      }
      
      // Verificar si es MetaMask y no otras wallets
      return Boolean(window.ethereum.isMetaMask) && 
             !window.ethereum.isCoinbaseWallet && 
             !window.ethereum.isTrust;
    }
  },
  {
    name: "Coinbase Wallet",
    icon: "🔵",
    connector: connectCoinbaseWallet,
    isInstalled: () => typeof window.ethereum !== "undefined" && 
                       Boolean(window.ethereum.isCoinbaseWallet)
  },
  {
    name: "Trust Wallet",
    icon: "🛡️",
    connector: connectTrustWallet,
    isInstalled: () => typeof window.ethereum !== "undefined" && 
                       Boolean(window.ethereum.isTrust)
  },
  {
    name: "Ledger",
    icon: "🔐",
    connector: connectLedger,
    isInstalled: () => {
      if (typeof window.ethereum === "undefined") return false;
      
      // Verificar si hay múltiples proveedores (indicativo de Ledger Live + MetaMask)
      if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
        return window.ethereum.providers.length > 1;
      }
      
      // Verificar si Ledger Live está corriendo (método alternativo)
      return Boolean(window.ethereum) && 
             !window.ethereum.isMetaMask && 
             !window.ethereum.isCoinbaseWallet && 
             !window.ethereum.isTrust;
    }
  }
];

export const getAvailableWallets = () => {
  return wallets.filter(wallet => wallet.isInstalled());
};



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
  
  // Si hay múltiples proveedores, buscar específicamente MetaMask
  if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
    const metamaskProvider = window.ethereum.providers.find((provider: any) => 
      provider.isMetaMask && !provider.isLedgerConnect
    );
    
    if (metamaskProvider) {
      const accounts = await metamaskProvider.request({ method: "eth_requestAccounts" });
      return { address: accounts[0], provider: metamaskProvider };
    }
  }
  
  // Verificar que sea MetaMask y no otra wallet
  if (window.ethereum.isMetaMask && !window.ethereum.isLedgerConnect) {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return { address: accounts[0], provider: window.ethereum };
  }
  
  throw new Error("MetaMask not found");
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
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Ethereum provider found. Please make sure Ledger Live is running.");
  }

  // Si hay múltiples proveedores, buscar específicamente Ledger Live
  if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
    console.log('Multiple providers found:', window.ethereum.providers.map((p: any) => ({
      isMetaMask: p.isMetaMask,
      isLedgerConnect: p.isLedgerConnect,
      constructor: p.constructor.name
    })));
    
    // Buscar el proveedor de Ledger Live
    const ledgerProvider = window.ethereum.providers.find((provider: any) => {
      // Ledger Live se identifica de diferentes maneras
      return provider.isLedgerConnect || 
             provider.constructor?.name?.includes('LedgerLive') ||
             (provider.request && !provider.isMetaMask && !provider.isCoinbaseWallet && !provider.isTrust);
    });
    
    if (ledgerProvider) {
      console.log('Found Ledger provider:', ledgerProvider);
      try {
        const accounts = await ledgerProvider.request({ method: "eth_requestAccounts" });
        return { address: accounts[0], provider: ledgerProvider };
      } catch (error) {
        console.error('Ledger connection error:', error);
        throw new Error("Failed to connect to Ledger. Make sure your device is connected and Ethereum app is open.");
      }
    }
    
    // Si no se encuentra un proveedor específico de Ledger, usar el que no sea MetaMask
    const nonMetaMaskProvider = window.ethereum.providers.find((provider: any) => 
      !provider.isMetaMask && !provider.isCoinbaseWallet && !provider.isTrust
    );
    
    if (nonMetaMaskProvider) {
      console.log('Using non-MetaMask provider for Ledger:', nonMetaMaskProvider);
      try {
        const accounts = await nonMetaMaskProvider.request({ method: "eth_requestAccounts" });
        return { address: accounts[0], provider: nonMetaMaskProvider };
      } catch (error) {
        console.error('Ledger connection error:', error);
        throw new Error("Failed to connect to Ledger. Make sure your device is connected and Ethereum app is open.");
      }
    }
  }
  
  // Si no hay múltiples proveedores pero ethereum existe, verificar si es Ledger
  if (!window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet && !window.ethereum.isTrust) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      return { address: accounts[0], provider: window.ethereum };
    } catch (error) {
      console.error('Ledger connection error:', error);
      throw new Error("Failed to connect to Ledger. Make sure your device is connected and Ethereum app is open.");
    }
  }
  
  throw new Error("Ledger Live not detected. Please make sure Ledger Live is running and connected.");
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
      
      // Verificar si hay múltiples proveedores (indicativo de Ledger Live + otras wallets)
      if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
        // Buscar evidencia de Ledger Live
        const hasLedger = window.ethereum.providers.some((provider: any) => 
          provider.isLedgerConnect || 
          provider.constructor?.name?.includes('LedgerLive') ||
          (!provider.isMetaMask && !provider.isCoinbaseWallet && !provider.isTrust)
        );
        return hasLedger;
      }
      
      // Si no hay múltiples proveedores, verificar si el único proveedor no es una wallet conocida
      return !window.ethereum.isMetaMask && 
             !window.ethereum.isCoinbaseWallet && 
             !window.ethereum.isTrust;
    }
  }
];

export const getAvailableWallets = () => {
  return wallets.filter(wallet => wallet.isInstalled());
};

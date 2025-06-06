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
  console.log('Attempting to connect to Ledger...');
  
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Ethereum provider found. Please make sure your Ledger is connected and the Ethereum app is open.");
  }

  let provider = null;

  // Si hay múltiples proveedores
  if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
    console.log('Multiple providers detected:', window.ethereum.providers.length);
    
    // Buscar cualquier proveedor disponible (incluido MetaMask que puede estar conectado al Ledger)
    provider = window.ethereum.providers[0] || window.ethereum;
  } else {
    // Un solo proveedor - usar el disponible
    console.log('Single provider detected, using available provider');
    provider = window.ethereum;
  }
  
  if (!provider) {
    throw new Error("No Ethereum provider available");
  }
  
  console.log('Using provider for Ledger connection');
  
  try {
    // Intentar conectar con el proveedor
    const accounts = await provider.request({ 
      method: "eth_requestAccounts"
    });
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts returned. Please make sure your Ledger is unlocked and the Ethereum app is open.");
    }
    
    console.log('Successfully connected, account:', accounts[0]);
    return { address: accounts[0], provider: provider };
    
  } catch (error: any) {
    console.error('Ledger connection error:', error);
    
    // Mensajes de error más específicos
    if (error.code === 4001) {
      throw new Error("Connection rejected. Please approve the connection on your device.");
    } else if (error.code === -32603) {
      throw new Error("Internal error. Please make sure the Ethereum app is open on your Ledger device.");
    } else if (error.message?.includes('User rejected')) {
      throw new Error("Connection was rejected. Please try again and approve on your device.");
    } else {
      throw new Error(`Failed to connect: ${error.message}. Please ensure your Ledger is connected and the Ethereum app is open.`);
    }
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
      
      // Siempre mostrar Ledger como disponible si hay algún proveedor Ethereum
      // La detección real se hará en el momento de la conexión
      return true;
    }
  }
];

export const getAvailableWallets = () => {
  return wallets.filter(wallet => wallet.isInstalled());
};

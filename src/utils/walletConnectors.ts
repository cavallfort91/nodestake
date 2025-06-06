
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
    throw new Error("No Ethereum provider found. Please make sure Ledger Live is running and the Ethereum app is open on your device.");
  }

  // Intentar detectar Ledger Live específicamente
  let ledgerProvider = null;

  // Si hay múltiples proveedores
  if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
    console.log('Multiple providers detected:', window.ethereum.providers.length);
    
    // Log de todos los proveedores para debugging
    window.ethereum.providers.forEach((provider: any, index: number) => {
      console.log(`Provider ${index}:`, {
        isMetaMask: provider.isMetaMask,
        isCoinbaseWallet: provider.isCoinbaseWallet,
        isTrust: provider.isTrust,
        isLedgerConnect: provider.isLedgerConnect,
        constructor: provider.constructor?.name,
        _metamask: provider._metamask,
        selectedAddress: provider.selectedAddress
      });
    });
    
    // Buscar proveedor de Ledger - múltiples estrategias
    ledgerProvider = window.ethereum.providers.find((provider: any) => {
      return provider.isLedgerConnect || 
             provider.constructor?.name?.toLowerCase().includes('ledger') ||
             (!provider.isMetaMask && !provider.isCoinbaseWallet && !provider.isTrust && !provider._metamask);
    });
    
    // Si no encontramos uno específico, usar el que no sea de las wallets conocidas
    if (!ledgerProvider) {
      ledgerProvider = window.ethereum.providers.find((provider: any) => 
        !provider.isMetaMask && !provider.isCoinbaseWallet && !provider.isTrust
      );
    }
  } else {
    // Un solo proveedor - verificar si podría ser Ledger
    console.log('Single provider detected:', {
      isMetaMask: window.ethereum.isMetaMask,
      isCoinbaseWallet: window.ethereum.isCoinbaseWallet,
      isTrust: window.ethereum.isTrust,
      isLedgerConnect: window.ethereum.isLedgerConnect,
      constructor: window.ethereum.constructor?.name
    });
    
    if (!window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet && !window.ethereum.isTrust) {
      ledgerProvider = window.ethereum;
    }
  }
  
  if (!ledgerProvider) {
    throw new Error("Ledger not detected. Please ensure:\n1. Ledger Live is running\n2. Your Ledger device is connected\n3. The Ethereum app is open on your device\n4. Browser support is enabled in Ledger Live settings");
  }
  
  console.log('Found potential Ledger provider:', ledgerProvider);
  
  try {
    // Intentar conectar con el proveedor encontrado
    const accounts = await ledgerProvider.request({ 
      method: "eth_requestAccounts"
    });
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts returned from Ledger");
    }
    
    console.log('Successfully connected to Ledger, account:', accounts[0]);
    return { address: accounts[0], provider: ledgerProvider };
    
  } catch (error: any) {
    console.error('Ledger connection error:', error);
    
    // Mensajes de error más específicos
    if (error.code === 4001) {
      throw new Error("Connection rejected. Please approve the connection on your Ledger device.");
    } else if (error.code === -32603) {
      throw new Error("Internal error. Please make sure the Ethereum app is open on your Ledger device.");
    } else if (error.message?.includes('User rejected')) {
      throw new Error("Connection was rejected. Please try again and approve on your Ledger device.");
    } else {
      throw new Error(`Failed to connect to Ledger: ${error.message}. Please ensure your device is connected and the Ethereum app is open.`);
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

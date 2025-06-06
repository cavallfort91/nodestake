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
  console.log('Attempting to connect to Ledger via MetaMask...');
  
  if (typeof window.ethereum === "undefined") {
    throw new Error("No Ethereum provider found. Please make sure MetaMask is installed and your Ledger is connected.");
  }

  let provider = null;

  // Buscar MetaMask como proveedor para acceder al Ledger
  if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
    console.log('Multiple providers detected:', window.ethereum.providers.length);
    provider = window.ethereum.providers.find((p: any) => p.isMetaMask) || window.ethereum;
  } else if (window.ethereum.isMetaMask) {
    provider = window.ethereum;
  } else {
    throw new Error("MetaMask not found. Please install MetaMask to connect your Ledger.");
  }
  
  if (!provider) {
    throw new Error("MetaMask provider not available");
  }
  
  console.log('Using MetaMask provider for Ledger connection');
  
  try {
    // Primero solicitar acceso a las cuentas
    const accounts = await provider.request({ 
      method: "eth_requestAccounts"
    });
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please unlock your Ledger device and open the Ethereum app.");
    }

    // Intentar obtener más direcciones del Ledger usando eth_accounts
    console.log('Available accounts:', accounts);
    
    // Para Ledger, intentamos solicitar más direcciones
    try {
      const allAccounts = await provider.request({
        method: "wallet_getAccounts"
      });
      console.log('All available accounts:', allAccounts);
    } catch (e) {
      console.log('wallet_getAccounts not supported, using eth_requestAccounts result');
    }

    // Por ahora, usar la primera cuenta disponible
    // En una implementación más avanzada, aquí podrías mostrar un selector de direcciones
    const selectedAccount = accounts[0];
    
    console.log('Successfully connected to Ledger account:', selectedAccount);
    return { address: selectedAccount, provider: provider };
    
  } catch (error: any) {
    console.error('Ledger connection error:', error);
    
    if (error.code === 4001) {
      throw new Error("Connection rejected. Please approve the connection and make sure your Ledger is unlocked with the Ethereum app open.");
    } else if (error.code === -32603) {
      throw new Error("Internal error. Please make sure your Ledger is connected and the Ethereum app is open.");
    } else if (error.message?.includes('User rejected')) {
      throw new Error("Connection was rejected. Please try again and make sure to approve the connection on your Ledger device.");
    } else {
      throw new Error(`Failed to connect to Ledger: ${error.message}. Please ensure your Ledger is connected, unlocked, and the Ethereum app is open.`);
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
      
      // Mostrar Ledger como disponible si MetaMask está instalado
      if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
        return window.ethereum.providers.some((provider: any) => provider.isMetaMask);
      }
      
      return Boolean(window.ethereum.isMetaMask);
    }
  }
];

export const getAvailableWallets = () => {
  return wallets.filter(wallet => wallet.isInstalled());
};

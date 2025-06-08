

export interface WalletInfo {
  name: string;
  icon: string;
  connector: () => Promise<{ address: string; provider: any; accounts?: string[] }>;
  isInstalled: () => boolean;
}

export const connectMetaMask = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask is not installed");
  }
  
  let provider = null;
  
  // Si hay múltiples proveedores, buscar específicamente MetaMask
  if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
    provider = window.ethereum.providers.find((p: any) => 
      p.isMetaMask && !p.isLedgerConnect
    );
  }
  
  // Si no se encontró en providers, usar el ethereum principal si es MetaMask
  if (!provider && window.ethereum.isMetaMask && !window.ethereum.isLedgerConnect) {
    provider = window.ethereum;
  }
  
  if (!provider) {
    throw new Error("MetaMask not found");
  }

  try {
    console.log('Requesting MetaMask accounts...');
    
    // Primero solicitar permisos para conectar
    const requestedAccounts = await provider.request({ 
      method: "eth_requestAccounts" 
    });
    console.log('Requested accounts:', requestedAccounts);
    
    // Intentar obtener todas las cuentas disponibles
    const allAccounts = await provider.request({ 
      method: "eth_accounts" 
    });
    console.log('All available accounts:', allAccounts);
    
    // Intentar solicitar acceso a todas las cuentas (incluyendo hardware wallets)
    try {
      const walletState = await provider.request({
        method: "wallet_getPermissions"
      });
      console.log('Wallet permissions:', walletState);
    } catch (permError) {
      console.log('Could not get wallet permissions:', permError);
    }

    // Intentar el método experimental para obtener todas las cuentas
    let extraAccounts = [];
    try {
      extraAccounts = await provider.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }]
      }).then(() => provider.request({ method: "eth_accounts" }));
      console.log('Extra accounts from permissions:', extraAccounts);
    } catch (extraError) {
      console.log('Could not get extra accounts:', extraError);
    }
    
    // Combinar todas las cuentas únicas
    let combinedAccounts = [...new Set([...requestedAccounts, ...allAccounts, ...extraAccounts])];
    
    // Si seguimos teniendo solo una cuenta, intentar acceder directamente a las cuentas internas de MetaMask
    if (combinedAccounts.length <= 1) {
      try {
        // Este es un método no estándar que algunos usuarios reportan que funciona
        const internalAccounts = await provider.request({
          method: "eth_accounts",
          params: []
        });
        console.log('Internal accounts:', internalAccounts);
        combinedAccounts = [...new Set([...combinedAccounts, ...internalAccounts])];
      } catch (internalError) {
        console.log('Could not access internal accounts:', internalError);
      }
    }
    
    console.log('Final combined accounts for MetaMask:', combinedAccounts);
    
    return { 
      address: combinedAccounts[0], 
      provider: provider, 
      accounts: combinedAccounts 
    };
  } catch (error: any) {
    console.error('MetaMask connection error:', error);
    throw error;
  }
};

export const connectCoinbaseWallet = async () => {
  if (typeof window.ethereum === "undefined" || !window.ethereum.isCoinbaseWallet) {
    throw new Error("Coinbase Wallet is not installed");
  }
  
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  return { address: accounts[0], provider: window.ethereum, accounts };
};

export const connectTrustWallet = async () => {
  if (typeof window.ethereum === "undefined" || !window.ethereum.isTrust) {
    throw new Error("Trust Wallet is not installed");
  }
  
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  return { address: accounts[0], provider: window.ethereum, accounts };
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
    // Primero solicitar permisos
    const requestedAccounts = await provider.request({ 
      method: "eth_requestAccounts"
    });
    console.log('Ledger requested accounts:', requestedAccounts);
    
    // Luego intentar obtener todas las cuentas (incluyendo Ledger)
    const allAccounts = await provider.request({ 
      method: "eth_accounts" 
    });
    console.log('All available accounts for Ledger:', allAccounts);
    
    let combinedAccounts = [...new Set([...requestedAccounts, ...allAccounts])];
    
    if (!combinedAccounts || combinedAccounts.length === 0) {
      throw new Error("No accounts found. Please unlock your Ledger device and open the Ethereum app, then try connecting through MetaMask settings > Connect Hardware Wallet.");
    }

    console.log('Final combined accounts for Ledger:', combinedAccounts);
    
    // Retornar todas las cuentas para que el usuario pueda seleccionar
    return { address: combinedAccounts[0], provider: provider, accounts: combinedAccounts };
    
  } catch (error: any) {
    console.error('Ledger connection error:', error);
    
    if (error.code === 4001) {
      throw new Error("Connection rejected. Please approve the connection and make sure your Ledger is connected to MetaMask via Settings > Connect Hardware Wallet.");
    } else if (error.code === -32603) {
      throw new Error("Internal error. Please make sure your Ledger is connected through MetaMask (Settings > Connect Hardware Wallet).");
    } else if (error.message?.includes('User rejected')) {
      throw new Error("Connection was rejected. Please connect your Ledger through MetaMask Settings > Connect Hardware Wallet first.");
    } else {
      throw new Error(`Failed to connect to Ledger: ${error.message}. Please ensure your Ledger is connected through MetaMask (Settings > Connect Hardware Wallet).`);
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

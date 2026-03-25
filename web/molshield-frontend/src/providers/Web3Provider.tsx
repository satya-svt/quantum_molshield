'use client';

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import { useState, useEffect } from 'react';

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#06d6a0',
            accentColorForeground: '#0a0e27',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
        >
          {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

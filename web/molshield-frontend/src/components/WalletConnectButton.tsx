'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="group relative px-6 py-3 rounded-xl font-semibold text-sm
                      bg-gradient-to-r from-cyan-500/20 to-purple-500/20
                      border border-cyan-500/30 text-cyan-400
                      hover:from-cyan-500/30 hover:to-purple-500/30
                      hover:border-cyan-400/50 hover:text-cyan-300
                      transition-all duration-300 cursor-pointer
                      hover:shadow-[0_0_20px_rgba(6,214,160,0.2)]"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Connect Wallet
                    </span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="px-6 py-3 rounded-xl font-semibold text-sm
                      bg-red-500/20 border border-red-500/30 text-red-400
                      hover:bg-red-500/30 transition-all duration-300 cursor-pointer"
                  >
                    Wrong Network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg
                      bg-secondary/50 border border-border/50 text-sm
                      hover:bg-secondary transition-all duration-300 cursor-pointer"
                  >
                    {chain.hasIcon && chain.iconUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        className="w-4 h-4 rounded-full"
                      />
                    )}
                    <span className="text-muted-foreground">{chain.name}</span>
                  </button>
                  <button
                    onClick={openAccountModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg
                      bg-primary/10 border border-primary/20 text-sm font-medium text-primary
                      hover:bg-primary/20 transition-all duration-300 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    {account.displayName}
                    {account.displayBalance && (
                      <span className="text-muted-foreground">| {account.displayBalance}</span>
                    )}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'MolShield ML',
  projectId: 'molshield-ml-demo-project-id',
  chains: [baseSepolia],
  ssr: true,
});

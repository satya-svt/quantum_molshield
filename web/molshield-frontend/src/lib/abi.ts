export const MOLSHIELD_NFT_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'smilesHash', type: 'bytes32' },
      { name: 'energy', type: 'int256' },
      { name: 'errorReduction', type: 'uint256' },
      { name: 'coherenceExtension', type: 'uint256' },
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  },
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
] as const;

// Placeholder contract address on Base Sepolia
export const MOLSHIELD_NFT_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678' as const;

'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { keccak256, toBytes, parseUnits } from 'viem';
import { MOLSHIELD_NFT_ABI, MOLSHIELD_NFT_ADDRESS } from '@/lib/abi';
import { useSimulationStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Loader2, ExternalLink, CheckCircle2 } from 'lucide-react';

interface MintButtonProps {
  simulationId: string;
  smiles: string;
  energy: number;
  errorReduction: number;
  coherenceExtension: number;
  disabled?: boolean;
}

export function MintButton({
  simulationId,
  smiles,
  energy,
  errorReduction,
  coherenceExtension,
  disabled = false,
}: MintButtonProps) {
  const [txHash, setTxHash] = useState<string | null>(null);
  const setStoreTxHash = useSimulationStore((s) => s.setTxHash);
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (hash) {
      setTxHash(hash);
      setStoreTxHash(simulationId, hash);
    }
  }, [hash, simulationId, setStoreTxHash]);

  const handleMint = () => {
    const smilesHash = keccak256(toBytes(smiles));
    const energyScaled = parseUnits(Math.abs(energy).toString(), 6);
    const errorReductionScaled = parseUnits(errorReduction.toString(), 2);
    const coherenceScaled = parseUnits(coherenceExtension.toString(), 2);

    writeContract({
      address: MOLSHIELD_NFT_ADDRESS,
      abi: MOLSHIELD_NFT_ABI,
      functionName: 'mint',
      args: [
        '0x0000000000000000000000000000000000000000',
        smilesHash,
        BigInt(energyScaled.toString()),
        BigInt(errorReductionScaled.toString()),
        BigInt(coherenceScaled.toString()),
      ],
    });
  };

  if (isSuccess && txHash) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">NFT Minted Successfully!</span>
        </div>
        <a
          href={`https://sepolia.basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View on BaseScan
        </a>
      </div>
    );
  }

  return (
    <Button
      onClick={handleMint}
      disabled={disabled || isPending || isConfirming}
      className="w-full py-6 text-base font-semibold rounded-xl cursor-pointer
        bg-gradient-to-r from-purple-600 to-indigo-600
        hover:from-purple-500 hover:to-indigo-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300
        shadow-[0_0_20px_rgba(124,58,237,0.3)]
        hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Confirm in Wallet...
        </span>
      ) : isConfirming ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Minting on Base Sepolia...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mint Result as NFT
        </span>
      )}
    </Button>
  );
}

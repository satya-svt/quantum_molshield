'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface QubitState {
  id: number;
  state: 'idle' | 'decoherence' | 'corrected' | 'active';
}

export function QubitAnimation({ isRunning = false, currentStep = 0 }: { isRunning?: boolean; currentStep?: number }) {
  const GRID_SIZE = 5;
  const [qubits, setQubits] = useState<QubitState[]>(
    Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
      id: i,
      state: 'idle' as const,
    }))
  );

  useEffect(() => {
    if (!isRunning) {
      setQubits(prev => prev.map(q => ({ ...q, state: 'idle' as const })));
      return;
    }

    const interval = setInterval(() => {
      setQubits(prev =>
        prev.map(q => {
          const rand = Math.random();
          if (currentStep >= 3) {
            // Mostly corrected in later steps
            if (rand < 0.1) return { ...q, state: 'decoherence' as const };
            if (rand < 0.4) return { ...q, state: 'corrected' as const };
            return { ...q, state: 'active' as const };
          } else if (currentStep >= 1) {
            // Mix of decoherence and corrections
            if (rand < 0.25) return { ...q, state: 'decoherence' as const };
            if (rand < 0.5) return { ...q, state: 'corrected' as const };
            if (rand < 0.75) return { ...q, state: 'active' as const };
            return { ...q, state: 'idle' as const };
          } else {
            // Early stage - mostly decoherence
            if (rand < 0.35) return { ...q, state: 'decoherence' as const };
            if (rand < 0.5) return { ...q, state: 'active' as const };
            return { ...q, state: 'idle' as const };
          }
        })
      );
    }, 300);

    return () => clearInterval(interval);
  }, [isRunning, currentStep]);

  const getQubitColor = (state: QubitState['state']) => {
    switch (state) {
      case 'decoherence':
        return 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]';
      case 'corrected':
        return 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]';
      case 'active':
        return 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]';
      default:
        return 'bg-slate-700 shadow-none';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Qubit Grid — Live Status
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Decoherence
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> QEC Corrected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Active
          </span>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {qubits.map((qubit) => (
          <motion.div
            key={qubit.id}
            className={`aspect-square rounded-lg flex items-center justify-center
              text-[10px] font-mono transition-colors duration-200 ${getQubitColor(qubit.state)}`}
            animate={{
              scale: qubit.state === 'decoherence' ? [1, 1.15, 1] : qubit.state === 'corrected' ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            Q{qubit.id}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

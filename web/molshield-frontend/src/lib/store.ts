import { create } from 'zustand';

export interface SimulationResult {
  id: string;
  smiles: string;
  moleculeName: string;
  rawEnergy: number;
  shieldedEnergy: number;
  errorReduction: number;
  coherenceExtension: number;
  qecCycles: number;
  timestamp: number;
  status: 'idle' | 'running' | 'completed' | 'error';
  currentStep: number;
  atoms: Array<{
    symbol: string;
    position: [number, number, number];
    color: string;
  }>;
  bonds: Array<{
    start: number;
    end: number;
  }>;
  txHash?: string;
  nftMinted?: boolean;
}

interface SimulationStore {
  currentSimulation: SimulationResult | null;
  simulations: SimulationResult[];
  isRunning: boolean;
  currentStep: number;
  smiles: string;
  setSmiles: (smiles: string) => void;
  startSimulation: (smiles: string) => void;
  setStep: (step: number) => void;
  completeSimulation: (result: Partial<SimulationResult>) => void;
  setError: () => void;
  setTxHash: (id: string, txHash: string) => void;
  reset: () => void;
}

const SAMPLE_MOLECULES: Record<string, { name: string; atoms: SimulationResult['atoms']; bonds: SimulationResult['bonds'] }> = {
  'CCO': {
    name: 'Ethanol',
    atoms: [
      { symbol: 'C', position: [-1.5, 0, 0], color: '#404040' },
      { symbol: 'C', position: [0, 0, 0], color: '#404040' },
      { symbol: 'O', position: [1.5, 0, 0], color: '#ff0000' },
      { symbol: 'H', position: [-2.1, 0.9, 0], color: '#ffffff' },
      { symbol: 'H', position: [-2.1, -0.5, 0.8], color: '#ffffff' },
      { symbol: 'H', position: [-2.1, -0.5, -0.8], color: '#ffffff' },
      { symbol: 'H', position: [0.5, 0.9, 0], color: '#ffffff' },
      { symbol: 'H', position: [0.5, -0.9, 0], color: '#ffffff' },
      { symbol: 'H', position: [2.1, 0.7, 0], color: '#ffffff' },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 0, end: 3 },
      { start: 0, end: 4 },
      { start: 0, end: 5 },
      { start: 1, end: 6 },
      { start: 1, end: 7 },
      { start: 2, end: 8 },
    ],
  },
  'CC(=O)O': {
    name: 'Acetic Acid',
    atoms: [
      { symbol: 'C', position: [-1.2, 0, 0], color: '#404040' },
      { symbol: 'C', position: [0.3, 0, 0], color: '#404040' },
      { symbol: 'O', position: [1.0, 1.2, 0], color: '#ff0000' },
      { symbol: 'O', position: [1.0, -1.2, 0], color: '#ff0000' },
      { symbol: 'H', position: [-1.8, 0.9, 0], color: '#ffffff' },
      { symbol: 'H', position: [-1.8, -0.5, 0.8], color: '#ffffff' },
      { symbol: 'H', position: [-1.8, -0.5, -0.8], color: '#ffffff' },
      { symbol: 'H', position: [1.6, -1.8, 0], color: '#ffffff' },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 1, end: 3 },
      { start: 0, end: 4 },
      { start: 0, end: 5 },
      { start: 0, end: 6 },
      { start: 3, end: 7 },
    ],
  },
};

const DEFAULT_MOLECULE = {
  name: 'Custom Molecule',
  atoms: [
    { symbol: 'C', position: [0, 0, 0] as [number, number, number], color: '#404040' },
    { symbol: 'C', position: [1.5, 0, 0] as [number, number, number], color: '#404040' },
    { symbol: 'N', position: [3, 0, 0] as [number, number, number], color: '#3050f8' },
    { symbol: 'O', position: [0, 1.5, 0] as [number, number, number], color: '#ff0000' },
    { symbol: 'H', position: [-0.8, -0.8, 0] as [number, number, number], color: '#ffffff' },
    { symbol: 'H', position: [1.5, -1.0, 0.7] as [number, number, number], color: '#ffffff' },
    { symbol: 'H', position: [1.5, -1.0, -0.7] as [number, number, number], color: '#ffffff' },
    { symbol: 'H', position: [3.5, 0.8, 0] as [number, number, number], color: '#ffffff' },
    { symbol: 'H', position: [3.5, -0.8, 0] as [number, number, number], color: '#ffffff' },
  ],
  bonds: [
    { start: 0, end: 1 },
    { start: 1, end: 2 },
    { start: 0, end: 3 },
    { start: 0, end: 4 },
    { start: 1, end: 5 },
    { start: 1, end: 6 },
    { start: 2, end: 7 },
    { start: 2, end: 8 },
  ],
};

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  currentSimulation: null,
  simulations: [],
  isRunning: false,
  currentStep: 0,
  smiles: '',

  setSmiles: (smiles: string) => set({ smiles }),

  startSimulation: (smiles: string) => {
    const moleculeData = SAMPLE_MOLECULES[smiles] || DEFAULT_MOLECULE;
    const id = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const simulation: SimulationResult = {
      id,
      smiles,
      moleculeName: moleculeData.name,
      rawEnergy: 0,
      shieldedEnergy: 0,
      errorReduction: 0,
      coherenceExtension: 0,
      qecCycles: 0,
      timestamp: Date.now(),
      status: 'running',
      currentStep: 0,
      atoms: moleculeData.atoms,
      bonds: moleculeData.bonds,
    };

    set({
      currentSimulation: simulation,
      isRunning: true,
      currentStep: 0,
    });
  },

  setStep: (step: number) => {
    const current = get().currentSimulation;
    if (current) {
      set({
        currentStep: step,
        currentSimulation: { ...current, currentStep: step },
      });
    }
  },

  completeSimulation: (result: Partial<SimulationResult>) => {
    const current = get().currentSimulation;
    if (current) {
      const completed: SimulationResult = {
        ...current,
        ...result,
        status: 'completed',
        currentStep: 4,
      };
      set({
        currentSimulation: completed,
        isRunning: false,
        currentStep: 4,
        simulations: [...get().simulations, completed],
      });
    }
  },

  setError: () => {
    const current = get().currentSimulation;
    if (current) {
      set({
        currentSimulation: { ...current, status: 'error' },
        isRunning: false,
      });
    }
  },

  setTxHash: (id: string, txHash: string) => {
    set({
      simulations: get().simulations.map((s) =>
        s.id === id ? { ...s, txHash, nftMinted: true } : s
      ),
      currentSimulation:
        get().currentSimulation?.id === id
          ? { ...get().currentSimulation!, txHash, nftMinted: true }
          : get().currentSimulation,
    });
  },

  reset: () =>
    set({
      currentSimulation: null,
      isRunning: false,
      currentStep: 0,
    }),
}));

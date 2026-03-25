'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSimulationStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Shield, Zap, ArrowLeft, TrendingDown, Clock, Activity, Atom } from 'lucide-react';

const MoleculeViewer = dynamic(
  () => import('@/components/MoleculeViewer').then(mod => ({ default: mod.MoleculeViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] rounded-xl bg-secondary/20 flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>
    ),
  }
);

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const simulation = useSimulationStore((s) =>
    s.currentSimulation?.id === params.id
      ? s.currentSimulation
      : s.simulations.find((sim) => sim.id === params.id)
  );

  if (!simulation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Simulation Not Found</h1>
          <p className="text-muted-foreground">
            This simulation may have expired or doesn&apos;t exist.
          </p>
        </div>
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const energyDelta = Math.abs(simulation.rawEnergy - simulation.shieldedEnergy);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <Button
              onClick={() => router.push('/')}
              variant="ghost"
              size="sm"
              className="mb-2 -ml-2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">
              Simulation Results
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <code className="text-sm font-mono text-primary bg-primary/10 px-3 py-1 rounded-lg">
                {simulation.smiles}
              </code>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                {simulation.moleculeName}
              </Badge>
              <Badge variant="outline" className="border-primary/30 text-primary">
                Shielded
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* 3D Molecule Viewer — Full Width */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Atom className="w-5 h-5 text-primary" />
                  3D Molecule Viewer
                </CardTitle>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>QEC Cycles: <span className="text-primary font-mono">{simulation.qecCycles}</span></span>
                  <span>ID: <span className="font-mono">{simulation.id.slice(0, 16)}…</span></span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <MoleculeViewer atoms={simulation.atoms} bonds={simulation.bonds} />
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Drag to rotate · Scroll to zoom · Right-click to pan
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Raw vs Shielded Comparison
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Raw Noisy VQE */}
            <Card className="glass-card border-red-500/20 hover:border-red-500/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <Zap className="w-5 h-5" />
                  Raw Noisy VQE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <div className="h-32 rounded-xl bg-gradient-to-t from-red-500/20 to-transparent
                    border border-red-500/10 flex items-end justify-center pb-3">
                    <div className="text-center">
                      <span className="text-3xl font-bold font-mono text-red-400">
                        {simulation.rawEnergy.toFixed(4)}
                      </span>
                      <p className="text-xs text-red-400/70 mt-1">Hartree</p>
                    </div>
                  </div>
                  {/* Noise visualization */}
                  <div className="absolute top-2 left-2 right-2 flex gap-0.5 opacity-40">
                    {Array.from({ length: 30 }, (_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-red-500 rounded-full"
                        style={{
                          height: `${Math.random() * 20 + 5}px`,
                          opacity: Math.random() * 0.5 + 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>No error correction applied. Results affected by gate noise, T1/T2 decoherence, and readout errors.</p>
                </div>
              </CardContent>
            </Card>

            {/* Shielded VQE */}
            <Card className="glass-card border-emerald-500/20 hover:border-emerald-500/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-400">
                  <Shield className="w-5 h-5" />
                  Shielded VQE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <div className="h-32 rounded-xl bg-gradient-to-t from-emerald-500/20 to-transparent
                    border border-emerald-500/10 flex items-end justify-center pb-3">
                    <div className="text-center">
                      <span className="text-3xl font-bold font-mono text-emerald-400">
                        {simulation.shieldedEnergy.toFixed(4)}
                      </span>
                      <p className="text-xs text-emerald-400/70 mt-1">Hartree</p>
                    </div>
                  </div>
                  {/* Clean signal visualization */}
                  <div className="absolute top-2 left-2 right-2 flex gap-0.5 opacity-40">
                    {Array.from({ length: 30 }, (_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-emerald-500 rounded-full"
                        style={{
                          height: `${Math.sin(i / 3) * 8 + 12}px`,
                          opacity: 0.6,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Protected by surface code QEC. Gate errors corrected in real-time with syndrome extraction.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-card text-center">
                <CardContent className="py-6">
                  <TrendingDown className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <p className="text-xs text-muted-foreground mb-1">Energy Improvement</p>
                  <p className="text-3xl font-bold font-mono text-emerald-400">
                    {energyDelta.toFixed(4)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Hartree</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass-card text-center">
                <CardContent className="py-6">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-xs text-muted-foreground mb-1">Error Reduction</p>
                  <p className="text-3xl font-bold font-mono text-primary">
                    {simulation.errorReduction.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">vs unshielded</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass-card text-center">
                <CardContent className="py-6">
                  <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <p className="text-xs text-muted-foreground mb-1">Coherence Extension</p>
                  <p className="text-3xl font-bold font-mono text-purple-400">
                    {simulation.coherenceExtension}x
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">longer coherence time</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

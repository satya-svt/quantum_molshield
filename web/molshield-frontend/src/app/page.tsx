'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useSimulationStore } from '@/lib/store';
import { useState } from 'react';
import { Shield, Zap, Atom, ArrowRight, Cpu, Brain, BarChart3, Code2, Filter } from 'lucide-react';

const EXAMPLE_SMILES = [
  { label: 'Ethanol', value: 'CCO' },
  { label: 'Acetic Acid', value: 'CC(=O)O' },
  { label: 'Polyethylene (unit)', value: 'CC' },
  { label: 'Benzene', value: 'c1ccccc1' },
  { label: 'Aspirin', value: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
  { label: 'Caffeine', value: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' },
];

const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Driven Error Classification',
    description: 'An intelligent agent analyzes simulation results, distinguishing natural quantum errors from noise-induced artifacts automatically.',
  },
  {
    icon: Shield,
    title: 'Multi-Pass QEC Shielding',
    description: 'Noise-flagged errors are sent to the shield for correction, then re-filtered to separate natural errors from true matches.',
  },
  {
    icon: Cpu,
    title: 'Universal VQE Optimization',
    description: 'Variational Quantum Eigensolver computes ground-state energies for any molecular structure — drug compounds, polymers, catalysts, and more.',
  },
  {
    icon: Filter,
    title: 'Smart Filtering Pipeline',
    description: 'Two-stage filtering: the AI agent identifies errors, the shield corrects noise, and the agent validates which results are genuine.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Live qubit grid visualization with decoherence detection, correction pulse monitoring, and error classification breakdown.',
  },
  {
    icon: Atom,
    title: 'Beyond Drug Discovery',
    description: 'From pharmaceutical molecules to advanced materials, catalysts, polymers, and energy storage — shield any molecular simulation.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { setSmiles, startSimulation } = useSimulationStore();
  const [inputSmiles, setInputSmiles] = useState('CCO');

  const handleRunSimulation = () => {
    if (!inputSmiles.trim()) return;
    setSmiles(inputSmiles);
    startSimulation(inputSmiles);
    router.push('/simulate');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(6,214,160,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,214,160,0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[128px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Quantum-Shielded Molecular Simulation
            </motion.div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Shield your quantum circuits from{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary to-purple-400 glow-text">
                decoherence
              </span>
              {' '}— instantly via API
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              MolShield ML uses an AI agent to classify quantum errors — separating noise from natural artifacts —
              then applies multi-pass QEC shielding for accurate molecular simulations across drug discovery,
              materials science, catalysis, and beyond.
            </p>

            {/* SMILES Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-xl mx-auto space-y-4"
            >
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <label className="text-sm font-medium text-muted-foreground text-left block">
                  Enter SMILES String
                </label>
                <div className="flex gap-3">
                  <Input
                    value={inputSmiles}
                    onChange={(e) => setInputSmiles(e.target.value)}
                    placeholder="Enter SMILES notation (e.g., CCO)"
                    className="h-12 bg-background/50 border-border/50 text-foreground
                      placeholder:text-muted-foreground/50 font-mono text-sm
                      focus:border-primary/50 focus:ring-primary/20"
                  />
                  <Button
                    onClick={handleRunSimulation}
                    disabled={!inputSmiles.trim()}
                    className="h-12 px-8 rounded-xl font-semibold cursor-pointer
                      bg-gradient-to-r from-cyan-500 to-primary
                      hover:from-cyan-400 hover:to-primary/90
                      text-background disabled:opacity-50
                      transition-all duration-300
                      shadow-[0_0_20px_rgba(6,214,160,0.3)]
                      hover:shadow-[0_0_30px_rgba(6,214,160,0.5)]"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Run Shielded Simulation
                  </Button>
                </div>

                {/* Example molecules */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground">Examples:</span>
                  {EXAMPLE_SMILES.map((mol) => (
                    <button
                      key={mol.value}
                      onClick={() => setInputSmiles(mol.value)}
                      className="text-xs px-2.5 py-1 rounded-md bg-secondary/50 text-muted-foreground
                        border border-border/30 hover:bg-secondary hover:text-foreground
                        transition-all duration-200 font-mono cursor-pointer"
                    >
                      {mol.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mini molecule sketchpad placeholder */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Atom className="w-5 h-5 text-primary" />
                  <span>Simple Molecule Sketchpad</span>
                </div>
                <div className="mt-3 grid grid-cols-6 gap-2">
                  {['C', 'N', 'O', 'S', 'H', 'F', '=', '#', '(', ')', '[', ']'].map((char) => (
                    <button
                      key={char}
                      onClick={() => setInputSmiles(prev => prev + char)}
                      className="py-2 rounded-lg bg-secondary/30 text-sm font-mono
                        border border-border/20 hover:bg-primary/20 hover:text-primary
                        hover:border-primary/30 transition-all duration-200 cursor-pointer"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 border-t border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold mb-3">
              Why <span className="text-primary">MolShield</span>?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Production-grade quantum error correction for molecular simulations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full glass-card border-border/30 hover:border-primary/30
                  transition-all duration-300 group cursor-default">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center
                      group-hover:bg-primary/20 transition-colors duration-300 mb-4">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / API Section */}
      <section className="relative py-20 border-t border-border/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to <span className="text-primary">shield</span> your circuits?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Explore our API, run AI-driven shielded simulations, and get noise-free molecular insights — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/api-explorer')}
                variant="outline"
                className="px-8 py-6 rounded-xl text-base font-semibold cursor-pointer
                  border-primary/30 text-primary hover:bg-primary/10
                  transition-all duration-300"
              >
                <Code2 className="w-5 h-5 mr-2" />
                Explore API
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={handleRunSimulation}
                className="px-8 py-6 rounded-xl text-base font-semibold cursor-pointer
                  bg-gradient-to-r from-cyan-500 to-primary
                  hover:from-cyan-400 hover:to-primary/90
                  text-background transition-all duration-300
                  shadow-[0_0_20px_rgba(6,214,160,0.3)]
                  hover:shadow-[0_0_30px_rgba(6,214,160,0.5)]"
              >
                <Shield className="w-5 h-5 mr-2" />
                Start Simulation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
          flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span>MolShield ML — Quantum Error Correction</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Powered by AI Agent + QEC · Built with Next.js
          </div>
        </div>
      </footer>
    </div>
  );
}

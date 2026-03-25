'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Suspense } from 'react';
import type { SimulationResult } from '@/lib/store';

const ATOM_COLORS: Record<string, string> = {
  H: '#ffffff',
  C: '#404040',
  N: '#3050f8',
  O: '#ff0000',
  S: '#ffff30',
  P: '#ff8000',
  F: '#90e050',
  Cl: '#1ff01f',
  Br: '#a62929',
  I: '#940094',
};

const ATOM_RADII: Record<string, number> = {
  H: 0.25,
  C: 0.4,
  N: 0.38,
  O: 0.36,
  S: 0.45,
  P: 0.44,
  F: 0.32,
  Cl: 0.42,
  Br: 0.46,
  I: 0.5,
};

function Atom({ position, symbol, color }: { position: [number, number, number]; symbol: string; color: string }) {
  const radius = ATOM_RADII[symbol] || 0.35;
  const atomColor = ATOM_COLORS[symbol] || color || '#cccccc';

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={atomColor}
          roughness={0.2}
          metalness={0.5}
          emissive={atomColor}
          emissiveIntensity={0.15}
        />
      </mesh>
      <Html center distanceFactor={8}>
        <span className="text-[10px] font-bold text-white pointer-events-none select-none
          bg-black/50 px-1 rounded backdrop-blur-sm">
          {symbol}
        </span>
      </Html>
    </group>
  );
}

function Bond({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) {
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;
  const midZ = (start[2] + end[2]) / 2;

  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

  const theta = Math.acos(dy / length);
  const phi = Math.atan2(dx, dz);

  return (
    <mesh position={[midX, midY, midZ]} rotation={[theta, phi, 0]}>
      <cylinderGeometry args={[0.06, 0.06, length, 12]} />
      <meshStandardMaterial
        color="#06d6a0"
        roughness={0.3}
        metalness={0.6}
        emissive="#06d6a0"
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function MoleculeScene({
  atoms,
  bonds,
}: {
  atoms: SimulationResult['atoms'];
  bonds: SimulationResult['bonds'];
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#06d6a0" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7b2ff7" />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {atoms.map((atom, i) => (
        <Atom
          key={`atom-${i}`}
          position={atom.position}
          symbol={atom.symbol}
          color={atom.color}
        />
      ))}

      {bonds.map((bond, i) => (
        <Bond
          key={`bond-${i}`}
          start={atoms[bond.start].position}
          end={atoms[bond.end].position}
        />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={1.5}
      />
    </>
  );
}

export function MoleculeViewer({
  atoms,
  bonds,
}: {
  atoms: SimulationResult['atoms'];
  bonds: SimulationResult['bonds'];
}) {
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-border/50 bg-black/30">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="text-cyan-400 animate-pulse">Loading 3D...</div>
            </Html>
          }
        >
          <MoleculeScene atoms={atoms} bonds={bonds} />
        </Suspense>
      </Canvas>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Beaker, Code2 } from 'lucide-react';

const links = [
  { href: '/', label: 'Home', icon: Shield },
  { href: '/simulate', label: 'Simulate', icon: Beaker },
  { href: '/api-explorer', label: 'API Explorer', icon: Code2 },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50
        bg-background/70 backdrop-blur-xl border-b border-border/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="w-7 h-7 text-primary transition-all duration-300 group-hover:text-cyan-300" />
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Mol<span className="text-primary">Shield</span>{' '}
              <span className="text-xs font-normal text-muted-foreground">ML</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-300
                    ${isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

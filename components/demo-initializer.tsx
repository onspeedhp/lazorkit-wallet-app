'use client';

import { useEffect, useState } from 'react';
import { reseedDemo } from '@/lib/demoSeed';
import { useWalletStore } from '@/lib/store/wallet';

export function DemoInitializer() {
  const { hasWallet, tokens } = useWalletStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    const seededKey = 'lazorkit-demo-seeded-v1';
    const already = typeof window !== 'undefined' && localStorage.getItem(seededKey);
    const appearsEmpty = !hasWallet || (tokens?.length ?? 0) < 8;
    if (!already || appearsEmpty) {
      reseedDemo(false);
      if (typeof window !== 'undefined') localStorage.setItem(seededKey, '1');
    }
    setInitialized(true);
  }, [initialized, hasWallet, tokens]);

  return null;
}



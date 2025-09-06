'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletStore } from '@/lib/store/wallet';
import { OnRampScreen } from '@/components/onramp-screen';

export default function Home() {
  const router = useRouter();
  const { hasPasskey, hasWallet } = useWalletStore();

  useEffect(() => {
    // Smart routing based on wallet state
    if (hasWallet) {
      router.push('/buy');
    }
  }, [hasWallet, router]);

  // Show On-Ramp screen if no wallet exists
  if (!hasPasskey || !hasWallet) {
    return <OnRampScreen />;
  }

  // This should not be reached due to useEffect redirect
  return <OnRampScreen />;
}

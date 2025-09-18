'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletStore } from '@/lib/store/wallet';
import { OnRampScreen } from '@/components/onramp-screen';

export default function Home() {
  const router = useRouter();
  const { hasPasskey, hasWallet } = useWalletStore();

  useEffect(() => {
    if (hasWallet) {
      router.push('/buy');
    }
  }, [hasWallet, router]);

  // 3 trạng thái:
  // 1) Chưa có gì: !hasPasskey && !hasWallet
  // 2) Có Passkey chưa có ví: hasPasskey && !hasWallet
  // 3) Có Passkey và ví: hasPasskey && hasWallet (sẽ redirect /buy)

  if (!hasPasskey && !hasWallet) {
    return <OnRampScreen />;
  }

  if (hasPasskey && !hasWallet) {
    return <OnRampScreen />;
  }

  return <OnRampScreen />;
}

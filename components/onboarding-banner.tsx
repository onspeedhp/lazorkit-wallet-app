'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useWalletStore } from '@/lib/store/wallet';
import { t } from '@/lib/i18n';
import { generatePublicKey } from '@/lib/utils/format';

interface OnboardingBannerProps {
  className?: string;
}

export const OnboardingBanner = ({ className }: OnboardingBannerProps) => {
  const { hasPasskey, hasWallet, setHasPasskey, setHasWallet, setPubkey } = useWalletStore();
  const [isBusy, setIsBusy] = useState(false);

  const handleCreatePasskey = async () => {
    setIsBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    setHasPasskey(true);
    setIsBusy(false);
  };

  const handleCreateWallet = async () => {
    setIsBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    const newPubkey = generatePublicKey();
    setPubkey(newPubkey);
    setHasWallet(true);
    setIsBusy(false);
  };

  if (hasPasskey && hasWallet) return null;

  return (
    <Card className={`glass-card border-dashed border-border/60 ${className || ''}`}>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between gap-3'>
          <div className='space-y-1'>
            {!hasPasskey && (
              <>
                <div className='text-sm font-medium'>{t('onRamp.createPasskey')}</div>
                <div className='text-xs text-muted-foreground'>{t('settings.passkeyStatus')}: {t('common.notAvailable')}</div>
              </>
            )}

            {hasPasskey && !hasWallet && (
              <>
                <div className='text-sm font-medium'>{t('onRamp.createWallet')}</div>
                <div className='text-xs text-muted-foreground'>{t('wallet.publicKey')}: {t('common.notAvailable')}</div>
              </>
            )}
          </div>

          <div className='flex items-center gap-2'>
            {!hasPasskey && (
              <Button size='sm' onClick={handleCreatePasskey} disabled={isBusy}>
                {isBusy ? t('onRamp.creatingPasskey') : t('onRamp.createPasskey')}
              </Button>
            )}
            {hasPasskey && !hasWallet && (
              <Button size='sm' onClick={handleCreateWallet} disabled={isBusy}>
                {isBusy ? t('onRamp.provisioningWallet') : t('onRamp.createWallet')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};



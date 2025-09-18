'use client';

import { Eye, EyeOff, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CopyButton } from './ui/copy-button';
import { Blockie } from './ui/blockie';
import { useWalletStore } from '@/lib/store/wallet';
import { fetchCommonTokens, JupiterToken } from '@/lib/services/jupiter';
import { formatAddress, formatCurrency } from '@/lib/utils/format';
import { t } from '@/lib/i18n';

interface WalletBannerProps {
  onDepositClick?: () => void;
  hideDeposit?: boolean;
}

export const WalletBanner = ({
  onDepositClick,
  hideDeposit = false,
}: WalletBannerProps) => {
  const { pubkey, fiat, rateUsdToVnd, tokens, hasNoAssets } = useWalletStore();
  const [showBalance, setShowBalance] = useState(true);
  const [tokenData, setTokenData] = useState<Map<string, JupiterToken>>(new Map());
  const [loadingPrices, setLoadingPrices] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingPrices(true);
        setLoadError(null);
        const data = await fetchCommonTokens();
        if (mounted) setTokenData(data);
      } catch (e) {
        if (mounted) setLoadError('failed');
      } finally {
        if (mounted) setLoadingPrices(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const totalBalance = useMemo(() => {
    if (!tokens || tokens.length === 0) return 0;
    return tokens.reduce((sum, tk) => {
      const j = tokenData.get(tk.symbol);
      const price = j?.usdPrice ?? tk.priceUsd ?? 0;
      return sum + tk.amount * price;
    }, 0);
  }, [tokens, tokenData]);

  const displayBalance =
    fiat === 'VND' ? totalBalance * rateUsdToVnd : totalBalance;

  return (
    <Card className='glass-card border-border/50 hover:border-primary/30 transition-all duration-300 relative overflow-hidden group hover:shadow-lg'>
      <CardContent className='p-4'>
        <div className='space-y-2'>
          {/* Public Key */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 rounded-lg overflow-hidden border border-border/50 shadow-sm group-hover:shadow-md transition-all duration-300'>
                <Blockie seed={pubkey || 'demo'} size={8} scale={4} />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>{t('wallet.publicKey')}</p>
                <p className='font-mono text-sm font-medium'>
                  {pubkey ? formatAddress(pubkey) : t('common.notAvailable')}
                </p>
              </div>
            </div>
            {pubkey && <CopyButton text={pubkey} />}
          </div>

          {/* Total Balance */}
          <div className='relative'>
            <div className='relative bg-muted/30 rounded-xl p-4 group-hover:bg-muted/50 transition-all duration-300 border border-border/30'>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <p className='text-xs text-muted-foreground mb-1'>
                    {t('wallet.totalBalance')}
                  </p>
                  <div className='flex items-center space-x-2'>
                    <p className='text-2xl font-bold text-foreground min-w-[120px]'>
                      {showBalance
                        ? (loadingPrices && totalBalance === 0
                          ? '—'
                          : formatCurrency(displayBalance, fiat))
                        : '••••••'}
                    </p>
                    {!hideDeposit && hasNoAssets && hasNoAssets() && (
                      <span className='text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/30'>New</span>
                    )}
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => setShowBalance(!showBalance)}
                      className='h-7 w-7 p-0 hover:bg-primary/10 transition-all duration-200'
                    >
                      {showBalance ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {!hideDeposit && (
            <Button
              variant='outline'
              size='sm'
              className='w-full hover:bg-primary/10 hover:border-primary/50 transition-all duration-200'
              onClick={onDepositClick}
            >
              <Plus className='mr-2 h-4 w-4' />
              {t('wallet.deposit')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

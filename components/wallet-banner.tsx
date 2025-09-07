'use client';

import { Eye, EyeOff, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CopyButton } from './ui/copy-button';
import { Blockie } from './ui/blockie';
import { useWalletStore } from '@/lib/store/wallet';
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
  const { pubkey, tokens, fiat, rateUsdToVnd } = useWalletStore();
  const [showBalance, setShowBalance] = useState(true);

  const totalBalance = tokens.reduce((sum, token) => {
    const value = token.amount * token.priceUsd;
    return sum + value;
  }, 0);

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
                <p className='text-sm text-muted-foreground'>Account ID</p>
                <p className='font-mono text-sm font-medium'>
                  {pubkey ? formatAddress(pubkey) : 'Not available'}
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
                        ? formatCurrency(displayBalance, fiat)
                        : '••••••'}
                    </p>
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

'use client';

import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Send,
  Plus,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SendModal } from './send-modal';
import { DepositModal } from './deposit-modal';
import { TokenDetailModal } from './token-detail-modal';
import { useWalletStore, TokenHolding } from '@/lib/store/wallet';
import { AssetsActivity } from './assets-activity';
import {
  formatCurrency,
  formatTokenAmount,
  formatPercentage,
} from '@/lib/utils/format';
import { t } from '@/lib/i18n';

export const AssetsTab = () => {
  const { tokens, fiat, rateUsdToVnd } = useWalletStore();
  const [showBalance, setShowBalance] = useState(true);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenHolding | null>(null);

  const totalBalance = tokens.reduce((sum, token) => {
    const value = token.amount * token.priceUsd;
    return sum + value;
  }, 0);

  const displayBalance =
    fiat === 'VND' ? totalBalance * rateUsdToVnd : totalBalance;

  const handleTokenClick = (token: TokenHolding) => {
    setSelectedToken(token);
  };

  return (
    <div className='space-y-6'>
      {/* Total Balance */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>{t('wallet.totalBalance')}</span>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowBalance(!showBalance)}
              className='h-6 w-6 p-0'
            >
              {showBalance ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold'>
            {showBalance ? formatCurrency(displayBalance, fiat) : '••••••'}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className='grid grid-cols-2 gap-4'>
        <Button
          variant='outline'
          onClick={() => setSendModalOpen(true)}
          className='h-12'
        >
          <Send className='mr-2 h-4 w-4' />
          {t('wallet.send')}
        </Button>
        <Button
          variant='outline'
          onClick={() => setDepositModalOpen(true)}
          className='h-12'
        >
          <Plus className='mr-2 h-4 w-4' />
          {t('wallet.deposit')}
        </Button>
      </div>

      {/* Token List */}
      <div className='space-y-3'>
        <h3 className='text-lg font-semibold'>Tokens</h3>
        {tokens.map((token) => {
          const value = token.amount * token.priceUsd;
          const displayValue = fiat === 'VND' ? value * rateUsdToVnd : value;
          const ChangeIcon =
            token.change24hPct >= 0 ? TrendingUp : TrendingDown;
          const changeColor =
            token.change24hPct >= 0 ? 'text-green-500' : 'text-red-500';

          return (
            <Card
              key={token.symbol}
              className='cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300 glass-card'
              onClick={() => handleTokenClick(token)}
            >
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='relative'>
                      <div className='w-12 h-12 rounded-xl gradient-primary flex items-center justify-center animate-float'>
                        <span className='text-white font-bold text-sm'>
                          {token.symbol.slice(0, 2)}
                        </span>
                      </div>
                      {token.change24hPct > 0 && (
                        <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center'>
                          <span className='text-white text-xs'>📈</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className='font-bold text-lg'>{token.symbol}</div>
                      <div className='text-sm text-muted-foreground'>
                        {showBalance
                          ? formatTokenAmount(token.amount, token.symbol)
                          : '••••••'}
                      </div>
                    </div>
                  </div>

                  <div className='text-right'>
                    <div className='font-bold text-lg'>
                      {showBalance
                        ? formatCurrency(displayValue, fiat)
                        : '••••••'}
                    </div>
                    <div
                      className={`text-sm flex items-center justify-end ${changeColor}`}
                    >
                      <ChangeIcon className='h-3 w-3 mr-1' />
                      {showBalance
                        ? formatPercentage(token.change24hPct)
                        : '••••'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Section */}
      <div className='space-y-3'>
        <h3 className='text-lg font-semibold'>{t('wallet.recentActivity')}</h3>
        <AssetsActivity />
      </div>

      {/* Modals */}
      <SendModal open={sendModalOpen} onOpenChange={setSendModalOpen} />

      <DepositModal
        open={depositModalOpen}
        onOpenChange={setDepositModalOpen}
      />

      {selectedToken && (
        <TokenDetailModal
          token={selectedToken}
          open={!!selectedToken}
          onOpenChange={(open) => !open && setSelectedToken(null)}
        />
      )}
    </div>
  );
};

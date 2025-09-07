'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { TokenDetailModal } from './token-detail-modal';
import { useWalletStore, TokenHolding } from '@/lib/store/wallet';
import { AssetsActivity } from './assets-activity';
import { fetchCommonTokens, JupiterToken } from '@/lib/services/jupiter';
import {
  formatCurrency,
  formatTokenAmount,
  formatPercentage,
} from '@/lib/utils/format';
import { t } from '@/lib/i18n';

// Fallback icons if API doesn't provide them
const fallbackTokenIcons: Record<string, string> = {
  SOL: '◉',
  USDC: '$',
  USDT: '$',
  BONK: '🐕',
  RAY: '🟣',
  JUP: '🪐',
  ORCA: '🐋',
  mSOL: '◉',
  JitoSOL: '◉',
  PYTH: '🔮',
  XYZ: '✨',
};

export const AssetsTab = () => {
  const { tokens, fiat, rateUsdToVnd } = useWalletStore();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedToken, setSelectedToken] = useState<TokenHolding | null>(null);
  const [tokenData, setTokenData] = useState<Map<string, JupiterToken>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);

  // Fetch token data on mount
  useEffect(() => {
    const loadTokenData = async () => {
      try {
        setLoading(true);
        const jupiterTokens = await fetchCommonTokens();
        setTokenData(jupiterTokens);
      } catch (error) {
        console.error('Failed to load token data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTokenData();
  }, []);

  const handleTokenClick = (token: TokenHolding) => {
    setSelectedToken(token);
  };

  // Get token icon from Jupiter data or use fallback
  const getTokenIcon = (symbol: string) => {
    const jupiterToken = tokenData.get(symbol);
    if (jupiterToken?.icon) {
      return (
        <>
          <img
            src={jupiterToken.icon}
            alt={symbol}
            className='w-10 h-10 rounded-lg object-cover'
            onError={(e) => {
              // Fallback to text icon if image fails to load
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextSibling as HTMLElement;
              nextElement?.classList.remove('hidden');
            }}
          />
          <span className='hidden text-lg'>
            {fallbackTokenIcons[symbol] || '?'}
          </span>
        </>
      );
    }
    return <span className='text-lg'>{fallbackTokenIcons[symbol] || '?'}</span>;
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>{t('assets.title')}</h3>
      </div>

      {/* Token List */}
      <div className='space-y-2'>
        {tokens.map((token) => {
          const value = token.amount * token.priceUsd;
          const displayValue = fiat === 'VND' ? value * rateUsdToVnd : value;
          const ChangeIcon =
            token.change24hPct >= 0 ? TrendingUp : TrendingDown;
          const changeColor =
            token.change24hPct >= 0 ? 'text-green-500' : 'text-red-500';
          const jupiterToken = tokenData.get(token.symbol);

          return (
            <Card
              key={token.symbol}
              className='cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300 glass-card'
              onClick={() => handleTokenClick(token)}
            >
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='relative'>
                      <div className='w-10 h-10 rounded-lg overflow-hidden border border-border/50 shadow-sm flex items-center justify-center bg-muted/30'>
                        {jupiterToken?.icon ? (
                          <img
                            src={jupiterToken.icon}
                            alt={token.symbol}
                            className='w-10 h-10 rounded-lg object-cover'
                            onError={(e) => {
                              // Fallback to text icon if image fails to load
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextSibling as HTMLElement;
                              nextElement?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <span className={`text-lg ${jupiterToken?.icon ? 'hidden' : ''}`}>
                          {fallbackTokenIcons[token.symbol] || token.symbol.slice(0, 2)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className='font-semibold text-base'>
                        {token.symbol}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {jupiterToken?.name || `${token.symbol} Token`}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {showBalance
                          ? formatTokenAmount(token.amount, token.symbol)
                          : '••••••'}
                      </div>
                    </div>
                  </div>

                  <div className='text-right'>
                    <div className='font-semibold text-base'>
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
        <h3 className='text-base font-semibold text-muted-foreground'>
          {t('assets.recentActivity')}
        </h3>
        <AssetsActivity />
      </div>

      {/* Token Detail Modal */}
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

'use client';

import { useState } from 'react';
import { ArrowUpDown, Settings2, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useWalletStore, TokenSym } from '@/lib/store/wallet';
import { formatTokenAmount, formatCurrency } from '@/lib/utils/format';
import { t } from '@/lib/i18n';
import { SwapReviewModal } from './swap-review-modal';
import { toast } from '@/hooks/use-toast';
import { JupiterToken } from '@/lib/services/jupiter';

interface SwapFormProps {
  onPreview?: (data: SwapData) => void;
  tokenData?: Map<string, JupiterToken>;
  className?: string;
}

interface SwapData {
  fromToken: TokenSym;
  toToken: TokenSym;
  amount: number;
  slippage: number;
}

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

export const SwapForm = ({
  onPreview,
  tokenData,
  className,
}: SwapFormProps) => {
  const { tokens, fiat, rateUsdToVnd } = useWalletStore();
  const [fromToken, setFromToken] = useState<TokenSym>('USDC');
  const [toToken, setToToken] = useState<TokenSym>('SOL');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [error, setError] = useState('');
  const [reviewOpen, setReviewOpen] = useState(false);
  const [showTokenSelect, setShowTokenSelect] = useState<'from' | 'to' | null>(
    null
  );

  const fromTokenData = tokens.find((t) => t.symbol === fromToken);
  const toTokenData = tokens.find((t) => t.symbol === toToken);
  const amountNum = parseFloat(amount) || 0;

  // Get token icon from Jupiter data or use fallback
  const getTokenIcon = (symbol: string) => {
    const token = tokenData?.get(symbol);
    if (token?.icon) {
      return (
        <>
          <img
            src={token.icon}
            alt={symbol}
            className='w-5 h-5 rounded-full'
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

  // Get price from Jupiter data or fallback to local data
  const getTokenPrice = (symbol: string) => {
    const jupiterToken = tokenData?.get(symbol);
    if (jupiterToken?.usdPrice) {
      return jupiterToken.usdPrice;
    }
    const localToken = tokens.find((t) => t.symbol === symbol);
    return localToken?.priceUsd || 0;
  };

  // Simulate swap rate (simplified) - in production, use Jupiter API for rates
  const fromPrice = getTokenPrice(fromToken);
  const toPrice = getTokenPrice(toToken);
  const swapRate = fromPrice && toPrice ? fromPrice / toPrice : 1;
  const estimatedReceive = amountNum * swapRate * (1 - slippage / 100);
  const amountUsd = amountNum * fromPrice;

  const validateForm = () => {
    if (!amount || amountNum <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (fromToken === toToken) {
      setError(t('swap.sameToken'));
      return false;
    }

    if (!fromTokenData || amountNum > fromTokenData.amount) {
      setError(t('swap.insufficientBalance'));
      return false;
    }

    setError('');
    return true;
  };

  const handlePreview = () => {
    if (!validateForm()) return;

    const data: SwapData = {
      fromToken,
      toToken,
      amount: amountNum,
      slippage,
    };

    console.log('swap_review_clicked', data);
    onPreview?.(data);
    setReviewOpen(true);
  };

  const handleMaxClick = () => {
    if (fromTokenData) {
      setAmount(fromTokenData.amount.toString());
      setError('');
    }
  };

  const handleHalfClick = () => {
    if (fromTokenData) {
      setAmount((fromTokenData.amount / 2).toString());
      setError('');
    }
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setAmount('');
    setError('');
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (value && !/^\d*\.?\d*$/.test(value)) return;
    setAmount(value);
    setError('');
  };

  // Format display value with commas
  const formatDisplayValue = (val: string) => {
    if (!val) return '';
    const parts = val.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  // Format balance with 2 decimals and token symbol
  const formatBalance = (amount: number, symbol: TokenSym) => {
    if (amount === 0) return `0.00 ${symbol}`;
    if (amount < 0.01) return `<0.01 ${symbol}`;
    return `${amount.toFixed(2)} ${symbol}`;
  };

  // Get available tokens that we have data for
  const availableTokens = ['SOL', 'USDC', 'USDT'] as TokenSym[];

  return (
    <>
      <div className='p-4 pt-3'>
        {/* Header with Ultra V2 and settings - Compact */}
        <div className='flex items-center justify-between mb-2'>
          <button className='flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors'>
            <Sparkles className='h-3.5 w-3.5 text-primary' />
            <span className='font-medium text-xs'>Ultra V2</span>
            <Settings2 className='h-3 w-3 text-muted-foreground' />
          </button>
          <button className='p-1.5 rounded-lg hover:bg-muted/50 transition-colors'>
            <Settings2 className='h-3.5 w-3.5 text-muted-foreground' />
          </button>
        </div>

        {/* Two Adjacent Input Sections with Overlapping Swap Button */}
        <div className='relative'>
          {/* Selling Section */}
          <div className='bg-muted/5 rounded-t-lg p-2.5 pb-3 border border-b-0 border-border/50'>
            <div className='flex items-start justify-between'>
              {/* Left side - Label and selector */}
              <div>
                <div className='text-xs text-muted-foreground mb-2'>
                  {t('swap.from')}
                </div>
                <button
                  onClick={() => setShowTokenSelect('from')}
                  className='flex items-center gap-1.5 px-3 py-2 rounded-full bg-card hover:bg-muted/20 transition-colors border border-border/50'
                >
                  <div className='flex items-center'>
                    {getTokenIcon(fromToken)}
                  </div>
                  <span className='font-medium text-sm'>{fromToken}</span>
                  <ChevronDown className='h-3 w-3 text-muted-foreground' />
                </button>
              </div>

              {/* Right side - Balance, buttons and input */}
              <div className='flex-1 ml-3 text-right'>
                <div className='flex items-center justify-end gap-1.5 mb-1 h-4'>
                  {fromTokenData && (
                    <span className='text-xs text-muted-foreground whitespace-nowrap'>
                      {formatBalance(fromTokenData.amount, fromToken)}
                    </span>
                  )}
                  {fromTokenData && fromTokenData.amount > 0 && (
                    <>
                      <button
                        onClick={handleHalfClick}
                        className='px-2 py-0.5 text-[10px] font-medium rounded bg-muted/20 hover:bg-muted/30 transition-colors'
                      >
                        HALF
                      </button>
                      <button
                        onClick={handleMaxClick}
                        className='px-2 py-0.5 text-[10px] font-medium rounded bg-muted/20 hover:bg-muted/30 transition-colors'
                      >
                        MAX
                      </button>
                    </>
                  )}
                </div>
                <Input
                  type='text'
                  inputMode='decimal'
                  placeholder='0.00'
                  value={formatDisplayValue(amount)}
                  onChange={(e) =>
                    handleAmountChange(e.target.value.replace(/,/g, ''))
                  }
                  className='text-2xl font-semibold bg-transparent border-0 p-0 h-auto text-right focus-visible:ring-0 placeholder:text-muted-foreground/30 text-foreground'
                />
                <div className='text-xs text-muted-foreground mt-0.5'>
                  {formatCurrency(amountUsd, 'USD')}
                </div>
              </div>
            </div>
          </div>

          {/* Swap Button - Overlapping both inputs */}
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
            <button
              onClick={handleSwapTokens}
              className='p-2 rounded-full bg-card hover:bg-muted/20 transition-colors border-2 border-border shadow-lg'
            >
              <ArrowUpDown className='h-4 w-4 text-foreground' />
            </button>
          </div>

          {/* Buying Section */}
          <div className='bg-muted/5 rounded-b-lg p-2.5 pb-3 border border-border/50'>
            <div className='flex items-start justify-between'>
              {/* Left side - Label and selector */}
              <div>
                <div className='text-xs text-muted-foreground mb-2'>{t('swap.to')}</div>
                <button
                  onClick={() => setShowTokenSelect('to')}
                  className='flex items-center gap-1.5 px-3 py-2 rounded-full bg-card hover:bg-muted/20 transition-colors border border-border/50'
                >
                  <div className='flex items-center'>
                    {getTokenIcon(toToken)}
                  </div>
                  <span className='font-medium text-sm'>{toToken}</span>
                  <ChevronDown className='h-3 w-3 text-muted-foreground' />
                </button>
              </div>

              {/* Right side - Balance and output */}
              <div className='flex-1 ml-3 text-right'>
                <div className='h-4 mb-1'>
                  {toTokenData && (
                    <span className='text-xs text-muted-foreground whitespace-nowrap'>
                      {formatBalance(toTokenData.amount, toToken)}
                    </span>
                  )}
                </div>
                <div className='text-2xl font-semibold text-muted-foreground/50'>
                  {estimatedReceive > 0
                    ? formatDisplayValue(estimatedReceive.toFixed(6))
                    : '0.00'}
                </div>
                <div className='text-xs text-muted-foreground mt-0.5'>
                  {formatCurrency(estimatedReceive * toPrice, 'USD')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slippage Settings */}
        <div className='mt-2.5 mb-2.5'>
          <div className='text-xs text-muted-foreground mb-1'>{t('swap.slippage')}</div>
          <div className='flex gap-1'>
            {[0.1, 0.5, 1, 2].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={`flex-1 py-1 text-xs rounded transition-all ${
                  slippage === value
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-muted/10 hover:bg-muted/20 border border-border/30'
                }`}
              >
                {value}%
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handlePreview}
          className={`w-full py-2.5 rounded-lg font-semibold text-sm ${
            !amount || !!error || amountNum <= 0
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90'
          }`}
          disabled={!amount || !!error || amountNum <= 0}
        >
          {error || (!amount ? t('swap.enterAmount') : t('swap.confirm'))}
        </Button>

        {/* Token Prices Footer - Individual borders */}
        <div className='flex items-center justify-between gap-2 mt-2.5'>
          <div className='flex items-center gap-2 p-2 border border-border/30 rounded-lg bg-muted/5 flex-1'>
            <div className='flex items-center'>{getTokenIcon(fromToken)}</div>
            <div className='flex-1'>
              <div className='text-xs font-medium'>{fromToken}</div>
              <div className='text-[10px] text-muted-foreground truncate'>
                {tokenData?.get(fromToken)?.id?.slice(0, 4) || 'EPJF'}...
                {tokenData?.get(fromToken)?.id?.slice(-4) || 'Dt1v'}
              </div>
            </div>
            <div className='text-right'>
              <div className='text-xs font-medium'>{formatCurrency(fromPrice, 'USD')}</div>
              <div className='text-[10px] text-destructive'>0%</div>
            </div>
          </div>

          <div className='flex items-center gap-2 p-2 border border-border/30 rounded-lg bg-muted/5 flex-1'>
            <div className='flex items-center'>{getTokenIcon(toToken)}</div>
            <div className='flex-1'>
              <div className='text-xs font-medium'>{toToken}</div>
              <div className='text-[10px] text-muted-foreground truncate'>
                {tokenData?.get(toToken)?.id?.slice(0, 4) || 'So11'}...
                {tokenData?.get(toToken)?.id?.slice(-4) || '1112'}
              </div>
            </div>
            <div className='text-right'>
              <div className='text-xs font-medium'>{formatCurrency(toPrice, 'USD')}</div>
              <div className='text-[10px] text-destructive'>-0.69%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Selection Modal */}
      {showTokenSelect && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center'
          onClick={() => setShowTokenSelect(null)}
        >
          <Card
            className='w-96 max-h-[80vh] overflow-hidden'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='p-3 border-b'>
              <h3 className='font-semibold text-sm'>{t('swap.selectToken')}</h3>
            </div>
            <div className='overflow-y-auto max-h-[60vh] p-2'>
              {availableTokens.map((tokenSymbol) => {
                const token = tokens.find((t) => t.symbol === tokenSymbol);
                const jupiterToken = tokenData?.get(tokenSymbol);

                if (!token) return null;

                return (
                  <button
                    key={token.symbol}
                    onClick={() => {
                      if (showTokenSelect === 'from') {
                        setFromToken(token.symbol);
                      } else {
                        setToToken(token.symbol);
                      }
                      setShowTokenSelect(null);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-colors ${
                      (showTokenSelect === 'from' &&
                        token.symbol === fromToken) ||
                      (showTokenSelect === 'to' && token.symbol === toToken)
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className='flex items-center gap-2.5'>
                      <div className='flex items-center'>
                        {jupiterToken?.icon ? (
                          <img
                            src={jupiterToken.icon}
                            alt={token.symbol}
                            className='w-6 h-6 rounded-full'
                          />
                        ) : (
                          <span className='text-xl'>
                            {fallbackTokenIcons[token.symbol]}
                          </span>
                        )}
                      </div>
                      <div className='text-left'>
                        <div className='font-medium text-sm'>
                          {token.symbol}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {jupiterToken?.name || `${token.symbol} Token`}
                        </div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-xs'>
                        {formatTokenAmount(token.amount, token.symbol)}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {formatCurrency(token.amount * token.priceUsd, 'USD')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      <SwapReviewModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        fromToken={fromToken}
        toToken={toToken}
        amount={amountNum}
        estimatedReceive={estimatedReceive}
        fee={amountNum * 0.002}
        onConfirm={() => {
          useWalletStore.getState().swapFake(fromToken, toToken, amountNum);
          toast({
            title: 'Swap confirmed',
            description: `${amountNum} ${fromToken} -> ${estimatedReceive.toFixed(
              4
            )} ${toToken}`,
          });
          setReviewOpen(false);
          setAmount('');
        }}
      />
    </>
  );
};

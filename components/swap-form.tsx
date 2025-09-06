'use client';

import { useState } from 'react';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useWalletStore, TokenSym } from '@/lib/store/wallet';
import { formatTokenAmount } from '@/lib/utils/format';
import { t } from '@/lib/i18n';
import { SwapReviewModal } from './swap-review-modal';
import { toast } from '@/hooks/use-toast';

interface SwapFormProps {
  onPreview?: (data: SwapData) => void;
  className?: string;
}

interface SwapData {
  fromToken: TokenSym;
  toToken: TokenSym;
  amount: number;
  slippage: number;
}

export const SwapForm = ({ onPreview, className }: SwapFormProps) => {
  const { tokens } = useWalletStore();
  const [fromToken, setFromToken] = useState<TokenSym>('SOL');
  const [toToken, setToToken] = useState<TokenSym>('USDC');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [error, setError] = useState('');
  const [reviewOpen, setReviewOpen] = useState(false);

  const fromTokenData = tokens.find((t) => t.symbol === fromToken);
  const toTokenData = tokens.find((t) => t.symbol === toToken);
  const amountNum = parseFloat(amount) || 0;

  // Simulate swap rate (simplified)
  const swapRate =
    fromTokenData && toTokenData
      ? fromTokenData.priceUsd / toTokenData.priceUsd
      : 1;
  const estimatedReceive = amountNum * swapRate * (1 - slippage / 100);

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

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setAmount('');
    setError('');
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError('');
  };

  const availableTokens = tokens.filter((t) => t.amount > 0);

  if (availableTokens.length === 0) {
    return (
      <Card className={className}>
        <CardContent className='p-6 text-center'>
          <p className='text-muted-foreground mb-4'>
            {t('swap.insufficientBalance')}
          </p>
          <Button variant='outline'>{t('navigation.onRamp')}</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 ${className}`}
    >
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center space-x-2'>
          <div className='w-8 h-8 rounded-lg gradient-primary flex items-center justify-center'>
            <span className='text-white text-sm'>🔄</span>
          </div>
          <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
            {t('swap.title')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* From Token */}
        <div className='space-y-2'>
          <Label>{t('swap.from')}</Label>
          <div className='flex space-x-2'>
            <Select
              value={fromToken}
              onValueChange={(value: TokenSym) => setFromToken(value)}
            >
              <SelectTrigger className='flex-1'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableTokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant='outline' size='sm' onClick={handleMaxClick}>
              {t('common.max')}
            </Button>
          </div>
          {fromTokenData && (
            <p className='text-sm text-muted-foreground'>
              Balance:{' '}
              {formatTokenAmount(fromTokenData.amount, fromTokenData.symbol)}
            </p>
          )}
        </div>

        {/* Amount */}
        <div className='space-y-2'>
          <Label>{t('swap.enterAmount')}</Label>
          <Input
            type='number'
            placeholder='0.00'
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className={error ? 'border-destructive' : ''}
          />
          {error && <p className='text-sm text-destructive'>{error}</p>}
        </div>

        {/* Swap Button */}
        <div className='flex justify-center'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleSwapTokens}
            className='rounded-full p-3 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 animate-bounce-gentle'
          >
            <ArrowUpDown className='h-5 w-5' />
          </Button>
        </div>

        {/* To Token */}
        <div className='space-y-2'>
          <Label>{t('swap.to')}</Label>
          <Select
            value={toToken}
            onValueChange={(value: TokenSym) => setToToken(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quote */}
        <div className='space-y-2'>
          <Label>{t('swap.quote')}</Label>
          <div className='relative p-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg border border-primary/30'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                  {estimatedReceive.toFixed(4)} {toToken}
                </p>
                <p className='text-sm text-muted-foreground'>
                  1 {fromToken} = {swapRate.toFixed(4)} {toToken}
                </p>
              </div>
              <div className='w-10 h-10 rounded-full gradient-accent flex items-center justify-center animate-pulse-glow'>
                <span className='text-white text-sm'>💱</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slippage */}
        <div className='space-y-2'>
          <Label>{t('swap.slippage')}</Label>
          <div className='flex space-x-2'>
            {[0.5, 1, 2].map((value) => (
              <Button
                key={value}
                variant={slippage === value ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSlippage(value)}
                className='flex-1'
              >
                {t(`swap.slippageOptions.${value}`)}
              </Button>
            ))}
          </div>
        </div>

        {/* Review Button */}
        <Button
          onClick={handlePreview}
          className='w-full gradient-primary hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl'
          disabled={!!error || !amount}
        >
          <span className='mr-2'>🔄</span>
          {t('swap.review')}
        </Button>
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
            toast({ title: 'Swap confirmed', description: `${amountNum} ${fromToken} -> ${estimatedReceive.toFixed(4)} ${toToken}` });
            setReviewOpen(false);
            setAmount('');
          }}
        />
      </CardContent>
    </Card>
  );
};

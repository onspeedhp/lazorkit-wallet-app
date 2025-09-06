'use client';

import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { OnRampPreviewModal } from './onramp-preview-modal';
import { useRouter } from 'next/navigation';
import {
  useWalletStore,
  Fiat,
  TokenSym,
  PaymentMethod,
} from '@/lib/store/wallet';
import {
  formatCurrency,
  convertCurrency,
  validateAmount,
  generateOrderId,
} from '@/lib/utils/format';
import { t } from '@/lib/i18n';

interface OnRampFormProps {
  onPreview?: (data: OnRampData) => void;
  className?: string;
}

interface OnRampData {
  fromCurrency: Fiat;
  toToken: TokenSym;
  amount: number;
  paymentMethod: PaymentMethod;
}

export const OnRampForm = ({ onPreview, className }: OnRampFormProps) => {
  const { fiat, rateUsdToVnd } = useWalletStore();
  const router = useRouter();
  const [fromCurrency, setFromCurrency] = useState<Fiat>(fiat);
  const [toToken, setToToken] = useState<TokenSym>('USDC');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const amountNum = parseFloat(amount) || 0;
  const amountUsd =
    fromCurrency === 'USD'
      ? amountNum
      : convertCurrency(amountNum, 'VND', 'USD', rateUsdToVnd);
  const estimatedReceive = amountUsd; // 1:1 for demo

  const validateForm = () => {
    if (!amount || amountNum <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (!validateAmount(amountUsd)) {
      if (amountUsd < 20) {
        setError(t('onRamp.amountTooLow'));
      } else {
        setError(t('onRamp.amountTooHigh'));
      }
      return false;
    }

    setError('');
    return true;
  };

  const handlePreview = () => {
    if (!validateForm()) return;

    const data: OnRampData = {
      fromCurrency,
      toToken,
      amount: amountUsd,
      paymentMethod,
    };

    console.log('onramp_preview_clicked', data);
    onPreview?.(data);
    setPreviewOpen(true);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError('');
  };

  return (
    <Card
      className={`glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 ${className}`}
    >
      <CardHeader className='pb-4'>
        <div className='space-y-2'>
          <CardTitle className='flex items-center space-x-2'>
            <div className='w-8 h-8 rounded-lg gradient-primary flex items-center justify-center'>
              <span className='text-white text-sm'>💳</span>
            </div>
            <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
              {t('onRamp.title')}
            </span>
          </CardTitle>
          <p className='text-xs text-muted-foreground'>Buy with Card / Apple Pay / VNPay • Instantly top up your Solana wallet (demo)</p>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Trust Row */}
        <div className='flex items-center justify-between text-[10px] text-muted-foreground'>
          <div className='flex items-center space-x-2'>
            <span className='px-2 py-1 rounded bg-card border'>VISA</span>
            <span className='px-2 py-1 rounded bg-card border'>Mastercard</span>
            <span className='px-2 py-1 rounded bg-card border'>Apple Pay</span>
            <span className='px-2 py-1 rounded bg-card border'>VNPay</span>
          </div>
          <span>{t('onRamp.trustStripe')}</span>
        </div>

        {/* Info banner */}
        <div className='p-3 rounded-lg border border-primary/30 bg-primary/10 text-xs'>
          {t('onRamp.infoBanner')}
        </div>
        {/* From Currency */}
        <div className='space-y-2'>
          <Label>{t('onRamp.from')}</Label>
          <Select
            value={fromCurrency}
            onValueChange={(value: Fiat) => setFromCurrency(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='USD'>USD</SelectItem>
              <SelectItem value='VND'>VND</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* To Token */}
        <div className='space-y-2'>
          <Label>{t('onRamp.to')}</Label>
          <Select
            value={toToken}
            onValueChange={(value: TokenSym) => setToToken(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='USDC'>USDC</SelectItem>
              <SelectItem value='USDT'>USDT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div className='space-y-2'>
          <Label>{t('onRamp.enterAmount')}</Label>
          <Input
            type='number'
            placeholder='0.00'
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className={error ? 'border-destructive' : ''}
          />
          <div className='flex justify-between text-sm text-muted-foreground'>
            <span>{t('onRamp.minAmount')}</span>
            <span>{t('onRamp.maxAmount')}</span>
          </div>
          {error && <p className='text-sm text-destructive'>{error}</p>}
        </div>

        {/* Rate Display */}
        <div className='relative p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20'>
          <div className='flex items-center space-x-2'>
            <div className='w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center'>
              <span className='text-primary text-xs'>💱</span>
            </div>
            <div>
              <p className='text-sm font-medium'>
                1 USD = {rateUsdToVnd.toLocaleString()} VND
              </p>
              <p className='text-xs text-muted-foreground'>
                {t('onRamp.staticRate')}
              </p>
            </div>
          </div>
        </div>

        {/* Estimated Receive */}
        <div className='space-y-2'>
          <Label>{t('onRamp.estimatedReceive')}</Label>
          <div className='relative p-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg border border-primary/30'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                  {estimatedReceive.toFixed(2)} {toToken}
                </p>
                <p className='text-xs text-muted-foreground'>
                  Estimated amount
                </p>
              </div>
              <div className='w-10 h-10 rounded-full gradient-accent flex items-center justify-center animate-pulse-glow'>
                <span className='text-white text-sm'>🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className='space-y-2'>
          <Label>{t('onRamp.paymentMethod')}</Label>
          <Tabs
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          >
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='card'>{t('onRamp.card')}</TabsTrigger>
              <TabsTrigger value='applepay'>{t('onRamp.applePay')}</TabsTrigger>
              <TabsTrigger value='vnpay'>{t('onRamp.vnpay')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Preview Button */}
        <Button
          onClick={handlePreview}
          className='w-full gradient-primary hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl'
          disabled={!!error || !amount}
        >
          <span className='mr-2'>✨</span>
          {t('onRamp.preview')}
        </Button>

        {/* Limits */}
        <div className='text-xs text-muted-foreground text-center'>{t('onRamp.limits')}</div>
      </CardContent>
      <OnRampPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={{ fromCurrency, toToken, amount: amountUsd, paymentMethod }}
        onConfirm={async () => {
          const orderId = generateOrderId();
          console.log('checkout_success', orderId);
          const url = `/callback/success?orderId=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(amountUsd.toFixed(2))}&token=${encodeURIComponent(toToken)}&currency=${encodeURIComponent(fromCurrency)}`;
          // Simulate 600ms redirect delay
          await new Promise(r => setTimeout(r, 600));
          router.push(url);
        }}
      />
    </Card>
  );
};

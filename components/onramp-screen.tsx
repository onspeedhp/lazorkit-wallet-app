'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { OnRampForm } from './onramp-form';
import {
  useWalletStore,
  Fiat,
  TokenSym,
  PaymentMethod,
} from '@/lib/store/wallet';
import {
  formatCurrency,
  generateOrderId,
  generatePublicKey,
} from '@/lib/utils/format';
import { t } from '@/lib/i18n';

interface OnRampData {
  fromCurrency: Fiat;
  toToken: TokenSym;
  amount: number;
  paymentMethod: PaymentMethod;
}

export const OnRampScreen = () => {
  const router = useRouter();
  const { onrampFake, setHasWallet, setPubkey } = useWalletStore();
  const [showPreview, setShowPreview] = useState(false);
  const [onrampData, setOnrampData] = useState<OnRampData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePreview = (data: OnRampData) => {
    setOnrampData(data);
    setShowPreview(true);
  };

  const handleConfirm = async () => {
    if (!onrampData) return;

    setIsProcessing(true);
    setShowPreview(false);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderId = generateOrderId();
    console.log('onramp_confirm_clicked', { ...onrampData, orderId });

    // Simulate redirect to payment
    console.log('checkout_success', { orderId });

    // Redirect to success callback
    router.push(
      `/callback/success?orderId=${orderId}&amount=${onrampData.amount}&token=${onrampData.toToken}&currency=${onrampData.fromCurrency}`
    );
  };

  const handleCancel = () => {
    console.log('checkout_canceled');
    setShowPreview(false);
    setOnrampData(null);
  };

  return (
    <div className='container mx-auto px-4 py-6 max-w-md'>
      <div className='space-y-8'>
        <div className='text-center space-y-4'>
          <div className='relative'>
            <div className='w-20 h-20 mx-auto rounded-2xl gradient-primary flex items-center justify-center animate-bounce-gentle'>
              <span className='text-white text-3xl'>🚀</span>
            </div>
            <div className='absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse-glow flex items-center justify-center'>
              <span className='text-white text-xs'>✨</span>
            </div>
          </div>
          <div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
              {t('app.title')}
            </h1>
            <p className='text-muted-foreground mt-2'>{t('app.subtitle')}</p>
          </div>
        </div>

        <div className='animate-fade-in'>
          <OnRampForm onPreview={handlePreview} />
        </div>

        <div className='text-center'>
          <div className='inline-flex items-center space-x-2 px-4 py-2 bg-muted/50 rounded-full'>
            <div className='w-2 h-2 bg-primary rounded-full animate-pulse'></div>
            <p className='text-xs text-muted-foreground'>
              {t('app.prototype')}
            </p>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{t('onRamp.preview')}</DialogTitle>
          </DialogHeader>

          {onrampData && (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>
                    {t('onRamp.from')}
                  </span>
                  <span>
                    {formatCurrency(onrampData.amount, onrampData.fromCurrency)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>
                    {t('onRamp.to')}
                  </span>
                  <span>
                    {onrampData.amount.toFixed(2)} {onrampData.toToken}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>
                    {t('common.fees')}
                  </span>
                  <span>$2.50</span>
                </div>
                <div className='flex justify-between font-semibold border-t pt-2'>
                  <span>{t('common.total')}</span>
                  <span>
                    {formatCurrency(
                      onrampData.amount + 2.5,
                      onrampData.fromCurrency
                    )}
                  </span>
                </div>
              </div>

              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  onClick={handleCancel}
                  className='flex-1'
                >
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleConfirm} className='flex-1'>
                  {t('onRamp.confirmPay')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Processing Modal */}
      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{t('onRamp.redirecting')}</DialogTitle>
          </DialogHeader>
          <div className='flex items-center justify-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

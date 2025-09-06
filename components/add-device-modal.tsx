'use client';

import { useState } from 'react';
import { Smartphone, QrCode, Copy, Link } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { CopyButton } from './ui/copy-button';
import { QRCode } from '@/lib/utils/qr';
import { useWalletStore } from '@/lib/store/wallet';
import { t } from '@/lib/i18n';
import { toast } from '@/hooks/use-toast';

interface AddDeviceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddDeviceModal = ({ open, onOpenChange }: AddDeviceModalProps) => {
  const { addDevice } = useWalletStore();
  const [pairingLink] = useState('https://lazorkit.com/pair/abc123xyz');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pairingLink);
      console.log('device_link_copied', { pairingLink });
      toast({
        title: t('devices.linkCopied'),
        description: 'Pairing link copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy pairing link',
        variant: 'destructive',
      });
    }
  };

  const handleAddDemoDevice = () => {
    const newDevice = {
      id: Date.now().toString(),
      name: 'Demo Device',
      platform: 'Web' as const,
      lastActive: 'Just now',
      location: 'Current Location',
    };

    addDevice(newDevice);
    console.log('device_add_opened', {
      deviceId: newDevice.id,
      deviceName: newDevice.name,
    });

    toast({
      title: 'Device added',
      description: 'Demo device has been added successfully',
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <Smartphone className='h-5 w-5' />
            <span>{t('devices.addDevice')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Instructions */}
          <div className='text-center space-y-2'>
            <p className='text-muted-foreground'>
              Scan the QR code or copy the pairing link to add a new device to
              your wallet.
            </p>
          </div>

          {/* QR Code */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex justify-center mb-4'>
                <div className='bg-white p-4 rounded-lg'>
                  <QRCode value={pairingLink} size={200} />
                </div>
              </div>
              <p className='text-sm text-muted-foreground text-center'>
                {t('devices.qrCode')}
              </p>
            </CardContent>
          </Card>

          {/* Pairing Link */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>
              {t('devices.pairingLink')}
            </label>
            <div className='flex items-center space-x-2'>
              <div className='flex-1 p-3 bg-muted/50 rounded-lg'>
                <p className='text-sm font-mono break-all'>{pairingLink}</p>
              </div>
              <CopyButton text={pairingLink} />
            </div>
          </div>

          {/* Demo Button */}
          <div className='p-4 bg-muted/50 rounded-lg'>
            <p className='text-sm text-muted-foreground mb-3'>
              This is a demo. In a real app, you would scan the QR code or use
              the pairing link.
            </p>
            <Button onClick={handleAddDemoDevice} className='w-full'>
              <Smartphone className='mr-2 h-4 w-4' />
              Add Demo Device
            </Button>
          </div>

          {/* Actions */}
          <div className='flex space-x-2'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='flex-1'
            >
              {t('common.cancel')}
            </Button>
            <Button onClick={handleCopyLink} className='flex-1'>
              <Copy className='mr-2 h-4 w-4' />
              {t('devices.copyLink')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

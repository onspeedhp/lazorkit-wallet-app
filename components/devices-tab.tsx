'use client';

import { useEffect, useState } from 'react';
import { Smartphone, Trash2, Plus, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AddDeviceModal } from './add-device-modal';
import { RemoveDeviceDialog } from './remove-device-dialog';
import { useWalletStore, Device } from '@/lib/store/wallet';
import { t } from '@/lib/i18n';

export const DevicesTab = () => {
  const { devices, removeDevice } = useWalletStore();
  const [addDeviceModalOpen, setAddDeviceModalOpen] = useState(false);
  const [removeDeviceDialogOpen, setRemoveDeviceDialogOpen] = useState(false);
  const [deviceToRemove, setDeviceToRemove] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 400 + Math.floor(Math.random() * 400));
    return () => clearTimeout(id);
  }, []);

  const handleRemoveDevice = (device: Device) => {
    setDeviceToRemove(device);
    setRemoveDeviceDialogOpen(true);
  };

  const confirmRemoveDevice = () => {
    if (deviceToRemove) {
      removeDevice(deviceToRemove.id);
      console.log('device_removed', {
        deviceId: deviceToRemove.id,
        deviceName: deviceToRemove.name,
      });
      setRemoveDeviceDialogOpen(false);
      setDeviceToRemove(null);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>{t('devices.title')}</h3>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setAddDeviceModalOpen(true)}
        >
          <Plus className='mr-2 h-4 w-4' />
          {t('devices.addDevice')}
        </Button>
      </div>

      {/* Devices List */}
      <div className='space-y-3'>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className='p-4'>
                  <div className='h-5 w-1/2 bg-muted/40 rounded animate-pulse mb-2' />
                  <div className='h-4 w-1/3 bg-muted/30 rounded animate-pulse' />
                </CardContent>
              </Card>
            ))
          : devices.map((device) => (
          <Card key={device.id}>
            <CardContent className='p-4'>
              <div className='flex items-start justify-between'>
                <div className='flex items-start space-x-3'>
                  <div className='w-10 h-10 bg-muted rounded-full flex items-center justify-center'>
                    <Smartphone className='h-5 w-5 text-muted-foreground' />
                  </div>
                  <div className='flex-1'>
                    <div className='font-semibold'>{device.name}</div>
                    <div className='text-sm text-muted-foreground mb-2'>
                      {device.platform}
                    </div>
                    <div className='space-y-1'>
                      <div className='flex items-center text-sm text-muted-foreground'>
                        <Clock className='h-3 w-3 mr-1' />
                        {t('devices.lastActive')}: {device.lastActive}
                      </div>
                      {device.location && (
                        <div className='flex items-center text-sm text-muted-foreground'>
                          <MapPin className='h-3 w-3 mr-1' />
                          {device.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleRemoveDevice(device)}
                  className='text-destructive hover:text-destructive'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {devices.length === 0 && (
        <Card>
          <CardContent className='p-6 text-center'>
            <Smartphone className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <h3 className='font-semibold mb-2'>No devices connected</h3>
            <p className='text-muted-foreground mb-4'>
              Add a device to manage your wallet across multiple platforms.
            </p>
            <Button onClick={() => setAddDeviceModalOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              {t('devices.addDevice')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <AddDeviceModal
        open={addDeviceModalOpen}
        onOpenChange={setAddDeviceModalOpen}
      />

      <RemoveDeviceDialog
        open={removeDeviceDialogOpen}
        onOpenChange={setRemoveDeviceDialogOpen}
        device={deviceToRemove}
        onConfirm={confirmRemoveDevice}
      />
    </div>
  );
};

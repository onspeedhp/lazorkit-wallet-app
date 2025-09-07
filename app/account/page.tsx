'use client';

import { useState } from 'react';
import { Send, Plus, Eye, EyeOff } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { DrawerNav } from '@/components/drawer-nav';
import { AssetsTab } from '@/components/assets-tab';
import { DevicesTab } from '@/components/devices-tab';
import { SettingsTab } from '@/components/settings-tab';
import { SendModal } from '@/components/send-modal';
import { DepositModal } from '@/components/deposit-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import { Blockie } from '@/components/ui/blockie';
import { useWalletStore } from '@/lib/store/wallet';
import { formatAddress, formatCurrency } from '@/lib/utils/format';
import { t } from '@/lib/i18n';

export default function AccountPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  const { pubkey, tokens, fiat, rateUsdToVnd } = useWalletStore();

  const totalBalance = tokens.reduce((sum, token) => {
    const value = token.amount * token.priceUsd;
    return sum + value;
  }, 0);

  const displayBalance =
    fiat === 'VND' ? totalBalance * rateUsdToVnd : totalBalance;

  return (
    <>
      <div className='min-h-screen bg-background'>
        <AppHeader showMenu onMenuClick={() => setDrawerOpen(true)} />

        <DrawerNav open={drawerOpen} onOpenChange={setDrawerOpen} />

        <main className='container mx-auto px-4 py-6 max-w-md'>
          <div className='space-y-6'>
            {/* Wallet Banner Style Total Balance */}
            <Card className='glass-card border-border/50 hover:border-primary/30 transition-all duration-300 relative overflow-hidden group hover:shadow-lg'>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  {/* Public Key */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 rounded-lg overflow-hidden border border-border/50 shadow-sm group-hover:shadow-md transition-all duration-300'>
                        <Blockie seed={pubkey || 'demo'} size={8} scale={4} />
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          Account ID
                        </p>
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
                          <p className='text-xs text-muted-foreground mb-2'>
                            {t('wallet.totalBalance')}
                          </p>
                          <div className='flex items-center space-x-2'>
                            <p className='text-3xl font-bold text-foreground min-w-[140px]'>
                              {showBalance
                                ? formatCurrency(displayBalance, fiat)
                                : '••••••'}
                            </p>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => setShowBalance(!showBalance)}
                              className='h-8 w-8 p-0 hover:bg-primary/10 transition-all duration-200'
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
                  <div className='grid grid-cols-2 gap-3'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-10 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200'
                      onClick={() => setSendModalOpen(true)}
                    >
                      <Send className='mr-2 h-4 w-4' />
                      {t('wallet.send')}
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-10 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200'
                      onClick={() => setDepositModalOpen(true)}
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      {t('wallet.deposit')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue='assets' className='w-full'>
              <TabsList className='grid w-full grid-cols-3 bg-muted/50'>
                <TabsTrigger
                  value='assets'
                  className='data-[state=active]:!bg-primary data-[state=active]:!text-white data-[state=active]:!shadow-sm'
                >
                  {t('navigation.assets')}
                </TabsTrigger>
                <TabsTrigger
                  value='devices'
                  className='data-[state=active]:!bg-primary data-[state=active]:!text-white data-[state=active]:!shadow-sm'
                >
                  {t('navigation.devices')}
                </TabsTrigger>
                <TabsTrigger
                  value='settings'
                  className='data-[state=active]:!bg-primary data-[state=active]:!text-white data-[state=active]:!shadow-sm'
                >
                  {t('navigation.settings')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value='assets' className='mt-6'>
                <AssetsTab />
              </TabsContent>

              <TabsContent value='devices' className='mt-6'>
                <DevicesTab />
              </TabsContent>

              <TabsContent value='settings' className='mt-6'>
                <SettingsTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Modals - Rendered outside of main container */}
      <SendModal open={sendModalOpen} onOpenChange={setSendModalOpen} />
      <DepositModal
        open={depositModalOpen}
        onOpenChange={setDepositModalOpen}
      />
    </>
  );
}

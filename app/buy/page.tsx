'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { DrawerNav } from '@/components/drawer-nav';
import { WalletBanner } from '@/components/wallet-banner';
import { OnRampForm } from '@/components/onramp-form';
import { SwapForm } from '@/components/swap-form';
import { DepositModal } from '@/components/deposit-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { t } from '@/lib/i18n';

export default function BuyPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        showMenu 
        onMenuClick={() => setDrawerOpen(true)}
      />
      
      <DrawerNav 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen} 
      />

      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="space-y-6">
          <WalletBanner onDepositClick={() => setDepositModalOpen(true)} />

          <Tabs defaultValue="onramp" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="onramp">{t('navigation.onRamp')}</TabsTrigger>
              <TabsTrigger value="swap">{t('navigation.swap')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="onramp" className="mt-6">
              <OnRampForm />
            </TabsContent>
            
            <TabsContent value="swap" className="mt-6">
              <SwapForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <DepositModal 
        open={depositModalOpen} 
        onOpenChange={setDepositModalOpen} 
      />
    </div>
  );
}

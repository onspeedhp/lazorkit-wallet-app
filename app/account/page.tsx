'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { DrawerNav } from '@/components/drawer-nav';
import { AssetsTab } from '@/components/assets-tab';
import { DevicesTab } from '@/components/devices-tab';
import { SettingsTab } from '@/components/settings-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { t } from '@/lib/i18n';

export default function AccountPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">{t('navigation.account')}</h1>
            <p className="text-muted-foreground">
              Manage your wallet and settings
            </p>
          </div>

          <Tabs defaultValue="assets" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assets">{t('navigation.assets')}</TabsTrigger>
              <TabsTrigger value="devices">{t('navigation.devices')}</TabsTrigger>
              <TabsTrigger value="settings">{t('navigation.settings')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assets" className="mt-6">
              <AssetsTab />
            </TabsContent>
            
            <TabsContent value="devices" className="mt-6">
              <DevicesTab />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

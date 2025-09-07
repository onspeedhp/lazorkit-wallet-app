'use client';

import { useState } from 'react';
import {
  Settings,
  Globe,
  Palette,
  DollarSign,
  Shield,
  Zap,
  Trash2,
} from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { useWalletStore } from '@/lib/store/wallet';
import { setLanguage, getLanguage, t } from '@/lib/i18n';
import { toast } from '@/hooks/use-toast';
import { ENV_CONFIG } from '@/lib/config/env';

export const SettingsTab = () => {
  const { fiat, setFiat, resetDemoData, setHasPasskey } = useWalletStore();

  const [walletName, setWalletName] = useState('My Wallet');
  const [language, setLanguageState] = useState(getLanguage());
  const [theme, setTheme] = useState('dark');
  const [passkeyEnabled, setPasskeyEnabled] = useState(true);
  const [minimalDemo, setMinimalDemo] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'en' | 'vi');
    setLanguageState(newLanguage as 'en' | 'vi');
    console.log('settings_language_changed', { language: newLanguage });
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    console.log('settings_theme_changed', { theme: newTheme });
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setFiat(newCurrency as 'USD' | 'VND');
  };

  const handleRegeneratePasskey = () => {
    if (!ENV_CONFIG.ENABLE_DEMO) {
      toast({
        title: 'Demo mode disabled',
        description: 'Passkey functionality is disabled in demo mode.',
      });
      return;
    }

    setHasPasskey(false);
    setTimeout(() => {
      setHasPasskey(true);
      toast({
        title: 'Passkey regenerated',
        description: 'Your passkey has been successfully regenerated.',
      });
    }, 1000);
  };

  const handleRequestAirdrop = () => {
    toast({
      title: 'Testnet airdrop requested',
      description: 'This is a demo - no real tokens will be received.',
    });
  };

  const handleResetDemoData = () => {
    resetDemoData();
    toast({
      title: 'Demo data reset',
      description: 'Demo data has been reset to initial state.',
    });
  };

  return (
    <div className='space-y-6'>
      {/* Wallet Settings */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Settings className='h-5 w-5' />
            <span>Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='walletName'>{t('settings.walletName')}</Label>
            <Input
              id='walletName'
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Globe className='h-5 w-5' />
            <span>Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label>{t('settings.language')}</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='en'>{t('settings.languages.en')}</SelectItem>
                <SelectItem value='vi'>{t('settings.languages.vi')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>{t('settings.theme')}</Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='dark'>
                  {t('settings.themes.dark')}
                </SelectItem>
                <SelectItem value='light'>
                  {t('settings.themes.light')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>{t('settings.currency')}</Label>
            <Select value={fiat} onValueChange={handleCurrencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='USD'>
                  {t('settings.currencies.usd')}
                </SelectItem>
                <SelectItem value='VND'>
                  {t('settings.currencies.vnd')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Security */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Shield className='h-5 w-5' />
            <span>{t('settings.backupSecurity')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='font-medium'>{t('settings.passkeyStatus')}</div>
              <div className='text-sm text-muted-foreground'>
                {t('settings.created')}
              </div>
            </div>
            <Switch
              checked={passkeyEnabled}
              onCheckedChange={setPasskeyEnabled}
            />
          </div>

          <Button
            variant='outline'
            onClick={handleRegeneratePasskey}
            className='w-full'
          >
            {t('settings.regeneratePasskey')}
          </Button>

          <Button variant='outline' className='w-full'>
            {t('settings.exportPublicKey')}
          </Button>
        </CardContent>
      </Card>

      {/* Advanced */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Zap className='h-5 w-5' />
            <span>{t('settings.advanced')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='font-medium'>Rich Demo Mode</div>
              <div className='text-sm text-muted-foreground'>
                Toggle Minimal Data Mode
              </div>
            </div>
            <Switch checked={minimalDemo} onCheckedChange={setMinimalDemo} />
          </div>
          <Button
            variant='outline'
            onClick={handleRequestAirdrop}
            className='w-full'
          >
            {t('settings.requestTestnetAirdrop')}
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className='border-destructive'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2 text-destructive'>
            <Trash2 className='h-5 w-5' />
            <span>{t('settings.dangerZone')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>
              {t('settings.confirmReset')}
            </p>
            <Button
              variant='destructive'
              onClick={handleResetDemoData}
              className='w-full'
            >
              {t('settings.resetDemoData')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

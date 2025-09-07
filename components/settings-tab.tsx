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
    <div className='space-y-4'>
      {/* Wallet Settings */}
      <Card className='glass-card'>
        <CardContent className='p-4'>
          <div className='space-y-3'>
            <div className='flex items-center space-x-2 mb-3'>
              <Settings className='h-4 w-4 text-primary' />
              <span className='font-semibold text-sm'>Wallet</span>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='walletName' className='text-sm'>{t('settings.walletName')}</Label>
              <Input
                id='walletName'
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                className='h-9'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className='glass-card'>
        <CardContent className='p-4'>
          <div className='space-y-4'>
            <div className='flex items-center space-x-2 mb-3'>
              <Globe className='h-4 w-4 text-primary' />
              <span className='font-semibold text-sm'>Preferences</span>
            </div>
            
            <div className='grid grid-cols-1 gap-3'>
              <div className='space-y-1'>
                <Label className='text-sm'>{t('settings.language')}</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className='h-9'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='en'>{t('settings.languages.en')}</SelectItem>
                    <SelectItem value='vi'>{t('settings.languages.vi')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-1'>
                <Label className='text-sm'>{t('settings.theme')}</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger className='h-9'>
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

              <div className='space-y-1'>
                <Label className='text-sm'>{t('settings.currency')}</Label>
                <Select value={fiat} onValueChange={handleCurrencyChange}>
                  <SelectTrigger className='h-9'>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className='glass-card'>
        <CardContent className='p-4'>
          <div className='space-y-4'>
            <div className='flex items-center space-x-2 mb-3'>
              <Shield className='h-4 w-4 text-primary' />
              <span className='font-semibold text-sm'>{t('settings.backupSecurity')}</span>
            </div>
            
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='font-medium text-sm'>{t('settings.passkeyStatus')}</div>
                  <div className='text-xs text-muted-foreground'>
                    {t('settings.created')}
                  </div>
                </div>
                <Switch
                  checked={passkeyEnabled}
                  onCheckedChange={setPasskeyEnabled}
                />
              </div>

              <div className='grid grid-cols-1 gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleRegeneratePasskey}
                  className='h-8 text-xs'
                >
                  {t('settings.regeneratePasskey')}
                </Button>
                <Button variant='outline' size='sm' className='h-8 text-xs'>
                  {t('settings.exportPublicKey')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced */}
      <Card className='glass-card'>
        <CardContent className='p-4'>
          <div className='space-y-4'>
            <div className='flex items-center space-x-2 mb-3'>
              <Zap className='h-4 w-4 text-primary' />
              <span className='font-semibold text-sm'>{t('settings.advanced')}</span>
            </div>
            
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='font-medium text-sm'>Rich Demo Mode</div>
                  <div className='text-xs text-muted-foreground'>
                    Toggle Minimal Data Mode
                  </div>
                </div>
                <Switch checked={minimalDemo} onCheckedChange={setMinimalDemo} />
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={handleRequestAirdrop}
                className='w-full h-8 text-xs'
              >
                {t('settings.requestTestnetAirdrop')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className='glass-card border-destructive/50'>
        <CardContent className='p-4'>
          <div className='space-y-3'>
            <div className='flex items-center space-x-2 mb-3'>
              <Trash2 className='h-4 w-4 text-destructive' />
              <span className='font-semibold text-sm text-destructive'>{t('settings.dangerZone')}</span>
            </div>
            
            <div className='space-y-2'>
              <p className='text-xs text-muted-foreground'>
                {t('settings.confirmReset')}
              </p>
              <Button
                variant='destructive'
                size='sm'
                onClick={handleResetDemoData}
                className='w-full h-8 text-xs'
              >
                {t('settings.resetDemoData')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

'use client';

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { DrawerNav } from '@/components/drawer-nav';
import { WalletBanner } from '@/components/wallet-banner';
import { OnRampForm } from '@/components/onramp-form';
import { SwapForm } from '@/components/swap-form';
import { DepositModal } from '@/components/deposit-modal';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchCommonTokens, JupiterToken } from '@/lib/services/jupiter';
import { useWalletStore } from '@/lib/store/wallet';
import { Zap, Shield, Clock, Globe, Star, TrendingUp } from 'lucide-react';

export default function BuyPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'swap' | 'buy'>('buy');
  const [tokenData, setTokenData] = useState<Map<string, JupiterToken>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const { hasWallet } = useWalletStore();

  // Fetch token data on mount
  useEffect(() => {
    const loadTokenData = async () => {
      try {
        setLoading(true);
        const tokens = await fetchCommonTokens();
        console.log('Loaded token data:', tokens);
        setTokenData(tokens);
      } catch (error) {
        console.error('Failed to load token data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTokenData();
  }, []);

  return (
    <div className='min-h-screen bg-background'>
      <AppHeader showMenu={hasWallet} onMenuClick={() => setDrawerOpen(true)} />

      <DrawerNav open={drawerOpen} onOpenChange={setDrawerOpen} />

      <main className='container mx-auto px-4 py-2 max-w-md'>
        <div className='space-y-10'>
          {hasWallet && (
            <WalletBanner
              hideDeposit
              onDepositClick={() => setDepositModalOpen(true)}
            />
          )}

          {/* First Time Buyer Section */}
          {!hasWallet && (
            <div className='space-y-4 pb-4'>
              {/* Main Buy Section */}
              <div className='text-center'>
                <h1 className='text-4xl font-black text-white mb-1'>
                  Buy USDC
                </h1>
                <p className='text-2xl font-bold text-primary mb-4'>
                  Instantly & Secure
                </p>

                {/* Tags */}
                <div className='flex flex-wrap gap-1.5 justify-center'>
                  <Badge
                    variant='outline'
                    className='px-2.5 py-1 text-xs border-green-400/30 text-green-500 bg-green-400/10 hover:bg-green-400/20 transition-colors shadow-sm'
                  >
                    <Shield className='w-3 h-3 mr-1' />
                    Face ID Login
                  </Badge>
                  <Badge
                    variant='outline'
                    className='px-2.5 py-1 text-xs border-blue-400/30 text-blue-500 bg-blue-400/10 hover:bg-blue-400/20 transition-colors shadow-sm'
                  >
                    <Zap className='w-3 h-3 mr-1' />
                    Scan & Pay
                  </Badge>
                  <Badge
                    variant='outline'
                    className='px-2.5 py-1 text-xs border-primary/30 text-primary bg-primary/10 hover:bg-primary/20 transition-colors shadow-sm'
                  >
                    <Clock className='w-3 h-3 mr-1' />
                    Under 30 Seconds
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Jupiter-style Card Container */}
          <Card className='swap-buy-glow overflow-hidden'>
            {/* Swap/Buy Tabs - Only show for users with wallet */}
            {hasWallet && (
              <div className='flex bg-muted/5'>
                <button
                  onClick={() => setActiveTab('buy')}
                  className={`flex-1 py-2 text-sm font-semibold transition-all relative ${
                    activeTab === 'buy'
                      ? 'text-foreground bg-card border-b-2 border-primary'
                      : 'text-muted-foreground/60 hover:text-muted-foreground'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setActiveTab('swap')}
                  className={`flex-1 py-2 text-sm font-semibold transition-all relative ${
                    activeTab === 'swap'
                      ? 'text-foreground bg-card border-b-2 border-primary'
                      : 'text-muted-foreground/60 hover:text-muted-foreground'
                  }`}
                >
                  Swap
                </button>
              </div>
            )}

            {/* Content */}
            <div className='bg-card'>
              {hasWallet ? (
                <>
                  {activeTab === 'buy' && <OnRampForm tokenData={tokenData} />}
                  {activeTab === 'swap' && <SwapForm tokenData={tokenData} />}
                </>
              ) : (
                <OnRampForm tokenData={tokenData} />
              )}
            </div>
          </Card>
        </div>
      </main>

      <DepositModal
        open={depositModalOpen}
        onOpenChange={setDepositModalOpen}
      />
    </div>
  );
}

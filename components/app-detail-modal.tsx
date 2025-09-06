'use client';

import { ExternalLink, Star, Heart, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { AppCard as AppCardType } from '@/lib/store/wallet';
import { t } from '@/lib/i18n';

interface AppDetailModalProps {
  app: AppCardType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AppDetailModal = ({
  app,
  open,
  onOpenChange,
}: AppDetailModalProps) => {
  const handleOpenApp = () => {
    console.log('app_opened', { appId: app.id, appName: app.name });
    window.open(app.website, '_blank');
  };

  const handleAddToFavorites = () => {
    console.log('app_favorited', { appId: app.id, appName: app.name });
    // In a real app, this would update the favorites list
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <span>{app.name}</span>
            {app.verified && (
              <Star className='h-5 w-5 text-yellow-500 fill-current' />
            )}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* App Banner */}
          <div className='w-full h-32 bg-muted rounded-lg flex items-center justify-center'>
            <ExternalLink className='h-12 w-12 text-muted-foreground' />
          </div>

          {/* App Info */}
          <div className='space-y-4'>
            <div>
              <h3 className='font-semibold mb-2'>{app.name}</h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {app.intro}
              </p>
              <div className='mt-2 text-xs text-muted-foreground flex items-center space-x-3'>
                {typeof app.rating === 'number' && <span>★ {app.rating.toFixed(1)}</span>}
                {app.installs && <span>{app.installs} installs</span>}
                {app.updatedAt && <span>Updated {new Date(app.updatedAt).toLocaleDateString()}</span>}
                {app.version && <span>v{app.version}</span>}
              </div>
            </div>

            {/* Category and Tags */}
            <div className='space-y-3'>
              <div className='flex items-center space-x-2'>
                <span className='text-sm font-medium'>Category:</span>
                <Badge variant='outline'>{app.category}</Badge>
              </div>

              <div className='space-y-2'>
                <span className='text-sm font-medium'>Tags:</span>
                <div className='flex flex-wrap gap-2'>
                  {app.tags.map((tag, idx) => (
                    <Badge key={`${app.id}-detail-tag-${idx}-${tag}`} variant='secondary' className='text-xs'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <Shield className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm font-medium'>
                  {t('apps.permissions')}
                </span>
              </div>
              <div className='space-y-1'>
                <div className='text-sm text-muted-foreground'>
                  • Read wallet balance
                </div>
                <div className='text-sm text-muted-foreground'>
                  • Request transactions
                </div>
                <div className='text-sm text-muted-foreground'>
                  • Access public key
                </div>
              </div>
            </div>

            {/* Website Link */}
            <div className='space-y-2'>
              <span className='text-sm font-medium'>{t('apps.website')}</span>
              <div className='flex items-center space-x-2'>
                <a
                  href={app.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-primary hover:underline'
                >
                  {app.website}
                </a>
                <ExternalLink className='h-3 w-3 text-muted-foreground' />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex space-x-2'>
            <Button
              variant='outline'
              onClick={handleAddToFavorites}
              className='flex-1'
            >
              <Heart className='mr-2 h-4 w-4' />
              {t('apps.addToFavorites')}
            </Button>
            <Button onClick={handleOpenApp} className='flex-1'>
              <ExternalLink className='mr-2 h-4 w-4' />
              {t('apps.openApp')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

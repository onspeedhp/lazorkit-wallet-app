'use client';

import { ExternalLink, Star } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { AppCard as AppCardType } from '@/lib/store/wallet';

interface AppCardProps {
  app: AppCardType;
  layout: 'grid' | 'list';
  onClick: () => void;
}

export const AppCard = ({ app, layout, onClick }: AppCardProps) => {
  if (layout === 'list') {
    return (
      <Card
        className='cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300 glass-card'
        onClick={onClick}
      >
        <CardContent className='p-4'>
          <div className='flex items-start space-x-4'>
            <div className='w-14 h-14 rounded-xl gradient-primary flex items-center justify-center animate-float'>
              <span className='text-white text-lg'>📱</span>
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center space-x-2 mb-2'>
                <h3 className='font-bold truncate text-lg'>{app.name}</h3>
                {app.verified && (
                  <div className='flex items-center space-x-1'>
                    <Star className='h-4 w-4 text-yellow-500 fill-current animate-pulse' />
                    <span className='text-xs text-yellow-500 font-medium'>
                      Verified
                    </span>
                  </div>
                )}
              </div>
              <p className='text-sm text-muted-foreground line-clamp-2 mb-2'>
                {app.intro}
              </p>
              <div className='flex items-center space-x-3 text-xs text-muted-foreground mb-3'>
                {typeof app.rating === 'number' && (
                  <span>★ {app.rating.toFixed(1)}</span>
                )}
                {app.installs && <span>{app.installs} installs</span>}
                {app.updatedAt && (
                  <span className='truncate'>Updated {new Date(app.updatedAt).toLocaleDateString()}</span>
                )}
              </div>
              <div className='flex flex-wrap gap-2'>
                {app.tags.slice(0, 2).map((tag, idx) => (
                  <Badge
                    key={`${app.id}-tag-${idx}-${tag}`}
                    variant='secondary'
                    className='text-xs bg-primary/10 text-primary border-primary/20'
                  >
                    {tag}
                  </Badge>
                ))}
                {app.tags.length > 2 && (
                  <Badge variant='secondary' className='text-xs'>
                    +{app.tags.length - 2}
                  </Badge>
                )}
              </div>
              <div className='mt-3 flex items-center justify-between'>
                <Badge variant='outline' className='text-xs'>{app.category}</Badge>
                <div className='text-primary text-xs flex items-center'>
                  <ExternalLink className='h-3 w-3 mr-1' /> Open App
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className='cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300 glass-card'
      onClick={onClick}
    >
      <CardContent className='p-4'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='w-12 h-12 rounded-xl gradient-primary flex items-center justify-center animate-float'>
              <span className='text-white text-lg'>📱</span>
            </div>
            {app.verified && (
              <div className='flex items-center space-x-1'>
                <Star className='h-4 w-4 text-yellow-500 fill-current animate-pulse' />
              </div>
            )}
          </div>

          <div>
            <h3 className='font-bold text-sm mb-2'>{app.name}</h3>
            <p className='text-xs text-muted-foreground line-clamp-2 leading-relaxed'>
              {app.intro}
            </p>
            <div className='mt-2 flex items-center justify-between'>
              <Badge variant='outline' className='text-[10px]'>{app.category}</Badge>
              <div className='text-[10px] text-muted-foreground space-x-2'>
                {typeof app.rating === 'number' && <span>★ {app.rating.toFixed(1)}</span>}
                {app.installs && <span>{app.installs}</span>}
              </div>
            </div>
          </div>

          <div className='flex flex-wrap gap-1'>
            {app.tags.slice(0, 2).map((tag, idx) => (
              <Badge
                key={`${app.id}-tag-${idx}-${tag}`}
                variant='secondary'
                className='text-xs bg-primary/10 text-primary border-primary/20'
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

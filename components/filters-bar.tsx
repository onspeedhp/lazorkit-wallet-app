'use client';

import { Filter, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { t } from '@/lib/i18n';

interface FiltersBarProps {
  category: string;
  onCategoryChange: (category: string) => void;
  verifiedOnly: boolean;
  onVerifiedChange: (verified: boolean) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  className?: string;
}

export const FiltersBar = ({
  category,
  onCategoryChange,
  verifiedOnly,
  onVerifiedChange,
  sortBy,
  onSortChange,
  className,
}: FiltersBarProps) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Category Filter */}
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className='w-32'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>{t('apps.categories.all')}</SelectItem>
          <SelectItem value='defi'>{t('apps.categories.defi')}</SelectItem>
          <SelectItem value='social'>{t('apps.categories.social')}</SelectItem>
          <SelectItem value='games'>{t('apps.categories.games')}</SelectItem>
          <SelectItem value='tools'>{t('apps.categories.tools')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Verified Filter */}
      <Button
        variant={verifiedOnly ? 'default' : 'outline'}
        size='sm'
        onClick={() => onVerifiedChange(!verifiedOnly)}
        className='flex items-center space-x-1'
      >
        <Filter className='h-4 w-4' />
        <span>Verified</span>
      </Button>

      {/* Sort Filter */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className='w-32'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='popularity'>
            {t('apps.sortOptions.popularity')}
          </SelectItem>
          <SelectItem value='newest'>{t('apps.sortOptions.newest')}</SelectItem>
          <SelectItem value='alphabetical'>
            {t('apps.sortOptions.alphabetical')}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

'use client';

import { t } from '@/lib/i18n';

export function DemoBadge() {
  return (
    <div className="fixed top-2 right-2 z-50">
      <div className="px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 text-xs font-medium shadow">
        {t('app.demoBadge')}
      </div>
    </div>
  );
}



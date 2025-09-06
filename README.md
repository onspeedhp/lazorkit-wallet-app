# Lazorkit Wallet

Mobile-first wallet prototype with rich demo mode.

## Project Structure

- `app/` Next.js routes
- `components/`
  - `apps/` re-exports for apps-related components
  - `ui/` design system primitives (re-exported by `components/ui/index.ts`)
  - page-level composites (e.g., `onramp-form.tsx`, `swap-form.tsx`)
- `lib/`
  - `demoSeed.ts` rich demo data generators
  - `i18n/` translation files
  - `store/` zustand store
  - `utils/` helpers (format, price, qr)

Import UI primitives from the barrel file to simplify paths:

```ts
import { Button, Card, Tabs } from '@/components/ui'
```

Apps-related imports can use the apps barrel:

```ts
import { AppCard, AppDetailModal } from '@/components/apps'
```
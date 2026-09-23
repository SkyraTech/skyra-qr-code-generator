'use client';

import React from 'react';
import { ToastProvider as PlatformToastProvider } from '@skyra/ui';
import { Toaster } from '@/components/ui/toaster';

/**
 * @platform-shim — migrated to @skyra/ui
 *
 * Wraps the application in Platform's Toast context and renders the ToastViewport
 * via the Toaster component.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <PlatformToastProvider>
      {children}
      <Toaster />
    </PlatformToastProvider>
  );
}

'use client';
import { ToastProvider as PlatformToastProvider } from '@skyra/ui';
import * as React from 'react';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <PlatformToastProvider>
      {children}
    </PlatformToastProvider>
  );
}

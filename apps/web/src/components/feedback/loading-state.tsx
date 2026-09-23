/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR feedback/loading-state → @skyra/ui Spinner
 *
 * QR's LoadingState was an inline container with a loader icon and message.
 * Platform's Spinner provides the loader, and this shim maintains the inline
 * container layout.
 */
'use client';

import * as React from 'react';
import { Spinner } from '@skyra/ui';

export interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function LoadingState({
  message = 'Loading data...',
  className = '',
  size = 'default',
}: LoadingStateProps) {
  const platformSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';

  return (
    <div
      className={['flex min-h-[200px] flex-col items-center justify-center p-8 text-center', className]
        .filter(Boolean)
        .join(' ')}
    >
      <Spinner size={platformSize} className="mb-3 text-primary" />
      {message && (
        <p className="text-xs text-muted-foreground font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

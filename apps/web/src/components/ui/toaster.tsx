/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR ui/toaster → @skyra/ui ToastProvider + ToastViewport
 *
 * Re-exports Platform's toaster mounting point.
 */
'use client';

import * as React from 'react';
import { ToastViewport } from '@skyra/ui';

/**
 * Platform handles the provider at the layout level.
 * The Toaster component just renders the viewport where toasts appear.
 */
export function Toaster() {
  return <ToastViewport position="bottom-right" />;
}

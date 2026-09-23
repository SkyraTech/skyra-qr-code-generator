'use client';

import * as React from 'react';
import { Alert as PlatformAlert } from '@skyra/ui';
import type { AlertProps as PlatformAlertProps } from '@skyra/ui';

export type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive' | 'error';

export interface AlertProps extends Omit<PlatformAlertProps, 'variant'> {
  variant?: AlertVariant;
}

const VARIANT_MAP: Record<AlertVariant, PlatformAlertProps['variant']> = {
  default: 'info',
  info: 'info',
  success: 'success',
  warning: 'warning',
  destructive: 'danger',
  error: 'danger',
};

/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR feedback/alert → @skyra/ui Alert
 * Maps QR variants to Platform variants.
 */
export function Alert({ variant = 'default', ...props }: AlertProps) {
  return (
    <PlatformAlert
      variant={VARIANT_MAP[variant]}
      {...props}
    />
  );
}

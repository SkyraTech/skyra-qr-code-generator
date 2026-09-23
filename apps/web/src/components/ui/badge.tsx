/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR UI Badge → @skyra/ui Badge
 *
 * Variant mapping (QR → Platform):
 *   'default'     → 'primary'
 *   'secondary'   → 'neutral'
 *   'destructive' → 'danger'
 *   'outline'     → 'neutral'  (no direct equivalent)
 *   'success'     → 'success'
 *   'warning'     → 'warning'
 *   'info'        → 'info'
 *
 * All new code should import directly from '@skyra/ui'.
 */
'use client';

import React from 'react';
import { Badge as PlatformBadge } from '@skyra/ui';
import type { BadgeVariant as PlatformBadgeVariant } from '@skyra/ui';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'default' | 'sm';
}

const VARIANT_MAP: Record<BadgeVariant, PlatformBadgeVariant> = {
  default: 'primary',
  secondary: 'neutral',
  destructive: 'danger',
  outline: 'neutral',
  success: 'success',
  warning: 'warning',
  info: 'info',
};

export function Badge({ variant = 'default', size, children, ...rest }: BadgeProps) {
  const platformVariant = VARIANT_MAP[variant];
  const platformSize = size === 'sm' ? 'sm' : 'md';

  return (
    <PlatformBadge variant={platformVariant} size={platformSize} {...rest}>
      {children}
    </PlatformBadge>
  );
}

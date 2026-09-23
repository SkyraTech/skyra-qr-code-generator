'use client';

import * as React from 'react';
import { Switch as PlatformSwitch } from '@skyra/ui';
import type { SwitchProps as PlatformSwitchProps } from '@skyra/ui';

export interface SwitchProps extends Omit<PlatformSwitchProps, 'onChange'> {
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR UI Switch → @skyra/ui Switch
 * Maps QR's onCheckedChange prop to Platform's onChange.
 */
export function Switch({ onCheckedChange, ...props }: SwitchProps) {
  return (
    <PlatformSwitch
      onChange={onCheckedChange}
      {...props}
    />
  );
}

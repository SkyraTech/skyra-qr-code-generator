'use client';

import * as React from 'react';
import { Tooltip as PlatformTooltip } from '@skyra/ui';
import type { TooltipProps as PlatformTooltipProps } from '@skyra/ui';

export interface TooltipProps extends Omit<PlatformTooltipProps, 'placement'> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR UI Tooltip → @skyra/ui Tooltip
 * Maps QR's side prop to Platform's placement prop.
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ side, placement, ...props }, ref) => {
    return (
      <PlatformTooltip
        placement={placement ?? side}
        {...props}
      />
    );
  }
);
Tooltip.displayName = 'Tooltip';

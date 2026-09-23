/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR UI Button → @skyra/ui Button
 *
 * Variant mapping (QR → Platform):
 *   'default'     → 'primary'
 *   'destructive' → 'danger'
 *   'secondary'   → 'ghost'   (closest visual match)
 *   'success'     → 'primary' (not in Platform; falls back to primary)
 *   'outline'     → 'outline'
 *   'ghost'       → 'ghost'
 *   'link'        → 'link'
 *
 * Size mapping (QR → Platform):
 *   'default' → 'md'
 *   'sm'      → 'sm'
 *   'lg'      → 'lg'
 *   'icon'    → 'md' + iconOnly=true
 *
 * All new code should import directly from '@skyra/ui'.
 * Remove this shim after all consumers import from @skyra/ui directly.
 */
'use client';

import React from 'react';
import { Button as PlatformButton } from '@skyra/ui';
import type { ButtonProps as PlatformButtonProps } from '@skyra/ui';

/** QR-specific variant union (preserved for backward compat) */
export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'success';

/** QR-specific size union (preserved for backward compat) */
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const VARIANT_MAP: Record<ButtonVariant, PlatformButtonProps['variant']> = {
  default: 'primary',
  destructive: 'danger',
  outline: 'outline',
  secondary: 'ghost',
  ghost: 'ghost',
  link: 'link',
  success: 'primary',
};

const SIZE_MAP: Record<Exclude<ButtonSize, 'icon'>, PlatformButtonProps['size']> = {
  default: 'md',
  sm: 'sm',
  lg: 'lg',
};

/**
 * Backward-compatible Button shim.
 * Delegates all rendering to @skyra/ui Button.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      isLoading,
      leftIcon,
      rightIcon,
      children,
      ...rest
    },
    ref
  ) => {
    const platformVariant = VARIANT_MAP[variant];
    const platformSize = size === 'icon' ? 'md' : SIZE_MAP[size];
    const iconOnly = size === 'icon';

    return (
      <PlatformButton
        ref={ref}
        variant={platformVariant}
        size={platformSize}
        isLoading={isLoading}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        iconOnly={iconOnly}
        {...rest}
      >
        {children}
      </PlatformButton>
    );
  }
);
Button.displayName = 'Button';

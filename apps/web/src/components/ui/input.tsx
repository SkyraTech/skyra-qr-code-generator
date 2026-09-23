'use client';

import * as React from 'react';
import { Input as PlatformInput } from '@skyra/ui';
import type { InputProps as PlatformInputProps } from '@skyra/ui';

export interface InputProps extends Omit<PlatformInputProps, 'leftIcon'> {
  leftIcon?: React.ReactNode;
}

/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR UI Input → @skyra/ui Input
 * Maps QR's leftIcon prop to Platform's leadingIcon.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, ...props }, ref) => {
    return (
      <PlatformInput
        ref={ref}
        leadingIcon={leftIcon}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

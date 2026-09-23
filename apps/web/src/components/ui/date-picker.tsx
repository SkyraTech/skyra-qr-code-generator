'use client';

import * as React from 'react';
import { DateField as PlatformDateField } from '@skyra/ui';
import type { DateFieldProps as PlatformDateFieldProps } from '@skyra/ui';

export interface DatePickerProps extends Omit<PlatformDateFieldProps, 'value'> {
  defaultValue?: string | Date;
  value?: string | Date;
}

/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR UI DatePicker → @skyra/ui DateField
 * Maps QR's defaultValue to Platform's value.
 */
export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ defaultValue, value, ...props }, ref) => {
    return (
      <div ref={ref}>
        <PlatformDateField
          value={value ?? defaultValue}
          {...props}
        />
      </div>
    );
  }
);
DatePicker.displayName = 'DatePicker';

export { PlatformDateField as DateField };
export type { PlatformDateFieldProps as DateFieldProps };

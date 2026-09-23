/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR UI MultiSelect → @skyra/ui DynamicSelect (multi mode)
 *
 * API mapping:
 *   QR MultiSelect:
 *     options: MultiSelectOption[] ({ label, value: string })
 *     selected: string[]
 *     onChange: (selected: string[]) => void
 *     placeholder?: string
 *
 *   Platform DynamicSelect (mode="multiple"):
 *     options: DefaultSelectOption[] ({ label, value })
 *     value: string | string[] | null
 *     onChange: (value: string | string[] | null) => void
 *     mode: 'single' | 'multiple'
 *     placeholder?: string
 *
 * This shim adapts the API so existing QR consumers don't need to change.
 *
 * All new code should import directly from '@skyra/ui' using DynamicSelect.
 */
'use client';

import React from 'react';
import { DynamicSelect } from '@skyra/ui';
import type { DefaultSelectOption } from '@skyra/ui';

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  className,
  disabled,
}: MultiSelectProps) {
  const platformOptions: DefaultSelectOption[] = options.map((o) => ({
    label: o.label,
    value: o.value,
  }));

  const handleChange = (value: string | string[] | null) => {
    if (Array.isArray(value)) {
      onChange(value);
    } else if (value === null) {
      onChange([]);
    } else {
      onChange([value]);
    }
  };

  return (
    <DynamicSelect
      options={platformOptions}
      value={selected}
      onChange={handleChange}
      mode="multiple"
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
}

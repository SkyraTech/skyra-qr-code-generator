/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR UI Select → @skyra/ui NativeSelect
 *
 * QR's Select was a native <select> with options[].
 * Platform's NativeSelect provides the same API:
 *   options, placeholder, error, disabled, value, onChange
 *
 * All new code should import directly from '@skyra/ui'.
 */
export { NativeSelect as Select, NativeSelect } from '@skyra/ui';
export type {
  NativeSelectProps as SelectProps,
  NativeSelectProps,
  NativeSelectOption as SelectOption,
} from '@skyra/ui';

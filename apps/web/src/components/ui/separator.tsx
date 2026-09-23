/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR UI Separator → @skyra/ui Divider
 *
 * Platform uses "Divider" as the component name.
 * This shim re-exports it as "Separator" to preserve backward compatibility.
 *
 * All new code should import directly from '@skyra/ui' as Divider.
 */
export { Divider as Separator } from '@skyra/ui';
export type { DividerProps as SeparatorProps } from '@skyra/ui';
// Also export native names for Platform-aware consumers
export { Divider } from '@skyra/ui';
export type { DividerProps } from '@skyra/ui';

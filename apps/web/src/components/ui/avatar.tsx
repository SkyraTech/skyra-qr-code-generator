/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR UI Avatar → @skyra/ui Avatar
 *
 * The Platform Avatar was added specifically to support QR consumers.
 * API is fully compatible: src, alt, fallback, size, shape.
 *
 * All new code should import directly from '@skyra/ui'.
 */
export { Avatar } from '@skyra/ui';
export type { AvatarProps, AvatarSize, AvatarShape } from '@skyra/ui';

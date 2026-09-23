/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR feedback/error-state → @skyra/ui ErrorState family
 * All new code should import directly from '@skyra/ui'.
 */
export {
  ErrorState,
  ErrorStateIcon,
  ErrorStateTitle,
  ErrorStateDescription,
  ErrorStateActions,
  ErrorStateDetails,
} from '@skyra/ui';
export type {
  ErrorStateProps,
  ErrorStateIconProps,
  ErrorStateTitleProps,
  ErrorStateDescriptionProps,
  ErrorStateActionsProps,
  ErrorStateDetailsProps,
} from '@skyra/ui';

/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR UI Card → @skyra/ui Card family
 *
 * Platform Card now includes sub-components matching QR's usage pattern:
 *   Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
 *
 * All new code should import directly from '@skyra/ui'.
 */
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@skyra/ui';
export type { CardProps } from '@skyra/ui';

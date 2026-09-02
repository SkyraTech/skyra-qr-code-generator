import {
  LayoutDashboard,
  QrCode,
  BarChart3,
  CreditCard,
  Users,
  Settings,
  Sliders,
} from 'lucide-react';
import { NavigationSection } from './navigation-types';
import { ROUTES } from '../routes';

export const userNavigation: NavigationSection[] = [
  {
    title: 'Workspace',
    items: [
      {
        label: 'Dashboard',
        href: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        exactMatch: true,
      },
      {
        label: 'QR Codes',
        href: ROUTES.QR_CODES,
        icon: QrCode,
      },
      {
        label: 'Analytics',
        href: ROUTES.ANALYTICS,
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        label: 'Billing & Plans',
        href: ROUTES.BILLING,
        icon: CreditCard,
      },
      {
        label: 'Team Members',
        href: ROUTES.TEAM,
        icon: Users,
      },
      {
        label: 'Settings',
        href: ROUTES.SETTINGS.ROOT,
        icon: Settings,
      },
    ],
  },
  {
    title: 'Resources',
    items: [
      {
        label: 'Design System',
        href: ROUTES.UI_PREVIEW,
        icon: Sliders,
        badge: 'Preview',
      },
    ],
  },
];

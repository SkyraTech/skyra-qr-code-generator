import {
  LayoutDashboard,
  Users,
  Building2,
  Receipt,
  CreditCard,
  BarChart3,
  ScrollText,
  SlidersHorizontal,
  ArrowLeft,
} from 'lucide-react';
import { NavigationSection } from './navigation-types';
import { ROUTES } from '../routes';

export const adminNavigation: NavigationSection[] = [
  {
    title: 'Platform Overview',
    items: [
      {
        label: 'Admin Dashboard',
        href: ROUTES.ADMIN.DASHBOARD,
        icon: LayoutDashboard,
        exactMatch: true,
      },
      {
        label: 'Platform Analytics',
        href: ROUTES.ADMIN.ANALYTICS,
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Multi-Tenant Operations',
    items: [
      {
        label: 'Users Directory',
        href: ROUTES.ADMIN.USERS,
        icon: Users,
      },
      {
        label: 'Workspaces',
        href: ROUTES.ADMIN.WORKSPACES,
        icon: Building2,
      },
      {
        label: 'Subscriptions',
        href: ROUTES.ADMIN.SUBSCRIPTIONS,
        icon: Receipt,
      },
      {
        label: 'Billing & Invoices',
        href: ROUTES.ADMIN.BILLING,
        icon: CreditCard,
      },
    ],
  },
  {
    title: 'Governance & Security',
    items: [
      {
        label: 'Authoritative Audit Logs',
        href: ROUTES.ADMIN.AUDIT_LOGS,
        icon: ScrollText,
      },
      {
        label: 'Platform Settings',
        href: ROUTES.ADMIN.SETTINGS,
        icon: SlidersHorizontal,
      },
    ],
  },
  {
    title: 'Navigation',
    items: [
      {
        label: 'Exit to Customer App',
        href: ROUTES.DASHBOARD,
        icon: ArrowLeft,
      },
    ],
  },
];

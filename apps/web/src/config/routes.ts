/**
 * Centralized Route Definitions
 * Single source of truth for all URL endpoints across Public, User/Workspace,
 * and Platform Admin surfaces.
 */

export const ROUTES = {
  // Public marketing & auth
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Customer / Workspace Application
  DASHBOARD: '/dashboard',
  QR_CODES: '/qr-codes',
  ANALYTICS: '/analytics',
  BILLING: '/billing',
  TEAM: '/team',
  SETTINGS: {
    ROOT: '/settings',
    PROFILE: '/settings/profile',
    WORKSPACE: '/settings/workspace',
    MEMBERS: '/settings/members',
    SECURITY: '/settings/security',
    API_KEYS: '/settings/api-keys',
  },

  // Platform Administration Console
  ADMIN: {
    ROOT: '/admin/dashboard',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    WORKSPACES: '/admin/workspaces',
    SUBSCRIPTIONS: '/admin/subscriptions',
    BILLING: '/admin/billing',
    ANALYTICS: '/admin/analytics',
    AUDIT_LOGS: '/admin/audit-logs',
    SETTINGS: '/admin/settings',
  },

  // Internal design system showcase
  UI_PREVIEW: '/ui-preview',
} as const;

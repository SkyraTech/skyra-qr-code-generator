import React from 'react';

export type UserRole =
  | 'PLATFORM_SUPER_ADMIN'
  | 'WORKSPACE_OWNER'
  | 'WORKSPACE_ADMIN'
  | 'WORKSPACE_MEMBER'
  | 'WORKSPACE_VIEWER';

export interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  exactMatch?: boolean;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  children?: NavigationItem[];
}

export interface NavigationSection {
  title?: string;
  items: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

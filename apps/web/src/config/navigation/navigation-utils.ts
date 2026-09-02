import { NavigationItem, NavigationSection, BreadcrumbItem, UserRole } from './navigation-types';

/**
 * Determines whether a navigation item is active given the current pathname.
 */
export function isRouteActive(
  pathname: string,
  href: string,
  exactMatch = false
): boolean {
  if (exactMatch || href === '/' || href === '/dashboard' || href === '/admin/dashboard') {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Formats a route segment slug into a human-readable title.
 */
function formatSegmentTitle(segment: string): string {
  if (segment.toLowerCase() === 'qr-codes') return 'QR Codes';
  if (segment.toLowerCase() === 'api-keys') return 'API Keys';
  if (segment.toLowerCase() === 'audit-logs') return 'Audit Logs';

  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Derives hierarchical breadcrumbs automatically from the URL pathname.
 */
export function getBreadcrumbsForRoute(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return [{ label: 'Home' }];
  }

  const breadcrumbs: BreadcrumbItem[] = [];
  let accumulatedPath = '';

  // Determine root anchor
  if (segments[0] === 'admin') {
    breadcrumbs.push({ label: 'Admin', href: '/admin/dashboard' });
  } else {
    breadcrumbs.push({ label: 'Workspace', href: '/dashboard' });
  }

  // Iterate sub-segments
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    accumulatedPath += `/${segment}`;

    // Skip redundant root segments
    if (segment === 'admin' || (segment === 'dashboard' && i === 0)) {
      continue;
    }

    const isLast = i === segments.length - 1;
    breadcrumbs.push({
      label: formatSegmentTitle(segment),
      href: isLast ? undefined : accumulatedPath,
    });
  }

  return breadcrumbs;
}

/**
 * Filters navigation sections according to user roles and permissions.
 * Serves as the extensible foundation for future RBAC policy evaluation.
 */
export function filterNavigationByRole(
  sections: NavigationSection[],
  userRole?: UserRole,
  permissions: string[] = []
): NavigationSection[] {
  return sections
    .map((section) => {
      const filteredItems = section.items.filter((item) => {
        // If roles required, verify user has matching role
        if (item.requiredRoles && item.requiredRoles.length > 0) {
          if (!userRole || !item.requiredRoles.includes(userRole)) {
            return false;
          }
        }

        // If permissions required, verify user has permissions
        if (item.requiredPermissions && item.requiredPermissions.length > 0) {
          const hasAll = item.requiredPermissions.every((p) =>
            permissions.includes(p)
          );
          if (!hasAll) return false;
        }

        return true;
      });

      return {
        ...section,
        items: filteredItems,
      };
    })
    .filter((section) => section.items.length > 0);
}

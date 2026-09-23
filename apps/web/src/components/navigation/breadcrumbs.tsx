'use client';

import * as React from 'react';
import {
  Breadcrumb as PlatformBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem as PlatformBreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@skyra/ui';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR navigation/breadcrumbs → @skyra/ui Breadcrumb family
 * Maps QR's array-based API to Platform's composed API.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items?.length) return null;

  return (
    <PlatformBreadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <PlatformBreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </PlatformBreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </PlatformBreadcrumb>
  );
}

// Re-export Platform's Breadcrumb family for new consumers
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem as BreadcrumbItemComponent,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@skyra/ui';

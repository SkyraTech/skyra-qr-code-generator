'use client';

import * as React from 'react';
import { Drawer as PlatformDrawer } from '@skyra/dialogs';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: 'default' | 'lg' | 'xl';
}

const SIZE_MAP = {
  default: '28rem', // max-w-md
  lg: '36rem',      // max-w-xl
  xl: '48rem',      // max-w-3xl
};

/**
 * @platform-shim — migrated to @skyra/dialogs
 *
 * SkyraQR dialogs/drawer → @skyra/dialogs Drawer
 *
 * Adapts QR's isOpen/size props to Platform's open/width props.
 * Handles QR's title/description nodes within Platform's children slot since
 * Platform Drawer only accepts string titles.
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'default',
}: DrawerProps) {
  // If title is just a string, we can pass it directly.
  // If it's a ReactNode (or we have a description), we inject it into the children
  // to maintain visual fidelity without breaking the Platform Drawer string-only title.
  const isStringTitle = typeof title === 'string' && !description;

  return (
    <PlatformDrawer
      open={isOpen}
      onClose={onClose}
      title={isStringTitle ? (title as string) : undefined}
      width={SIZE_MAP[size]}
      side="right"
      footer={footer}
    >
      {!isStringTitle && (title || description) && (
        <div className="mb-6 border-b border-border pb-4">
          {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      )}
      {children}
    </PlatformDrawer>
  );
}

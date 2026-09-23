'use client';

import * as React from 'react';
import { DropdownMenu as PlatformDropdownMenu } from '@skyra/ui';
import type { DropdownMenuProps, DropdownMenuItemConfig } from '@skyra/ui';

// Dummy wrapper for backward compatibility with QR consumers that manually build DropdownMenu items
// Platform's DropdownMenu expects an `items` config array instead of children.
export function DropdownMenu({ children, items, ...props }: any) {
  if (items) {
    return <PlatformDropdownMenu items={items} {...props} />;
  }
  // Fallback: Just render the children in a div if consumers are passing children manually.
  // Note: True migration requires replacing `<DropdownMenuItem>` usage with the `items` array config.
  return <div className="dropdown-fallback">{children}</div>;
}

export function DropdownMenuTrigger({ children, asChild }: any) {
  return <>{children}</>;
}

export function DropdownMenuContent({ children }: any) {
  return <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">{children}</div>;
}

export function DropdownMenuItem({ children, onClick, className }: any) {
  return (
    <button onClick={onClick} className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${className}`}>
      {children}
    </button>
  );
}

export function DropdownMenuLabel({ children }: any) {
  return <div className="px-2 py-1.5 text-sm font-semibold">{children}</div>;
}

export function DropdownMenuSeparator() {
  return <div className="-mx-1 my-1 h-px bg-muted" />;
}

export type { DropdownMenuProps, DropdownMenuItemConfig };

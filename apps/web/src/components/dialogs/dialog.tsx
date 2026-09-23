'use client';

import * as React from 'react';
import { Modal as PlatformModal } from '@skyra/dialogs';
import type { ModalProps as PlatformModalProps } from '@skyra/dialogs';

export interface DialogProps extends Omit<PlatformModalProps, 'open'> {
  isOpen?: boolean;
}

/**
 * @platform-shim — migrated to @skyra/dialogs
 *
 * SkyraQR dialogs/dialog → @skyra/dialogs Modal
 * Maps QR's isOpen to Platform's open.
 */
export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ isOpen, ...props }, ref) => {
    return (
      <PlatformModal
        open={isOpen ?? false}
        {...props}
      />
    );
  }
);
Dialog.displayName = 'Dialog';

export { PlatformModal as Modal };
export type { PlatformModalProps as ModalProps };

// Dummy wrappers for backward compatibility in ui-preview
export function DialogHeader({ children }: any) { return <div className="mb-4">{children}</div>; }
export function DialogTitle({ children }: any) { return <h3 className="text-lg font-semibold">{children}</h3>; }
export function DialogDescription({ children }: any) { return <p className="text-sm text-muted-foreground">{children}</p>; }
export function DialogFooter({ children }: any) { return <div className="mt-6 flex justify-end gap-2">{children}</div>; }

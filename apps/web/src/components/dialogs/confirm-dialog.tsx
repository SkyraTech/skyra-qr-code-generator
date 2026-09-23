'use client';
import * as React from 'react';
import { ConfirmDialog as PlatformConfirmDialog } from '@skyra/dialogs';
import type { ConfirmDialogProps as PlatformConfirmDialogProps } from '@skyra/dialogs';

export interface ConfirmDialogProps extends Omit<PlatformConfirmDialogProps, 'open' | 'onCancel' | 'message'> {
  isOpen: boolean;
  onClose: () => void;
  description?: React.ReactNode;
}

/**
 * @platform-shim — migrated to @skyra/dialogs
 *
 * SkyraQR dialogs/confirm-dialog → @skyra/dialogs ConfirmDialog
 * Maps QR's isOpen/onClose/description to Platform's open/onCancel/message.
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  description,
  ...props
}: ConfirmDialogProps) {
  return (
    <PlatformConfirmDialog
      open={isOpen}
      onCancel={onClose}
      message={description}
      {...props}
    />
  );
}

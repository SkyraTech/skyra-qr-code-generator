'use client';

import * as React from 'react';
import { ConfirmDialog } from './confirm-dialog';

export interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  itemName?: string;
  itemType?: string;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'item',
  isLoading = false,
}: DeleteConfirmDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete ${itemType}?`}
      description={
        <span>
          Are you sure you want to permanently delete{' '}
          {itemName ? (
            <strong className="font-semibold text-foreground">&ldquo;{itemName}&rdquo;</strong>
          ) : (
            `this ${itemType}`
          )}
          ? This action is destructive and cannot be undone.
        </span>
      }
      confirmLabel="Delete Permanently"
      cancelLabel="Keep It"
      isDestructive={true}
      isLoading={isLoading}
    />
  );
}

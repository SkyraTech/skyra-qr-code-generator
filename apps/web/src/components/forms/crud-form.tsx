'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/feedback/alert';
import { cn } from '@/lib/utils';

export type FormMode = 'create' | 'edit' | 'read-only';

export interface CrudFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  mode: FormMode;
  entityName: string;
  isSubmitting?: boolean;
  serverError?: string | null;
  onCancel?: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  showReset?: boolean;
  onReset?: () => void;
  children: React.ReactNode;
}

export function CrudForm({
  mode,
  entityName,
  isSubmitting = false,
  serverError,
  onCancel,
  onSubmit,
  submitLabel,
  cancelLabel = 'Cancel',
  showReset = false,
  onReset,
  children,
  className,
  ...props
}: CrudFormProps) {
  const isReadOnly = mode === 'read-only';

  const defaultSubmitLabel =
    mode === 'create' ? `Create ${entityName}` : `Save Changes`;

  return (
    <form
      onSubmit={onSubmit}
      className={cn('space-y-6', className)}
      noValidate
      {...props}
    >
      {/* Server Error Banner */}
      {serverError && (
        <Alert variant="destructive" title="Submission Error">
          {serverError}
        </Alert>
      )}

      {/* Form Fields Content */}
      <div className={cn('space-y-4', isReadOnly && 'pointer-events-none opacity-80')}>
        {children}
      </div>

      {/* Form Action Controls */}
      {!isReadOnly && (
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border">
          {showReset && onReset && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          )}

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
          )}

          <Button
            type="submit"
            variant="default"
            size="sm"
            isLoading={isSubmitting}
          >
            {submitLabel || defaultSubmitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}

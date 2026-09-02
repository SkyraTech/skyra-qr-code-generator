import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string | null;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  description,
  error,
  required = false,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5 text-left', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-semibold text-foreground tracking-wide select-none"
        >
          {label}
          {required && (
            <span className="text-destructive ml-1" title="Required field">
              *
            </span>
          )}
        </label>
      )}

      {children}

      {description && !error && (
        <p className="text-[11px] text-muted-foreground leading-normal">
          {description}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="flex items-center gap-1 text-xs text-destructive font-medium animate-in fade-in-50"
        >
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export function FormLabel({
  children,
  required,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'block text-xs font-semibold text-foreground tracking-wide select-none',
        className
      )}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}

export function FormDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-[11px] text-muted-foreground leading-normal',
        className
      )}
    >
      {children}
    </p>
  );
}

export function FormMessage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className={cn(
        'flex items-center gap-1 text-xs text-destructive font-medium animate-in fade-in-50',
        className
      )}
    >
      <AlertCircle className="h-3 w-3 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

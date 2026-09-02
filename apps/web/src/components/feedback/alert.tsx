import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'destructive';
  title?: React.ReactNode;
  icon?: React.ReactNode;
}

export function Alert({
  variant = 'default',
  title,
  icon,
  children,
  className,
  ...props
}: AlertProps) {
  const defaultIcons = {
    default: <Info className="h-4 w-4 text-slate-500" />,
    info: <Info className="h-4 w-4 text-info" />,
    success: <CheckCircle2 className="h-4 w-4 text-success" />,
    warning: <AlertTriangle className="h-4 w-4 text-warning" />,
    destructive: <AlertCircle className="h-4 w-4 text-destructive" />,
  };

  const variantStyles = {
    default: 'bg-muted/60 text-foreground border-border',
    info: 'bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-900/50',
    success:
      'bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900/50',
    warning:
      'bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-900/50',
    destructive:
      'bg-red-50/60 dark:bg-red-950/30 text-red-900 dark:text-red-200 border-red-200 dark:border-red-900/50',
  };

  return (
    <div
      role="alert"
      className={cn(
        'relative flex w-full gap-3 rounded-lg border p-4 text-sm',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="mt-0.5 flex-shrink-0">
        {icon || defaultIcons[variant]}
      </div>
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-semibold leading-tight">{title}</h5>}
        {children && (
          <div className="text-xs opacity-90 leading-relaxed">{children}</div>
        )}
      </div>
    </div>
  );
}

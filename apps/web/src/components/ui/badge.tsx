import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'success'
    | 'warning'
    | 'info';
  size?: 'default' | 'sm';
}

function Badge({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: BadgeProps) {
  const variantStyles: Record<string, string> = {
    default:
      'border-transparent bg-primary/10 text-primary border border-primary/20',
    secondary:
      'border-transparent bg-secondary text-secondary-foreground',
    destructive:
      'border-transparent bg-destructive/10 text-destructive border border-destructive/20',
    outline: 'text-foreground border border-border',
    success:
      'border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    warning:
      'border-transparent bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
    info:
      'border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  };

  const sizeStyles: Record<string, string> = {
    default: 'px-2.5 py-0.5 text-xs',
    sm: 'px-1.5 py-0.2 text-[10px]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}

export { Badge };

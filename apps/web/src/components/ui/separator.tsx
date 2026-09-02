import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: React.ReactNode;
}

export function Separator({
  orientation = 'horizontal',
  label,
  className,
  ...props
}: SeparatorProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('h-full w-[1px] bg-border', className)}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div className={cn('relative flex items-center my-4', className)} {...props}>
        <div className="flex-grow border-t border-border"></div>
        <span className="flex-shrink mx-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </span>
        <div className="flex-grow border-t border-border"></div>
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('h-[1px] w-full bg-border my-4', className)}
      {...props}
    />
  );
}

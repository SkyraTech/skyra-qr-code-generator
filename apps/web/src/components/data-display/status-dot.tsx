import * as React from 'react';
import { cn } from '@/lib/utils';

export interface StatusDotProps {
  status: 'online' | 'offline' | 'warning' | 'busy' | 'healthy';
  label?: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

export function StatusDot({
  status,
  label,
  pulse = false,
  className,
}: StatusDotProps) {
  const statusColors = {
    online: 'bg-emerald-500',
    healthy: 'bg-emerald-500',
    offline: 'bg-slate-400',
    warning: 'bg-amber-500',
    busy: 'bg-destructive',
  };

  return (
    <div className={cn('inline-flex items-center gap-2 text-xs', className)}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              statusColors[status]
            )}
          />
        )}
        <span
          className={cn('relative inline-flex h-2 w-2 rounded-full', statusColors[status])}
        />
      </span>
      {label && <span className="font-medium text-foreground">{label}</span>}
    </div>
  );
}

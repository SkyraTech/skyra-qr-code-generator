import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function LoadingState({
  message = 'Loading data...',
  className,
  size = 'default',
}: LoadingStateProps) {
  const iconSizes = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'flex min-h-[200px] flex-col items-center justify-center p-8 text-center',
        className
      )}
    >
      <Loader2
        className={cn('animate-spin text-primary mb-3', iconSizes[size])}
      />
      {message && (
        <p className="text-xs text-muted-foreground font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

import { Card, Skeleton } from '@skyra/ui';
import * as React from 'react';


import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  change?: number; // e.g. +12.5 or -4.2 percent
  changeLabel?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  change,
  changeLabel = 'vs last period',
  icon,
  isLoading = false,
  className,
}: StatsCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  return (
    <Card className={cn('p-5 flex flex-col justify-between', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        {isLoading ? (
          <Skeleton className="h-8 w-24 rounded my-1" />
        ) : (
          <div className="text-2xl font-extrabold tracking-tight text-foreground font-mono-data">
            {value}
          </div>
        )}

        {(change !== undefined || subtitle) && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            {change !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded',
                  isPositive &&
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                  isNegative &&
                    'bg-destructive/10 text-destructive',
                  isNeutral && 'bg-muted text-muted-foreground'
                )}
              >
                {isPositive && <TrendingUp className="h-3 w-3" />}
                {isNegative && <TrendingDown className="h-3 w-3" />}
                {isNeutral && <Minus className="h-3 w-3" />}
                <span>
                  {isPositive ? `+${change}%` : `${change}%`}
                </span>
              </span>
            )}
            <span className="text-muted-foreground text-[11px]">
              {subtitle || changeLabel}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

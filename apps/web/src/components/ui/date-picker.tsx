import * as React from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
          <Calendar className="h-4 w-4" />
        </div>
        <input
          type="date"
          className={cn(
            'flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error &&
              'border-destructive focus-visible:ring-destructive text-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
DatePicker.displayName = 'DatePicker';

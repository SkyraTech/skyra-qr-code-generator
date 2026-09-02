'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X, ChevronDown, Check } from 'lucide-react';
import { Badge } from './badge';

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected = [],
  onChange,
  placeholder = 'Select options...',
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((item) => item !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const removeOption = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== val));
  };

  const selectedLabels = options.filter((opt) => selected.includes(opt.value));

  return (
    <div className={cn('relative w-full text-left', className)} ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[40px] w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background p-1.5 text-xs transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-ring"
      >
        {selectedLabels.length === 0 ? (
          <span className="px-2 text-muted-foreground">{placeholder}</span>
        ) : (
          selectedLabels.map((item) => (
            <Badge
              key={item.value}
              variant="secondary"
              className="inline-flex items-center gap-1 py-0.5"
            >
              <span>{item.label}</span>
              <button
                type="button"
                onClick={(e) => removeOption(item.value, e)}
                className="hover:text-destructive focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
        <ChevronDown className="ml-auto mr-1.5 h-4 w-4 text-muted-foreground opacity-60" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95">
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className={cn(
                  'flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors hover:bg-muted select-none',
                  isSelected && 'bg-primary/10 text-primary font-semibold'
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

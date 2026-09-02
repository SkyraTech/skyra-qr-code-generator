import * as React from 'react';
import { ColumnDef, SortState } from '@/types/table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DataTableColumnHeaderProps<TData> {
  column: ColumnDef<TData>;
  title: React.ReactNode;
  sorting?: SortState | null;
  onSortingChange?: (sorting: SortState | null) => void;
  className?: string;
}

export function DataTableColumnHeader<TData>({
  column,
  title,
  sorting,
  onSortingChange,
  className,
}: DataTableColumnHeaderProps<TData>) {
  if (!column.enableSorting || !onSortingChange) {
    return <div className={cn('text-xs font-semibold text-muted-foreground uppercase tracking-wider', className)}>{title}</div>;
  }

  const isSorted = sorting?.columnId === column.id;
  const isAsc = isSorted && sorting?.direction === 'asc';
  const isDesc = isSorted && sorting?.direction === 'desc';

  const toggleSort = () => {
    if (!isSorted) {
      onSortingChange({ columnId: column.id, direction: 'asc' });
    } else if (isAsc) {
      onSortingChange({ columnId: column.id, direction: 'desc' });
    } else {
      onSortingChange(null);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleSort}
      className={cn(
        'group inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors select-none focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 -ml-1',
        isSorted && 'text-foreground font-bold',
        className
      )}
    >
      <span>{title}</span>
      {isAsc && <ArrowUp className="h-3.5 w-3.5 text-primary stroke-[2.5]" />}
      {isDesc && <ArrowDown className="h-3.5 w-3.5 text-primary stroke-[2.5]" />}
      {!isSorted && (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}

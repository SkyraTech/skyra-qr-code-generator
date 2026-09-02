import * as React from 'react';
import { PaginationState } from '@/types/table';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export interface DataTablePaginationProps {
  pagination: PaginationState;
  totalCount: number;
  onPaginationChange: (pagination: PaginationState) => void;
  pageSizeOptions?: number[];
  selectedCount?: number;
}

export function DataTablePagination({
  pagination,
  totalCount,
  onPaginationChange,
  pageSizeOptions = [10, 25, 50, 100],
  selectedCount = 0,
}: DataTablePaginationProps) {
  const { pageIndex, pageSize } = pagination;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const startRecord = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const endRecord = Math.min((pageIndex + 1) * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 border-t border-border text-xs text-muted-foreground">
      {/* Selection & Count Status */}
      <div className="flex items-center gap-2">
        {selectedCount > 0 ? (
          <span className="font-medium text-foreground">
            {selectedCount} of {totalCount} row(s) selected
          </span>
        ) : (
          <span>
            Showing <strong className="text-foreground">{startRecord}</strong> to{' '}
            <strong className="text-foreground">{endRecord}</strong> of{' '}
            <strong className="text-foreground">{totalCount}</strong> results
          </span>
        )}
      </div>

      {/* Page Size & Navigation */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPaginationChange({
                pageIndex: 0,
                pageSize: Number(e.target.value),
              });
            }}
            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 font-medium">
          Page {pageIndex + 1} of {pageCount}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPaginationChange({ ...pagination, pageIndex: 0 })}
            disabled={!canPreviousPage}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              onPaginationChange({ ...pagination, pageIndex: pageIndex - 1 })
            }
            disabled={!canPreviousPage}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              onPaginationChange({ ...pagination, pageIndex: pageIndex + 1 })
            }
            disabled={!canNextPage}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              onPaginationChange({ ...pagination, pageIndex: pageCount - 1 })
            }
            disabled={!canNextPage}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

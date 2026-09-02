'use client';

import * as React from 'react';
import { ColumnDef, DataTableProps } from '@/types/table';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTablePagination } from './data-table-pagination';
import { DataTableColumnHeader } from './data-table-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export function DataTable<TData>({
  columns,
  data,
  keyField = 'id' as keyof TData,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load table records',
  onRetry,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  pagination,
  totalCount = data.length,
  onPaginationChange,
  sorting,
  onSortingChange,
  selectedRows,
  onSelectionChange,
  bulkActions,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items to display right now.',
  emptyActionLabel,
  onEmptyAction,
  onRowClick,
}: DataTableProps<TData>) {
  // Row selection helpers
  const isSelectable = !!onSelectionChange;
  const allIds = data.map((row) => String(row[keyField]));
  const isAllSelected =
    data.length > 0 && allIds.every((id) => selectedRows?.has(id));

  const toggleSelectAll = () => {
    if (!onSelectionChange) return;
    const next = new Set(selectedRows);
    if (isAllSelected) {
      allIds.forEach((id) => next.delete(id));
    } else {
      allIds.forEach((id) => next.add(id));
    }
    onSelectionChange(next);
  };

  const toggleSelectRow = (id: string) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedRows);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  // Render cell helper
  const renderCell = (row: TData, column: ColumnDef<TData>) => {
    const rowRecord = row as Record<string, unknown>;
    if (column.cell) {
      const value = column.accessorKey
        ? rowRecord[column.accessorKey as string]
        : column.accessorFn
        ? column.accessorFn(row)
        : undefined;
      return column.cell({ row, value });
    }
    if (column.accessorKey) {
      return String(rowRecord[column.accessorKey as string] ?? '');
    }
    if (column.accessorFn) {
      return String(column.accessorFn(row) ?? '');
    }
    return null;
  };

  return (
    <div className="w-full space-y-2">
      {/* Search & Bulk Toolbar */}
      {(onSearchChange || bulkActions) && (
        <DataTableToolbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          bulkActions={
            bulkActions && selectedRows && selectedRows.size > 0
              ? bulkActions(Array.from(selectedRows))
              : undefined
          }
        />
      )}

      {/* Main Table Container */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            {/* Header */}
            <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground select-none">
              <tr>
                {isSelectable && (
                  <th className="w-10 px-4 py-3 text-center">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.id}
                    style={{ width: col.width }}
                    className="px-4 py-3 font-semibold"
                  >
                    {typeof col.header === 'function' ? (
                      col.header({ column: col })
                    ) : (
                      <DataTableColumnHeader
                        column={col}
                        title={col.header}
                        sorting={sorting}
                        onSortingChange={onSortingChange}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-border">
              {isLoading ? (
                // Loading Skeleton Rows
                Array.from({ length: pagination?.pageSize || 5 }).map(
                  (_, rIdx) => (
                    <tr key={`loading-row-${rIdx}`} className="h-14">
                      {isSelectable && (
                        <td className="px-4 py-3 text-center">
                          <Skeleton className="h-4 w-4 rounded mx-auto" />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={`loading-col-${col.id}`} className="px-4 py-3">
                          <Skeleton className="h-4 w-3/4 rounded" />
                        </td>
                      ))}
                    </tr>
                  )
                )
              ) : isError ? (
                // Error State Row
                <tr>
                  <td
                    colSpan={columns.length + (isSelectable ? 1 : 0)}
                    className="p-8 text-center"
                  >
                    <ErrorState message={errorMessage} onRetry={onRetry} />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                // Empty State Row
                <tr>
                  <td
                    colSpan={columns.length + (isSelectable ? 1 : 0)}
                    className="p-8 text-center"
                  >
                    <EmptyState
                      title={emptyTitle}
                      description={emptyDescription}
                      actionLabel={emptyActionLabel}
                      onAction={onEmptyAction}
                    />
                  </td>
                </tr>
              ) : (
                // Render Actual Rows
                data.map((row, index) => {
                  const rowId = String(row[keyField] ?? index);
                  const isSelected = selectedRows?.has(rowId);

                  return (
                    <tr
                      key={rowId}
                      onClick={() => onRowClick?.(row)}
                      className={cn(
                        'transition-colors hover:bg-muted/40',
                        isSelected && 'bg-primary/5 hover:bg-primary/10',
                        onRowClick && 'cursor-pointer'
                      )}
                    >
                      {isSelectable && (
                        <td
                          className="px-4 py-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectRow(rowId)}
                            aria-label={`Select row ${rowId}`}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.id}
                          className="px-4 py-3.5 text-foreground text-xs leading-relaxed"
                        >
                          {renderCell(row, col)}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && onPaginationChange && !isLoading && !isError && data.length > 0 && (
          <DataTablePagination
            pagination={pagination}
            totalCount={totalCount}
            onPaginationChange={onPaginationChange}
            selectedCount={selectedRows?.size || 0}
          />
        )}
      </div>
    </div>
  );
}

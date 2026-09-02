import React from 'react';

export interface ColumnDef<TData> {
  id: string;
  header: React.ReactNode | ((props: { column: ColumnDef<TData> }) => React.ReactNode);
  accessorKey?: keyof TData;
  accessorFn?: (row: TData) => unknown;
  cell?: (props: { row: TData; value: unknown }) => React.ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
  width?: string | number;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  columnId: string;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  pageIndex: number; // 0-based
  pageSize: number;
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  keyField?: keyof TData;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  // Search & Filter
  searchableColumn?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  // Pagination
  pagination?: PaginationState;
  totalCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  // Sorting
  sorting?: SortState | null;
  onSortingChange?: (sorting: SortState | null) => void;
  // Selection
  selectedRows?: Set<string | number>;
  onSelectionChange?: (selectedIds: Set<string | number>) => void;
  // Bulk actions slot
  bulkActions?: (selectedIds: (string | number)[]) => React.ReactNode;
  // Empty State override
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  // Row Click
  onRowClick?: (row: TData) => void;
}

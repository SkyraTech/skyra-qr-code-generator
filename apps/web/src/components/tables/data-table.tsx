'use client';

import * as React from 'react';
import { DynamicDataTable } from '@skyra/data-table';
import type { Column } from '@skyra/data-table';

// Minimal type definition to accept existing QR TanStack ColumnDefs
export type ColumnDef<TData, TValue = unknown> = {
  id?: string;
  accessorKey?: string | keyof TData;
  header?: string | React.ReactNode | ((props: any) => React.ReactNode);
  cell?: (props: { row: TData; value: unknown }) => React.ReactNode;
  enableSorting?: boolean;
};

export interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
  className?: string;
}

/**
 * @platform-shim — migrated to @skyra/data-table
 *
 * SkyraQR tables/data-table → @skyra/data-table DynamicDataTable
 *
 * Translates TanStack Table ColumnDefs (used by QR consumers)
 * into the simplified schema format expected by Platform's DynamicDataTable.
 */
export function DataTable<TData extends Record<string, any>, TValue = unknown>({
  columns,
  data,
  searchKey,
  placeholder,
  searchPlaceholder,
  isLoading,
  onRowClick,
  className,
}: DataTableProps<TData, TValue>) {
  
  // Platform requires data to have an `id` field for React keys.
  // We inject a fallback id if one doesn't exist.
  const platformData = React.useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      id: item.id || `row-${index}`,
    }));
  }, [data]);

  // Translate QR TanStack ColumnDefs to Platform DynamicDataTable schema
  const platformColumns = React.useMemo(() => {
    return columns.map((col): Column<any> => {
      const key = (col.accessorKey as string) || col.id || 'unknown';
      
      let title = key;
      if (typeof col.header === 'string') {
        title = col.header;
      }

      return {
        key,
        header: title.charAt(0).toUpperCase() + title.slice(1),
        sortable: col.enableSorting ?? false,
        accessor: col.cell
          ? (item: any) => {
              // Pass the exact signature the QR consumers expect
              return col.cell!({
                row: item,
                value: item[key],
              });
            }
          : key,
      };
    });
  }, [columns]);

  return (
    <DynamicDataTable
      data={platformData}
      columns={platformColumns}
      isLoading={isLoading}
      searchPlaceholder={searchPlaceholder || placeholder}
      onAction={undefined}
    />
  );
}

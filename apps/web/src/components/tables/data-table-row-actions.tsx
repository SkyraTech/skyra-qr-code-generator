import * as React from 'react';
import { DropdownMenu, DropdownMenuItemConfig } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit2, Trash2 } from 'lucide-react';

export interface DataTableRowActionsProps<TData> {
  row: TData;
  onView?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  customActions?: DropdownMenuItemConfig[];
}

export function DataTableRowActions<TData>({
  row,
  onView,
  onEdit,
  onDelete,
  customActions = [],
}: DataTableRowActionsProps<TData>) {
  const items: (DropdownMenuItemConfig | 'separator')[] = [];

  if (onView) {
    items.push({
      label: 'View details',
      icon: <Eye className="h-3.5 w-3.5" />,
      onClick: () => onView(row),
    });
  }

  if (onEdit) {
    items.push({
      label: 'Edit record',
      icon: <Edit2 className="h-3.5 w-3.5" />,
      onClick: () => onEdit(row),
    });
  }

  if (customActions.length > 0) {
    if (items.length > 0) items.push('separator');
    items.push(...customActions);
  }

  if (onDelete) {
    if (items.length > 0) items.push('separator');
    items.push({
      label: 'Delete',
      icon: <Trash2 className="h-3.5 w-3.5 text-destructive" />,
      destructive: true,
      onClick: () => onDelete(row),
    });
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Row actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        }
        items={items}
      />
    </div>
  );
}

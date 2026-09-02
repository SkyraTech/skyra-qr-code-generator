'use client';

import React from 'react';
import { useToast, ToastItem, ToastVariant } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  default: <Info className="h-4 w-4 text-slate-500" />,
  info: <Info className="h-4 w-4 text-info" />,
  success: <CheckCircle2 className="h-4 w-4 text-success" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning" />,
  destructive: <AlertCircle className="h-4 w-4 text-destructive" />,
};

const variantStyles: Record<ToastVariant, string> = {
  default: 'border-border bg-card text-card-foreground',
  info: 'border-blue-200 dark:border-blue-900 bg-blue-50/90 dark:bg-blue-950/90 text-blue-900 dark:text-blue-100',
  success: 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/90 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100',
  warning: 'border-amber-200 dark:border-amber-900 bg-amber-50/90 dark:bg-amber-950/90 text-amber-900 dark:text-amber-100',
  destructive: 'border-red-200 dark:border-red-900 bg-red-50/90 dark:bg-red-950/90 text-red-900 dark:text-red-100',
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex max-h-screen w-full flex-col-reverse gap-2 sm:max-w-[420px]"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const variant = toast.variant || 'default';

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg transition-all',
        variantStyles[variant]
      )}
    >
      <div className="mt-0.5 flex-shrink-0">{variantIcons[variant]}</div>
      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-semibold leading-none">{toast.title}</h4>
        {toast.description && (
          <p className="text-xs opacity-90 leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

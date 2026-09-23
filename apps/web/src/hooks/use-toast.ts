'use client';
import { toast as platformToast, useToast as platformUseToast } from '@skyra/ui';
/**
 * @platform-shim — migrated to @skyra/ui
 *
 * SkyraQR hooks/use-toast → @skyra/ui Toast
 *
 * This shim maps QR's toast API (variant, description)
 * to Platform's API (type, message).
 */
import type { ToastOptions as PlatformToastOptions } from '@skyra/ui';

export type ToastVariant = 'default' | 'success' | 'destructive' | 'warning' | 'info';

export interface ToastItem {
  id?: string;
  title: string;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

const VARIANT_MAP: Record<ToastVariant, PlatformToastOptions['type']> = {
  default: 'neutral',
  success: 'success',
  destructive: 'error',
  warning: 'warning',
  info: 'info',
};

/**
 * Adapter function that maps QR toast props to Platform toast props
 */
export function toast(options: ToastItem) {
  return platformToast({
    id: options.id,
    title: options.title,
    message: options.description,
    type: options.variant ? VARIANT_MAP[options.variant] : 'neutral',
    duration: options.duration,
  });
}

/**
 * Adapter hook that maps QR toast API to Platform toast API
 */
export function useToast() {
  const { toasts, dismiss, dismissAll } = platformUseToast();
  
  // Map Platform ToastData back to QR ToastItem format for consumers reading state
  const mappedToasts = toasts.map((t) => ({
    id: t.id,
    title: t.title as string,
    description: t.message,
    variant: t.type === 'error' ? 'destructive' : t.type === 'neutral' ? 'default' : t.type as ToastVariant,
  }));

  return {
    toasts: mappedToasts,
    toast,
    dismiss,
    dismissAll,
  };
}

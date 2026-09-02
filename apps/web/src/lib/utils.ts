import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines conditional class names and resolves Tailwind CSS precedence conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates an accessible identifier for forms and ARIA fields.
 */
export function generateId(prefix = 'skyra'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Requires the authenticated user to possess ALL specified permissions
 * within their current authoritative workspace context.
 * 
 * AND semantics are used: if multiple permissions are specified,
 * the user must have every single one.
 * 
 * @param permissions List of permission identifiers (e.g., 'qr:create', 'qr:update')
 */
export const RequirePermission = (...permissions: string[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);

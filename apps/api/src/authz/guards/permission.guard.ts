import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { PERMISSIONS_KEY } from '../decorators/require-permission.decorator';
import { AuthorizationService } from '../authorization.service';
import { AuthorizationContext } from '../types/authorization-context';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no specific permissions are required, allow the request to proceed.
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    
    // Ensure the request has passed through SupabaseAuthGuard
    const user = request['user'];
    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // Ensure the request has passed through WorkspaceContextGuard
    const workspaceContext = request['workspace'] as AuthorizationContext | undefined;
    if (!workspaceContext) {
      throw new ForbiddenException(
        'Workspace context is required but missing. Did you forget WorkspaceContextGuard?',
      );
    }

    // Validate that the user's role grants them the required permissions in this specific workspace
    const hasPermission = await this.authorizationService.hasPermissions(
      workspaceContext.workspaceId,
      workspaceContext.role,
      requiredPermissions,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'Insufficient permissions in the current workspace',
      );
    }

    return true;
  }
}

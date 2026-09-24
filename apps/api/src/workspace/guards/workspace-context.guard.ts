import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { WorkspaceService } from '../workspace.service';

@Injectable()
export class WorkspaceContextGuard implements CanActivate {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    // Ensure authenticated user identity exists on the request
    const user = request['user'];
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'Authentication required before establishing workspace context',
      );
    }

    // Extract requested workspace ID from header (X-Workspace-Id or x-workspace-id)
    const rawWorkspaceHeader =
      request.headers['x-workspace-id'] || request.headers['X-Workspace-Id'];

    const requestedWorkspaceId =
      typeof rawWorkspaceHeader === 'string' &&
      rawWorkspaceHeader.trim().length > 0
        ? rawWorkspaceHeader.trim()
        : undefined;

    // Resolve authoritative workspace context
    const workspaceContext =
      await this.workspaceService.resolveWorkspaceContext(
        user.id,
        requestedWorkspaceId,
      );

    // Attach verified workspace context to the request
    request['workspace'] = workspaceContext;

    return true;
  }
}

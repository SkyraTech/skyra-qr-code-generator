import {
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { WorkspaceContext, WorkspaceSummary } from './types/workspace-context';

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);

  constructor(private readonly database: DatabaseService) {}

  /**
   * Retrieves all active workspaces that the authenticated user belongs to.
   */
  async getUserWorkspaces(userId: string): Promise<WorkspaceSummary[]> {
    const memberships = await this.database.workspaceMember.findMany({
      where: {
        userId,
        workspace: {
          deletedAt: null,
          status: 'ACTIVE',
        },
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
            tier: true,
            status: true,
            whiteLabelLogo: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    return memberships.map((membership) => ({
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      tier: membership.workspace.tier,
      status: membership.workspace.status,
      whiteLabelLogo: membership.workspace.whiteLabelLogo,
      role: membership.role,
      joinedAt: membership.joinedAt,
      createdAt: membership.workspace.createdAt,
    }));
  }

  /**
   * Resolves authoritative workspace context for an authenticated user.
   * If requestedWorkspaceId is provided, verifies that the user is an active member.
   * If not provided, falls back to the user's default/first active workspace membership.
   */
  async resolveWorkspaceContext(
    userId: string,
    requestedWorkspaceId?: string,
  ): Promise<WorkspaceContext> {
    if (requestedWorkspaceId) {
      const membership = await this.database.workspaceMember.findFirst({
        where: {
          userId,
          workspaceId: requestedWorkspaceId,
          workspace: {
            deletedAt: null,
            status: 'ACTIVE',
          },
        },
        include: {
          workspace: true,
        },
      });

      if (!membership) {
        this.logger.warn(
          `Tenant access denied: User ${userId} requested unauthorized or inactive workspace ${requestedWorkspaceId}`,
        );
        throw new ForbiddenException(
          'Access to the requested workspace is denied or workspace is inactive',
        );
      }

      return {
        workspaceId: membership.workspaceId,
        userId: membership.userId,
        membershipId: membership.id,
        role: membership.role,
        workspaceName: membership.workspace.name,
        workspaceSlug: membership.workspace.slug,
        workspaceTier: membership.workspace.tier,
      };
    }

    // Default active workspace resolution
    const defaultMembership = await this.database.workspaceMember.findFirst({
      where: {
        userId,
        workspace: {
          deletedAt: null,
          status: 'ACTIVE',
        },
      },
      include: {
        workspace: true,
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    if (!defaultMembership) {
      this.logger.warn(
        `Workspace context resolution failed: User ${userId} has no active workspace memberships`,
      );
      throw new ForbiddenException(
        'User does not belong to any active workspace',
      );
    }

    return {
      workspaceId: defaultMembership.workspaceId,
      userId: defaultMembership.userId,
      membershipId: defaultMembership.id,
      role: defaultMembership.role,
      workspaceName: defaultMembership.workspace.name,
      workspaceSlug: defaultMembership.workspace.slug,
      workspaceTier: defaultMembership.workspace.tier,
    };
  }

  /**
   * Utility to verify workspace resource ownership for tenant isolation.
   */
  async verifyWorkspaceAccess(
    workspaceId: string,
    userId: string,
  ): Promise<boolean> {
    const membership = await this.database.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        workspace: {
          deletedAt: null,
          status: 'ACTIVE',
        },
      },
    });

    return !!membership;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthorizationService {
  private readonly logger = new Logger(AuthorizationService.name);

  constructor(private readonly database: DatabaseService) {}

  /**
   * Verifies if a role in a specific workspace possesses ALL the requested permissions.
   * Uses AND semantics.
   *
   * @param workspaceId The ID of the current active workspace.
   * @param roleName The name of the role (e.g. 'ADMIN', 'EDITOR') from the user's workspace membership.
   * @param requiredPermissions The permissions required to authorize the request.
   * @returns boolean indicating if the user has all required permissions.
   */
  async hasPermissions(
    workspaceId: string,
    roleName: string,
    requiredPermissions: string[],
  ): Promise<boolean> {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No specific permissions requested, allow by default
    }

    // Attempt to lookup the role strictly within the bounds of the provided workspace.
    // Tenant isolation: A role in Workspace A cannot authorize access in Workspace B.
    const role = await this.database.role.findFirst({
      where: {
        workspaceId,
        name: roleName,
      },
      include: {
        permissions: {
          select: {
            permissionId: true,
          },
        },
      },
    });

    if (!role) {
      this.logger.warn(
        `Authorization failed: Role '${roleName}' not found in workspace '${workspaceId}'. Access denied.`,
      );
      return false;
    }

    const assignedPermissions = new Set(
      role.permissions.map((rp) => rp.permissionId),
    );

    // AND Semantics: User must possess EVERY required permission
    for (const reqPerm of requiredPermissions) {
      if (!assignedPermissions.has(reqPerm)) {
        this.logger.warn(
          `Authorization failed: Role '${roleName}' lacks required permission '${reqPerm}' in workspace '${workspaceId}'.`,
        );
        return false;
      }
    }

    return true;
  }
}

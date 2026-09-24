import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { WorkspaceService } from './workspace.service';
import { WorkspaceContextGuard } from './guards/workspace-context.guard';
import { CurrentWorkspace } from './decorators/current-workspace.decorator';
import { WorkspaceContext, WorkspaceSummary } from './types/workspace-context';

@Controller('workspaces')
@UseGuards(SupabaseAuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  /**
   * Retrieves all workspaces the authenticated user belongs to.
   * GET /api/v1/workspaces
   */
  @Get()
  async getWorkspaces(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WorkspaceSummary[]> {
    return this.workspaceService.getUserWorkspaces(user.id);
  }

  /**
   * Resolves and returns the active workspace context for the current request.
   * GET /api/v1/workspaces/current
   */
  @Get('current')
  @UseGuards(WorkspaceContextGuard)
  getCurrentWorkspace(
    @CurrentWorkspace() workspace: WorkspaceContext,
  ): WorkspaceContext {
    return workspace;
  }
}

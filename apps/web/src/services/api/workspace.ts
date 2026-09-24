import { apiClient } from './client';

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  tier: string;
  status: string;
  whiteLabelLogo: string | null;
  role: string;
  joinedAt: string;
  createdAt: string;
}

export interface WorkspaceContext {
  workspaceId: string;
  userId: string;
  membershipId: string;
  role: string;
  workspaceName?: string;
  workspaceSlug?: string;
  workspaceTier?: string;
}

export interface WorkspaceResponse<T> {
  data: T;
}

export const workspaceApi = {
  /**
   * Fetches all active workspaces for the currently authenticated user.
   */
  async getWorkspaces(): Promise<WorkspaceSummary[]> {
    const response = await apiClient.get<WorkspaceResponse<WorkspaceSummary[]>>('/api/v1/workspaces');
    return response.data;
  },

  /**
   * Fetches the current active workspace context (optionally passing a specific workspaceId).
   */
  async getCurrentWorkspace(workspaceId?: string): Promise<WorkspaceContext> {
    const headers: Record<string, string> = {};
    if (workspaceId) {
      headers['X-Workspace-Id'] = workspaceId;
    }
    const response = await apiClient.get<WorkspaceResponse<WorkspaceContext>>('/api/v1/workspaces/current', {
      headers,
    });
    return response.data;
  },
};

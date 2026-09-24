export interface WorkspaceContext {
  workspaceId: string;
  userId: string;
  membershipId: string;
  role: string;
  workspaceName?: string;
  workspaceSlug?: string;
  workspaceTier?: string;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  tier: string;
  status: string;
  whiteLabelLogo: string | null;
  role: string;
  joinedAt: Date;
  createdAt: Date;
}

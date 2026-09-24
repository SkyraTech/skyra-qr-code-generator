import { WorkspaceContext } from '../../workspace/types/workspace-context';

/**
 * AuthorizationContext builds upon WorkspaceContext.
 * In Phase 1E, the context requirements are identical:
 * we need the workspace ID and the user's role in that workspace.
 */
export type AuthorizationContext = WorkspaceContext;

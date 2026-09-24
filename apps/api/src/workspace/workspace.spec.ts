import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceContextGuard } from './guards/workspace-context.guard';
import { DatabaseService } from '../database/database.service';

/**
 * Phase 1D Workspace Foundation Logic & Security Unit Tests
 */
async function runTests() {
  console.log('🧪 Starting Phase 1D Workspace Foundation Unit Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // Mock DatabaseService
  const mockMemberships = [
    {
      id: 'member-1-uuid',
      workspaceId: 'ws-1-uuid',
      userId: 'user-1-uuid',
      role: 'OWNER',
      joinedAt: new Date('2026-01-01'),
      workspace: {
        id: 'ws-1-uuid',
        name: 'Skyra Enterprise',
        slug: 'skyra-enterprise',
        tier: 'BUSINESS',
        status: 'ACTIVE',
        whiteLabelLogo: null,
        createdAt: new Date('2026-01-01'),
        deletedAt: null,
      },
    },
    {
      id: 'member-2-uuid',
      workspaceId: 'ws-2-uuid',
      userId: 'user-1-uuid',
      role: 'EDITOR',
      joinedAt: new Date('2026-02-01'),
      workspace: {
        id: 'ws-2-uuid',
        name: 'Marketing Branch',
        slug: 'marketing-branch',
        tier: 'STARTER',
        status: 'ACTIVE',
        whiteLabelLogo: null,
        createdAt: new Date('2026-02-01'),
        deletedAt: null,
      },
    },
  ];

  const mockDb = {
    workspaceMember: {
      findMany: async ({ where }: any) => {
        return mockMemberships.filter(
          (m) =>
            m.userId === where.userId &&
            m.workspace.status === where.workspace?.status &&
            m.workspace.deletedAt === where.workspace?.deletedAt,
        );
      },
      findFirst: async ({ where }: any) => {
        return (
          mockMemberships.find((m) => {
            const userMatches = m.userId === where.userId;
            const wsMatches = where.workspaceId
              ? m.workspaceId === where.workspaceId
              : true;
            const statusMatches =
              m.workspace.status === (where.workspace?.status ?? 'ACTIVE');
            const deletedMatches =
              m.workspace.deletedAt === (where.workspace?.deletedAt ?? null);
            return (
              userMatches && wsMatches && statusMatches && deletedMatches
            );
          }) || null
        );
      },
    },
  } as unknown as DatabaseService;

  const workspaceService = new WorkspaceService(mockDb);
  const workspaceGuard = new WorkspaceContextGuard(workspaceService);

  // Test 1: Get user workspaces
  try {
    const workspaces = await workspaceService.getUserWorkspaces('user-1-uuid');
    assert(
      workspaces.length === 2 && workspaces[0].name === 'Skyra Enterprise',
      'getUserWorkspaces returns all active workspaces for user',
    );
  } catch (e) {
    assert(false, `getUserWorkspaces threw error: ${e}`);
  }

  // Test 2: Resolve workspace context with explicit valid requestedWorkspaceId
  try {
    const context = await workspaceService.resolveWorkspaceContext(
      'user-1-uuid',
      'ws-2-uuid',
    );
    assert(
      context.workspaceId === 'ws-2-uuid' &&
        context.workspaceName === 'Marketing Branch' &&
        context.role === 'EDITOR',
      'resolveWorkspaceContext resolves explicit requested workspace when membership exists',
    );
  } catch (e) {
    assert(false, `Explicit workspace resolution threw error: ${e}`);
  }

  // Test 3: Resolve workspace context with default (fallback to first active)
  try {
    const context = await workspaceService.resolveWorkspaceContext('user-1-uuid');
    assert(
      context.workspaceId === 'ws-1-uuid' &&
        context.workspaceName === 'Skyra Enterprise' &&
        context.role === 'OWNER',
      'resolveWorkspaceContext resolves default first workspace when no header is supplied',
    );
  } catch (e) {
    assert(false, `Default workspace resolution threw error: ${e}`);
  }

  // Test 4: Tenant isolation - User requesting workspace they do not belong to
  try {
    await workspaceService.resolveWorkspaceContext(
      'user-1-uuid',
      'unauthorized-ws-99',
    );
    assert(false, 'Unauthorized workspace request should throw ForbiddenException');
  } catch (e) {
    assert(
      e instanceof ForbiddenException,
      'Unauthorized workspace request correctly throws ForbiddenException (403)',
    );
  }

  // Test 5: User with no active workspace memberships
  try {
    await workspaceService.resolveWorkspaceContext('stranger-user-uuid');
    assert(false, 'User with no memberships should throw ForbiddenException');
  } catch (e) {
    assert(
      e instanceof ForbiddenException,
      'User with no memberships correctly throws ForbiddenException (403)',
    );
  }

  // Test 6: Guard verifies unauthenticated request
  try {
    const mockContextUnauth = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as any;

    await workspaceGuard.canActivate(mockContextUnauth);
    assert(false, 'Guard should reject unauthenticated request with 401');
  } catch (e) {
    assert(
      e instanceof UnauthorizedException,
      'WorkspaceContextGuard rejects unauthenticated request with UnauthorizedException (401)',
    );
  }

  // Test 7: Guard verifies authenticated request and attaches workspace context
  try {
    const mockRequest: any = {
      user: { id: 'user-1-uuid', email: 'test@skyra.tech' },
      headers: { 'x-workspace-id': 'ws-2-uuid' },
    };
    const mockContextAuth = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as any;

    const allowed = await workspaceGuard.canActivate(mockContextAuth);
    assert(
      allowed === true &&
        mockRequest.workspace !== undefined &&
        mockRequest.workspace.workspaceId === 'ws-2-uuid' &&
        mockRequest.workspace.role === 'EDITOR',
      'WorkspaceContextGuard extracts header, verifies membership, and attaches verified workspace to request',
    );
  } catch (e) {
    assert(false, `Guard execution failed: ${e}`);
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal test runner error:', e);
  process.exit(1);
});

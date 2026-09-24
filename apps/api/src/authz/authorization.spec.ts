import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { PermissionGuard } from './guards/permission.guard';
import { DatabaseService } from '../database/database.service';


/**
 * Phase 1E RBAC & Authorization Foundation Unit Tests
 */
async function runTests() {
  console.log('🧪 Starting Phase 1E Authorization Foundation Unit Tests...\n');
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
  const mockRoles = [
    {
      id: 'role-1',
      workspaceId: 'ws-1',
      name: 'EDITOR',
      permissions: [
        { permissionId: 'qr:create' },
        { permissionId: 'qr:update' },
      ],
    },
    {
      id: 'role-2',
      workspaceId: 'ws-1',
      name: 'VIEWER',
      permissions: [
        { permissionId: 'qr:read' },
      ],
    }
  ];

  const mockDb = {
    role: {
      findFirst: async ({ where }: any) => {
        return mockRoles.find(r => r.workspaceId === where.workspaceId && r.name === where.name) || null;
      },
    },
  } as unknown as DatabaseService;

  const authzService = new AuthorizationService(mockDb);

  // Mock Reflector
  class MockReflector {
    private requiredPerms: string[] = [];
    set(perms: string[]) {
      this.requiredPerms = perms;
    }
    getAllAndOverride() {
      return this.requiredPerms;
    }
  }
  const reflector = new MockReflector() as any;
  const permissionGuard = new PermissionGuard(reflector, authzService);

  // ==========================================
  // AuthorizationService Tests
  // ==========================================

  // Test 1: Service - No required permissions
  try {
    const result = await authzService.hasPermissions('ws-1', 'EDITOR', []);
    assert(result === true, 'hasPermissions allows access when no permissions are required');
  } catch (e) {
    assert(false, `Test threw error: ${e}`);
  }

  // Test 2: Service - Role not found
  try {
    const result = await authzService.hasPermissions('ws-unknown', 'EDITOR', ['qr:create']);
    assert(result === false, 'hasPermissions denies access if role is not found in the specified workspace');
  } catch (e) {
    assert(false, `Test threw error: ${e}`);
  }

  // Test 3: Service - Missing permission (AND semantics)
  try {
    const result = await authzService.hasPermissions('ws-1', 'EDITOR', ['qr:create', 'qr:delete']);
    assert(result === false, 'hasPermissions denies access if role lacks any of the required permissions');
  } catch (e) {
    assert(false, `Test threw error: ${e}`);
  }

  // Test 4: Service - All permissions present
  try {
    const result = await authzService.hasPermissions('ws-1', 'EDITOR', ['qr:create', 'qr:update']);
    assert(result === true, 'hasPermissions grants access when role possesses all required permissions');
  } catch (e) {
    assert(false, `Test threw error: ${e}`);
  }

  // ==========================================
  // PermissionGuard Tests
  // ==========================================

  // Test 5: Guard - Unauthenticated request
  try {
    reflector.set(['qr:create']);
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
      getHandler: () => {},
      getClass: () => {},
    } as any;

    await permissionGuard.canActivate(mockContext);
    assert(false, 'Guard should reject unauthenticated request with UnauthorizedException');
  } catch (e) {
    assert(e instanceof UnauthorizedException, 'PermissionGuard rejects unauthenticated request (401)');
  }

  // Test 6: Guard - Missing workspace context
  try {
    reflector.set(['qr:create']);
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'u-1' },
        }),
      }),
      getHandler: () => {},
      getClass: () => {},
    } as any;

    await permissionGuard.canActivate(mockContext);
    assert(false, 'Guard should reject request missing workspace context with ForbiddenException');
  } catch (e) {
    assert(e instanceof ForbiddenException, 'PermissionGuard rejects missing workspace context (403)');
  }

  // Test 7: Guard - Has context but lacks permissions
  try {
    reflector.set(['qr:create']);
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'u-1' },
          workspace: { workspaceId: 'ws-1', role: 'VIEWER' }
        }),
      }),
      getHandler: () => {},
      getClass: () => {},
    } as any;

    await permissionGuard.canActivate(mockContext);
    assert(false, 'Guard should reject request with insufficient permissions with ForbiddenException');
  } catch (e) {
    assert(e instanceof ForbiddenException, 'PermissionGuard rejects request lacking permissions (403)');
  }

  // Test 8: Guard - Has context and has permissions
  try {
    reflector.set(['qr:create']);
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'u-1' },
          workspace: { workspaceId: 'ws-1', role: 'EDITOR' }
        }),
      }),
      getHandler: () => {},
      getClass: () => {},
    } as any;

    const allowed = await permissionGuard.canActivate(mockContext);
    assert(allowed === true, 'PermissionGuard allows request with correct workspace context and permissions');
  } catch (e) {
    assert(false, `Test threw error: ${e}`);
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

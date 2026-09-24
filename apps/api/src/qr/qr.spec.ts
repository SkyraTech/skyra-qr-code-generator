import { ForbiddenException, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { QrService } from './qr.service';
import { QrRepository } from './repositories/qr.repository';
import { QrController } from './qr.controller';
import { DatabaseService } from '../database/database.service';
import { CreateQrDto } from './dto/create-qr.dto';
import { PublicQrController } from './public-qr.controller';
import { validate } from 'class-validator';

async function runTests() {
  console.log('🧪 Starting Phase 2A QR Domain Unit Tests...\n');
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

  // -----------------------------------------------------
  // 1. Setup Mocks
  // -----------------------------------------------------
  const mockDb = {
    qrCode: {
      create: async (args: any) => ({
        id: 'qr-1',
        workspaceId: args.data.workspaceId,
        shortCode: 'abcd1234',
        name: args.data.name,
        isDynamic: args.data.isDynamic,
        destination: { targetUrl: args.data.destination?.create?.targetUrl },
      }),
      findFirst: async (args: any) => {
        if (args.where.id === 'qr-1' && args.where.workspaceId === 'ws-1') {
          return {
            id: 'qr-1',
            workspaceId: 'ws-1',
            shortCode: 'abcd1234',
            isDynamic: true,
            destination: { targetUrl: 'https://example.com' },
          };
        }
        return null;
      },
      findMany: async (args: any) => {
        if (args.where.workspaceId === 'ws-1') {
          return [{ id: 'qr-1', workspaceId: 'ws-1' }];
        }
        return [];
      },
      updateMany: async (args: any) => {
        if (args.where.id === 'qr-1' && args.where.workspaceId === 'ws-1') {
          return { count: 1 };
        }
        return { count: 0 };
      },
    },
    qrDestination: {
      findUnique: async () => ({ qrId: 'qr-1' }),
      update: async () => ({}),
    }
  } as unknown as DatabaseService;

  let attemptCount = 0;
  const mockDbWithCollision = {
    qrCode: {
      create: async (args: any) => {
        attemptCount++;
        if (attemptCount === 1) {
          // Simulate collision on first attempt
          const error: any = new Error('Unique constraint failed');
          error.code = 'P2002';
          error.meta = { target: ['short_code'] };
          throw error;
        }
        return {
          id: 'qr-2',
          workspaceId: args.data.workspaceId,
          shortCode: 'abcd1235',
          name: args.data.name,
          isDynamic: args.data.isDynamic,
          destination: { targetUrl: args.data.destination?.create?.targetUrl },
        };
      },
      findUnique: async (args: any) => {
        if (args.where.shortCode === 'valid123') {
          return {
            id: 'qr-3',
            shortCode: 'valid123',
            status: 'ACTIVE',
            deletedAt: null,
            expiresAt: null,
            destination: { targetUrl: 'https://skyra.tech' }
          };
        }
        if (args.where.shortCode === 'deleted1') {
          return {
            id: 'qr-4',
            shortCode: 'deleted1',
            status: 'ACTIVE',
            deletedAt: new Date(),
            destination: { targetUrl: 'https://skyra.tech' }
          };
        }
        if (args.where.shortCode === 'expired1') {
          return {
            id: 'qr-5',
            shortCode: 'expired1',
            status: 'ACTIVE',
            deletedAt: null,
            expiresAt: new Date(Date.now() - 10000), // Past
            destination: { targetUrl: 'https://skyra.tech' }
          };
        }
        return null;
      }
    },
  } as unknown as DatabaseService;

  const repo = new QrRepository(mockDb);
  const service = new QrService(repo);
  const controller = new QrController(service);
  
  const repoCollision = new QrRepository(mockDbWithCollision);
  const serviceCollision = new QrService(repoCollision);
  const publicController = new PublicQrController(serviceCollision);

  const mockReqAuth = (workspaceId: string, role: string) => ({
    user: { id: 'u-1' },
    workspace: { workspaceId, role }
  } as any);

  // -----------------------------------------------------
  // 2. Run Tests
  // -----------------------------------------------------

  // Test 1: Create QR with valid workspace
  try {
    const dto: CreateQrDto = { name: 'Test QR', qrTypeId: 'DYNAMIC_URL', targetUrl: 'https://example.com', isDynamic: true };
    const res = await controller.create(mockReqAuth('ws-1', 'EDITOR'), dto);
    assert(res.id === 'qr-1' && res.workspaceId === 'ws-1', 'Create QR with valid workspace succeeds');
  } catch(e) {
    assert(false, 'Create QR threw an error');
  }

  // Test 2: List QR codes returns only current workspace
  try {
    const res = await controller.findAll(mockReqAuth('ws-1', 'VIEWER'));
    assert(res.length === 1 && res[0].workspaceId === 'ws-1', 'List QR codes only returns current workspace records');
  } catch(e) {
    assert(false, 'List QR threw an error');
  }

  try {
    const res = await controller.findAll(mockReqAuth('ws-2', 'VIEWER'));
    assert(res.length === 0, 'List QR codes for empty workspace returns empty array');
  } catch(e) {
    assert(false, 'List QR threw an error');
  }

  // Test 4: Get QR belonging to current workspace
  try {
    const res = await controller.findOne(mockReqAuth('ws-1', 'VIEWER'), 'qr-1');
    assert(res.id === 'qr-1', 'Get QR belonging to current workspace succeeds');
  } catch (e) {
    assert(false, 'Get QR threw an error');
  }

  // Test 5: Get QR belonging to another workspace
  try {
    await controller.findOne(mockReqAuth('ws-2', 'VIEWER'), 'qr-1');
    assert(false, 'Get QR belonging to another workspace should throw NotFound');
  } catch (e) {
    assert(e instanceof NotFoundException, 'Get QR belonging to another workspace rejected');
  }

  // Test 6: Update QR belonging to current workspace
  try {
    const res = await controller.update(mockReqAuth('ws-1', 'EDITOR'), 'qr-1', { name: 'New Name' });
    assert(res?.id === 'qr-1', 'Update QR belonging to current workspace succeeds');
  } catch (e) {
    assert(false, 'Update QR threw an error');
  }

  // Test 7: Update QR belonging to another workspace
  try {
    await controller.update(mockReqAuth('ws-2', 'EDITOR'), 'qr-1', { name: 'New Name' });
    assert(false, 'Update QR belonging to another workspace should throw NotFound');
  } catch (e) {
    assert(e instanceof NotFoundException, 'Update QR belonging to another workspace rejected');
  }

  // Test 8: Delete QR belonging to current workspace
  try {
    const res = await controller.remove(mockReqAuth('ws-1', 'ADMIN'), 'qr-1');
    assert(res.success === true, 'Delete QR belonging to current workspace succeeds');
  } catch (e) {
    assert(false, 'Delete QR threw an error');
  }

  // Test 9: Delete QR belonging to another workspace
  try {
    await controller.remove(mockReqAuth('ws-2', 'ADMIN'), 'qr-1');
    assert(false, 'Delete QR belonging to another workspace should throw NotFound');
  } catch (e) {
    assert(e instanceof NotFoundException, 'Delete QR belonging to another workspace rejected');
  }

  // Test 11: @skyra/qr integration
  try {
    const matrix = await controller.getMatrix(mockReqAuth('ws-1', 'VIEWER'), 'qr-1');
    assert(matrix && matrix.modules && matrix.size > 0, '@skyra/qr integration correctly returns a QR matrix');
  } catch (e) {
    console.error(e);
    assert(false, '@skyra/qr integration threw an error');
  }

  // Test 12: Invalid QR domain input (Static QR without payload)
  try {
    const dto: CreateQrDto = { name: 'Static QR', qrTypeId: 'STATIC_URL', targetUrl: '', isDynamic: false };
    await controller.create(mockReqAuth('ws-1', 'EDITOR'), dto);
    assert(false, 'Create Static QR without target URL should throw BadRequest');
  } catch (e) {
    assert(e instanceof BadRequestException, 'Invalid QR domain input causes validation failure');
  }

  // Test 13: ShortCode Collision Retry
  try {
    const dto: CreateQrDto = { name: 'Collision QR', qrTypeId: 'DYNAMIC_URL', targetUrl: 'https://example.com', isDynamic: true };
    const res = await serviceCollision.create('ws-1', 'u-1', dto);
    assert(res.id === 'qr-2' && attemptCount === 2, 'Create QR succeeds after shortCode collision retry');
  } catch(e) {
    console.error(e);
    assert(false, 'Create QR failed during collision retry');
  }

  // Test 14: URL Validation (Valid)
  try {
    const dto = new CreateQrDto();
    dto.name = 'Valid URL';
    dto.qrTypeId = 'DYNAMIC_URL';
    dto.targetUrl = 'https://example.com';
    const errors = await validate(dto);
    assert(errors.length === 0, 'URL Validation accepts https://');
  } catch(e) {
    assert(false, 'URL Validation threw');
  }

  // Test 15: URL Validation (Invalid JS)
  try {
    const dto = new CreateQrDto();
    dto.name = 'Invalid URL';
    dto.qrTypeId = 'DYNAMIC_URL';
    dto.targetUrl = 'javascript:alert(1)';
    const errors = await validate(dto);
    assert(errors.length > 0 && errors[0].property === 'targetUrl', 'URL Validation rejects javascript:');
  } catch(e) {
    assert(false, 'URL Validation threw');
  }

  // Test 16: Public Resolution - Valid Active QR
  try {
    const res = await publicController.resolvePublicQR('valid123');
    assert(res.data.targetUrl === 'https://skyra.tech', 'Public resolver successfully returns destination for valid QR');
  } catch(e) {
    assert(false, 'Public resolver threw error for valid QR');
  }

  // Test 17: Public Resolution - Deleted QR
  try {
    await publicController.resolvePublicQR('deleted1');
    assert(false, 'Public resolver should not resolve deleted QR');
  } catch(e) {
    assert(e instanceof NotFoundException, 'Public resolver rejects deleted QR');
  }

  // Test 18: Public Resolution - Expired QR
  try {
    await publicController.resolvePublicQR('expired1');
    assert(false, 'Public resolver should not resolve expired QR');
  } catch(e) {
    assert(e instanceof BadRequestException, 'Public resolver rejects expired QR');
  }

  // Test 19: Public Resolution - Not Found
  try {
    await publicController.resolvePublicQR('nonexistent');
    assert(false, 'Public resolver should not resolve nonexistent QR');
  } catch(e) {
    assert(e instanceof NotFoundException, 'Public resolver rejects nonexistent shortCode');
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(e => {
  console.error('Fatal test runner error:', e);
  process.exit(1);
});

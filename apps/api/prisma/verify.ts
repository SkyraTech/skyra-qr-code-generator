import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EXPECTED_57_TABLES = [
  // Group 1: Identity & Auth (6)
  'users',
  'user_sessions',
  'refresh_tokens',
  'auth_identities',
  'user_mfa_settings',
  'auth_audit_logs',

  // Group 2: Tenancy & RBAC (6)
  'workspaces',
  'workspace_members',
  'workspace_invitations',
  'roles',
  'permissions',
  'role_permissions',

  // Group 3: Platform Admin (5)
  'platform_users',
  'platform_roles',
  'platform_permissions',
  'platform_user_roles',
  'platform_audit_logs',

  // Group 4: QR Core & Design (7)
  'qr_types',
  'qr_folders',
  'qr_codes',
  'qr_destinations',
  'qr_designs',
  'qr_versions',
  'qr_generation_jobs',

  // Group 5: Dynamic Routing & Defense (2)
  'redirect_rules',
  'qr_health_checks',

  // Group 6: Micro-Landing Pages (6)
  'landing_pages',
  'menus',
  'menu_categories',
  'menu_items',
  'vcard_profiles',
  'digital_assets',

  // Group 7: Campaigns & Attribution (2)
  'campaigns',
  'campaign_qrs',

  // Group 8: Scan Telemetry & Rollups (2)
  'scan_events',
  'daily_scan_metrics',

  // Group 9: Subscriptions & Metering (8)
  'plans',
  'plan_features',
  'subscriptions',
  'entitlements',
  'usage_meters',
  'usage_events',
  'usage_alerts',
  'subscription_invoices',

  // Group 10: Developer & Custom Domains (4)
  'custom_domains',
  'api_keys',
  'webhooks',
  'webhook_deliveries',

  // Group 11: MCP & AI Integration (7)
  'mcp_roles',
  'mcp_permissions',
  'mcp_role_permissions',
  'mcp_credentials',
  'mcp_credential_permissions',
  'mcp_invocation_logs',
  'mcp_pending_actions',

  // Group 12: Security & Abuse (2)
  'audit_logs',
  'blocked_destinations',
];

interface QueryResult {
  [key: string]: unknown;
}

let failureCount = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failureCount++;
    console.error(`  ❌ FAIL: ${testName}${details ? ` -> ${details}` : ''}`);
  }
}

async function runVerification() {
  console.log('==============================================================================');
  console.log('🔍 Running SkyraQR Phase 1 Database Foundation Verification Suite');
  console.log('==============================================================================\n');

  // ----------------------------------------------------------------------------
  // Test 1: Exactly 57 Production Tables
  // ----------------------------------------------------------------------------
  console.log('📋 Test Group 1: 57-Table Inventory & Schema Integrity');
  const tableRows = await prisma.$queryRaw<QueryResult[]>`
    SELECT c.relname as table_name, c.relkind
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind IN ('r', 'p')
      AND c.relname != '_prisma_migrations'
      AND c.relispartition = false
    ORDER BY c.relname;
  `;

  const existingTables = tableRows.map((r) => r.table_name as string);
  assert(
    existingTables.length === 57,
    'Exactly 57 production relational tables exist',
    `Found ${existingTables.length} tables`
  );

  const missingTables = EXPECTED_57_TABLES.filter((t) => !existingTables.includes(t));
  assert(
    missingTables.length === 0,
    'All 57 architecture-specified tables are present in PostgreSQL',
    missingTables.join(', ')
  );

  // ----------------------------------------------------------------------------
  // Test 2: Primary Keys on All Tables
  // ----------------------------------------------------------------------------
  console.log('\n🔑 Test Group 2: Primary Key Constraints');
  const pkRows = await prisma.$queryRaw<QueryResult[]>`
    SELECT tc.table_name, string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as pk_columns
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    WHERE tc.table_schema = 'public'
      AND tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_name != '_prisma_migrations'
    GROUP BY tc.table_name;
  `;

  const pkTableNames = pkRows.map((r) => r.table_name as string);
  // Partitioned table scan_events has PK defined on parent or partitions
  const expectedPks = EXPECTED_57_TABLES.filter((t) => t !== 'scan_events');
  const missingPks = expectedPks.filter((t) => !pkTableNames.includes(t));
  assert(
    missingPks.length === 0,
    'All regular production tables have primary keys',
    missingPks.join(', ')
  );

  // Verify composite PK on scan_events
  const scanEventsPk = await prisma.$queryRaw<QueryResult[]>`
    SELECT conname, pg_get_constraintdef(oid) as def
    FROM pg_constraint
    WHERE conrelid = 'scan_events'::regclass AND contype = 'p';
  `;
  assert(
    scanEventsPk.length > 0 && String(scanEventsPk[0]?.def).includes('(id, scanned_at)'),
    'scan_events enforces composite primary key (id, scanned_at)'
  );

  // ----------------------------------------------------------------------------
  // Test 3: UUIDv7 Functionality & Ordering
  // ----------------------------------------------------------------------------
  console.log('\n⏱️ Test Group 3: UUIDv7 Generation & Chronological Ordering');
  const uuidRows = await prisma.$queryRaw<QueryResult[]>`
    SELECT uuid_generate_v7() as id1,
           (SELECT uuid_generate_v7() FROM pg_sleep(0.003)) as id2,
           (SELECT uuid_generate_v7() FROM pg_sleep(0.003)) as id3;
  `;

  const id1 = String(uuidRows[0]?.id1);
  const id2 = String(uuidRows[0]?.id2);
  const id3 = String(uuidRows[0]?.id3);

  const uuidv7Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  assert(uuidv7Regex.test(id1), `Database uuid_generate_v7() matches RFC 9562 UUIDv7 format (${id1})`);
  assert(uuidv7Regex.test(id2), `Database uuid_generate_v7() matches RFC 9562 UUIDv7 format (${id2})`);
  assert(id1 < id2 && id2 < id3, `Database UUIDv7 values sort chronologically (${id1.slice(0, 13)} < ${id2.slice(0, 13)} < ${id3.slice(0, 13)})`);

  // Application-layer TypeScript UUIDv7 verification
  const { uuidv7 } = await import('uuidv7');
  const tsId1 = uuidv7();
  await new Promise((r) => setTimeout(r, 5));
  const tsId2 = uuidv7();
  assert(uuidv7Regex.test(tsId1), `Application TypeScript uuidv7 matches RFC 9562 (${tsId1})`);
  assert(tsId1 < tsId2, `Application TypeScript UUIDv7 values sort chronologically (${tsId1} < ${tsId2})`);

  // ----------------------------------------------------------------------------
  // Test 4: Declarative Monthly Partitioning on scan_events
  // ----------------------------------------------------------------------------
  console.log('\n📊 Test Group 4: Declarative Monthly Partitioning');
  const partitionCheck = await prisma.$queryRaw<QueryResult[]>`
    SELECT c.relname, c.relkind
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'scan_events';
  `;
  assert(
    partitionCheck.length > 0 && partitionCheck[0]?.relkind === 'p',
    'scan_events is declaratively partitioned (relkind = p)'
  );

  const childPartitions = await prisma.$queryRaw<QueryResult[]>`
    SELECT c.relname as partition_name
    FROM pg_inherits i
    JOIN pg_class c ON c.oid = i.inhrelid
    JOIN pg_class p ON p.oid = i.inhparent
    WHERE p.relname = 'scan_events'
    ORDER BY c.relname;
  `;
  const partitionNames = childPartitions.map((p) => p.partition_name as string);
  assert(
    partitionNames.includes('scan_events_2026_09'),
    'Monthly partition scan_events_2026_09 exists'
  );
  assert(
    partitionNames.includes('scan_events_default'),
    'Default catch-all partition scan_events_default exists'
  );

  // Test Partition Routing by inserting a real record
  const wsTest = await prisma.workspace.create({
    data: {
      name: 'Verification Test Workspace',
      slug: `verify-ws-${Date.now()}`,
    },
  });

  const qrTest = await prisma.qrCode.create({
    data: {
      workspaceId: wsTest.id,
      qrTypeId: 'DYNAMIC_URL',
      shortCode: `v_${Date.now().toString(36).slice(-6)}`,
      name: 'Verification Test QR',
    },
  });

  const testEventTimestamp = new Date('2026-09-15T12:00:00Z');
  const insertedEvent = await prisma.scanEvent.create({
    data: {
      workspaceId: wsTest.id,
      qrId: qrTest.id,
      visitorHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      countryCode: 'US',
      deviceType: 'mobile',
      scannedAt: testEventTimestamp,
    },
  });

  // Verify the record directly in the child partition table
  const routedRecord = await prisma.$queryRaw<QueryResult[]>`
    SELECT id, scanned_at FROM scan_events_2026_09 WHERE id = ${insertedEvent.id}::uuid;
  `;
  assert(
    routedRecord.length === 1,
    'Scan event inserted for Sept 2026 correctly routed into scan_events_2026_09 child partition'
  );

  // Clean up test workspace (which cascades to qr_codes and scan_events)
  await prisma.workspace.delete({ where: { id: wsTest.id } });

  // ----------------------------------------------------------------------------
  // Test 5: Privacy Standards & IP Datatype Policy
  // ----------------------------------------------------------------------------
  console.log('\n🔒 Test Group 5: Privacy by Design & IP Datatypes');
  const scanEventCols = await prisma.$queryRaw<QueryResult[]>`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'scan_events';
  `;
  const scanEventColNames = scanEventCols.map((c) => (c.column_name as string).toLowerCase());
  const hasRawIpInScanEvents = scanEventColNames.some(
    (name) => name.includes('ip') && !name.includes('description')
  );
  assert(
    !hasRawIpInScanEvents,
    'scan_events contains ZERO raw IP address columns (Privacy-by-Design)'
  );
  assert(
    scanEventColNames.includes('visitor_hash'),
    'scan_events contains visitor_hash for salted privacy-preserving attribution'
  );

  // Check INET types on security/audit tables
  const inetCols = await prisma.$queryRaw<QueryResult[]>`
    SELECT table_name, column_name, data_type, udt_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name IN ('client_ip', 'ip_address')
      AND table_name IN ('user_sessions', 'auth_audit_logs', 'platform_audit_logs', 'mcp_invocation_logs', 'audit_logs');
  `;
  const validInetCols = inetCols.filter((c) => c.udt_name === 'inet');
  assert(
    validInetCols.length === 5,
    'All 5 security/audit tables strictly utilize native INET for IP addresses',
    `Found ${validInetCols.length} INET columns`
  );

  // ----------------------------------------------------------------------------
  // Test 6: Monetary Precision Standard NUMERIC(12,2)
  // ----------------------------------------------------------------------------
  console.log('\n💰 Test Group 6: Monetary Precision Policy NUMERIC(12,2)');
  const monetaryCols = await prisma.$queryRaw<QueryResult[]>`
    SELECT table_name, column_name, numeric_precision, numeric_scale
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND (
        (table_name = 'menu_items' AND column_name = 'price') OR
        (table_name = 'plans' AND column_name = 'price_amount') OR
        (table_name = 'subscription_invoices' AND column_name = 'amount_paid')
      );
  `;
  const validMonetary = monetaryCols.filter(
    (c) => Number(c.numeric_precision) === 12 && Number(c.numeric_scale) === 2
  );
  assert(
    validMonetary.length === 3,
    'All monetary fields strictly standardized to NUMERIC(12,2)',
    `Found ${validMonetary.length} columns matching NUMERIC(12,2)`
  );

  // ----------------------------------------------------------------------------
  // Test 7: Soft Deletion & Partial Unique Indexes
  // ----------------------------------------------------------------------------
  console.log('\n🗑️ Test Group 7: Soft Deletion & Partial Indexes');
  const partialIndexes = await prisma.$queryRaw<QueryResult[]>`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexdef LIKE '%WHERE%deleted_at IS NULL%';
  `;
  const partialIdxNames = partialIndexes.map((i) => i.indexname as string);
  assert(
    partialIdxNames.includes('idx_qr_codes_short_code_active'),
    'Partial unique index idx_qr_codes_short_code_active exists (WHERE deleted_at IS NULL)'
  );
  assert(
    partialIdxNames.includes('idx_workspaces_slug_active'),
    'Partial unique index idx_workspaces_slug_active exists (WHERE deleted_at IS NULL)'
  );
  assert(
    partialIdxNames.includes('idx_users_email_active'),
    'Partial unique index idx_users_email_active exists (WHERE deleted_at IS NULL)'
  );

  // ----------------------------------------------------------------------------
  // Test 8: Tenant Scoping (Direct vs Indirect)
  // ----------------------------------------------------------------------------
  console.log('\n🏢 Test Group 8: Multi-Tenant Scoping Architecture');
  const directScopedTables = [
    'qr_codes',
    'campaigns',
    'custom_domains',
    'api_keys',
    'webhooks',
    'mcp_credentials',
    'usage_meters',
    'digital_assets',
    'landing_pages',
  ];

  for (const table of directScopedTables) {
    const wsCol = await prisma.$queryRaw<QueryResult[]>`
      SELECT column_name, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${table} AND column_name = 'workspace_id';
    `;
    assert(
      wsCol.length > 0 && wsCol[0]?.is_nullable === 'NO',
      `Direct scoped table ${table} contains NOT NULL workspace_id`
    );
  }

  // Indirect scoped tables should NOT contain redundant workspace_id
  const indirectScopedTables = ['menu_items', 'menu_categories', 'menus', 'qr_designs', 'redirect_rules'];
  for (const table of indirectScopedTables) {
    const wsCol = await prisma.$queryRaw<QueryResult[]>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${table} AND column_name = 'workspace_id';
    `;
    assert(
      wsCol.length === 0,
      `Indirect scoped table ${table} does NOT contain redundant workspace_id`
    );
  }

  // ----------------------------------------------------------------------------
  // Test 9: Referential Integrity & Delete Actions (CASCADE, RESTRICT, SET NULL)
  // ----------------------------------------------------------------------------
  console.log('\n🔗 Test Group 9: Referential Actions (CASCADE / RESTRICT / SET NULL)');
  const fkActions = await prisma.$queryRaw<QueryResult[]>`
    SELECT
      tc.table_name as child_table,
      kcu.column_name as child_col,
      ccu.table_name as parent_table,
      rc.delete_rule
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.referential_constraints AS rc
      ON tc.constraint_name = rc.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = rc.constraint_name
    WHERE tc.table_schema = 'public';
  `;

  const findAction = (child: string, col: string) =>
    fkActions.find((a) => a.child_table === child && a.child_col === col)?.delete_rule;

  assert(
    findAction('qr_codes', 'workspace_id') === 'CASCADE',
    'qr_codes.workspace_id ON DELETE CASCADE enforced'
  );
  assert(
    findAction('subscriptions', 'workspace_id') === 'RESTRICT',
    'subscriptions.workspace_id ON DELETE RESTRICT enforced'
  );
  assert(
    findAction('subscription_invoices', 'workspace_id') === 'RESTRICT',
    'subscription_invoices.workspace_id ON DELETE RESTRICT enforced'
  );
  assert(
    findAction('qr_codes', 'folder_id') === 'SET NULL',
    'qr_codes.folder_id ON DELETE SET NULL enforced'
  );

  // ----------------------------------------------------------------------------
  // Test 10: Seed Data Completeness
  // ----------------------------------------------------------------------------
  console.log('\n🌱 Test Group 10: Seed Data Verification');
  const qrTypeCount = await prisma.qrType.count();
  assert(qrTypeCount === 16, `All 16 standard QR types are seeded (found ${qrTypeCount})`);

  const permCount = await prisma.permission.count();
  assert(permCount === 27, `All 27 granular workspace permissions are seeded (found ${permCount})`);

  const planCount = await prisma.plan.count();
  assert(planCount >= 16, `Subscription plans are seeded (found ${planCount})`);

  const platformRoleCount = await prisma.platformRole.count();
  assert(platformRoleCount === 4, `All 4 platform operator roles are seeded (found ${platformRoleCount})`);

  const mcpRoleCount = await prisma.mcpRole.count({ where: { isSystemDefault: true } });
  assert(mcpRoleCount === 4, `All 4 system default MCP roles are seeded (found ${mcpRoleCount})`);

  console.log('\n==============================================================================');
  if (failureCount === 0) {
    console.log('🎉 ALL DATABASE VERIFICATION TESTS PASSED SUCCESSFULLY!');
  } else {
    console.error(`💥 ${failureCount} TEST(S) FAILED! Review details above.`);
  }
  console.log('==============================================================================\n');

  if (failureCount > 0) {
    process.exit(1);
  }
}

runVerification()
  .catch((err) => {
    console.error('Fatal error during database verification:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

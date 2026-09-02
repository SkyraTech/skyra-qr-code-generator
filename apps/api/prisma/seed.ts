import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SkyraQR deterministic database seed...');

  // ============================================================================
  // 1. Standard QR Types (16 Types)
  // ============================================================================
  const qrTypes = [
    { id: 'DYNAMIC_URL', category: 'WEB', isDynamic: true, minTier: 'FREE' },
    { id: 'STATIC_URL', category: 'WEB', isDynamic: false, minTier: 'FREE' },
    { id: 'VCARD_PLUS', category: 'IDENTITY', isDynamic: true, minTier: 'STARTER' },
    { id: 'STATIC_VCARD', category: 'IDENTITY', isDynamic: false, minTier: 'FREE' },
    { id: 'DIGITAL_MENU', category: 'HOSPITALITY', isDynamic: true, minTier: 'STARTER' },
    { id: 'PDF_SHOWCASE', category: 'MEDIA', isDynamic: true, minTier: 'STARTER' },
    { id: 'WIFI_ACCESS', category: 'CONNECT', isDynamic: false, minTier: 'FREE' },
    { id: 'LINK_IN_BIO', category: 'IDENTITY', isDynamic: true, minTier: 'FREE' },
    { id: 'WHATSAPP_DIRECT', category: 'CONNECT', isDynamic: false, minTier: 'FREE' },
    { id: 'PRODUCT_PAGE', category: 'COMMERCE', isDynamic: true, minTier: 'STARTER' },
    { id: 'COUPON_PROMO', category: 'COMMERCE', isDynamic: true, minTier: 'STARTER' },
    { id: 'EVENT_RSVP', category: 'CONNECT', isDynamic: true, minTier: 'STARTER' },
    { id: 'FEEDBACK_STAR', category: 'CONNECT', isDynamic: true, minTier: 'STARTER' },
    { id: 'SMART_APP_LINK', category: 'WEB', isDynamic: true, minTier: 'STARTER' },
    { id: 'AUDIO_MP3', category: 'MEDIA', isDynamic: true, minTier: 'STARTER' },
    { id: 'GS1_DIGITAL_LINK', category: 'ENTERPRISE', isDynamic: true, minTier: 'BUSINESS' },
  ];

  console.log(`  Seeding ${qrTypes.length} standard QR types...`);
  for (const qt of qrTypes) {
    await prisma.qrType.upsert({
      where: { id: qt.id },
      update: { category: qt.category, isDynamic: qt.isDynamic, minTier: qt.minTier },
      create: qt,
    });
  }

  // ============================================================================
  // 2. Master Workspace Permissions (27 Permissions)
  // ============================================================================
  const permissions = [
    // QR Code Management
    { id: 'qr:create', category: 'QR', description: 'Create new dynamic and static QR codes' },
    { id: 'qr:read', category: 'QR', description: 'View QR codes and configurations' },
    { id: 'qr:update', category: 'QR', description: 'Update QR code destinations, styling, and rules' },
    { id: 'qr:delete', category: 'QR', description: 'Soft delete QR codes' },
    { id: 'qr:batch_generate', category: 'QR', description: 'Bulk CSV QR code generation' },
    { id: 'qr:export', category: 'QR', description: 'Export high-res vector and raster QR assets' },
    { id: 'campaigns:manage', category: 'QR', description: 'Create and manage marketing campaigns and QR links' },
    { id: 'landing_pages:manage', category: 'QR', description: 'Create and manage micro-landing pages and menus' },

    // Analytics & Telemetry
    { id: 'analytics:read', category: 'ANALYTICS', description: 'View aggregated scan metrics and charts' },
    { id: 'analytics:export', category: 'ANALYTICS', description: 'Export detailed scan telemetry reports' },
    { id: 'analytics:realtime', category: 'ANALYTICS', description: 'Access real-time scan event streams' },

    // Billing & Subscriptions
    { id: 'billing:read', category: 'BILLING', description: 'View subscription status, quotas, and invoices' },
    { id: 'billing:manage', category: 'BILLING', description: 'Upgrade, downgrade, or cancel subscription' },
    { id: 'billing:payment_methods', category: 'BILLING', description: 'Update payment methods and billing details' },

    // Custom Domains
    { id: 'domains:create', category: 'DOMAINS', description: 'Add custom branded domains' },
    { id: 'domains:read', category: 'DOMAINS', description: 'View configured custom domains and SSL status' },
    { id: 'domains:delete', category: 'DOMAINS', description: 'Remove custom domains' },

    // Team & RBAC
    { id: 'team:invite', category: 'TEAM', description: 'Invite new members to workspace' },
    { id: 'team:read', category: 'TEAM', description: 'View workspace members and pending invitations' },
    { id: 'team:update_role', category: 'TEAM', description: 'Change member roles and permissions' },
    { id: 'team:remove', category: 'TEAM', description: 'Remove members from workspace' },
    { id: 'team:manage_roles', category: 'TEAM', description: 'Create and edit custom workspace roles' },

    // Model Context Protocol (MCP) / AI Agent Governance
    { id: 'mcp:read', category: 'MCP', description: 'View MCP credentials and invocation logs' },
    { id: 'mcp:create_credential', category: 'MCP', description: 'Provision new MCP agent credentials' },
    { id: 'mcp:revoke_credential', category: 'MCP', description: 'Revoke or suspend MCP credentials' },
    { id: 'mcp:manage_roles', category: 'MCP', description: 'Configure MCP roles and permissions' },
    { id: 'mcp:confirm_action', category: 'MCP', description: 'Approve or reject high-risk staged MCP actions' },
  ];

  console.log(`  Seeding ${permissions.length} master workspace permissions...`);
  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { id: perm.id },
      update: { category: perm.category, description: perm.description },
      create: perm,
    });
  }

  // ============================================================================
  // 3. Subscription Plans (Dual Currency USD & INR)
  // ============================================================================
  const plans = [
    // USD Plans
    { id: 'FREE', tier: 'FREE', billingInterval: 'month', currency: 'USD', priceAmount: 0.0, isActive: true },
    { id: 'STARTER_USD_MONTHLY', tier: 'STARTER', billingInterval: 'month', currency: 'USD', priceAmount: 15.0, isActive: true },
    { id: 'STARTER_USD_YEARLY', tier: 'STARTER', billingInterval: 'year', currency: 'USD', priceAmount: 144.0, isActive: true },
    { id: 'BUSINESS_USD_MONTHLY', tier: 'BUSINESS', billingInterval: 'month', currency: 'USD', priceAmount: 49.0, isActive: true },
    { id: 'BUSINESS_USD_YEARLY', tier: 'BUSINESS', billingInterval: 'year', currency: 'USD', priceAmount: 468.0, isActive: true },
    { id: 'AGENCY_USD_MONTHLY', tier: 'AGENCY', billingInterval: 'month', currency: 'USD', priceAmount: 149.0, isActive: true },
    { id: 'AGENCY_USD_YEARLY', tier: 'AGENCY', billingInterval: 'year', currency: 'USD', priceAmount: 1428.0, isActive: true },
    { id: 'ENTERPRISE_USD_YEARLY', tier: 'ENTERPRISE', billingInterval: 'year', currency: 'USD', priceAmount: 4999.0, isActive: true },

    // INR Plans
    { id: 'FREE_INR', tier: 'FREE', billingInterval: 'month', currency: 'INR', priceAmount: 0.0, isActive: true },
    { id: 'STARTER_INR_MONTHLY', tier: 'STARTER', billingInterval: 'month', currency: 'INR', priceAmount: 999.0, isActive: true },
    { id: 'STARTER_INR_YEARLY', tier: 'STARTER', billingInterval: 'year', currency: 'INR', priceAmount: 9588.0, isActive: true },
    { id: 'BUSINESS_INR_MONTHLY', tier: 'BUSINESS', billingInterval: 'month', currency: 'INR', priceAmount: 2999.0, isActive: true },
    { id: 'BUSINESS_INR_YEARLY', tier: 'BUSINESS', billingInterval: 'year', currency: 'INR', priceAmount: 28788.0, isActive: true },
    { id: 'AGENCY_INR_MONTHLY', tier: 'AGENCY', billingInterval: 'month', currency: 'INR', priceAmount: 8999.0, isActive: true },
    { id: 'AGENCY_INR_YEARLY', tier: 'AGENCY', billingInterval: 'year', currency: 'INR', priceAmount: 86388.0, isActive: true },
    { id: 'ENTERPRISE_INR_YEARLY', tier: 'ENTERPRISE', billingInterval: 'year', currency: 'INR', priceAmount: 299999.0, isActive: true },
  ];

  console.log(`  Seeding ${plans.length} subscription plans...`);
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: {
        tier: plan.tier,
        billingInterval: plan.billingInterval,
        currency: plan.currency,
        priceAmount: plan.priceAmount,
        isActive: plan.isActive,
      },
      create: plan,
    });
  }

  // ============================================================================
  // 4. Plan Features / Entitlements Matrix
  // ============================================================================
  const featureKeys = [
    'SMART_ROUTING',
    'CUSTOM_DOMAINS',
    'MCP_ACCESS',
    'WHITE_LABEL',
    'BULK_GENERATION',
    'ADVANCED_ANALYTICS',
    'API_ACCESS',
  ];

  const planFeatureMatrix: Record<string, string[]> = {
    FREE: [],
    FREE_INR: [],
    STARTER_USD_MONTHLY: ['ADVANCED_ANALYTICS'],
    STARTER_USD_YEARLY: ['ADVANCED_ANALYTICS'],
    STARTER_INR_MONTHLY: ['ADVANCED_ANALYTICS'],
    STARTER_INR_YEARLY: ['ADVANCED_ANALYTICS'],
    BUSINESS_USD_MONTHLY: ['SMART_ROUTING', 'CUSTOM_DOMAINS', 'ADVANCED_ANALYTICS', 'BULK_GENERATION'],
    BUSINESS_USD_YEARLY: ['SMART_ROUTING', 'CUSTOM_DOMAINS', 'ADVANCED_ANALYTICS', 'BULK_GENERATION'],
    BUSINESS_INR_MONTHLY: ['SMART_ROUTING', 'CUSTOM_DOMAINS', 'ADVANCED_ANALYTICS', 'BULK_GENERATION'],
    BUSINESS_INR_YEARLY: ['SMART_ROUTING', 'CUSTOM_DOMAINS', 'ADVANCED_ANALYTICS', 'BULK_GENERATION'],
    AGENCY_USD_MONTHLY: ['SMART_ROUTING', 'CUSTOM_DOMAINS', 'MCP_ACCESS', 'WHITE_LABEL', 'BULK_GENERATION', 'ADVANCED_ANALYTICS', 'API_ACCESS'],
    AGENCY_USD_YEARLY: ['SMART_ROUTING', 'CUSTOM_DOMAINS', 'MCP_ACCESS', 'WHITE_LABEL', 'BULK_GENERATION', 'ADVANCED_ANALYTICS', 'API_ACCESS'],
    AGENCY_INR_MONTHLY: ['SMART_ROUTING', 'CUSTOM_DOMAINS', 'MCP_ACCESS', 'WHITE_LABEL', 'BULK_GENERATION', 'ADVANCED_ANALYTICS', 'API_ACCESS'],
    AGENCY_INR_YEARLY: ['SMART_ROUTING', 'CUSTOM_DOMAINS', 'MCP_ACCESS', 'WHITE_LABEL', 'BULK_GENERATION', 'ADVANCED_ANALYTICS', 'API_ACCESS'],
    ENTERPRISE_USD_YEARLY: ['SMART_ROUTING', 'CUSTOM_DOMAINS', 'MCP_ACCESS', 'WHITE_LABEL', 'BULK_GENERATION', 'ADVANCED_ANALYTICS', 'API_ACCESS'],
    ENTERPRISE_INR_YEARLY: ['SMART_ROUTING', 'CUSTOM_DOMAINS', 'MCP_ACCESS', 'WHITE_LABEL', 'BULK_GENERATION', 'ADVANCED_ANALYTICS', 'API_ACCESS'],
  };

  console.log('  Seeding plan features and entitlements matrix...');
  for (const [planId, enabledFeatures] of Object.entries(planFeatureMatrix)) {
    for (const featureKey of featureKeys) {
      const isEnabled = enabledFeatures.includes(featureKey);
      await prisma.planFeature.upsert({
        where: {
          uq_plan_features_plan_key: {
            planId,
            featureKey,
          },
        },
        update: { isEnabled },
        create: {
          planId,
          featureKey,
          isEnabled,
        },
      });
    }
  }

  // ============================================================================
  // 5. Platform Roles & Operator Permissions
  // ============================================================================
  const platformRoles = [
    { id: 'PLATFORM_OWNER', description: 'Full administrative control over the entire SaaS platform' },
    { id: 'PLATFORM_ADMIN', description: 'Platform administrator with operations and governance authority' },
    { id: 'PLATFORM_SUPPORT', description: 'Customer support staff with read and diagnostics access' },
    { id: 'PLATFORM_ANALYST', description: 'Financial and telemetry analytics operator' },
  ];

  console.log(`  Seeding ${platformRoles.length} platform operator roles...`);
  for (const role of platformRoles) {
    await prisma.platformRole.upsert({
      where: { id: role.id },
      update: { description: role.description },
      create: role,
    });
  }

  const platformPermissions = [
    { id: 'platform:abuse:quarantine', description: 'Quarantine malicious QR codes or workspaces' },
    { id: 'platform:revenue:read', description: 'View aggregate platform revenue and payment telemetry' },
    { id: 'platform:workspaces:manage', description: 'Suspend or activate customer workspaces' },
    { id: 'platform:plans:manage', description: 'Modify pricing tiers and plan configurations' },
  ];

  console.log(`  Seeding ${platformPermissions.length} platform operator permissions...`);
  for (const perm of platformPermissions) {
    await prisma.platformPermission.upsert({
      where: { id: perm.id },
      update: { description: perm.description },
      create: perm,
    });
  }

  // ============================================================================
  // 6. Master MCP Permissions & System Default Roles
  // ============================================================================
  const mcpPermissions = [
    { id: 'read:qrs', category: 'READ', isHighRisk: false, description: 'View QR code metadata and analytics' },
    { id: 'write:qrs', category: 'WRITE', isHighRisk: false, description: 'Create and edit QR codes and styles' },
    { id: 'delete:qrs', category: 'WRITE', isHighRisk: true, description: 'Delete QR codes (Requires confirmation)' },
    { id: 'read:analytics', category: 'READ', isHighRisk: false, description: 'Query scan event telemetry' },
    { id: 'manage:domains', category: 'MANAGEMENT', isHighRisk: true, description: 'Bind or remove custom hostnames' },
    { id: 'manage:billing', category: 'MANAGEMENT', isHighRisk: true, description: 'Modify billing or subscriptions' },
  ];

  console.log(`  Seeding ${mcpPermissions.length} MCP tool permissions...`);
  for (const mp of mcpPermissions) {
    await prisma.mcpPermission.upsert({
      where: { id: mp.id },
      update: { category: mp.category, isHighRisk: mp.isHighRisk, description: mp.description },
      create: mp,
    });
  }

  const defaultMcpRoles = [
    { name: 'MCP Viewer', description: 'Read-only access for analytical and inspection AI agents' },
    { name: 'MCP Editor', description: 'Operational access for content and QR management agents' },
    { name: 'MCP Manager', description: 'Management access for marketing automation agents' },
    { name: 'MCP Administrator', description: 'Full administrative access for high-privilege AI orchestrators' },
  ];

  console.log(`  Seeding ${defaultMcpRoles.length} system default MCP roles...`);
  for (const role of defaultMcpRoles) {
    const existing = await prisma.mcpRole.findFirst({
      where: { workspaceId: null, name: role.name },
    });

    if (!existing) {
      await prisma.mcpRole.create({
        data: {
          workspaceId: null,
          name: role.name,
          description: role.description,
          isSystemDefault: true,
        },
      });
    }
  }

  console.log('✅ Deterministic seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

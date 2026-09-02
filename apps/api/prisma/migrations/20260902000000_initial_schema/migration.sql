-- ==============================================================================
-- SkyraQR — Baseline Schema Migration
-- Document Identifier: SKYRA-DOC-DB-001 | Version: 2.2.0
-- Establishes all 57 production relational tables, UUIDv7 function,
-- declarative partitioning, performance indexes, and foreign keys.
-- ==============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. UUIDv7 Generation Function (RFC 9562 Compliant)
CREATE OR REPLACE FUNCTION uuid_generate_v7()
RETURNS uuid
AS $$
DECLARE
  unix_time_ms int8;
  uuid_bytes bytea;
BEGIN
  unix_time_ms = floor(extract(epoch from clock_timestamp()) * 1000);
  uuid_bytes = set_byte(
    set_byte(
      overlay(
        gen_random_bytes(16) placing substring(int8send(unix_time_ms) from 3 for 6) from 1 for 6
      ),
      6, (b'0111' || substring(get_byte(gen_random_bytes(1), 0)::bit(8) from 5 for 4))::bit(8)::int
    ),
    8, (b'10' || substring(get_byte(gen_random_bytes(1), 0)::bit(8) from 3 for 6))::bit(8)::int
  );
  RETURN encode(uuid_bytes, 'hex')::uuid;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- ==============================================================================
-- Group 1: Identity, Authentication & Sessions (6 Tables)
-- ==============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    password_changed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_users_email_active ON users (email) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_users_email ON users (email);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_agent TEXT,
    client_ip INET,
    device_fingerprint VARCHAR(64),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_user_sessions_expires CHECK (expires_at > created_at)
);

CREATE INDEX idx_user_sessions_user_expires ON user_sessions (user_id, expires_at);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    session_id UUID NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    replaced_by_token_id UUID REFERENCES refresh_tokens(id) ON DELETE SET NULL ON UPDATE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens (token_hash);

CREATE TABLE auth_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_auth_identities_provider_user UNIQUE (provider, provider_user_id)
);

CREATE INDEX idx_auth_identities_user ON auth_identities (user_id);

CREATE TABLE user_mfa_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    totp_secret_encrypted TEXT NOT NULL,
    backup_codes_hashed TEXT[] NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    enabled_at TIMESTAMPTZ
);

CREATE INDEX idx_user_mfa_user_id ON user_mfa_settings (user_id);

CREATE TABLE auth_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    event_type VARCHAR(60) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_auth_audit_user_time ON auth_audit_logs (user_id, created_at DESC);

-- ==============================================================================
-- Group 2: Tenancy, Workspaces & Customer RBAC (6 Tables)
-- ==============================================================================

CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(60) NOT NULL,
    tier VARCHAR(30) NOT NULL DEFAULT 'FREE',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    white_label_logo TEXT,
    white_label_theme JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_workspaces_slug_active ON workspaces (slug) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_workspaces_slug ON workspaces (slug);

CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    role VARCHAR(30) NOT NULL DEFAULT 'EDITOR',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_workspace_member UNIQUE (workspace_id, user_id)
);

CREATE INDEX idx_workspace_members_user ON workspace_members (user_id);

CREATE TABLE workspace_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'VIEWER',
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workspace_invitations_token ON workspace_invitations (token);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(60) NOT NULL,
    is_system_default BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_roles_workspace_name UNIQUE (workspace_id, name)
);

CREATE INDEX idx_roles_workspace ON roles (workspace_id);

CREATE TABLE permissions (
    id VARCHAR(60) PRIMARY KEY,
    category VARCHAR(40) NOT NULL,
    description TEXT NOT NULL
);

CREATE INDEX idx_permissions_category ON permissions (category);

CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    permission_id VARCHAR(60) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ==============================================================================
-- Group 3: Platform Owner Administration & Operations (5 Tables)
-- ==============================================================================

CREATE TABLE platform_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    mfa_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    totp_secret_encrypted TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_platform_users_email ON platform_users (email);

CREATE TABLE platform_roles (
    id VARCHAR(40) PRIMARY KEY,
    description TEXT NOT NULL
);

CREATE TABLE platform_permissions (
    id VARCHAR(60) PRIMARY KEY,
    description TEXT NOT NULL
);

CREATE TABLE platform_user_roles (
    platform_user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    platform_role_id VARCHAR(40) NOT NULL REFERENCES platform_roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (platform_user_id, platform_role_id)
);

CREATE TABLE platform_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    platform_user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    action VARCHAR(80) NOT NULL,
    target_resource VARCHAR(50) NOT NULL,
    target_resource_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}',
    ip_address INET NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_platform_audit_time ON platform_audit_logs (created_at DESC);

-- ==============================================================================
-- Group 4: QR Code Core Management & Design (7 Tables)
-- ==============================================================================

CREATE TABLE qr_types (
    id VARCHAR(40) PRIMARY KEY,
    category VARCHAR(40) NOT NULL,
    is_dynamic BOOLEAN NOT NULL,
    min_tier VARCHAR(30) NOT NULL DEFAULT 'FREE'
);

CREATE TABLE qr_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    parent_folder_id UUID REFERENCES qr_folders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_qr_folders_workspace ON qr_folders (workspace_id);

CREATE TABLE qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    folder_id UUID REFERENCES qr_folders(id) ON DELETE SET NULL ON UPDATE CASCADE,
    qr_type_id VARCHAR(40) NOT NULL REFERENCES qr_types(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    short_code VARCHAR(16) NOT NULL,
    name VARCHAR(150) NOT NULL,
    is_dynamic BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    total_scans BIGINT NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    scannability_score INTEGER NOT NULL DEFAULT 100,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_qr_codes_short_code_active ON qr_codes (short_code) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_qr_codes_short_code ON qr_codes (short_code);
CREATE INDEX idx_qr_codes_workspace_status ON qr_codes (workspace_id, status, created_at DESC) WHERE deleted_at IS NULL;

CREATE TABLE qr_destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    qr_id UUID NOT NULL UNIQUE REFERENCES qr_codes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    target_url TEXT NOT NULL,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    health_status VARCHAR(30) NOT NULL DEFAULT 'HEALTHY',
    last_checked_at TIMESTAMPTZ,
    last_http_status INTEGER DEFAULT 200
);

CREATE INDEX idx_qr_destinations_qr_id ON qr_destinations (qr_id);

CREATE TABLE qr_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    qr_id UUID NOT NULL UNIQUE REFERENCES qr_codes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    ecc_level VARCHAR(2) NOT NULL DEFAULT 'M',
    module_pattern VARCHAR(40) NOT NULL DEFAULT 'square',
    eye_shape VARCHAR(40) NOT NULL DEFAULT 'square',
    eye_pupil VARCHAR(40) NOT NULL DEFAULT 'square',
    fg_color VARCHAR(20) NOT NULL DEFAULT '#000000',
    bg_color VARCHAR(20) NOT NULL DEFAULT '#FFFFFF',
    gradient_type VARCHAR(20),
    gradient_secondary VARCHAR(20),
    logo_url TEXT,
    logo_scale NUMERIC(3,2) NOT NULL DEFAULT 0.20,
    frame_style VARCHAR(50),
    frame_text VARCHAR(60),
    styling_payload JSONB NOT NULL DEFAULT '{}',
    CONSTRAINT chk_qr_designs_logo_scale CHECK (logo_scale <= 0.22)
);

CREATE TABLE qr_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    qr_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    snapshot_payload JSONB NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_qr_versions_qr_id ON qr_versions (qr_id, version_number DESC);

CREATE TABLE qr_generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    total_records INTEGER NOT NULL,
    processed_records INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    download_zip_url TEXT,
    error_summary JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_qr_generation_jobs_ws ON qr_generation_jobs (workspace_id, status);

-- ==============================================================================
-- Group 5: Dynamic Routing & Health Defense (2 Tables)
-- ==============================================================================

CREATE TABLE redirect_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    qr_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    rule_type VARCHAR(30) NOT NULL,
    priority INTEGER NOT NULL DEFAULT 0,
    condition_payload JSONB NOT NULL,
    destination_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_redirect_rules_qr_active ON redirect_rules (qr_id, priority) WHERE is_active = TRUE;

CREATE TABLE qr_health_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    qr_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    http_status INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    error_message TEXT,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_qr_health_checks_qr ON qr_health_checks (qr_id, checked_at DESC);

-- ==============================================================================
-- Group 6: No-Code Micro-Landing Pages & Content (6 Tables)
-- ==============================================================================

CREATE TABLE landing_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    qr_id UUID NOT NULL UNIQUE REFERENCES qr_codes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    page_type VARCHAR(40) NOT NULL,
    title VARCHAR(150) NOT NULL,
    meta_description TEXT,
    theme_settings JSONB NOT NULL DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_landing_pages_workspace ON landing_pages (workspace_id);

CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    landing_page_id UUID NOT NULL UNIQUE REFERENCES landing_pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    allow_allergens BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_menu_categories_menu ON menu_categories (menu_id, display_order);

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL,
    image_url TEXT,
    dietary_tags TEXT[] NOT NULL DEFAULT '{}',
    is_available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_menu_items_category ON menu_items (category_id);

CREATE TABLE vcard_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    landing_page_id UUID NOT NULL UNIQUE REFERENCES landing_pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60),
    organization VARCHAR(100),
    job_title VARCHAR(100),
    phone_mobile VARCHAR(30),
    phone_work VARCHAR(30),
    email VARCHAR(255),
    website_url TEXT,
    address_json JSONB NOT NULL DEFAULT '{}',
    social_links JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE digital_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_digital_assets_workspace ON digital_assets (workspace_id);

-- ==============================================================================
-- Group 7: Campaigns & Attribution (2 Tables)
-- ==============================================================================

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    utm_campaign VARCHAR(100),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_workspace ON campaigns (workspace_id);

CREATE TABLE campaign_qrs (
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE ON UPDATE CASCADE,
    qr_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (campaign_id, qr_id)
);

-- ==============================================================================
-- Group 8: Scan Telemetry & Pre-Aggregated Rollups (2 Tables)
-- Declarative Range Partitioning on `scanned_at`
-- ==============================================================================

CREATE TABLE scan_events (
    id UUID NOT NULL DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    qr_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    visitor_hash VARCHAR(64) NOT NULL,
    country_code VARCHAR(2),
    region VARCHAR(50),
    city VARCHAR(100),
    device_type VARCHAR(20) NOT NULL DEFAULT 'mobile',
    os VARCHAR(30),
    browser VARCHAR(40),
    is_unique_daily BOOLEAN NOT NULL DEFAULT FALSE,
    scanned_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (id, scanned_at)
) PARTITION BY RANGE (scanned_at);

CREATE INDEX idx_scan_events_qr_time ON scan_events (qr_id, scanned_at DESC);

-- Declarative Monthly Child Partitions
CREATE TABLE scan_events_2026_08 PARTITION OF scan_events
    FOR VALUES FROM ('2026-08-01 00:00:00+00') TO ('2026-09-01 00:00:00+00');

CREATE TABLE scan_events_2026_09 PARTITION OF scan_events
    FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');

CREATE TABLE scan_events_2026_10 PARTITION OF scan_events
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');

CREATE TABLE scan_events_2026_11 PARTITION OF scan_events
    FOR VALUES FROM ('2026-11-01 00:00:00+00') TO ('2026-12-01 00:00:00+00');

CREATE TABLE scan_events_2026_12 PARTITION OF scan_events
    FOR VALUES FROM ('2026-12-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

CREATE TABLE scan_events_default PARTITION OF scan_events DEFAULT;

CREATE TABLE daily_scan_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    qr_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    metric_date DATE NOT NULL,
    total_scans INTEGER NOT NULL DEFAULT 0,
    unique_scans INTEGER NOT NULL DEFAULT 0,
    geo_breakdown JSONB NOT NULL DEFAULT '{}',
    device_breakdown JSONB NOT NULL DEFAULT '{}',
    os_breakdown JSONB NOT NULL DEFAULT '{}',
    hourly_distribution INTEGER[] NOT NULL DEFAULT '{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}',
    CONSTRAINT uq_daily_scan_metrics_qr_date UNIQUE (qr_id, metric_date)
);

CREATE INDEX idx_daily_metrics_qr_date ON daily_scan_metrics (qr_id, metric_date DESC);

-- ==============================================================================
-- Group 9: Subscriptions, Entitlements & Metering (8 Tables)
-- ==============================================================================

CREATE TABLE plans (
    id VARCHAR(40) PRIMARY KEY,
    tier VARCHAR(30) NOT NULL,
    billing_interval VARCHAR(20) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    price_amount NUMERIC(12,2) NOT NULL,
    stripe_price_id VARCHAR(100),
    razorpay_plan_id VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE plan_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    plan_id VARCHAR(40) NOT NULL REFERENCES plans(id) ON DELETE CASCADE ON UPDATE CASCADE,
    feature_key VARCHAR(60) NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_plan_features_plan_key UNIQUE (plan_id, feature_key)
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    plan_id VARCHAR(40) NOT NULL REFERENCES plans(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    gateway VARCHAR(20) NOT NULL,
    gateway_customer_id VARCHAR(100),
    gateway_subscription_id VARCHAR(100) UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE entitlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    feature_key VARCHAR(60) NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_entitlements_subscription_key UNIQUE (subscription_id, feature_key)
);

CREATE TABLE usage_meters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    metric_key VARCHAR(60) NOT NULL,
    current_value BIGINT NOT NULL DEFAULT 0,
    quota_limit BIGINT NOT NULL,
    policy_on_exhaustion VARCHAR(30) NOT NULL DEFAULT 'BLOCK',
    reset_interval VARCHAR(20) NOT NULL DEFAULT 'MONTHLY',
    last_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_usage_meters_workspace_key UNIQUE (workspace_id, metric_key)
);

CREATE TABLE usage_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    meter_id UUID NOT NULL REFERENCES usage_meters(id) ON DELETE CASCADE ON UPDATE CASCADE,
    delta BIGINT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usage_events_meter ON usage_events (meter_id, recorded_at DESC);

CREATE TABLE usage_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    metric_key VARCHAR(60) NOT NULL,
    threshold_percent INTEGER NOT NULL,
    dispatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE subscription_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    amount_paid NUMERIC(12,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PAID',
    pdf_receipt_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_workspace ON subscription_invoices (workspace_id, created_at DESC);

-- ==============================================================================
-- Group 10: Developer Platform & Custom Domains (4 Tables)
-- ==============================================================================

CREATE TABLE custom_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    hostname VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    ssl_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_domains_hostname ON custom_domains (hostname);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(80) NOT NULL,
    key_prefix VARCHAR(12) NOT NULL,
    key_hash VARCHAR(64) NOT NULL UNIQUE,
    scopes TEXT[] NOT NULL DEFAULT '{"read:qrs", "write:qrs"}',
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_keys_hash ON api_keys (key_hash);

CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    target_url TEXT NOT NULL,
    secret_encrypted TEXT NOT NULL,
    events TEXT[] NOT NULL DEFAULT '{"scan.milestone"}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_webhooks_workspace ON webhooks (workspace_id);

CREATE TABLE webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE ON UPDATE CASCADE,
    event_name VARCHAR(60) NOT NULL,
    http_status INTEGER,
    response_body TEXT,
    duration_ms INTEGER,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_deliveries_hook ON webhook_deliveries (webhook_id, attempted_at DESC);

-- ==============================================================================
-- Group 11: Model Context Protocol (MCP) & AI Integration (7 Tables)
-- ==============================================================================

CREATE TABLE mcp_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(60) NOT NULL,
    description TEXT,
    is_system_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_mcp_roles_workspace_name UNIQUE (workspace_id, name)
);

CREATE TABLE mcp_permissions (
    id VARCHAR(60) PRIMARY KEY,
    category VARCHAR(30) NOT NULL,
    is_high_risk BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT NOT NULL
);

CREATE TABLE mcp_role_permissions (
    role_id UUID NOT NULL REFERENCES mcp_roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    permission_id VARCHAR(60) NOT NULL REFERENCES mcp_permissions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE mcp_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    name VARCHAR(80) NOT NULL,
    token_prefix VARCHAR(14) NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    role_id UUID NOT NULL REFERENCES mcp_roles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    updated_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    revoked_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    revoked_at TIMESTAMPTZ,
    suspended_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_mcp_credentials_duration CHECK (expires_at > starts_at)
);

CREATE INDEX idx_mcp_credentials_hash ON mcp_credentials (token_hash);
CREATE INDEX idx_mcp_credentials_workspace ON mcp_credentials (workspace_id, status);

CREATE TABLE mcp_credential_permissions (
    mcp_credential_id UUID NOT NULL REFERENCES mcp_credentials(id) ON DELETE CASCADE ON UPDATE CASCADE,
    permission_id VARCHAR(60) NOT NULL REFERENCES mcp_permissions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    is_granted BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (mcp_credential_id, permission_id)
);

CREATE TABLE mcp_invocation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    mcp_credential_id UUID NOT NULL REFERENCES mcp_credentials(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    tool_name VARCHAR(60) NOT NULL,
    tool_classification VARCHAR(20) NOT NULL,
    request_id VARCHAR(64) NOT NULL,
    trace_id VARCHAR(64) NOT NULL,
    input_arguments JSONB NOT NULL,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    error_code VARCHAR(50),
    execution_duration_ms INTEGER NOT NULL,
    ip_address INET NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mcp_invocations_credential ON mcp_invocation_logs (mcp_credential_id, created_at DESC);
CREATE INDEX idx_mcp_invocations_request_id ON mcp_invocation_logs (request_id);

CREATE TABLE mcp_pending_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    mcp_credential_id UUID NOT NULL REFERENCES mcp_credentials(id) ON DELETE CASCADE ON UPDATE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    tool_name VARCHAR(60) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    confirmed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    confirmed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mcp_pending_actions_ws ON mcp_pending_actions (workspace_id, status);

-- ==============================================================================
-- Group 12: Security, Abuse & Audit Logging (2 Tables)
-- ==============================================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    actor_type VARCHAR(30) NOT NULL,
    action VARCHAR(80) NOT NULL,
    event_type VARCHAR(60) NOT NULL,
    resource_type VARCHAR(40) NOT NULL,
    resource_id UUID,
    before_state JSONB,
    after_state JSONB,
    metadata JSONB NOT NULL DEFAULT '{}',
    request_id VARCHAR(64),
    trace_id VARCHAR(64),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_workspace_time ON audit_logs (workspace_id, created_at DESC);
CREATE INDEX idx_audit_logs_request_id ON audit_logs (request_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs (resource_type, resource_id);

CREATE TABLE blocked_destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    pattern VARCHAR(255) NOT NULL UNIQUE,
    threat_type VARCHAR(50) NOT NULL DEFAULT 'PHISHING',
    detected_by VARCHAR(50) NOT NULL DEFAULT 'SAFE_BROWSING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blocked_destinations_pattern ON blocked_destinations (pattern);

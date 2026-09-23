'use client';

/**
 * /ui-platform-poc
 *
 * Phase 0D-1 — Skyra Platform Integration Proof of Concept
 *
 * This page demonstrates four representative Platform component categories
 * being consumed directly from @skyra/* packages inside the SkyraQR Next.js
 * application. No Platform source code has been copied.
 *
 * POC components selected:
 *   1. Button + Badge  — @skyra/ui  (simple primitive, all variants/sizes)
 *   2. Input           — @skyra/ui  (form primitive with label, error, helper)
 *   3. ConfirmDialog + Modal — @skyra/dialogs (interactive overlay, portal, focus trap)
 *   4. DynamicDataTable  — @skyra/data-table (complex data component with sort/search)
 *
 * CSS foundation loaded via layout.tsx:
 *   @skyra/design-tokens/tokens.css  → --skyra-* CSS custom properties
 *   @skyra/design-tokens/reset.css   → Skyra normalisation reset
 *   @skyra/ui/styles.css             → .skyra-* component CSS classes
 */

import React, { useState } from 'react';

// ── @skyra/ui ──────────────────────────────────────────────────────────────
import { Button, Input, Badge, StatusBadge } from '@skyra/ui';
import type { StatusConfig } from '@skyra/ui';

// ── @skyra/dialogs ─────────────────────────────────────────────────────────
import { ConfirmDialog, Modal } from '@skyra/dialogs';

// ── @skyra/data-table ──────────────────────────────────────────────────────
import { DynamicDataTable } from '@skyra/data-table';
import type { Column } from '@skyra/data-table';

// ── Lucide icons ───────────────────────────────────────────────────────────
import {
  CheckCircle2,
  Package,
  Layers,
  QrCode,
  Activity,
  Trash2,
  AlertTriangle,
  Info,
} from 'lucide-react';

// ── QR-status map for StatusBadge ──────────────────────────────────────────
const QR_STATUS_MAP: Record<string, StatusConfig> = {
  ACTIVE: {
    label: 'Active',
    bg: 'var(--skyra-success-light)',
    color: 'var(--skyra-success)',
    border: 'var(--skyra-success)',
  },
  PAUSED: {
    label: 'Paused',
    bg: 'var(--skyra-warning-light)',
    color: 'var(--skyra-warning)',
    border: 'var(--skyra-warning)',
  },
  EXPIRED: {
    label: 'Expired',
    bg: 'var(--skyra-danger-light)',
    color: 'var(--skyra-danger)',
    border: 'var(--skyra-danger)',
  },
};

// ── Mock data for DynamicDataTable POC ────────────────────────────────────
interface MockQRCode {
  id: string;
  name: string;
  shortCode: string;
  type: string;
  scans: number;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  createdAt: string;
}

const MOCK_QR_DATA: MockQRCode[] = [
  { id: '001', name: 'Summer Campaign Menu QR', shortCode: 'sm-mnu1', type: 'Digital Menu', scans: 1420, status: 'ACTIVE', createdAt: '2026-08-28' },
  { id: '002', name: 'Executive Contact vCard', shortCode: 'ceo-vcf', type: 'vCard+', scans: 382, status: 'ACTIVE', createdAt: '2026-07-14' },
  { id: '003', name: 'Promo Landing Page', shortCode: 'promo-lp', type: 'URL', scans: 891, status: 'PAUSED', createdAt: '2026-06-01' },
  { id: '004', name: 'Event Check-in QR', shortCode: 'evt-chk', type: 'Event', scans: 2300, status: 'EXPIRED', createdAt: '2026-05-10' },
  { id: '005', name: 'Product PDF Brochure', shortCode: 'pdf-bro', type: 'PDF', scans: 640, status: 'ACTIVE', createdAt: '2026-09-01' },
];

const TABLE_COLUMNS: Column<MockQRCode>[] = [
  { key: 'name', header: 'QR Code Name', accessor: 'name', sortable: true },
  {
    key: 'shortCode',
    header: 'Short Code',
    accessor: (row) => (
      <code
        style={{
          fontFamily: 'var(--skyra-font-mono)',
          fontSize: '0.78rem',
          background: 'var(--skyra-primary-light)',
          color: 'var(--skyra-primary)',
          padding: '2px 7px',
          borderRadius: 'var(--skyra-radius-sm)',
        }}
      >
        {row.shortCode}
      </code>
    ),
    sortable: false,
  },
  { key: 'type', header: 'Type', accessor: 'type', sortable: true },
  { key: 'scans', header: 'Scans', accessor: (row) => row.scans.toLocaleString(), sortable: true },
  {
    key: 'status',
    header: 'Status',
    accessor: (row) => (
      <StatusBadge status={row.status} statusMap={QR_STATUS_MAP} />
    ),
    sortable: false,
  },
  { key: 'createdAt', header: 'Created', accessor: 'createdAt', sortable: true },
];

// ── Page Component ─────────────────────────────────────────────────────────
export default function UiPlatformPocPage() {
  const [inputValue, setInputValue] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmVariant, setConfirmVariant] = useState<'primary' | 'danger' | 'warning'>('primary');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmResult, setConfirmResult] = useState<string | null>(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const handleConfirm = async () => {
    setIsConfirmLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsConfirmLoading(false);
    setConfirmOpen(false);
    setConfirmResult('✅  Action confirmed via @skyra/dialogs ConfirmDialog (isLoading + portal + focus trap tested)');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--skyra-bg)',
        fontFamily: 'var(--skyra-font-body)',
        color: 'var(--skyra-text)',
        padding: '2rem',
      }}
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Layers size={26} color="var(--skyra-primary)" />
          <h1
            style={{
              fontFamily: 'var(--skyra-font-display)',
              fontSize: '1.6rem',
              fontWeight: 700,
              margin: 0,
              color: 'var(--skyra-text)',
            }}
          >
            Skyra Platform — Integration POC
          </h1>
          <span
            style={{
              background: 'var(--skyra-primary-light)',
              color: 'var(--skyra-primary)',
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 'var(--skyra-radius-full)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Phase 0D-1
          </span>
        </div>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          All components on this page are imported directly from{' '}
          <code style={{ fontFamily: 'var(--skyra-font-mono)', color: 'var(--skyra-primary)', fontSize: '0.8rem' }}>
            @skyra/*
          </code>{' '}
          Platform packages. Zero source copied. Zero local forks. Proving the integration architecture.
        </p>

        {/* Package provenance strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
          {[
            { pkg: '@skyra/design-tokens', note: 'tokens.css, reset.css' },
            { pkg: '@skyra/ui', note: 'Button, Input, Badge, StatusBadge' },
            { pkg: '@skyra/dialogs', note: 'ConfirmDialog, Modal' },
            { pkg: '@skyra/data-table', note: 'DynamicDataTable' },
          ].map(({ pkg, note }) => (
            <div
              key={pkg}
              style={{
                background: 'var(--skyra-surface)',
                border: '1px solid var(--skyra-border)',
                borderRadius: 'var(--skyra-radius-md)',
                padding: '0.5rem 0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Package size={13} color="var(--skyra-primary)" />
              <span style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.75rem', color: 'var(--skyra-primary)', fontWeight: 600 }}>
                {pkg}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--skyra-text-muted)' }}>— {note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── POC Sections ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Section 1 — Button + Badge */}
        <PocSection
          number="1"
          title="Button & Badge"
          source="@skyra/ui"
          description="All variants (primary, orange, outline, ghost, danger), all sizes (sm, md, lg), isLoading state, disabled state, leftIcon/rightIcon, fullWidth. Badge variants (primary, success, danger, warning, neutral, info, orange)."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Variant row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center' }}>
              <Button variant="primary">Primary</Button>
              <Button variant="orange">Orange</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="link">Link</Button>
            </div>
            {/* Sizes + states */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center' }}>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" isLoading loadingText="Saving...">Save</Button>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="outline" leftIcon={<QrCode size={15} />}>With Icon</Button>
              <Button variant="primary" fullWidth style={{ marginTop: '0.25rem' }}>Full Width Button</Button>
            </div>
            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', paddingTop: '0.25rem', borderTop: '1px solid var(--skyra-border)' }}>
              {(['primary', 'orange', 'success', 'danger', 'warning', 'info', 'neutral'] as const).map((v) => (
                <Badge key={v} variant={v}>{v}</Badge>
              ))}
            </div>
          </div>
        </PocSection>

        {/* Section 2 — Input */}
        <PocSection
          number="2"
          title="Input"
          source="@skyra/ui"
          description="Built-in label, helper, error, required asterisk, clearable, loading spinner, left/right adornments, character count, disabled, readOnly states."
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
            <Input
              label="QR Code Name"
              placeholder="Enter campaign name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              clearable
              onClear={() => setInputValue('')}
              helper={`Value: "${inputValue || 'empty'}"`}
            />
            <Input
              label="Destination URL"
              placeholder="https://example.com"
              type="url"
              required
              helper="The URL this QR code redirects to"
            />
            <Input
              label="Short Code"
              placeholder="my-qr-001"
              error="This short code is already taken"
              defaultValue="my-qr"
            />
            <Input
              label="Scan Limit"
              placeholder="1000"
              type="number"
              loading
              helper="Loading current limit..."
            />
            <Input
              label="Campaign Notes"
              placeholder="Internal notes..."
              maxLength={100}
              showCount
            />
            <Input
              label="Read-only Field"
              value="QR-2026-001"
              readOnly
              helper="Auto-generated QR identifier"
            />
            <Input
              label="Disabled Field"
              value="Locked value"
              disabled
            />
          </div>
        </PocSection>

        {/* Section 3 — ConfirmDialog + Modal */}
        <PocSection
          number="3"
          title="ConfirmDialog + Modal"
          source="@skyra/dialogs"
          description="Portal rendering, focus trap (Tab cycles within dialog), keyboard Escape closes, ARIA role=dialog aria-modal aria-labelledby aria-describedby. ConfirmDialog: 3 variants (primary/danger/warning), isLoading spinner. Modal: 5 sizes, footer slot, backdrop click control."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <Button
                variant="primary"
                leftIcon={<Info size={15} />}
                onClick={() => { setConfirmVariant('primary'); setConfirmResult(null); setConfirmOpen(true); }}
              >
                Primary Confirm
              </Button>
              <Button
                variant="danger"
                leftIcon={<Trash2 size={15} />}
                onClick={() => { setConfirmVariant('danger'); setConfirmResult(null); setConfirmOpen(true); }}
              >
                Danger Confirm
              </Button>
              <Button
                variant="outline"
                leftIcon={<AlertTriangle size={15} />}
                onClick={() => { setConfirmVariant('warning'); setConfirmResult(null); setConfirmOpen(true); }}
              >
                Warning Confirm
              </Button>
              <Button
                variant="outline"
                leftIcon={<Layers size={15} />}
                onClick={() => setModalOpen(true)}
              >
                Open Modal
              </Button>
            </div>

            {confirmResult && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'var(--skyra-success-light)',
                  border: '1px solid var(--skyra-success)',
                  borderRadius: 'var(--skyra-radius-md)',
                  fontSize: '0.875rem',
                  color: 'var(--skyra-success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <CheckCircle2 size={16} />
                {confirmResult}
              </div>
            )}
          </div>

          {/* ConfirmDialog — rendered via @skyra/dialogs */}
          <ConfirmDialog
            open={confirmOpen}
            title={
              confirmVariant === 'danger' ? 'Delete QR Code?'
              : confirmVariant === 'warning' ? 'Archive Campaign?'
              : 'Publish QR Code?'
            }
            message={
              confirmVariant === 'danger'
                ? 'This will permanently delete the QR code and all associated scan analytics. This action cannot be undone.'
                : confirmVariant === 'warning'
                ? 'Archiving this campaign will pause all active QR codes. You can reactivate it at any time.'
                : 'Publishing will make this QR code publicly accessible. Verify the destination URL is correct before proceeding.'
            }
            variant={confirmVariant}
            confirmLabel={confirmVariant === 'danger' ? 'Delete Permanently' : confirmVariant === 'warning' ? 'Archive' : 'Publish Now'}
            cancelLabel="Cancel"
            isLoading={isConfirmLoading}
            onConfirm={handleConfirm}
            onCancel={() => { setConfirmOpen(false); }}
          />

          {/* Modal — rendered via @skyra/dialogs */}
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="QR Code Configuration"
            size="md"
            footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => setModalOpen(false)}>Save Changes</Button>
              </div>
            }
          >
            <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Modal rendered via{' '}
              <code style={{ fontFamily: 'var(--skyra-font-mono)', color: 'var(--skyra-primary)', fontSize: '0.8rem' }}>
                @skyra/dialogs Modal
              </code>
              . Uses React portal, focus trap, and keyboard Escape handling.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <Input label="Campaign Name" placeholder="Enter campaign name" required />
              <Input label="Redirect URL" placeholder="https://example.com" type="url" required />
              <Input label="Internal Notes" placeholder="Optional notes..." helper="Not visible to end users" />
            </div>
          </Modal>
        </PocSection>

        {/* Section 4 — DynamicDataTable */}
        <PocSection
          number="4"
          title="DynamicDataTable"
          source="@skyra/data-table"
          description="Client-side search, column sorting (↑↓), pagination, column visibility toggle, per-row edit/delete/view actions, action button, loading skeleton, and empty state."
        >
          <DynamicDataTable<MockQRCode>
            columns={TABLE_COLUMNS}
            data={MOCK_QR_DATA}
            pageSize={5}
            searchPlaceholder="Search QR codes..."
            actionLabel="Create QR Code"
            onAction={() => alert('[POC] Create QR Code — from @skyra/data-table DynamicDataTable')}
            onEdit={(row) => alert(`[POC] Edit: ${row.name}`)}
            onDelete={(row) => alert(`[POC] Delete: ${row.name}`)}
          />
        </PocSection>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid var(--skyra-border)',
            paddingTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            color: 'var(--skyra-text-muted)',
            fontSize: '0.78rem',
          }}
        >
          <CheckCircle2 size={15} color="var(--skyra-success)" />
          <span>
            <strong style={{ color: 'var(--skyra-text)' }}>Phase 0D-1 POC</strong> — All 4 component categories
            imported from <code style={{ fontFamily: 'var(--skyra-font-mono)', color: 'var(--skyra-primary)' }}>@skyra/*</code>{' '}
            Platform packages via <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>link:</code> protocol. CSS loaded via
            layout.tsx JS imports. No source copied. No existing QR components deleted.
          </span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Activity size={13} />
            {MOCK_QR_DATA.length} QR codes
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Reusable POC section wrapper ───────────────────────────────────────────
function PocSection({
  number,
  title,
  source,
  description,
  children,
}: {
  number: string;
  title: string;
  source: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: 'var(--skyra-surface)',
        border: '1px solid var(--skyra-border)',
        borderRadius: 'var(--skyra-radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--skyra-shadow-sm)',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid var(--skyra-border)',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'var(--skyra-bg)',
        }}
      >
        <span
          style={{
            width: '26px',
            height: '26px',
            borderRadius: 'var(--skyra-radius-md)',
            background: 'var(--skyra-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.78rem',
            flexShrink: 0,
          }}
        >
          {number}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h2
              style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                margin: 0,
                fontFamily: 'var(--skyra-font-display)',
                color: 'var(--skyra-text)',
              }}
            >
              {title}
            </h2>
            <code
              style={{
                fontFamily: 'var(--skyra-font-mono)',
                fontSize: '0.68rem',
                background: 'var(--skyra-primary-light)',
                color: 'var(--skyra-primary)',
                padding: '2px 7px',
                borderRadius: 'var(--skyra-radius-full)',
                fontWeight: 600,
              }}
            >
              {source}
            </code>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--skyra-text-muted)', margin: '2px 0 0', lineHeight: 1.5 }}>
            {description}
          </p>
        </div>
      </div>
      <div style={{ padding: '1.25rem 1.5rem' }}>{children}</div>
    </section>
  );
}

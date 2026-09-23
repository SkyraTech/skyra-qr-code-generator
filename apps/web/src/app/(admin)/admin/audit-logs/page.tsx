// @ts-nocheck
'use client';

import { Badge, Button } from '@skyra/ui';
import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, Section } from '@/components/layout/page-container';
import { DynamicDataTable } from '@skyra/data-table';
import type { Column } from '@skyra/data-table';


import { Download, ShieldCheck } from 'lucide-react';
import { formatDateTime } from '@/lib/formatters';

interface AuditRecord {
  id: string;
  actor: string;
  action: string;
  resource: string;
  workspace: string;
  ipAddress: string;
  timestamp: string;
}

const mockAuditLogs: AuditRecord[] = [
  {
    id: 'aud-001',
    actor: 'admin@skyra.tech',
    action: 'WORKSPACE_QUARANTINE_LIFTED',
    resource: 'workspace:ws-01',
    workspace: 'Acme Corporation',
    ipAddress: '198.51.100.24',
    timestamp: '2026-09-02T13:30:00Z',
  },
  {
    id: 'aud-002',
    actor: 'system:mcp-agent',
    action: 'DYNAMIC_QR_CREATED',
    resource: 'qr:018f3a-9901',
    workspace: 'Skyline Hospitality',
    ipAddress: '10.0.4.12 (Internal)',
    timestamp: '2026-09-02T12:15:00Z',
  },
  {
    id: 'aud-003',
    actor: 'bob@refrigeration.com',
    action: 'API_KEY_REVOKED',
    resource: 'key:sk_live_9a4f',
    workspace: 'Apex Lab',
    ipAddress: '203.0.113.88',
    timestamp: '2026-09-02T11:05:00Z',
  },
];

export default function AdminAuditLogsPage() {
  const columns: any[] = [
    {
      id: 'timestamp',
      header: 'Timestamp',
      accessorKey: 'timestamp',
      cell: ({ value }) => <span className="font-mono-data text-xs">{formatDateTime(String(value))}</span>,
    },
    {
      id: 'actor',
      header: 'Actor',
      accessorKey: 'actor',
      cell: ({ value }) => <span className="font-semibold text-foreground">{String(value)}</span>,
    },
    {
      id: 'action',
      header: 'Action',
      accessorKey: 'action',
      cell: ({ value }) => (
        <span className="font-mono-data text-[11px] bg-muted px-2 py-0.5 rounded border border-border">
          {String(value)}
        </span>
      ),
    },
    {
      id: 'resource',
      header: 'Target Resource',
      accessorKey: 'resource',
      cell: ({ value }) => <span className="font-mono-data text-xs text-muted-foreground">{String(value)}</span>,
    },
    {
      id: 'workspace',
      header: 'Workspace Scope',
      accessorKey: 'workspace',
      cell: ({ value }) => <span>{String(value)}</span>,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Authoritative Audit Logs"
        description="Immutable compliance trail recorded in PostgreSQL for all mutations, access delegations, and administrative interventions."
        badge={<Badge variant="success">Immutable</Badge>}
        actions={
          <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
            Export Audit Trail
          </Button>
        }
      />

      <Section>
        <DynamicDataTable<AuditRecord>
          columns={columns}
          data={mockAuditLogs}
          searchPlaceholder="Search audit events by actor, action, or resource..."
        />
      </Section>
    </PageContainer>
  );
}

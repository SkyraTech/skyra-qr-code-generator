'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, Section } from '@/components/layout/page-container';
import { DataTable } from '@/components/tables/data-table';
import { ColumnDef } from '@/types/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Download } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/formatters';

interface AdminWorkspace {
  id: string;
  name: string;
  slug: string;
  plan: string;
  qrCount: number;
  membersCount: number;
  status: 'ACTIVE' | 'QUARANTINED';
  createdAt: string;
}

const mockAdminWorkspaces: AdminWorkspace[] = [
  {
    id: 'ws-01',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    plan: 'ENTERPRISE',
    qrCount: 420,
    membersCount: 18,
    status: 'ACTIVE',
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'ws-02',
    name: 'Skyline Hospitality Group',
    slug: 'skyline-hospitality',
    plan: 'BUSINESS',
    qrCount: 154,
    membersCount: 6,
    status: 'ACTIVE',
    createdAt: '2026-08-12T16:20:00Z',
  },
  {
    id: 'ws-03',
    name: 'Apex Marketing Lab',
    slug: 'apex-lab',
    plan: 'STARTER',
    qrCount: 12,
    membersCount: 2,
    status: 'QUARANTINED',
    createdAt: '2026-08-25T11:00:00Z',
  },
];

export default function AdminWorkspacesPage() {
  const columns: ColumnDef<AdminWorkspace>[] = [
    {
      id: 'name',
      header: 'Workspace',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-foreground">{row.name}</div>
          <div className="text-[11px] text-muted-foreground font-mono-data">slug: {row.slug}</div>
        </div>
      ),
    },
    {
      id: 'plan',
      header: 'Current Plan',
      accessorKey: 'plan',
      cell: ({ value }) => <Badge variant="default">{String(value)}</Badge>,
    },
    {
      id: 'qrCount',
      header: 'Dynamic QRs',
      accessorKey: 'qrCount',
      cell: ({ value }) => <span className="font-mono-data font-semibold">{formatNumber(Number(value))}</span>,
    },
    {
      id: 'membersCount',
      header: 'Seats',
      accessorKey: 'membersCount',
      cell: ({ value }) => <span className="font-mono-data">{String(value)}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) =>
        value === 'ACTIVE' ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="destructive">Quarantined</Badge>
        ),
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorKey: 'createdAt',
      cell: ({ value }) => <span className="text-muted-foreground">{formatDate(String(value))}</span>,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Workspaces"
        description="Multi-tenant workspace isolation, quota monitoring, and administrative governance."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
              Export List
            </Button>
            <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
              Provision Workspace
            </Button>
          </div>
        }
      />

      <Section>
        <DataTable<AdminWorkspace>
          columns={columns}
          data={mockAdminWorkspaces}
          searchPlaceholder="Filter workspaces by name, slug, or plan..."
        />
      </Section>
    </PageContainer>
  );
}

// @ts-nocheck
'use client';

import { Badge, Button } from '@skyra/ui';
import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, Section } from '@/components/layout/page-container';
import { DynamicDataTable } from '@skyra/data-table';
import type { Column } from '@skyra/data-table';


import { UserPlus, Download } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  workspacesCount: number;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

const mockAdminUsers: AdminUser[] = [
  {
    id: 'usr-01',
    name: 'Alice Cooper',
    email: 'alice@acme.corp',
    role: 'WORKSPACE_OWNER',
    workspacesCount: 2,
    status: 'ACTIVE',
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'usr-02',
    name: 'Robert Vance',
    email: 'bob@refrigeration.com',
    role: 'WORKSPACE_ADMIN',
    workspacesCount: 1,
    status: 'ACTIVE',
    createdAt: '2026-08-18T14:20:00Z',
  },
  {
    id: 'usr-03',
    name: 'Claire Beauchamp',
    email: 'claire@highland.org',
    role: 'WORKSPACE_MEMBER',
    workspacesCount: 1,
    status: 'SUSPENDED',
    createdAt: '2026-08-20T11:45:00Z',
  },
];

export default function AdminUsersPage() {
  const columns: any[] = [
    {
      id: 'name',
      header: 'User Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-foreground">{row.name}</div>
          <div className="text-[11px] text-muted-foreground">{row.email}</div>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Primary Role',
      accessorKey: 'role',
      cell: ({ value }) => (
        <span className="font-mono-data text-[11px] bg-muted px-2 py-0.5 rounded border border-border">
          {String(value)}
        </span>
      ),
    },
    {
      id: 'workspacesCount',
      header: 'Workspaces',
      accessorKey: 'workspacesCount',
      cell: ({ value }) => <span className="font-mono-data font-semibold">{String(value)}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) =>
        value === 'ACTIVE' ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="danger">Suspended</Badge>
        ),
    },
    {
      id: 'createdAt',
      header: 'Registered',
      accessorKey: 'createdAt',
      cell: ({ value }) => <span className="text-muted-foreground">{formatDate(String(value))}</span>,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Users Directory"
        description="Search, inspect, and administer user identities across all SkyraQR multi-tenant workspaces."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
              Export CSV
            </Button>
            <Button size="sm" leftIcon={<UserPlus className="h-3.5 w-3.5" />}>
              Invite Platform Admin
            </Button>
          </div>
        }
      />

      <Section>
        <DynamicDataTable<AdminUser>
          columns={columns}
          data={mockAdminUsers}
          searchPlaceholder="Search users by name, email, or role..."
        />
      </Section>
    </PageContainer>
  );
}

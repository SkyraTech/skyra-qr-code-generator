'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, Section } from '@/components/layout/page-container';
import { DataTable } from '@/components/tables/data-table';
import { ColumnDef } from '@/types/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus, Shield } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  status: 'ACTIVE' | 'INVITED';
  joinedAt: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: 'mem-1',
    name: 'Sarah Connor',
    email: 'sarah@skyra.tech',
    role: 'OWNER',
    status: 'ACTIVE',
    joinedAt: '2026-08-01T09:00:00Z',
  },
  {
    id: 'mem-2',
    name: 'John Miller',
    email: 'john@skyra.tech',
    role: 'ADMIN',
    status: 'ACTIVE',
    joinedAt: '2026-08-05T12:00:00Z',
  },
  {
    id: 'mem-3',
    name: 'Elena Rostova',
    email: 'elena@skyra.tech',
    role: 'MEMBER',
    status: 'ACTIVE',
    joinedAt: '2026-08-10T15:30:00Z',
  },
];

export default function WorkspaceTeamPage() {
  const columns: ColumnDef<TeamMember>[] = [
    {
      id: 'name',
      header: 'Member',
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
      header: 'Role',
      accessorKey: 'role',
      cell: ({ value }) => (
        <span className="font-mono-data text-[11px] bg-muted px-2 py-0.5 rounded border border-border">
          {String(value)}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) =>
        value === 'ACTIVE' ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="warning">Invited</Badge>
        ),
    },
    {
      id: 'joinedAt',
      header: 'Joined',
      accessorKey: 'joinedAt',
      cell: ({ value }) => (
        <span className="text-muted-foreground text-xs">
          {formatDate(String(value))}
        </span>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Team Members"
        description="Manage workspace team members, invitations, and role-based permissions."
        actions={
          <Button size="sm" leftIcon={<UserPlus className="h-3.5 w-3.5" />}>
            Invite Member
          </Button>
        }
      />

      <Section>
        <DataTable<TeamMember>
          columns={columns}
          data={mockTeamMembers}
          searchPlaceholder="Search team members by name or email..."
        />
      </Section>
    </PageContainer>
  );
}

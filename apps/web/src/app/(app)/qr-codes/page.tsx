'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, Section } from '@/components/layout/page-container';
import { DataTable } from '@/components/tables/data-table';
import { ColumnDef } from '@/types/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QrCode, Plus, Download, Filter } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/formatters';

interface QRCodeRecord {
  id: string;
  name: string;
  shortCode: string;
  type: string;
  scans: number;
  status: 'ACTIVE' | 'PAUSED';
  createdAt: string;
}

const mockQRCodes: QRCodeRecord[] = [
  {
    id: 'qr-1',
    name: 'Summer Campaign Menu QR',
    shortCode: 'sm-mnu1',
    type: 'DIGITAL_MENU',
    scans: 3892,
    status: 'ACTIVE',
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'qr-2',
    name: 'Executive Contact vCard',
    shortCode: 'ceo-vcf',
    type: 'VCARD_PLUS',
    scans: 1240,
    status: 'ACTIVE',
    createdAt: '2026-08-22T14:30:00Z',
  },
  {
    id: 'qr-3',
    name: 'Store WiFi Guest Access',
    shortCode: 'wf-nyc',
    type: 'WIFI_ACCESS',
    scans: 8490,
    status: 'ACTIVE',
    createdAt: '2026-08-25T09:15:00Z',
  },
  {
    id: 'qr-4',
    name: 'Mobile App Smart Download',
    shortCode: 'dl-app',
    type: 'SMART_APP_LINK',
    scans: 15820,
    status: 'PAUSED',
    createdAt: '2026-08-28T16:45:00Z',
  },
];

export default function QRCodesPage() {
  const columns: ColumnDef<QRCodeRecord>[] = [
    {
      id: 'name',
      header: 'QR Campaign',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-foreground">{row.name}</div>
          <div className="text-[11px] text-muted-foreground font-mono-data">
            https://skyra.link/{row.shortCode}
          </div>
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'type',
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
          <Badge variant="warning">Paused</Badge>
        ),
    },
    {
      id: 'scans',
      header: 'Scans',
      accessorKey: 'scans',
      cell: ({ value }) => (
        <span className="font-mono-data font-bold text-foreground">
          {formatNumber(Number(value))}
        </span>
      ),
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorKey: 'createdAt',
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
        title="QR Codes"
        description="Manage dynamic QR codes, configure smart redirection rules, and download high-resolution vectors."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
              Export
            </Button>
            <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
              Create Dynamic QR
            </Button>
          </div>
        }
      />

      <Section>
        <DataTable<QRCodeRecord>
          columns={columns}
          data={mockQRCodes}
          searchPlaceholder="Search QR codes by name, type, or short code..."
        />
      </Section>
    </PageContainer>
  );
}

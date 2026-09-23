'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@skyra/ui';
import * as React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, DashboardGrid, Section } from '@/components/layout/page-container';
import { StatsCard } from '@/components/layout/stats-card';



import { QrCode, Plus, BarChart3, Users, Zap, ExternalLink, ArrowRight } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/formatters';
import { ROUTES } from '@/config/routes';

export default function WorkspaceDashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Workspace Overview"
        description="Monitor active dynamic QR campaigns, scan telemetry, and team activity for Skyra Tech HQ."
        badge={<Badge variant="neutral">Business Tier</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Link href={ROUTES.QR_CODES}>
              <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                Create QR Code
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Metrics */}
      <DashboardGrid columns={4}>
        <StatsCard
          title="Active Dynamic QRs"
          value={formatNumber(42)}
          change={12.5}
          subtitle="Quota: 42 / 100"
          icon={<QrCode className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Scans (Month)"
          value={formatNumber(18490)}
          change={24.8}
          subtitle="Included: 50,000"
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <StatsCard
          title="Avg Edge Latency"
          value="18ms"
          change={-4.0}
          subtitle="Sub-30ms guarantee"
          icon={<Zap className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Team Seats"
          value="5 / 10"
          change={0}
          subtitle="Seats utilized"
          icon={<Users className="h-4 w-4" />}
        />
      </DashboardGrid>

      {/* Quick Launch & Recent Campaigns Section */}
      <Section title="Active Campaigns & Quick Access">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 flex flex-col justify-between">
            <div>
              <Badge variant="success" size="sm">Active</Badge>
              <h4 className="font-semibold text-foreground text-sm mt-2">Summer Restaurant Menu</h4>
              <p className="text-xs text-muted-foreground mt-1">Digital menu QR for outdoor patio seating.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="font-mono-data text-muted-foreground">3,892 scans</span>
              <Link href={ROUTES.QR_CODES} className="text-primary hover:underline inline-flex items-center gap-1 font-medium">
                <span>Inspect</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <div>
              <Badge variant="success" size="sm">Active</Badge>
              <h4 className="font-semibold text-foreground text-sm mt-2">Executive Contact vCard</h4>
              <p className="text-xs text-muted-foreground mt-1">NFC badge & QR code redirect for sales reps.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="font-mono-data text-muted-foreground">1,240 scans</span>
              <Link href={ROUTES.QR_CODES} className="text-primary hover:underline inline-flex items-center gap-1 font-medium">
                <span>Inspect</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <div>
              <Badge variant="warning" size="sm">Scheduled</Badge>
              <h4 className="font-semibold text-foreground text-sm mt-2">Autumn Product Showcase</h4>
              <p className="text-xs text-muted-foreground mt-1">Dynamic URL redirect scheduled for Sep 15.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="font-mono-data text-muted-foreground">0 scans</span>
              <Link href={ROUTES.QR_CODES} className="text-primary hover:underline inline-flex items-center gap-1 font-medium">
                <span>Inspect</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>
        </div>
      </Section>
    </PageContainer>
  );
}

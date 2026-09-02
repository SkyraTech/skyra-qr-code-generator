'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, DashboardGrid, Section } from '@/components/layout/page-container';
import { StatsCard } from '@/components/layout/stats-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusDot } from '@/components/data-display/status-dot';
import { Building2, Users, Receipt, Activity, RefreshCw, ArrowUpRight } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/formatters';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';

export default function AdminDashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Platform Administration"
        description="Global system telemetry, multi-tenant workspace administration, and subscription management across SkyraQR."
        badge={<Badge variant="warning">Super Admin</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Sync Telemetry
            </Button>
          </div>
        }
      />

      {/* Global KPIs */}
      <DashboardGrid columns={4}>
        <StatsCard
          title="Total Workspaces"
          value={formatNumber(348)}
          change={12.4}
          subtitle="across 4 tiers"
          icon={<Building2 className="h-4 w-4" />}
        />
        <StatsCard
          title="Registered Users"
          value={formatNumber(1894)}
          change={8.2}
          subtitle="78% active"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Subscriptions"
          value={formatNumber(284)}
          change={14.1}
          subtitle="ARR: $148,200"
          icon={<Receipt className="h-4 w-4" />}
        />
        <StatsCard
          title="Global Scans (30d)"
          value={formatNumber(3849200)}
          change={28.6}
          subtitle="p99: 18ms"
          icon={<Activity className="h-4 w-4" />}
        />
      </DashboardGrid>

      {/* System Status & Infrastructure Cards */}
      <Section title="Platform Health & Edge Cluster Status">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Authoritative Infrastructure</CardTitle>
              <CardDescription>Real-time status across multi-region edge nodes and primary clusters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-xs text-foreground">NestJS + Fastify Primary API</span>
                <StatusDot status="online" label="Operational (Healthy)" pulse />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-xs text-foreground">Supabase PostgreSQL 16 Cluster</span>
                <StatusDot status="online" label="57 Tables Synced" />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-xs text-foreground">Edge POP Redirection Mesh</span>
                <StatusDot status="online" label="38 Edge Points Active" />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-foreground">MCP AI Agent (Jarvis Server)</span>
                <StatusDot status="online" label="Ready (HTTPS Transport)" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Administrative Shortcuts</CardTitle>
              <CardDescription>Rapid access to tenant management and governance tooling.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 pt-0">
              <Link href={ROUTES.ADMIN.USERS}>
                <Button variant="outline" className="w-full justify-between text-xs" size="sm">
                  <span>Users Directory</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Button>
              </Link>
              <Link href={ROUTES.ADMIN.WORKSPACES}>
                <Button variant="outline" className="w-full justify-between text-xs" size="sm">
                  <span>Workspaces</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Button>
              </Link>
              <Link href={ROUTES.ADMIN.SUBSCRIPTIONS}>
                <Button variant="outline" className="w-full justify-between text-xs" size="sm">
                  <span>Subscriptions</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Button>
              </Link>
              <Link href={ROUTES.ADMIN.AUDIT_LOGS}>
                <Button variant="outline" className="w-full justify-between text-xs" size="sm">
                  <span>Audit Logs</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageContainer>
  );
}

'use client';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@skyra/ui';
import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, DashboardGrid, Section } from '@/components/layout/page-container';
import { StatsCard } from '@/components/layout/stats-card';

import { BarChart3, Smartphone, Monitor, Globe, Filter } from 'lucide-react';

import { formatNumber } from '@/lib/formatters';

export default function WorkspaceAnalyticsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Scan Analytics"
        description="Comprehensive telemetry, device breakdowns, and geographic insights for your workspace."
        actions={
          <Button variant="outline" size="sm" leftIcon={<Filter className="h-3.5 w-3.5" />}>
            Last 30 Days
          </Button>
        }
      />

      <DashboardGrid columns={4}>
        <StatsCard
          title="Total Scans"
          value={formatNumber(18490)}
          change={24.8}
          subtitle="vs previous 30 days"
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <StatsCard
          title="Unique Devices"
          value={formatNumber(14210)}
          change={18.2}
          subtitle="Salted HMAC hash"
          icon={<Smartphone className="h-4 w-4" />}
        />
        <StatsCard
          title="Mobile Traffic"
          value="94.2%"
          change={1.5}
          subtitle="iOS & Android"
          icon={<Monitor className="h-4 w-4" />}
        />
        <StatsCard
          title="Top Region"
          value="US-East"
          subtitle="48% of total volume"
          icon={<Globe className="h-4 w-4" />}
        />
      </DashboardGrid>

      <Section title="Device Operating System Distribution">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Scanners by Operating System
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Apple iOS (iPhone / iPad)</span>
                <span className="font-mono-data font-semibold">68%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Google Android</span>
                <span className="font-mono-data font-semibold">26%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Desktop Web / Other</span>
                <span className="font-mono-data font-semibold">6%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Privacy & Compliance Architecture
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              In accordance with GDPR, CCPA, and India DPDP 2023, raw visitor IP addresses are never recorded in PostgreSQL. Every scan event uses an ephemeral daily rotating HMAC-SHA256 salt.
            </p>
          </Card>
        </div>
      </Section>
    </PageContainer>
  );
}

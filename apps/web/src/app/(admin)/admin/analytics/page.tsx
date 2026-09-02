'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, DashboardGrid, Section } from '@/components/layout/page-container';
import { StatsCard } from '@/components/layout/stats-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Globe, Zap, Cpu } from 'lucide-react';
import { formatNumber } from '@/lib/formatters';

export default function AdminAnalyticsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Platform Analytics"
        description="Global edge latency distribution, regional scan volumes, and system resource consumption."
      />

      <DashboardGrid columns={4}>
        <StatsCard
          title="Edge POP Requests"
          value={formatNumber(12480000)}
          change={24.2}
          subtitle="Total hits (30d)"
          icon={<Globe className="h-4 w-4" />}
        />
        <StatsCard
          title="Avg Edge Latency"
          value="14.2ms"
          change={-2.1}
          subtitle="p99: 22.8ms"
          icon={<Zap className="h-4 w-4" />}
        />
        <StatsCard
          title="Cache Hit Ratio (L1/L2)"
          value="98.4%"
          change={0.6}
          subtitle="Redis + in-memory"
          icon={<Activity className="h-4 w-4" />}
        />
        <StatsCard
          title="MCP Tool Executions"
          value={formatNumber(4820)}
          change={44.8}
          subtitle="AI Agent interactions"
          icon={<Cpu className="h-4 w-4" />}
        />
      </DashboardGrid>

      <Section title="Geographical Edge Distribution">
        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-foreground">North America (IAD, SFO, ORD)</span>
              <span className="font-mono-data font-semibold">54% of global scans</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-foreground">Europe (FRA, LHR, CDG)</span>
              <span className="font-mono-data font-semibold">28% of global scans</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-foreground">Asia-Pacific (BOM, SIN, NRT)</span>
              <span className="font-mono-data font-semibold">18% of global scans</span>
            </div>
          </div>
        </Card>
      </Section>
    </PageContainer>
  );
}

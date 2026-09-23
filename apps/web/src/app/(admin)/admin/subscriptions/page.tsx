'use client';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@skyra/ui';
import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, DashboardGrid, Section } from '@/components/layout/page-container';
import { StatsCard } from '@/components/layout/stats-card';


import { formatCurrency, formatNumber } from '@/lib/formatters';
import { Receipt, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminSubscriptionsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Subscriptions"
        description="Monitor active subscription plans, trial conversions, and recurring license renewals."
      />

      <DashboardGrid columns={3}>
        <StatsCard
          title="Active Subscriptions"
          value={formatNumber(284)}
          change={14.1}
          subtitle="Monthly recurring"
          icon={<Receipt className="h-4 w-4" />}
        />
        <StatsCard
          title="Trial Conversion Rate"
          value="34.8%"
          change={4.2}
          subtitle="14-day trials"
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <StatsCard
          title="Churn Rate (30d)"
          value="1.2%"
          change={-0.4}
          subtitle="Industry benchmark < 3%"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </DashboardGrid>

      <Section title="Plan Distribution">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <h4 className="font-semibold text-foreground text-sm">Starter Plan</h4>
            <p className="text-2xl font-bold font-mono-data mt-2 text-foreground">112</p>
            <p className="text-xs text-muted-foreground mt-1">$29 / month</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold text-foreground text-sm">Professional Plan</h4>
            <p className="text-2xl font-bold font-mono-data mt-2 text-foreground">94</p>
            <p className="text-xs text-muted-foreground mt-1">$79 / month</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold text-foreground text-sm">Business Plan</h4>
            <p className="text-2xl font-bold font-mono-data mt-2 text-foreground">58</p>
            <p className="text-xs text-muted-foreground mt-1">$199 / month</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold text-foreground text-sm">Enterprise Custom</h4>
            <p className="text-2xl font-bold font-mono-data mt-2 text-foreground">20</p>
            <p className="text-xs text-muted-foreground mt-1">Custom annual contracts</p>
          </Card>
        </div>
      </Section>
    </PageContainer>
  );
}

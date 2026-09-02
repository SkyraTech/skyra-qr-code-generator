'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, DashboardGrid, Section } from '@/components/layout/page-container';
import { StatsCard } from '@/components/layout/stats-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CreditCard, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export default function AdminBillingPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Billing & Invoices"
        description="Global revenue reconciliation across Stripe and Razorpay payment gateways."
      />

      <DashboardGrid columns={3}>
        <StatsCard
          title="Monthly Gross Volume"
          value={formatCurrency(48920)}
          change={18.4}
          subtitle="Processed volume"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatsCard
          title="Payment Success Rate"
          value="99.4%"
          change={0.2}
          subtitle="Dual-gateway failover"
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatsCard
          title="Net Expansion Revenue"
          value={formatCurrency(4200)}
          change={11.5}
          subtitle="Upgrades & add-ons"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </DashboardGrid>

      <Section title="Payment Gateways Integration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5">
            <h4 className="font-semibold text-foreground">Stripe International Engine</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Primary gateway for USD, EUR, GBP credit card processing and automatic tax calculation.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-600 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Webhook Delivery: 100% (Operational)</span>
            </div>
          </Card>
          <Card className="p-5">
            <h4 className="font-semibold text-foreground">Razorpay India Engine</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Primary gateway for INR transactions, UPI auto-pay, and domestic net banking.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-600 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Webhook Delivery: 100% (Operational)</span>
            </div>
          </Card>
        </div>
      </Section>
    </PageContainer>
  );
}

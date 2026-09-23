'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button, Progress } from '@skyra/ui';
import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, Section } from '@/components/layout/page-container';




import { Check, CreditCard, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export default function WorkspaceBillingPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Billing & Subscription"
        description="Manage your workspace subscription plan, payment methods, and invoice receipts."
        badge={<Badge variant="neutral">Business Tier</Badge>}
        actions={
          <Button size="sm" variant="outline" leftIcon={<CreditCard className="h-3.5 w-3.5" />}>
            Manage Payment Methods
          </Button>
        }
      />

      {/* Current Plan Overview */}
      <Section title="Current Active Plan">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Business Plan</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Billed monthly via Stripe. Renews on Oct 1, 2026.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold font-mono-data text-foreground">
                  {formatCurrency(199)}
                </span>
                <span className="text-xs text-muted-foreground"> / mo</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Dynamic QR Code Quota</span>
                  <span className="font-semibold text-foreground">42 / 100 QRs</span>
                </div>
                <Progress value={42} variant="primary" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Monthly Scan Volume</span>
                  <span className="font-semibold text-foreground">18,490 / 50,000 Scans</span>
                </div>
                <Progress value={37} variant="success" />
              </div>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-foreground text-sm">Need Enterprise Scale?</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Unlock custom CNAME domain mapping, unlimited dynamic QRs, 99.99% SLA, and dedicated MCP tool agent quotas.
              </p>
            </div>
            <Button className="w-full mt-4" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              Upgrade to Enterprise
            </Button>
          </Card>
        </div>
      </Section>
    </PageContainer>
  );
}

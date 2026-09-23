'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Switch, Input } from '@skyra/ui';
import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, Section } from '@/components/layout/page-container';




import { Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [registrationOpen, setRegistrationOpen] = React.useState(true);

  return (
    <PageContainer>
      <PageHeader
        title="Platform Settings"
        description="Global system configuration, security policies, and feature flag management."
        actions={
          <Button
            size="sm"
            leftIcon={<Save className="h-3.5 w-3.5" />}
            onClick={() => toast({ title: 'Platform settings saved', variant: 'success' })}
          >
            Save Changes
          </Button>
        }
      />

      <Section>
        <div className="space-y-6 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>System Availability & Maintenance</CardTitle>
              <CardDescription>Control public registration and global platform availability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <p className="text-xs font-semibold text-foreground">Global Maintenance Mode</p>
                  <p className="text-[11px] text-muted-foreground">Redirect all public traffic to maintenance notice.</p>
                </div>
                <Switch checked={maintenanceMode} onChange={setMaintenanceMode} />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-xs font-semibold text-foreground">Open Self-Serve Registration</p>
                  <p className="text-[11px] text-muted-foreground">Allow new businesses to register workspaces directly.</p>
                </div>
                <Switch checked={registrationOpen} onChange={setRegistrationOpen} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security & Rate Limit Defaults</CardTitle>
              <CardDescription>Default throttling applied to non-whitelisted IP addresses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <Input defaultValue="120" type="number" 
                  label="Default Edge POP Throttle (Req / min)"
                />
              <Input defaultValue="15" type="number" 
                  label="JWT Access Token Lifetime (Minutes)"
                />
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageContainer>
  );
}

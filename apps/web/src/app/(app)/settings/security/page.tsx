'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Switch, Input } from '@skyra/ui';
import * as React from 'react';




import { ShieldCheck, Smartphone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SecuritySettingsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(true);

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication & Security</CardTitle>
          <CardDescription>Protect your workspace with Multi-Factor Authentication (TOTP).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-foreground">Authenticator App (TOTP)</p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Require a 6-digit verification code from Google Authenticator or 1Password.
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onChange={(c) => {
                setTwoFactorEnabled(c);
                toast({
                  title: c ? '2FA Enabled' : '2FA Disabled',
                  variant: c ? 'success' : 'warning',
                });
              }}
            />
          </div>

          <div className="pt-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Change Password</h4>
            <Input type="password" placeholder="••••••••••••" 
                  label="Current Password"
                />
            <Input type="password" placeholder="••••••••••••" 
                  label="New Password"
                />
            <Button size="sm" variant="outline">Update Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

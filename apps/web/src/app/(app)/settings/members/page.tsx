'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@skyra/ui';
import * as React from 'react';



import { UserPlus } from 'lucide-react';

export default function MembersSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Member Access & Roles</CardTitle>
            <CardDescription>Control who has access to this workspace and assign granular RBAC roles.</CardDescription>
          </div>
          <Button size="sm" leftIcon={<UserPlus className="h-3.5 w-3.5" />}>
            Invite
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex items-center justify-between py-2 border-b border-border text-xs">
            <div>
              <p className="font-semibold text-foreground">Sarah Connor (You)</p>
              <p className="text-muted-foreground">sarah@skyra.tech</p>
            </div>
            <Badge variant="neutral">Workspace Owner</Badge>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border text-xs">
            <div>
              <p className="font-semibold text-foreground">John Miller</p>
              <p className="text-muted-foreground">john@skyra.tech</p>
            </div>
            <Badge variant="neutral">Admin</Badge>
          </div>
          <div className="flex items-center justify-between py-2 text-xs">
            <div>
              <p className="font-semibold text-foreground">Elena Rostova</p>
              <p className="text-muted-foreground">elena@skyra.tech</p>
            </div>
            <Badge variant="neutral">Member</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

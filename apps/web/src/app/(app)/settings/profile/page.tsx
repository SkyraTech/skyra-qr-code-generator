'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Avatar } from '@skyra/ui';
import * as React from 'react';




import { toast } from '@/hooks/use-toast';

export default function ProfileSettingsPage() {
  const [name, setName] = React.useState('Sarah Connor');
  const [email, setEmail] = React.useState('sarah@skyra.tech');

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Profile</CardTitle>
          <CardDescription>Update your personal identity details and display photo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="flex items-center gap-4 pb-2">
            <Avatar fallback="SC" size="lg" />
            <div>
              <Button size="sm" variant="outline">Change Avatar</Button>
              <p className="text-[11px] text-muted-foreground mt-1">JPG, PNG, or WebP under 2MB.</p>
            </div>
          </div>

          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} 
                  label="Full Name"
                  required
                />

          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                  label="Email Address"
                  description="Used for security verification and login notifications."
                  required
                />
        </CardContent>
        <CardFooter className="flex justify-end border-t border-border pt-4">
          <Button size="sm" onClick={() => toast({ title: 'Profile updated', variant: 'success' })}>
            Save Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

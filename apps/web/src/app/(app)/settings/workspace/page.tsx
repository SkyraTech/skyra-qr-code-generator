'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input } from '@skyra/ui';
import * as React from 'react';



import { FormField } from '@/components/forms/form-field';
import { toast } from '@/hooks/use-toast';

export default function WorkspaceSettingsPage() {
  const [wsName, setWsName] = React.useState('Skyra Tech HQ');
  const [slug, setSlug] = React.useState('skyra-tech');

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Identity</CardTitle>
          <CardDescription>Configure workspace branding, URL slugs, and default landing domains.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <FormField label="Workspace Name" required htmlFor="wsName">
            <Input id="wsName" value={wsName} onChange={(e) => setWsName(e.target.value)} />
          </FormField>

          <FormField
            label="Workspace URL Slug"
            required
            htmlFor="slug"
            description="Used in public landing page paths and API resource endpoints."
          >
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </FormField>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-border pt-4">
          <Button size="sm" onClick={() => toast({ title: 'Workspace settings saved', variant: 'success' })}>
            Save Workspace
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

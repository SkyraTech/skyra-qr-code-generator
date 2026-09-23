'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@skyra/ui';
import { DynamicForm, FieldDef } from '@skyra/dynamic-form';
import * as React from 'react';
import { toast } from '@/hooks/use-toast';

export default function WorkspaceSettingsPage() {
  const fields: FieldDef[] = [
    {
      name: 'wsName',
      type: 'text',
      label: 'Workspace Name',
      required: true,
      defaultValue: 'Skyra Tech HQ',
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Workspace URL Slug',
      description: 'Used in public landing page paths and API resource endpoints.',
      required: true,
      defaultValue: 'skyra-tech',
    },
  ];

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log('Saved workspace:', values);
    toast({ title: 'Workspace settings saved', variant: 'success' });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Identity</CardTitle>
          <CardDescription>Configure workspace branding, URL slugs, and default landing domains.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <DynamicForm
            fields={fields}
            onSubmit={handleSubmit}
            submitLabel="Save Workspace"
          />
        </CardContent>
      </Card>
    </div>
  );
}
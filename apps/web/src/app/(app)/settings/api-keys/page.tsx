'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@skyra/ui';
import * as React from 'react';



import { CodeBlock } from '@/components/data-display/code-block';
import { Key, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ApiKeysSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>REST API Keys</CardTitle>
            <CardDescription>
              Programmatic access tokens for creating dynamic QRs and querying scan telemetry.
            </CardDescription>
          </div>
          <Button
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => toast({ title: 'New API Key Generated', variant: 'success' })}
          >
            Create Key
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="rounded-lg border border-border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" />
                <span className="font-semibold text-xs text-foreground">Production Automation Key</span>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive h-8 px-2"
                onClick={() => toast({ title: 'Key Revoked', variant: 'destructive' })}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                <span>Revoke</span>
              </Button>
            </div>
            <div className="font-mono-data text-xs text-muted-foreground bg-muted p-2 rounded border border-border">
              sq_live_9f8e7d6c5b4a3...
            </div>
            <p className="text-[11px] text-muted-foreground">Created Aug 14, 2026 • Last used 2 hours ago</p>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Authentication Example
            </h4>
            <CodeBlock
              language="bash"
              code={`curl -X GET https://api.skyra.link/api/v1/qrs \\\n  -H "Authorization: Bearer sq_live_..."`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

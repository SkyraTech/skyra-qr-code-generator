'use client';
import { Button, EmptyState } from '@skyra/ui';
import * as React from 'react';
import Link from 'next/link';

import { Compass } from 'lucide-react';
import { ROUTES } from '@/config/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="max-w-md w-full">
        <EmptyState
          icon={<Compass className="h-8 w-8 text-primary" />}
          title="Page Not Found (404)"
          description="The route or resource you requested could not be located in this workspace or administration surface."
          action={
            <div className="flex gap-2 justify-center">
              <Button onClick={() => window.location.href = ROUTES.DASHBOARD}>Return to Dashboard</Button>
              <Button variant="outline" onClick={() => window.location.href = ROUTES.HOME}>Return to Homepage</Button>
            </div>
          }
        />
      </div>
    </div>
  );
}
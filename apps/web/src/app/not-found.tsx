'use client';

import * as React from 'react';
import Link from 'next/link';
import { EmptyState } from '@/components/feedback/empty-state';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Compass, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/config/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="max-w-md w-full">
        <EmptyState
          icon={<Compass className="h-8 w-8 text-primary" />}
          title="Page Not Found (404)"
          description="The route or resource you requested could not be located in this workspace or administration surface."
          actionLabel="Return to Dashboard"
          onAction={() => {
            window.location.href = ROUTES.DASHBOARD;
          }}
          secondaryActionLabel="Return to Homepage"
          onSecondaryAction={() => {
            window.location.href = ROUTES.HOME;
          }}
        />
      </div>
    </div>
  );
}

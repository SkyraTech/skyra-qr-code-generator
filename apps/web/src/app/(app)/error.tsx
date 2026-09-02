'use client';

import * as React from 'react';
import { ErrorState } from '@/components/feedback/error-state';
import { PageContainer } from '@/components/layout/page-container';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Workspace application error:', error);
  }, [error]);

  return (
    <PageContainer>
      <div className="py-12">
        <ErrorState
          title="Workspace Application Error"
          message={error.message || 'An unexpected error occurred while rendering the workspace.'}
          onRetry={reset}
        />
      </div>
    </PageContainer>
  );
}

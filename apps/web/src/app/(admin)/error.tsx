'use client';
import * as React from 'react';
import { ErrorState } from '@skyra/ui';
import { PageContainer } from '@/components/layout/page-container';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Admin route error:', error);
  }, [error]);

  return (
    <PageContainer>
      <div className="py-12">
        <ErrorState
          title="Administrative Console Error"
          description={error.message || 'An unexpected error occurred within the administration panel.'}
          onRetry={reset}
        />
      </div>
    </PageContainer>
  );
}

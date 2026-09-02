'use client';

import { LoadingState } from '@/components/feedback/loading-state';
import { PageContainer } from '@/components/layout/page-container';

export default function AppLoading() {
  return (
    <PageContainer>
      <div className="flex items-center justify-center py-20">
        <LoadingState message="Loading workspace data..." size="lg" />
      </div>
    </PageContainer>
  );
}

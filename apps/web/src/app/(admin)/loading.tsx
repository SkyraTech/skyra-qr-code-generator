'use client';

import { LoadingState } from '@/components/feedback/loading-state';
import { PageContainer } from '@/components/layout/page-container';

export default function AdminLoading() {
  return (
    <PageContainer>
      <div className="flex items-center justify-center py-20">
        <LoadingState message="Loading administrative console..." size="lg" />
      </div>
    </PageContainer>
  );
}

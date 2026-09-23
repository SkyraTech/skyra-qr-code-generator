'use client';
import { PageLoader } from '@skyra/ui';
import { PageContainer } from '@/components/layout/page-container';

export default function AppLoading() {
  return (
    <PageContainer>
      <div className="flex items-center justify-center py-20">
        <PageLoader message="Loading workspace data..."  />
      </div>
    </PageContainer>
  );
}

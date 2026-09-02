'use client';

import * as React from 'react';
import { Sidebar } from './sidebar';
import { TopNavigation } from './top-navigation';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

export function AppShell({
  children,
  breadcrumbs,
}: {
  children: React.ReactNode;
  breadcrumbs?: React.ReactNode;
}) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main App Area */}
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300 min-w-0',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        <TopNavigation breadcrumbs={breadcrumbs} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer } from '@/components/layout/page-container';
import { cn } from '@/lib/utils';
import { User, Building, Users, Shield, Key } from 'lucide-react';
import { ROUTES } from '@/config/routes';

const settingsTabs = [
  { label: 'My Profile', href: ROUTES.SETTINGS.PROFILE, icon: User },
  { label: 'Workspace', href: ROUTES.SETTINGS.WORKSPACE, icon: Building },
  { label: 'Members', href: ROUTES.SETTINGS.MEMBERS, icon: Users },
  { label: 'Security & 2FA', href: ROUTES.SETTINGS.SECURITY, icon: Shield },
  { label: 'Developer API Keys', href: ROUTES.SETTINGS.API_KEYS, icon: Key },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Configure your personal profile, workspace identity, security credentials, and developer access."
      />

      {/* Horizontal Sub-Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-6 overflow-x-auto py-1" aria-label="Settings tabs">
          {settingsTabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex items-center gap-2 border-b-2 py-2 text-xs font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-2">{children}</div>
    </PageContainer>
  );
}

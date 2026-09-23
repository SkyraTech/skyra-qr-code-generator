'use client';
import { Tooltip } from '@skyra/ui';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  QrCode,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Building,
} from 'lucide-react';
import { PROJECT_CODENAME } from '@skyra/shared';
import { useUIStore } from '@/stores/ui-store';
import { NavigationSection } from '@/config/navigation/navigation-types';
import { userNavigation } from '@/config/navigation/user-navigation';
import { adminNavigation } from '@/config/navigation/admin-navigation';
import { isRouteActive } from '@/config/navigation/navigation-utils';


export interface SidebarProps {
  variant?: 'user' | 'admin';
  sections?: NavigationSection[];
  className?: string;
}

export function Sidebar({
  variant = 'user',
  sections: customSections,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, sidebarOpen, setSidebarOpen } =
    useUIStore();

  const sections =
    customSections || (variant === 'admin' ? adminNavigation : userNavigation);

  const homeHref = variant === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-in fade-in-0"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 select-none',
          sidebarCollapsed ? 'w-16' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <Link
            href={homeHref}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-105',
                variant === 'admin'
                  ? 'bg-amber-600 text-white'
                  : 'bg-primary text-primary-foreground'
              )}
            >
              {variant === 'admin' ? (
                <ShieldAlert className="h-5 w-5" />
              ) : (
                <QrCode className="h-5 w-5" />
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground">
                  {PROJECT_CODENAME}
                </span>
                <span
                  className={cn(
                    'text-[10px] uppercase tracking-widest font-semibold',
                    variant === 'admin'
                      ? 'text-amber-600 dark:text-amber-400 font-bold'
                      : 'text-muted-foreground'
                  )}
                >
                  {variant === 'admin' ? 'Platform Admin' : 'Workspace App'}
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Workspace Context Switcher (Placeholder) */}
        {!sidebarCollapsed && variant === 'user' && (
          <div className="px-3 pt-3 pb-1">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs">
              <div className="flex items-center gap-2 truncate">
                <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-semibold truncate text-foreground">
                  Skyra Tech HQ
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono bg-background px-1.5 py-0.5 rounded border border-border">
                Prod
              </span>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!sidebarCollapsed && section.title && (
                <h4 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2">
                  {section.title}
                </h4>
              )}
              {section.items.map((item) => {
                const isActive = isRouteActive(
                  pathname,
                  item.href,
                  item.exactMatch
                );
                const IconComponent = item.icon;

                const linkContent = (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                      sidebarCollapsed && 'justify-center px-2'
                    )}
                  >
                    <span
                      className={cn(
                        'shrink-0 transition-transform group-hover:scale-110',
                        isActive && 'text-primary'
                      )}
                    >
                      <IconComponent className="h-4 w-4" />
                    </span>
                    {!sidebarCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );

                if (sidebarCollapsed) {
                  return (
                    <Tooltip key={item.href} content={item.label} >
                      {linkContent}
                    </Tooltip>
                  );
                }

                return linkContent;
              })}
            </div>
          ))}
        </div>

        {/* Footer Collapse Toggle */}
        <div className="hidden lg:flex items-center justify-between p-3 border-t border-sidebar-border">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex h-8 w-full items-center justify-center gap-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
            aria-label={
              sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse Navigation</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

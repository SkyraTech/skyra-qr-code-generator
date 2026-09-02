'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  QrCode,
  BarChart3,
  Layers,
  Settings,
  Users,
  CreditCard,
  Key,
  Bot,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Sliders,
} from 'lucide-react';
import { PROJECT_CODENAME } from '@skyra/shared';
import { useUIStore } from '@/stores/ui-store';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

const defaultNavSections: NavSection[] = [
  {
    title: 'Workspace',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        title: 'QR Codes',
        href: '/qrs',
        icon: <QrCode className="h-4 w-4" />,
      },
      {
        title: 'Campaigns',
        href: '/campaigns',
        icon: <FolderOpen className="h-4 w-4" />,
      },
      {
        title: 'Landing Pages',
        href: '/landing-pages',
        icon: <Layers className="h-4 w-4" />,
      },
      {
        title: 'Analytics',
        href: '/analytics',
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        title: 'Team & RBAC',
        href: '/team',
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: 'Billing & Plans',
        href: '/billing',
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        title: 'Developer API',
        href: '/developer',
        icon: <Key className="h-4 w-4" />,
      },
      {
        title: 'MCP AI Agent',
        href: '/mcp',
        icon: <Bot className="h-4 w-4" />,
        badge: 'Jarvis',
      },
      {
        title: 'Settings',
        href: '/settings',
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
  {
    title: 'Design System',
    items: [
      {
        title: 'UI Preview Showcase',
        href: '/ui-preview',
        icon: <Sliders className="h-4 w-4" />,
        badge: 'Demo',
      },
    ],
  },
];

export function Sidebar({
  sections = defaultNavSections,
  className,
}: {
  sections?: NavSection[];
  className?: string;
}) {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, sidebarOpen, setSidebarOpen } =
    useUIStore();

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
            href="/ui-preview"
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <QrCode className="h-5 w-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground">
                  {PROJECT_CODENAME}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                  SaaS Platform
                </span>
              </div>
            )}
          </Link>
        </div>

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
                const isActive = pathname === item.href;
                return (
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
                    title={sidebarCollapsed ? item.title : undefined}
                  >
                    <span
                      className={cn(
                        'shrink-0 transition-transform group-hover:scale-110',
                        isActive && 'text-primary'
                      )}
                    >
                      {item.icon}
                    </span>
                    {!sidebarCollapsed && (
                      <span className="flex-1 truncate">{item.title}</span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Toggle */}
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

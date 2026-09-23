'use client';
import { Avatar, Button, Badge, DropdownMenu, Breadcrumb } from '@skyra/ui';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/ui-store';
import { useTheme } from '@/providers/theme-provider';




import { getBreadcrumbForRoute } from '@/config/navigation/navigation-utils';
import {
  Menu,
  Sun,
  Moon,
  Laptop,
  Bell,
  Search,
  Shield,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { ROUTES } from '@/config/routes';

export interface TopNavigationProps {
  variant?: 'user' | 'admin';
  breadcrumbs?: React.ReactNode;
  className?: string;
}

export function TopNavigation({
  variant = 'user',
  breadcrumbs,
  className,
}: TopNavigationProps) {
  const pathname = usePathname();
  const { toggleSidebar } = useUIStore();
  const { theme, setTheme } = useTheme();

  // Automatic breadcrumb fallback
  const renderedBreadcrumb =
    breadcrumbs || <Breadcrumb><span /></Breadcrumb>;

  const themeOptions = [
    {
      label: 'Light',
      icon: <Sun className="h-3.5 w-3.5" />,
      onClick: () => setTheme('light'),
    },
    {
      label: 'Dark',
      icon: <Moon className="h-3.5 w-3.5" />,
      onClick: () => setTheme('dark'),
    },
    {
      label: 'System',
      icon: <Laptop className="h-3.5 w-3.5" />,
      onClick: () => setTheme('system'),
    },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 transition-all',
        className
      )}
    >
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          iconOnly={true}
          className="lg:hidden h-9 w-9 text-muted-foreground"
          onClick={toggleSidebar}
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          {renderedBreadcrumb}
          {variant === 'admin' && (
            <Badge variant="warning" size="sm" className="hidden sm:inline-flex">
              Platform Admin
            </Badge>
          )}
        </div>
      </div>

      {/* Right: Actions, Context Switcher, Theme Toggle, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Trigger */}
        <button
          type="button"
          className="hidden md:flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground shadow-sm w-44 lg:w-56 transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Quick find...</span>
          <kbd className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono border border-border">
            ⌘K
          </kbd>
        </button>

        {/* Cross-Surface Shortcut (Admin <-> User) */}
        {variant === 'user' ? (
          <Link
            href={ROUTES.ADMIN.DASHBOARD}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-muted"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin</span>
            <ArrowUpRight className="h-3 w-3 opacity-60" />
          </Link>
        ) : (
          <Link
            href={ROUTES.DASHBOARD}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
          >
            <span>Customer App</span>
            <ArrowUpRight className="h-3 w-3 opacity-60" />
          </Link>
        )}

        {/* Notifications Trigger */}
        <Button
          variant="ghost"
          iconOnly={true}
          className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* Theme Toggle */}
        <DropdownMenu
          align="end"
          trigger={
            <Button
              variant="ghost"
              iconOnly={true}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          }
          items={themeOptions}
        />

        {/* User Account Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <Avatar
            fallback={variant === 'admin' ? 'PA' : 'SQ'}
            size="sm"
          />
          <div className="hidden xl:block text-left text-xs">
            <p className="font-semibold text-foreground leading-tight">
              {variant === 'admin' ? 'Super Admin' : 'Skyra Operator'}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {variant === 'admin' ? 'Platform Console' : 'Acme Workspace'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

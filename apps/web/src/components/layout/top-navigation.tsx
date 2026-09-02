'use client';

import * as React from 'react';
import { useUIStore } from '@/stores/ui-store';
import { useTheme } from '@/providers/theme-provider';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Menu,
  Sun,
  Moon,
  Laptop,
  Bell,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu } from '@/components/ui/dropdown-menu';

export function TopNavigation({
  breadcrumbs,
  className,
}: {
  breadcrumbs?: React.ReactNode;
  className?: string;
}) {
  const { toggleSidebar, sidebarCollapsed } = useUIStore();
  const { theme, setTheme } = useTheme();

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
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 text-muted-foreground"
          onClick={toggleSidebar}
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {breadcrumbs}
      </div>

      {/* Right: Actions, Search, Theme Toggle, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search */}
        <button
          type="button"
          className="hidden md:flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground shadow-sm w-48 lg:w-64 transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search or jump to...</span>
          <kbd className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono border border-border">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* Theme Toggle */}
        <DropdownMenu
          align="right"
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          }
          items={themeOptions}
        />

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <Avatar fallback="SQ" size="sm" />
          <div className="hidden xl:block text-left text-xs">
            <p className="font-semibold text-foreground leading-tight">
              Skyra Operator
            </p>
            <p className="text-[10px] text-muted-foreground">Admin Workspace</p>
          </div>
        </div>
      </div>
    </header>
  );
}

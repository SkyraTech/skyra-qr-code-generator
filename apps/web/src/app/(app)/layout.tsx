import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';

export default function UserAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell variant="user">{children}</AppShell>;
}

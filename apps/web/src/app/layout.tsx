import type { Metadata } from 'next';
// ── Skyra Platform CSS Foundation ──
// Imported via JS so Next.js handles ordering correctly.
// @skyra/design-tokens/tokens.css  → --skyra-* CSS custom properties (light + dark)
// @skyra/design-tokens/reset.css   → Skyra's normalisation reset
// @skyra/ui/styles.css             → .skyra-* component class styles
import '@skyra/design-tokens/tokens.css';
import '@skyra/design-tokens/reset.css';
import '@skyra/ui/styles.css';
// ── SkyraQR own global styles (Tailwind) ──
import './globals.css';
import { PROJECT_CODENAME, PARENT_COMPANY } from '@skyra/shared';
import { ThemeProvider } from '@/providers/theme-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ToastProvider } from '@/providers/toast-provider';

export const metadata: Metadata = {
  title: `${PROJECT_CODENAME} — Enterprise B2B QR SaaS Platform`,
  description: `Next-generation dynamic QR generation, context-aware routing, micro-landing pages, and autonomous AI-agent operations. Built by ${PARENT_COMPANY}.`,
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-primary selection:text-primary-foreground min-h-screen">
        <ThemeProvider defaultTheme="system" storageKey="skyra_theme">
          <QueryProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

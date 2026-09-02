import type { Metadata } from 'next';
import './globals.css';
import { PROJECT_CODENAME, PARENT_COMPANY } from '@skyra/shared';

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
    <html lang="en">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

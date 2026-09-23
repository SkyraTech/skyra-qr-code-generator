'use client';
import { Button, Badge } from '@skyra/ui';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  QrCode,
  Server,
  Database,
  ShieldCheck,
  Cpu,
  Layers,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  ArrowRight,
  Shield,
  LayoutDashboard,
} from 'lucide-react';
import {
  PROJECT_CODENAME,
  PARENT_COMPANY,
  COMMERCIAL_PRODUCT_NAME,
  HealthCheckResponse,
} from '@skyra/shared';


import { ROUTES } from '@/config/routes';

export default function HomePage() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/health`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data: HealthCheckResponse = await res.json();
      setHealth(data);
      setLastChecked(new Date());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Backend unreachable');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-foreground tracking-tight">
                  {PROJECT_CODENAME}
                </span>
                <Badge variant="neutral" size="sm">
                  Codename
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">by {PARENT_COMPANY}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={ROUTES.LOGIN}>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href={ROUTES.DASHBOARD}>
              <Button size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Go to App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            <ShieldCheck className="h-4 w-4" />
            <span>Phase 0C — App Shell & Navigation Foundation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            High-Performance B2B QR SaaS Platform
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Engineered with a clean separation of concerns: Next.js 14+ presentation tier, authoritative NestJS Fastify backend, and Supabase PostgreSQL.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href={ROUTES.DASHBOARD}>
              <Button leftIcon={<LayoutDashboard className="h-4 w-4" />}>
                Customer Workspace Shell
              </Button>
            </Link>
            <Link href={ROUTES.ADMIN.DASHBOARD}>
              <Button variant="outline" leftIcon={<Shield className="h-4 w-4" />}>
                Platform Admin Console
              </Button>
            </Link>
            <Link href={ROUTES.UI_PREVIEW}>
              <Button variant="outline">
                UI Design System Preview
              </Button>
            </Link>
          </div>
        </section>

        {/* Live Backend Connection Card */}
        <section className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  Authoritative Backend Health & Connectivity
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Direct verification between Next.js UI and NestJS + Fastify API (`http://localhost:4000/health`)
              </p>
            </div>
            <Button
              onClick={fetchHealth}
              disabled={loading}
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Refresh Status
            </Button>
          </div>

          <div className="pt-6">
            {loading && !health && !error && (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-sm gap-2">
                <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                <span>Checking backend connection...</span>
              </div>
            )}

            {health && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">API Status</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1 uppercase tracking-wide">
                    {health.status}
                  </p>
                  <span className="text-[10px] text-emerald-600/80">Service: {health.service}</span>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Environment</span>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xl font-bold text-foreground mt-1 capitalize">
                    {health.environment}
                  </p>
                  <span className="text-[10px] text-muted-foreground">v{health.version}</span>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Uptime</span>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xl font-bold text-foreground mt-1">
                    {health.uptimeSeconds}s
                  </p>
                  <span className="text-[10px] text-muted-foreground">Fastify Engine</span>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Database & Redis</span>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xl font-bold text-amber-600 mt-1">
                    Deferred
                  </p>
                  <span className="text-[10px] text-muted-foreground">Supabase in Phase 1</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold">Backend connection status: Offline / Starting</p>
                  <p className="opacity-90">
                    Could not reach NestJS API at <code className="bg-muted px-1 py-0.5 rounded">http://localhost:4000/health</code> ({error}).
                  </p>
                  <p className="text-amber-600 pt-1">
                    Tip: Start both services concurrently from the root directory using <code className="bg-muted px-1 py-0.5 rounded font-mono font-bold">pnpm dev</code>.
                  </p>
                </div>
              </div>
            )}

            {lastChecked && (
              <p className="text-[11px] text-muted-foreground mt-3 text-right">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
        </section>

        {/* Feature Capabilities Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-card border border-border shadow-sm space-y-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <QrCode className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">16 QR Barcode Types</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dynamic URLs, vCard Plus, Digital Menus, WiFi, PDF Catalogs, Multi-links, and GS1 Digital Links.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border shadow-sm space-y-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Sub-30ms Edge Redirects</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Decoupled edge resolution with multi-tier caching, OS routing, geo-targeting, and dayparting.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border shadow-sm space-y-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Cpu className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Native MCP AI Server</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Jarvis AI Agent integration via Admin-Managed MCP Credentials with high-risk human approval triggers.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border shadow-sm space-y-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Zero Raw IP Telemetry</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Privacy-by-design scan analytics using daily rotating HMAC-SHA256 salts aligning with GDPR & DPDP.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {PARENT_COMPANY}. Internal Codename: {PROJECT_CODENAME} (Commercial Product Name: {COMMERCIAL_PRODUCT_NAME}). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href={ROUTES.LOGIN} className="hover:text-foreground transition-colors">Login</Link>
            <span>•</span>
            <Link href={ROUTES.REGISTER} className="hover:text-foreground transition-colors">Register</Link>
            <span>•</span>
            <Link href={ROUTES.UI_PREVIEW} className="hover:text-foreground transition-colors">UI Preview</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

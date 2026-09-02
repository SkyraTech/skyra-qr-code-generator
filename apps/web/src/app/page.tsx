'use client';

import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import {
  PROJECT_CODENAME,
  PARENT_COMPANY,
  COMMERCIAL_PRODUCT_NAME,
  HealthCheckResponse,
} from '@skyra/shared';

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
      // Attempt to query via Next.js proxy or direct API URL
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
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  {PROJECT_CODENAME}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
                  Codename
                </span>
              </div>
              <p className="text-xs text-slate-500">by {PARENT_COMPANY}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Phase 0 Foundation Active</span>
            </div>
            <a
              href="https://github.com/SkyraTech/skyra-qr-code-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              <Code2 className="h-4 w-4" />
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/70 text-indigo-800 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <span>Monorepo Architecture Initialized</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            High-Performance B2B QR SaaS Platform
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Engineered with a clean separation of concerns: Next.js 14+ presentation tier, authoritative NestJS Fastify backend, and Supabase PostgreSQL.
          </p>
        </section>

        {/* Live Backend Connection Card */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Authoritative Backend Health & Connectivity
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Direct verification between Next.js UI and NestJS + Fastify API (`http://localhost:4000/health`)
              </p>
            </div>
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          <div className="pt-6">
            {loading && !health && !error && (
              <div className="flex items-center justify-center py-8 text-slate-500 text-sm gap-2">
                <RefreshCw className="h-5 w-5 animate-spin text-indigo-600" />
                <span>Checking backend connection...</span>
              </div>
            )}

            {health && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-emerald-800">API Status</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-xl font-bold text-emerald-950 mt-1 uppercase tracking-wide">
                    {health.status}
                  </p>
                  <span className="text-[10px] text-emerald-700">Service: {health.service}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">Environment</span>
                    <Layers className="h-4 w-4 text-slate-500" />
                  </div>
                  <p className="text-xl font-bold text-slate-900 mt-1 capitalize">
                    {health.environment}
                  </p>
                  <span className="text-[10px] text-slate-500">v{health.version}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">Uptime</span>
                    <Clock className="h-4 w-4 text-slate-500" />
                  </div>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {health.uptimeSeconds}s
                  </p>
                  <span className="text-[10px] text-slate-500">Fastify Engine</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">Database & Redis</span>
                    <Database className="h-4 w-4 text-slate-500" />
                  </div>
                  <p className="text-xl font-bold text-amber-600 mt-1">
                    Deferred
                  </p>
                  <span className="text-[10px] text-slate-500">Supabase in Phase 1</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold">Backend connection status: Offline / Starting</p>
                  <p className="text-amber-700">
                    Could not reach NestJS API at <code className="bg-amber-100 px-1 py-0.5 rounded">http://localhost:4000/health</code> ({error}).
                  </p>
                  <p className="text-amber-600 pt-1">
                    Tip: Start both services concurrently from the root directory using <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">pnpm dev</code>.
                  </p>
                </div>
              </div>
            )}

            {lastChecked && (
              <p className="text-[11px] text-slate-400 mt-3 text-right">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
        </section>

        {/* Architecture & Separation of Concerns Diagram */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold tracking-tight">
              Strict Separation of Concerns Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Tier 1: Presentation
                </span>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                  apps/web
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-100">Next.js 14+ App Router</h3>
              <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                <li>Server & Client UI Components</li>
                <li>QR Design Studio & Analytics Views</li>
                <li>Presentation & Client State Only</li>
                <li className="text-emerald-400 font-medium">Zero Direct DB Access</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Tier 2: Business Authority
                </span>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                  apps/api
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-100">NestJS + Fastify</h3>
              <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                <li>Authentication & JWT/Session Security</li>
                <li>Multi-Tenant Scoping & RBAC</li>
                <li>Dynamic QR Routing & Scannability</li>
                <li className="text-indigo-300 font-medium">Shared Domain Services</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Tier 3: Persistence
                </span>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                  Supabase
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-100">PostgreSQL 16</h3>
              <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                <li>57 Relational Production Tables</li>
                <li>UUIDv7 Sequential Primary Keys</li>
                <li>Monthly Partitioned Scan Events</li>
                <li className="text-slate-300 font-medium">Accessed Only via NestJS</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature Capabilities Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <QrCode className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">16 QR Barcode Types</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dynamic URLs, vCard Plus, Digital Menus, WiFi, PDF Catalogs, Multi-links, and GS1 Digital Links.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Sub-30ms Edge Redirects</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Decoupled edge resolution with multi-tier caching, OS routing, geo-targeting, and dayparting.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Cpu className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Native MCP AI Server</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Jarvis AI Agent integration via Admin-Managed MCP Credentials with high-risk human approval triggers.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Zero Raw IP Telemetry</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Privacy-by-design scan analytics using daily rotating HMAC-SHA256 salts aligning with GDPR & DPDP.
            </p>
          </div>
        </section>

        {/* Local Developer Quickstart */}
        <section className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Local Development Quickstart</h2>
          </div>
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto space-y-2">
            <p className="text-slate-400"># 1. Install all dependencies across the monorepo</p>
            <p className="text-emerald-400">pnpm install</p>
            <p className="text-slate-400"># 2. Run both Next.js and NestJS concurrently with Turbo</p>
            <p className="text-emerald-400">pnpm dev</p>
            <p className="text-slate-400"># 3. Type-check all workspaces</p>
            <p className="text-emerald-400">pnpm check-types</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {PARENT_COMPANY}. Internal Codename: {PROJECT_CODENAME} (Commercial Product Name: {COMMERCIAL_PRODUCT_NAME}). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>Next.js 14+</span>
            <span>•</span>
            <span>NestJS Fastify</span>
            <span>•</span>
            <span>Turborepo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

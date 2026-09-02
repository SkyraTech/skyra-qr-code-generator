'use client';

import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer, DashboardGrid, Section } from '@/components/layout/page-container';
import { StatsCard } from '@/components/layout/stats-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip } from '@/components/ui/tooltip';
import { CodeBlock } from '@/components/data-display/code-block';
import { StatusDot } from '@/components/data-display/status-dot';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';
import { DataTable } from '@/components/tables/data-table';
import { ColumnDef, PaginationState, SortState } from '@/types/table';
import { DataTableRowActions } from '@/components/tables/data-table-row-actions';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/dialogs/dialog';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { DeleteConfirmDialog } from '@/components/dialogs/delete-confirm-dialog';
import { Drawer } from '@/components/dialogs/drawer';
import { Alert } from '@/components/feedback/alert';
import { LoadingState } from '@/components/feedback/loading-state';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { FormField } from '@/components/forms/form-field';
import { CrudForm, FormMode } from '@/components/forms/crud-form';
import { toast } from '@/hooks/use-toast';
import { formatNumber, formatCurrency, formatDate } from '@/lib/formatters';
import {
  QrCode,
  Users,
  Activity,
  CreditCard,
  Plus,
  Trash2,
  Sliders,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

// Generic Mock Row Type for the Demo Table
interface MockRecord {
  id: string;
  name: string;
  shortCode: string;
  type: string;
  scans: number;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  createdAt: string;
}

const initialMockData: MockRecord[] = [
  {
    id: '018f3a99-0001-7000-8000-000000000001',
    name: 'Summer Campaign Menu QR',
    shortCode: 'sm-mnu1',
    type: 'DIGITAL_MENU',
    scans: 1420,
    status: 'ACTIVE',
    createdAt: '2026-08-28T10:00:00Z',
  },
  {
    id: '018f3a99-0002-7000-8000-000000000002',
    name: 'Executive Contact vCard',
    shortCode: 'ceo-vcf',
    type: 'VCARD_PLUS',
    scans: 382,
    status: 'ACTIVE',
    createdAt: '2026-08-29T14:30:00Z',
  },
  {
    id: '018f3a99-0003-7000-8000-000000000003',
    name: 'Store WiFi Guest Access',
    shortCode: 'wf-nyc',
    type: 'WIFI_ACCESS',
    scans: 4890,
    status: 'ACTIVE',
    createdAt: '2026-08-30T09:15:00Z',
  },
  {
    id: '018f3a99-0004-7000-8000-000000000004',
    name: 'App Store Smart Redirect',
    shortCode: 'dl-app',
    type: 'SMART_APP_LINK',
    scans: 12450,
    status: 'PAUSED',
    createdAt: '2026-08-31T16:45:00Z',
  },
  {
    id: '018f3a99-0005-7000-8000-000000000005',
    name: 'Spring Clearance Coupon',
    shortCode: 'sp-cpn',
    type: 'COUPON_PROMO',
    scans: 820,
    status: 'EXPIRED',
    createdAt: '2026-09-01T11:20:00Z',
  },
];

export default function UIPreviewPage() {
  // Dialog States
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);

  // Form State
  const [formMode, setFormMode] = React.useState<FormMode>('create');
  const [formValues, setFormValues] = React.useState({
    name: '',
    targetUrl: '',
    category: 'WEB',
    isActive: true,
  });
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Table State
  const [tableData, setTableData] = React.useState<MockRecord[]>(initialMockData);
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedRows, setSelectedRows] = React.useState<Set<string | number>>(new Set());
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 5 });
  const [sorting, setSorting] = React.useState<SortState | null>({ columnId: 'scans', direction: 'desc' });
  const [selectedMulti, setSelectedMulti] = React.useState<string[]>(['react', 'tailwind']);

  // Table Columns Definition
  const columns: ColumnDef<MockRecord>[] = [
    {
      id: 'name',
      header: 'QR Campaign Name',
      accessorKey: 'name',
      enableSorting: true,
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-foreground">{row.name}</div>
          <div className="text-[11px] text-muted-foreground font-mono-data">
            https://skyra.link/{row.shortCode}
          </div>
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'type',
      cell: ({ value }) => (
        <span className="font-mono-data text-[11px] bg-muted px-2 py-0.5 rounded border border-border">
          {String(value)}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) => {
        const s = String(value);
        if (s === 'ACTIVE') return <Badge variant="success">Active</Badge>;
        if (s === 'PAUSED') return <Badge variant="warning">Paused</Badge>;
        return <Badge variant="destructive">Expired</Badge>;
      },
    },
    {
      id: 'scans',
      header: 'Scans',
      accessorKey: 'scans',
      enableSorting: true,
      cell: ({ value }) => (
        <span className="font-mono-data font-bold text-foreground">
          {formatNumber(Number(value))}
        </span>
      ),
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorKey: 'createdAt',
      cell: ({ value }) => (
        <span className="text-muted-foreground text-xs">
          {formatDate(String(value))}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onView={(item) => toast({ title: `Viewing ${item.name}` })}
          onEdit={(item) => {
            setFormMode('edit');
            setFormValues({
              name: item.name,
              targetUrl: `https://example.com/${item.shortCode}`,
              category: 'WEB',
              isActive: item.status === 'ACTIVE',
            });
            toast({ title: 'Editing record in form below' });
          }}
          onDelete={(item) => setIsDeleteOpen(true)}
        />
      ),
    },
  ];

  // Client-side search and sort simulation
  const filteredData = React.useMemo(() => {
    let result = [...tableData];
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.shortCode.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
      );
    }
    if (sorting) {
      result.sort((a, b) => {
        const aVal = a[sorting.columnId as keyof MockRecord];
        const bVal = b[sorting.columnId as keyof MockRecord];
        if (aVal < bVal) return sorting.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sorting.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [tableData, searchValue, sorting]);

  // Handle Form Submit
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formValues.name.trim()) errors.name = 'Campaign name is required';
    if (!formValues.targetUrl.trim()) errors.targetUrl = 'Target URL is required';
    else if (!formValues.targetUrl.startsWith('http')) errors.targetUrl = 'URL must begin with http:// or https://';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: 'Validation Failed',
        description: 'Please correct the highlighted fields before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (formMode === 'create') {
        const newRecord: MockRecord = {
          id: `mock-${Date.now()}`,
          name: formValues.name,
          shortCode: `sc-${Math.random().toString(36).substring(2, 6)}`,
          type: 'DYNAMIC_URL',
          scans: 0,
          status: formValues.isActive ? 'ACTIVE' : 'PAUSED',
          createdAt: new Date().toISOString(),
        };
        setTableData([newRecord, ...tableData]);
        toast({
          title: 'Campaign Created',
          description: `"${newRecord.name}" successfully created with short code ${newRecord.shortCode}.`,
          variant: 'success',
        });
      } else {
        toast({
          title: 'Changes Saved',
          description: `"${formValues.name}" was successfully updated.`,
          variant: 'success',
        });
      }
      setFormValues({ name: '', targetUrl: '', category: 'WEB', isActive: true });
      setFormMode('create');
    }, 800);
  };

  return (
    <AppShell
      breadcrumbs={
        <Breadcrumbs
          items={[
            { label: 'SkyraQR', href: '/' },
            { label: 'Design System' },
            { label: 'UI Preview' },
          ]}
        />
      }
    >
      <PageContainer>
        {/* Page Header */}
        <PageHeader
          title="UI Architecture & Component Showcase"
          description="A centralized, accessible, responsive design system engineered for B2B SaaS interfaces. Composable primitives power CRUD tables, forms, modals, and telemetry views."
          badge={<Badge variant="default">Phase 0B</Badge>}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDrawerOpen(true)}
              >
                Open Drawer
              </Button>
              <Button
                size="sm"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Open Modal
              </Button>
            </div>
          }
        />

        {/* 1. KPI Stats Cards */}
        <Section title="1. Reusable KPI Stats Cards" description="Responsive grid displaying metrics, trends, and loading skeletons.">
          <DashboardGrid columns={4}>
            <StatsCard
              title="Active Dynamic QRs"
              value={formatNumber(1248)}
              change={14.8}
              subtitle="vs last 30 days"
              icon={<QrCode className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Scans (Month)"
              value={formatNumber(48920)}
              change={22.4}
              subtitle="vs last 30 days"
              icon={<Activity className="h-4 w-4" />}
            />
            <StatsCard
              title="Monthly Recurring Revenue"
              value={formatCurrency(4850)}
              change={8.2}
              subtitle="ARR: $58.2k"
              icon={<CreditCard className="h-4 w-4" />}
            />
            <StatsCard
              title="Workspace Team Seats"
              value="8 / 10"
              change={0}
              subtitle="Business Tier Quota"
              icon={<Users className="h-4 w-4" />}
            />
          </DashboardGrid>
        </Section>

        {/* 2. Generic DataTable System */}
        <Section
          title="2. Generic Reusable Data Table"
          description="Sortable, filterable, paginated table with checkbox bulk selection, row actions, and zero coupling to database schemas."
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTableData(initialMockData);
                toast({ title: 'Mock data reset to original 5 rows' });
              }}
            >
              Reset Data
            </Button>
          }
        >
          <DataTable<MockRecord>
            columns={columns}
            data={filteredData}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search campaigns by name, short code, or type..."
            pagination={pagination}
            totalCount={filteredData.length}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortingChange={setSorting}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            bulkActions={(ids) => (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  {ids.length} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={() => {
                    setTableData(tableData.filter((r) => !ids.includes(r.id)));
                    setSelectedRows(new Set());
                    toast({
                      title: 'Bulk Deletion Completed',
                      description: `Deleted ${ids.length} selected items.`,
                      variant: 'success',
                    });
                  }}
                >
                  Delete Selected
                </Button>
              </div>
            )}
          />
        </Section>

        {/* 3. Reusable Form & CRUD Pattern */}
        <Section
          title="3. Reusable Form Architecture (Create / Edit Pattern)"
          description="Schema-driven validation, unified create vs edit modes, field-level error messages, and loading states."
          actions={
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Form Mode:</span>
              <Button
                variant={formMode === 'create' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFormMode('create');
                  setFormValues({ name: '', targetUrl: '', category: 'WEB', isActive: true });
                  setFormErrors({});
                }}
              >
                Create Mode
              </Button>
              <Button
                variant={formMode === 'edit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFormMode('edit');
                  setFormValues({
                    name: 'Existing Showcase QR',
                    targetUrl: 'https://skyra.tech/showcase',
                    category: 'WEB',
                    isActive: true,
                  });
                  setFormErrors({});
                }}
              >
                Edit Mode
              </Button>
              <Button
                variant={formMode === 'read-only' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFormMode('read-only')}
              >
                Read-Only Mode
              </Button>
            </div>
          }
        >
          <Card className="p-6">
            <CrudForm
              mode={formMode}
              entityName="QR Destination"
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
              onCancel={() => {
                setFormValues({ name: '', targetUrl: '', category: 'WEB', isActive: true });
                setFormErrors({});
                toast({ title: 'Form reset' });
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Campaign / Resource Name"
                  required
                  error={formErrors.name}
                  description="A human-readable label visible inside the dashboard."
                >
                  <Input
                    placeholder="e.g. Autumn Restaurant Promo"
                    value={formValues.name}
                    onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                    error={!!formErrors.name}
                  />
                </FormField>

                <FormField
                  label="Target Destination URL"
                  required
                  error={formErrors.targetUrl}
                  description="Where dynamic short codes will redirect scanners."
                >
                  <Input
                    placeholder="https://example.com/target"
                    value={formValues.targetUrl}
                    onChange={(e) => setFormValues({ ...formValues, targetUrl: e.target.value })}
                    error={!!formErrors.targetUrl}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <FormField label="Category Type" description="Internal grouping for analytics.">
                  <Select
                    options={[
                      { label: 'Web & URLs', value: 'WEB' },
                      { label: 'Hospitality & Menus', value: 'HOSPITALITY' },
                      { label: 'Identity & vCards', value: 'IDENTITY' },
                      { label: 'Commerce & Coupons', value: 'COMMERCE' },
                    ]}
                    value={formValues.category}
                    onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                  />
                </FormField>

                <FormField label="Launch Date" description="Scheduled activation window.">
                  <DatePicker defaultValue="2026-09-02" />
                </FormField>

                <FormField label="Active Status" description="Enable instant edge redirection.">
                  <div className="flex items-center gap-3 pt-2">
                    <Switch
                      checked={formValues.isActive}
                      onCheckedChange={(checked) => setFormValues({ ...formValues, isActive: checked })}
                    />
                    <span className="text-xs font-semibold text-foreground">
                      {formValues.isActive ? 'Active (Live)' : 'Paused'}
                    </span>
                  </div>
                </FormField>
              </div>
            </CrudForm>
          </Card>
        </Section>

        {/* 4. Core UI Primitives & Atoms */}
        <Section title="4. Core UI Primitives" description="Buttons, Badges, MultiSelect, Tooltips, Tabs, and Feedback States.">
          <Tabs defaultValue="buttons">
            <TabsList>
              <TabsTrigger value="buttons">Buttons & Badges</TabsTrigger>
              <TabsTrigger value="inputs">Controls & Selection</TabsTrigger>
              <TabsTrigger value="dialogs">Dialogs & Triggers</TabsTrigger>
              <TabsTrigger value="feedback">Feedback & States</TabsTrigger>
            </TabsList>

            {/* Sub-tab 1: Buttons & Badges */}
            <TabsContent value="buttons" className="space-y-6 pt-4">
              <Card className="p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Button Variants</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="default">Primary Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="success">Success</Button>
                  <Button isLoading>Loading</Button>
                  <Button leftIcon={<ShieldCheck className="h-4 w-4" />}>With Icon</Button>
                </div>

                <Separator />

                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Button Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small (sm)</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large (lg)</Button>
                  <Button size="icon" aria-label="Icon only"><Plus className="h-4 w-4" /></Button>
                </div>

                <Separator />

                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Semantic Badges</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="default">Default Indigo</Badge>
                  <Badge variant="secondary">Secondary Slate</Badge>
                  <Badge variant="success">Success Active</Badge>
                  <Badge variant="warning">Warning Pending</Badge>
                  <Badge variant="destructive">Error Failed</Badge>
                  <Badge variant="info">Info Notice</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </Card>
            </TabsContent>

            {/* Sub-tab 2: Controls */}
            <TabsContent value="inputs" className="space-y-6 pt-4">
              <Card className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      MultiSelect Component
                    </h4>
                    <MultiSelect
                      options={[
                        { label: 'React 18', value: 'react' },
                        { label: 'Next.js 14', value: 'nextjs' },
                        { label: 'Tailwind CSS', value: 'tailwind' },
                        { label: 'NestJS Fastify', value: 'nestjs' },
                        { label: 'Supabase PostgreSQL', value: 'supabase' },
                      ]}
                      selected={selectedMulti}
                      onChange={setSelectedMulti}
                      placeholder="Select tech tags..."
                    />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Checkboxes & Switches
                    </h4>
                    <div className="space-y-3 pt-1">
                      <Checkbox label="Enable deterministic A/B traffic split" defaultChecked />
                      <Checkbox label="Send email digest when monthly scans exceed 80%" />
                      <div className="flex items-center gap-2 pt-2">
                        <StatusDot status="online" label="Edge POP Status: Online" pulse />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Technical Monospace Code Block
                  </h4>
                  <CodeBlock
                    code={`curl -X POST https://api.skyra.link/api/v1/qrs \\\n  -H "Authorization: Bearer mcp_sk_live_9a2f..." \\\n  -d '{"name": "Autumn Campaign", "targetUrl": "https://example.com"}'`}
                    language="bash"
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Sub-tab 3: Dialogs */}
            <TabsContent value="dialogs" className="space-y-6 pt-4">
              <Card className="p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Interactive Modals & Dialogs</h4>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => setIsModalOpen(true)}>Standard Dialog</Button>
                  <Button variant="outline" onClick={() => setIsConfirmOpen(true)}>Confirm Dialog</Button>
                  <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>Delete Confirmation</Button>
                  <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>Right Drawer Panel</Button>
                </div>

                <Separator />

                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Global Toast Triggers</h4>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast({ title: 'Operation Successful', description: 'Your campaign has been published.', variant: 'success' })}
                  >
                    Success Toast
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast({ title: 'Action Failed', description: 'Network timeout during request.', variant: 'destructive' })}
                  >
                    Error Toast
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast({ title: 'Quota Warning', description: 'You have utilized 85% of your dynamic QR quota.', variant: 'warning' })}
                  >
                    Warning Toast
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast({ title: 'System Notice', description: 'Scheduled maintenance this Sunday at 02:00 UTC.', variant: 'info' })}
                  >
                    Info Toast
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Sub-tab 4: Feedback States */}
            <TabsContent value="feedback" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Inline Alerts</h4>
                  <div className="space-y-3">
                    <Alert variant="info" title="Informational Notice">
                      The NestJS Fastify backend remains the sole authoritative API.
                    </Alert>
                    <Alert variant="success" title="Verification Passed">
                      All 57 production relational database tables conform to 3NF standards.
                    </Alert>
                    <Alert variant="warning" title="Approaching Limit">
                      Your monthly scan count has crossed 80% of included plan threshold.
                    </Alert>
                    <Alert variant="destructive" title="Access Denied">
                      High-risk MCP tool execution requires workspace human administrator approval.
                    </Alert>
                  </div>
                </Card>

                <Card className="p-6 flex flex-col justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Loading & Progress</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Dynamic QR Quota</span>
                        <span className="font-semibold">75%</span>
                      </div>
                      <Progress value={75} variant="default" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Scan Storage Volume</span>
                        <span className="font-semibold text-emerald-600">42%</span>
                      </div>
                      <Progress value={42} variant="success" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>API Rate Limit Consumption</span>
                        <span className="font-semibold text-destructive">92%</span>
                      </div>
                      <Progress value={92} variant="destructive" />
                    </div>
                  </div>
                  <LoadingState message="Simulated asynchronous data stream..." />
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Section>
      </PageContainer>

      {/* Standard Dialog Demo */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogHeader>
          <DialogTitle>Standard Modal Dialog</DialogTitle>
          <DialogDescription>
            Engineered with keyboard accessibility (Escape key), background backdrop blur, and focus trap.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-xs text-muted-foreground leading-relaxed">
          This modal demonstrates the centralized reusable dialog system. You can pass any arbitrary form, wizard, or detail view into this container.
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button size="sm" onClick={() => { setIsModalOpen(false); toast({ title: 'Action confirmed in modal' }); }}>
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Confirm Dialog Demo */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          toast({ title: 'Confirmed', description: 'Action successfully approved.', variant: 'success' });
        }}
        title="Approve Pending AI Action"
        description="The Jarvis AI agent has requested permission to create a new promotional dynamic QR code. Do you wish to approve this action?"
        confirmLabel="Approve Action"
      />

      {/* Delete Confirmation Dialog Demo */}
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          setIsDeleteLoading(true);
          setTimeout(() => {
            setIsDeleteLoading(false);
            setIsDeleteOpen(false);
            toast({
              title: 'Deleted',
              description: 'Campaign successfully deleted.',
              variant: 'success',
            });
          }, 600);
        }}
        itemName="Summer Campaign Menu QR"
        itemType="QR Code"
        isLoading={isDeleteLoading}
      />

      {/* Drawer Panel Demo */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Campaign Configuration Panel"
        description="Configure context-aware routing, device targeting, and dayparting."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => { setIsDrawerOpen(false); toast({ title: 'Drawer settings saved' }); }}>
              Apply Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs text-muted-foreground">
          <p>
            This slide-over drawer component is designed for advanced inspector views, QR styling accordions, and audit log sidebars.
          </p>
          <FormField label="Sub-Domain CNAME" description="Must point to cname.skyra.link">
            <Input defaultValue="qr.clientbrand.com" />
          </FormField>
          <FormField label="Expiration Threshold">
            <DatePicker defaultValue="2026-12-31" />
          </FormField>
          <Checkbox label="Enable device OS redirection (iOS vs Android)" defaultChecked />
        </div>
      </Drawer>
    </AppShell>
  );
}

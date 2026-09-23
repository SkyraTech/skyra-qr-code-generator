# SkyraQR --- Business Requirements Document (BRD)

**Document Identifier:** SKYRA-DOC-BRD-001\
**Version:** 2.3.0\
**Status:** Approved for Implementation --- Reconciled with Skyra
Platform (Architecture Locked)\
**Owner:** Skyra Product Management & Strategy Group\
**Release Phasing:** MVP (Stage 1) $\rightarrow$ Phase 2 (Automation &
Scale) $\rightarrow$ Phase 3 (Agency & Intelligence) $\rightarrow$
Enterprise (Stage 4/5)

------------------------------------------------------------------------

## Executive Summary

**SkyraQR** is an enterprise-grade B2B Software-as-a-Service (SaaS)
platform engineered to modernize the creation, intelligent routing,
design management, analytics, and lifecycle governance of dynamic and
static QR codes.

While legacy QR platforms (e.g., QRFY, Beaconstac, QR Code Generator)
have historically capitalized on post-pandemic contactless adoption,
publicly observed competitor capabilities reveal acute friction points:
deceptive trial-to-annual billing lock-ins (often charging
\$300--\$450/year after an initial trial), rigid 1:1 destination
routing, siloed agency account management, and a complete absence of
localized pricing and regional payment mechanisms (such as India's UPI).
*Note: Competitor internal architecture, backend implementations, and
proprietary algorithms are not publicly known.*

SkyraQR resolves these market challenges by delivering: 1. **Target
Sub-30ms Edge Dynamic Redirection:** High-performance short-link
resolution with multi-region edge caching. Target p99 end-to-end edge
redirection latency is $<30\text{ms}$ under defined benchmark
conditions, excluding client/network latency outside SkyraQR control. 2.
**Context-Aware Smart Routing:** Deterministic traffic splitting based
on user device OS, geographic location, scheduled time windows, and
privacy-preserving statistical A/B tests. 3. **No-Code Micro-Landing
Pages:** High-converting, mobile-responsive interactive landing pages
(digital menus, vCard Plus, product showcases, event registration, and
customer feedback) hosted natively with custom domain and white-label
support. 4. **Transparent, Fair & Localized Monetization:** A
sustainable pricing architecture featuring localized billing (native
INR/UPI support alongside USD/Stripe), explicit renewal notifications,
and an authoritative policy prohibiting third-party advertising inside
customer QR destinations. 5. **Tripartite Dashboard Domain
Architecture:** Complete separation between the **Customer Dashboard**
(daily QR operations), **Workspace Administration** (team RBAC, domains,
API keys, MCP credentials), and the **SkyraQR Platform Owner Dashboard**
(global SaaS infrastructure, revenue, abuse quarantine, and platform
audit logs). 6. **First-Class Model Context Protocol (MCP) Server with
Admin-Managed Credentials:** Native integration enabling AI agents (such
as the Jarvis AI Agent) to securely query analytics, manage campaigns,
and inspect link health through an authorized domain service
layer---with zero direct database access. **Admin-Managed MCP
Credentials** constitute the primary authentication model, governed by
strict delegated authority boundaries, independent role permissions, and
complete credential lifecycle states. 7. **Privacy-by-Design
Architecture:** Real-time scan telemetry built on a privacy-by-design
and compliance-aligned architecture (addressing principles in GDPR,
CCPA, and India's DPDP Act 2023), utilizing cryptographic one-way
daily-keyed hashing to measure unique scans without persisting raw
client IP addresses. 8. **Enterprise Observability & Traceable Audit
Governance:** Dual-tier logging architecture comprising an
authoritative, immutable PostgreSQL audit ledger (`audit_logs`)
capturing every business mutation alongside centralized structured JSON
logging (ELK stack) with distributed request tracing (`request_id`,
`trace_id`). 9. **Shared Skyra Platform Foundation:** SkyraQR consumes
Skyra Platform shared UI/design-system packages and the reusable
`@skyra/qr` generation capability, while retaining QR product-specific
business logic inside SkyraQR.

------------------------------------------------------------------------

## Table of Contents

-   [1. Product Overview & Codename
    Policy](#1-product-overview--codename-policy)
    -   [1.1 Product Codename & Branding
        Policy](#11-product-codename--branding-policy)
    -   [1.2 Product Vision & Mission](#12-product-vision--mission)
    -   [1.3 Problem Statement](#13-problem-statement)
    -   [1.4 Market Opportunity](#14-market-opportunity)
    -   [1.5 Value Proposition & Competitive
        Differentiation](#15-value-proposition--competitive-differentiation)
-   [1.6 Skyra Platform Dependency & Reusable QR
    Core](#16-skyra-platform-dependency--reusable-qr-core)
-   [2. Business Problems by Industry
    Vertical](#2-business-problems-by-industry-vertical)
-   [3. Target Personas & User
    Classes](#3-target-personas--user-classes)
-   [4. Product Scope & Phased
    Roadmap](#4-product-scope--phased-roadmap)
-   [5. Authentication, Identity & Session
    Architecture](#5-authentication-identity--session-architecture)
    -   [5.1 Multi-Channel Authentication
        Overview](#51-multi-channel-authentication-overview)
    -   [5.2 Admin-Managed MCP Credential Model
        (Primary)](#52-admin-managed-mcp-credential-model-primary)
    -   [5.3 Delegated MCP Access & Authority
        Boundaries](#53-delegated-mcp-access--authority-boundaries)
-   [6. Tripartite Dashboard & RBAC
    Architecture](#6-tripartite-dashboard--rbac-architecture)
    -   [6.1 Customer Dashboard](#61-customer-dashboard)
    -   [6.2 Workspace Administration & MCP Access
        Management](#62-workspace-administration--mcp-access-management)
    -   [6.3 Platform Owner Dashboard](#63-platform-owner-dashboard)
-   [7. Core Feature Specifications & Frontend
    Role](#7-core-feature-specifications--frontend-role)
-   [8. Advanced & Differentiating
    Features](#8-advanced--differentiating-features)
    -   [8.1 Model Context Protocol (MCP) & Jarvis AI
        Integration](#81-model-context-protocol-mcp--jarvis-ai-integration)
    -   [8.2 MCP Role Model & Permission
        Taxonomy](#82-mcp-role-model--permission-taxonomy)
    -   [8.3 MCP Credential Lifecycle
        Governance](#83-mcp-credential-lifecycle-governance)
    -   [8.4 Context-Aware Smart Routing & A/B
        Testing](#84-context-aware-smart-routing--ab-testing)
    -   [8.5 QR Health Monitoring & Dead-Link
        Defense](#85-qr-health-monitoring--dead-link-defense)
    -   [8.6 White-Label Agency Dashboards & Client
        Portals](#86-white-label-agency-dashboards--client-portals)
-   [9. QR Type Strategy & Comprehensive Generation
    Lifecycle](#9-qr-type-strategy--comprehensive-generation-lifecycle)
-   [10. Dynamic QR Business Logic &
    Lifecycle](#10-dynamic-qr-business-logic--lifecycle)
-   [11. End-to-End User Journeys](#11-end-to-end-user-journeys)
-   [12. Detailed Functional Requirements (BR-FR-001 to
    BR-FR-029)](#12-detailed-functional-requirements)
-   [13. Traceability Matrix](#13-traceability-matrix)
-   [14. Non-Functional Requirements (BR-NFR-001 to
    BR-NFR-015)](#14-non-functional-requirements)
-   [15. Subscription, Entitlement Engine & Monetization
    Strategy](#15-subscription-entitlement-engine--monetization-strategy)
    -   [15.1 Before-Subscription and After-Subscription
        Experience](#151-before-subscription-and-after-subscription-experience)
    -   [15.2 Subscription Tier
        Architecture](#152-subscription-tier-architecture)
    -   [15.3 Authoritative Entitlement Policy Model (BLOCK,
        SOFT_OVERAGE,
        READ_ONLY)](#153-authoritative-entitlement-policy-model)
    -   [15.4 Advertising & Monetization
        Boundaries](#154-advertising--monetization-boundaries)
-   [16. Privacy, Security Logging & Audit Retention
    Policy](#16-privacy-security-logging--audit-retention-policy)
-   [17. Observability & Centralized ELK
    Requirements](#17-observability--centralized-elk-requirements)
-   [18. Assumptions, Dependencies &
    Risks](#18-assumptions-dependencies--risks)
-   [19. Glossary](#19-glossary)
-   [20. Revision & Version History](#20-revision--version-history)

------------------------------------------------------------------------

## 1. Product Overview & Codename Policy

### 1.1 Product Codename & Branding Policy

To maintain architectural rigor while brand positioning is finalized,
the following naming policy is authoritatively enforced: - **Internal
Project Codename:** **SkyraQR** (used consistently throughout
engineering and technical documentation). - **Parent Company:** **Skyra
Tech**. - **Future Commercial Product Name:** **TBD** (to be selected by
product leadership prior to commercial launch).

> \[!IMPORTANT\] **Zero Architectural Lock-in:** The platform
> architecture, API endpoints, database entities, and frontend assets
> are designed so that the eventual commercial product name can replace
> the "SkyraQR" codename via configuration and environment variables
> without requiring structural or architectural code changes.

### 1.2 Product Vision & Mission

-   **Vision:** To serve as the global infrastructure standard
    connecting physical surfaces to intelligent digital experiences
    through secure, ultra-fast, and brand-first QR technology.
-   **Mission:** Empower SMBs, creative agencies, global consumer
    brands, and AI agents with an affordable, enterprise-grade QR
    lifecycle platform that combines precision design, contextual smart
    routing, actionable real-time analytics, and seamless multi-tenant
    team collaboration.

### 1.3 Problem Statement

Physical-to-digital interactions mediated by QR codes represent an
indispensable channel for modern commerce, marketing, and operational
workflows. However, businesses deploying QR codes today encounter acute
operational vulnerabilities: - **Print Permanence vs. Digital
Mutability:** Traditional static QR codes hardcode URLs into print runs.
If the destination link changes, breaks, or expires, physical collateral
(signage, packaging, menus, billboards) is immediately invalidated,
resulting in expensive reprints. - **Predatory SaaS Economics:** Leading
market incumbents (such as QRFY and competitors) frequently lure users
with deceptive \$0.99 or free trial periods, only to enforce automated
renewals exceeding \$300--\$450/year without transparent monthly
options, causing widespread customer disputes. - **Rudimentary Dynamic
Routing:** Most tools only offer simple 1:1 URL redirects. Marketers
cannot redirect an iOS user to the Apple App Store, an Android user to
Google Play, and a desktop user to a web landing page from a single
printed code. - **AI Agent Integration Gap:** Modern enterprises
increasingly deploy autonomous AI agents (such as Jarvis) for business
intelligence, campaign management, and customer operations. Legacy QR
platforms lack standard protocols (such as MCP) to enable AI agents to
safely read analytics or provision campaigns without fragile web
scraping. - **Data & Compliance Deficits:** Legacy analytics engines
either log unhashed raw IP addresses (violating modern privacy
standards) or provide superficial total-scan counters devoid of
conversion attribution or city-level geographic fidelity.

### 1.4 Market Opportunity

The global QR code generation and dynamic management market is expanding
at a Compound Annual Growth Rate (CAGR) of 16.8%, driven by omnichannel
retail, smart packaging, restaurant operational digitization, and
contactless authentication. Furthermore, high-velocity digital economies
like India, Southeast Asia, and Latin America have established QR-based
digital interactions as daily cultural norms (e.g., UPI payments, ONDC
retail discovery, smart tickets).

Yet, virtually zero incumbent Western SaaS providers cater natively to
these geographies with localized pricing (INR, UPI), regional edge POPs,
or localized customer support. SkyraQR captures this whitespace while
concurrently disrupting the North American and European mid-market.

### 1.5 Value Proposition & Competitive Differentiation

  ---------------------------------------------------------------------------
  Vector            Observed Public      SkyraQR Proposed   Competitor
                    Competitor           Platform           Internal Status
                    Capabilities (e.g.,  Capabilities       
                    QRFY, Bitly)                            
  ----------------- -------------------- ------------------ -----------------
  **Pricing &       Trial-to-annual      Transparent        Competitor
  Transparency**    lock-ins             monthly & annual   billing logic is
                    (\$300--\$450/yr),   tiers; explicit    proprietary and
                    limited monthly      renewal            internal.
                    cancellation         notifications;     
                    options.             graceful           
                                         soft-limits upon   
                                         downgrade.         

  **Regional        Credit card/USD/EUR  Native Stripe      Competitor
  Payments**        centric; lacks       (USD/EUR) +        payment
                    native Indian UPI or Razorpay (INR)     partnerships are
                    regional payment     dual engine; UPI   external.
                    methods.             AutoPay,           
                                         Netbanking, GST    
                                         invoices.          

  **Edge            Centralized          Target p99         Competitor edge
  Redirection       redirection          end-to-end edge    infrastructure is
  Speed**           exhibiting           redirection        proprietary and
                    noticeable mobile    latency is         not publicly
                    white-screen pauses. $<30\text{ms}$     disclosed.
                                         under defined      
                                         benchmark          
                                         conditions,        
                                         excluding network  
                                         latency outside    
                                         SkyraQR control.   

  **Smart Routing   Single static target Context-Aware      Basic redirect
  Engine**          URL per dynamic      Smart Engine:      rules observed in
                    code.                Device OS,         select enterprise
                                         Geolocation        tiers.
                                         (Country/City),    
                                         Time/Dayparting,   
                                         and deterministic  
                                         A/B testing.       

  **AI Agent        Zero standardized    Native **Model     No known
  Integration**     agentic support;     Context Protocol   competitor MCP
                    requires custom      (MCP)** server     server exists.
                    scraping.            with Admin-Managed 
                                         credentials,       
                                         delegated          
                                         governance, and    
                                         domain service     
                                         execution.         

  **Platform        Single-tier account  Tripartite         Competitor
  Governance**      view; agency client  Dashboard          internal admin
                    accounts share       Architecture:      tooling is not
                    unified logins.      Customer           public.
                                         Dashboard,         
                                         Workspace Admin,   
                                         and isolated       
                                         Platform Owner     
                                         Admin.             

  **QR Health       Broken destination   Automated          Competitor health
  Monitoring**      links throw          dead-link crawler  checking not
                    unbranded 404 errors (404/500           publicly
                    indefinitely.        detection) and     documented.
                                         pre-screen         
                                         integration with   
                                         Google Safe        
                                         Browsing.          

  **Monetization    Occasional ads or    **Zero third-party Competitor
  Ethics**          brand watermarks     ads** in customer  advertising
                    injected on lower    QRs, destinations, policies vary by
                    tiers.               or paid landing    tier.
                                         pages. Clean B2B   
                                         SaaS monetization. 
  ---------------------------------------------------------------------------

------------------------------------------------------------------------

## 1.6 Skyra Platform Dependency & Reusable QR Core

SkyraQR consumes **Skyra Platform** as the authoritative shared frontend
and reusable capability foundation. SkyraQR must not maintain
independent copies of generic UI primitives, design tokens, forms,
dialogs, tables, validation utilities, export utilities, or other
capabilities intentionally owned by Skyra Platform.

The QR generation capability is split deliberately:

-   **Skyra Platform --- `@skyra/qr`:** Generic, product-agnostic QR
    generation and rendering primitives, QR configuration/types,
    generation-input validation, and reusable SVG/PNG rendering
    interfaces. It must not depend on SkyraQR database models, workspace
    state, billing, analytics, campaigns, or MCP credentials.
-   **SkyraQR:** Product-specific QR lifecycle and business logic,
    including persistence, dynamic/static workflows, destinations,
    designs, campaigns, analytics, scan tracking, subscriptions,
    billing, workspace permissions, templates, and MCP operations.
-   **Skyra Platform UI packages:** Source of truth for shared UI such
    as buttons, inputs, forms, dialogs, data tables, status/feedback
    components, and design tokens.

This boundary allows future Skyra applications to reuse QR generation
without importing SkyraQR business logic or database infrastructure.

**Architectural rule:** reusable technical capability belongs in Skyra
Platform only when it is product-agnostic and independently useful
across multiple Skyra applications. Product workflows and business
policy remain in the consuming application.

------------------------------------------------------------------------

## 2. Business Problems by Industry Vertical

``` mermaid
mindmap
  root((SkyraQR Market Need))
    Restaurants
      High reprint costs on menu revisions
      Multi-language diner support
      Daily special lunch/dinner time-swaps
    Retail & Consumer Brands
      Smart product packaging
      Warranty registration & authenticity
      A/B testing marketing campaigns
    Marketing Agencies
      Multi-client separation & RBAC
      White-label dashboards & reports
      Campaign UTM tracking & conversion attribution
    Event Organizers
      Dynamic scheduling updates
      Paperless badge check-ins & ticketing
      Offline-capable Wi-Fi & RSVP collection
    Enterprises & AI Teams
      SSO SAML/OIDC compliance
      Audit logging & governance
      Jarvis AI Agent MCP integration
```

### 2.1 Restaurants & Hospitality

-   **The Challenge:** Seasonal food pricing, daily specials (lunch
    vs. dinner menus), and supply-chain stockouts require frequent menu
    updates. Physical reprints cost restaurants hundreds of dollars
    monthly and generate paper waste.
-   **SkyraQR Solution:** Built-in Digital Menu Builder supporting
    multiple categories, allergen tags, currency switchers,
    multi-language localization, and time-based scheduling (switching
    from Breakfast to Dinner automatically).

### 2.2 Retail & Packaged Goods (CPG / FMCG)

-   **The Challenge:** QR codes printed on physical packaging, carton
    boxes, or hangtags have lifetimes measured in months or years. If a
    product recall occurs, a regulatory label changes, or an unboxing
    video link breaks, millions of packages are affected.
-   **SkyraQR Solution:** Dynamic QR codes with immutable short codes
    that allow instant destination URL rewrites, GS1 2D barcode
    alignment, serial batch identification, and warranty registration
    micro-landing pages.

### 2.3 Product & Brand Marketing Professionals

-   **The Challenge:** Marketers cannot accurately attribute offline
    scans to downstream digital conversions (e.g., newsletter signups,
    app downloads, e-commerce purchases).
-   **SkyraQR Solution:** Built-in UTM parameter generators, custom
    tracking pixels, automated A/B destination split-testing, and
    dynamic campaign attribution dashboards.

### 2.4 Marketing & Advertising Agencies

-   **The Challenge:** Agencies manage dozens of separate client
    accounts. Storing them under one login creates data privacy hazards
    and prevents clients from reviewing analytics without seeing other
    clients' assets.
-   **SkyraQR Solution:** Multi-tenant Workspaces with isolated assets,
    billing, and custom domains; custom client-facing white-label
    portals featuring the agency's logo, colors, and domain (e.g.,
    `qr.agencyname.com`).

### 2.5 Event Organizers & Venues

-   **The Challenge:** Conference schedules, speaker halls, and badge
    access credentials change dynamically up to the last hour. Paper
    programs cannot adapt.
-   **SkyraQR Solution:** Dynamic Event QR codes linking to responsive
    schedule micro-pages, downloadable `.ics` calendar files, one-tap
    Wi-Fi network joining, and live RSVP check-in counters.

### 2.6 Small Businesses & Freelance Professionals

-   **The Challenge:** Traditional business cards are thrown away within
    one week. Solo entrepreneurs lack the budget or technical skill to
    build a custom website.
-   **SkyraQR Solution:** Digital vCard Plus micro-page that allows
    contacts to download a verified `.vcf` file into their phone's
    native address book with a single tap, alongside social links,
    WhatsApp click-to-chat, and payment links.

### 2.7 Enterprise Organizations & AI Operations

-   **The Challenge:** Lack of centralized security, uncontrolled
    creation of rogue QR codes by rogue teams, vulnerability to
    phishing/malware links, lack of enterprise Single Sign-On (SSO), and
    inability for enterprise AI agents (e.g., Jarvis) to automate QR
    workflows safely.
-   **SkyraQR Solution:** Okta/Azure AD SAML 2.0 and OIDC Single
    Sign-On, strict Role-Based Access Control, centralized audit trail
    logging, automated malware destination inspection, 99.95% uptime
    SLAs, and an enterprise **Model Context Protocol (MCP)** server with
    delegated admin-managed credentials.

------------------------------------------------------------------------

## 3. Target Personas & User Classes

``` mermaid
graph TD
    A[SkyraQR Customer Ecosystem] --> B[Self-Serve SMB / Individuals]
    A --> C[Mid-Market / Growth Businesses]
    A --> D[Agencies & Enterprises]
    A --> E[Autonomous AI Agents]
    
    B --> B1[Persona 1: Priya - Freelance Consultant]
    B --> B2[Persona 2: Marco - Bistro Owner]
    B --> B3[Persona 3: Rahul - Boutique Retailer]
    
    C --> C1[Persona 4: Sarah - Head of Demand Gen]
    C --> C2[Persona 5: David - Product Packaging Director]
    C --> C3[Persona 6: Elena - Event Operations Lead]
    
    D --> D1[Persona 7: Alex - Digital Agency Managing Director]
    D --> D2[Persona 8: Vikram - Enterprise IT & Security VP]

    E --> E1[Persona 9: Jarvis AI Agent - Automated Marketing Agent]
```

### Persona 1: Priya Sharma --- Independent Creative & Consultant

-   **Role:** Freelance Brand Designer & Marketing Consultant (Solo
    proprietor)
-   **Goals:** Showcase portfolio, distribute contact information
    seamlessly at networking events, capture inbound leads.
-   **Pain Points:** High card reprint costs; standard paper cards
    cannot reflect portfolio changes; cannot afford \$40/mo enterprise
    tools.
-   **Required Features:** vCard Plus QR, Social Links QR, custom logo
    embedding, SVG vector export, basic scan counts.
-   **Target Tier:** **Free** to **Starter Tier** (\$9 / ₹499/mo).

### Persona 2: Marco Rossi --- Owner & General Manager

-   **Role:** Independent Restaurant & Craft Bar Owner (2 locations, 24
    employees)
-   **Goals:** Eliminate paper menu printing costs, update culinary
    specials dynamically, provide contactless Wi-Fi access.
-   **Pain Points:** High reprint costs when wine vintages change; menus
    load slowly on poor cellular networks.
-   **Required Features:** Interactive Digital Menu builder, allergen
    filters, scheduled dayparting (Breakfast/Lunch/Dinner), Wi-Fi QR,
    table-tent design templates.
-   **Target Tier:** **Starter** to **Business Tier** (\$29 /
    ₹1,499/mo).

### Persona 3: Rahul Gupta --- Direct-to-Consumer (D2C) Retail Founder

-   **Role:** Founder of an artisanal apparel brand (15 employees, 50k
    monthly shipments)
-   **Goals:** Drive repeat purchases from packaging unboxing inserts,
    gather customer feedback, authenticate product batches.
-   **Pain Points:** Inability to track which retail box inserts result
    in repeat store purchases; inability to run seasonal discounts on
    pre-printed packaging.
-   **Required Features:** Dynamic URL QR, Coupon QR, Feedback QR, UTM
    campaign tracking, A/B destination testing.
-   **Target Tier:** **Business Tier** (\$29 / ₹1,499/mo).

### Persona 4: Sarah Jenkins --- Performance Marketing Director

-   **Role:** Growth & Demand Generation Lead at a mid-market SaaS (250
    employees)
-   **Goals:** Bridge physical conference banners, print magazine ads,
    and transit billboards directly into the digital sales pipeline with
    end-to-end attribution.
-   **Pain Points:** Physical campaigns act as data black holes; cannot
    determine offline ROAS; high risk of pre-printed links leading to
    404s.
-   **Required Features:** Smart OS routing (iOS App Store vs. Google
    Play), UTM parameter passing, webhook notifications on scan
    milestones, dead-link monitoring, CSV bulk export.
-   **Target Tier:** **Business Tier** (\$29 / ₹1,499/mo).

### Persona 5: David Vance --- Director of Packaging & Brand Identity

-   **Role:** CPG Brand Director (Global beverage company, 10M
    units/year)
-   **Goals:** Implement compliant, high-density GS1 2D barcodes and
    dynamic QR codes on aluminum cans and glass bottles.
-   **Pain Points:** Errors in printing cause packaging recalls; QR
    designs must strictly match brand guidelines without failing barcode
    scannability.
-   **Required Features:** Precise QR scannability validation score,
    vector downloads (EPS, PDF, SVG), high error correction (Level H
    30%), custom branded corner eyes, API batch generation.
-   **Target Tier:** **Enterprise Tier** (Custom / \$299+/mo).

### Persona 6: Elena Rostova --- VP of Global Event Operations

-   **Role:** Chief Event Producer for international tech summits
    (5,000+ attendees)
-   **Goals:** Provide dynamic schedules, live venue maps, digital
    speaker bios, and sponsor engagement tracking across badges and
    exhibition booths.
-   **Pain Points:** Schedule changes occur hours before keynote
    sessions; attendees complain of unreadable codes in dim lighting.
-   **Required Features:** Event QR, PDF QR with offline progressive
    caching, fast-loading micro-pages, scheduled redirect changes,
    high-throughput bulk badge generation.
-   **Target Tier:** **Business** or **Agency Tier** (\$79 / ₹3,999/mo).

### Persona 7: Alex Mercer --- Agency Managing Director

-   **Role:** Founder of a 30-person digital marketing agency (45 active
    client retainers)
-   **Goals:** Provide clients with branded QR campaign management under
    the agency's domain without clients knowing third-party software is
    utilized.
-   **Pain Points:** Staff mixing up client links; clients requesting
    ad-hoc scan reports; clients complaining about third-party branding
    on redirect intermediate screens.
-   **Required Features:** Multi-tenant Workspaces, white-label client
    portal (`qr.agency.com`), custom client CNAME short-domains,
    white-label PDF analytics reports, granular member roles (Viewer,
    Editor).
-   **Target Tier:** **Agency Tier** (\$79 / ₹3,999/mo).

### Persona 8: Vikram Singhania --- Enterprise Chief Information Security Officer (CISO)

-   **Role:** VP of IT Infrastructure & Information Security (10,000+
    employees across 12 countries)
-   **Goals:** Ensure all employee-generated QR codes comply with strict
    corporate cybersecurity policies and data privacy regulations.
-   **Pain Points:** Employees generating QR codes on unvetted free
    tools that redirect through unsecured domains; lack of Single
    Sign-On; no audit trail.
-   **Required Features:** SAML 2.0 / Okta SSO, SCIM provisioning,
    automated malicious destination URL blocking, role-based governance,
    immutable audit logging, 99.95% uptime SLA, dedicated IP/VPC
    options.
-   **Target Tier:** **Enterprise Tier** (Annual contract).

### Persona 9: Jarvis AI Agent --- Autonomous Marketing Operations Assistant

-   **Role:** Automated AI Agent integrated with marketing stacks, CRM,
    and BI tools
-   **Goals:** Autonomously retrieve QR scan telemetry, inspect link
    health, create promotional QRs for new campaigns, and summarize ROI
    for human marketing directors.
-   **Pain Points:** Traditional web scraping is fragile and violates
    security boundaries; lacks programmatic, structured access with
    tool-level authorization.
-   **Required Features:** Model Context Protocol (MCP) server support,
    scoped tool access (`read:analytics`, `write:qrs`),
    human-in-the-loop confirmation for high-risk actions, rate limiting,
    and structured JSON tool returns.
-   **Target Tier:** Included across **Business**, **Agency**, and
    **Enterprise Tiers**.

------------------------------------------------------------------------

## 4. Product Scope & Phased Roadmap

``` mermaid
gantt
    title SkyraQR Phased Implementation Roadmap
    dateFormat  X
    axisFormat  Stage %s
    section MVP (Stage 1)
    User Auth, JWT, Refresh Rotation & Sessions :active, 0, 3
    Core Dynamic & Static QR Engines          :active, 0, 3
    Design Studio & Scannability Scoring       :active, 1, 3
    Core Micro-Pages (Menu, vCard, PDF)        :active, 1, 4
    Durable Redis Telemetry & Rollup Pipeline  :active, 1, 4
    Stripe & Razorpay Dual Billing Engine      :active, 2, 4
    section Phase 2 (Automation & Scale)
    Smart Routing Engine (OS, Geo, Time)       :3, 6
    CSV Bulk Generation & Export Engine        :4, 6
    Custom Domain CNAME & Auto-SSL Engine      :4, 7
    Public REST API v1 & Webhooks              :5, 7
    Customer & Workspace Admin Separation      :5, 7
    section Phase 3 (Agency & Intelligence)
    Model Context Protocol (MCP) Server        :6, 9
    Admin-Managed MCP Credentials & Delegation :7, 9
    Jarvis AI Agent Tool Integration           :7, 9
    White-Label Agency Client Portals          :7, 10
    A/B Traffic Splitting & Conversion Engine  :8, 10
    Automated Dead-Link Health Crawler         :8, 10
    SkyraQR Platform Owner Dashboard           :8, 11
    section Enterprise (Stage 4/5)
    Enterprise SAML 2.0 SSO & SCIM             :10, 13
    ClickHouse Analytical Database Migration   :11, 14
    GS1 2D Digital Link Barcode Engine         :12, 14
```

------------------------------------------------------------------------

## 5. Authentication, Identity & Session Architecture

### 5.1 Multi-Channel Authentication Overview

``` mermaid
flowchart LR
    subgraph AuthChannels["SkyraQR Authentication Channels"]
        Browser["Browser / Mobile App User"] --> JWTFlow["Session JWT in Memory + HttpOnly Refresh Cookie"]
        DevAPI["REST API Developer"] --> APIKeyFlow["Scoped API Key sk_live_... (SHA-256 Verified)"]
        JarvisAI["Jarvis AI Agent (MCP)"] --> MCPCredFlow["Admin-Managed MCP Credential mcp_sk_live_..."]
        PlatformStaff["Platform Operator"] --> AdminGateway["Isolated /platform-admin Gateway + Hardware MFA"]
    end
```

SkyraQR enforces strict authentication boundaries across all four access
channels: 1. **Browser/Customer Authentication:** Passwords hashed with
**Argon2id** ($m=65536 \text{ KiB}, t=3, p=4$). Short-lived JWT access
tokens (15-min TTL) in application memory; rotating refresh tokens
(7-day TTL) in `HttpOnly`, `Secure`, `SameSite=Strict` cookies
(`__Host-skyra_rt`). Token replay detection immediately revokes the
session family in Redis. 2. **REST API Client Authentication:**
Programmatic access via high-entropy API keys (`sk_live_...`). **API
keys are explicitly NOT JWTs.** The API Gateway computes
`SHA-256(API_KEY)` and queries `api_keys`. 3. **MCP / Jarvis AI Agent
Authentication:** Authenticated **exclusively** via **Admin-Managed MCP
Credentials** (`mcp_sk_live_...`). OAuth 2.0 / OIDC is not supported as
a primary authentication mechanism and is documented strictly as a
future enterprise federation option. 4. **Platform Administration
Authentication:** Accessible only via `/platform-admin/login`, requiring
mandatory hardware (WebAuthn/FIDO2) or TOTP MFA.

### 5.2 Admin-Managed MCP Credential Model (Primary)

``` mermaid
sequenceDiagram
    autonumber
    actor Admin as Workspace Owner / Admin
    participant UI as Workspace Admin Console
    participant Auth as Auth & Access Service
    participant Crypto as CSPRNG Key Generator
    participant DB as PostgreSQL DB
    actor Jarvis as Jarvis AI Agent
    
    Admin->>UI: Navigate to MCP Access Management
    Admin->>UI: Select User & Click "Create MCP Credential"
    Admin->>UI: Configure: Name, Starts At, Expires At, MCP Role, Permissions
    UI->>Auth: POST /api/v1/mcp/credentials { user_id, role_id, permissions, dates }
    Auth->>Auth: Validate delegating user authority (Cannot exceed own permissions)
    Auth->>Crypto: Generate 256-bit token (mcp_sk_live_...)
    Crypto-->>Auth: Raw token string
    Auth->>Auth: Compute token_hash = SHA-256(token) & extract token_prefix
    Auth->>DB: INSERT INTO mcp_credentials (token_prefix, token_hash, status: ACTIVE/SCHEDULED)
    Auth->>DB: INSERT INTO audit_logs (event: mcp_credential_created)
    Auth-->>UI: Return raw token ONCE
    UI-->>Admin: Display token modal with copy warning ("Never shown again")
    Admin->>Jarvis: Configure Jarvis with token
    Jarvis->>Auth: Inbound MCP request with Authorization: Bearer mcp_sk_live_...
    Auth->>DB: Query mcp_credentials by SHA-256(token)
    DB-->>Auth: Return credential, role & permissions
```

-   **One-Time Secret Display:** The raw MCP token is displayed to the
    administrator exactly once upon creation. It is never stored in
    plaintext, never logged, and is mathematically unrecoverable from
    the database.
-   **Database Storage:** The database stores strictly `token_prefix`
    (e.g., `mcp_sk_live_9a`) and `token_hash` (SHA-256).

### 5.3 Delegated MCP Access & Authority Boundaries

``` mermaid
flowchart TD
    Owner["Workspace Owner"] -->|1. Invites Member & Assigns Role| Member["Team Member (e.g., Marketing Lead)"]
    Owner -->|2. Grants Permission: manage:mcp_credentials| PermGrant["Permission Granted"]
    Member -->|3. Accesses Console| MCPConsole["MCP Access Management Console"]
    MCPConsole -->|4. Attempts Credential Creation| PolicyCheck{Authority Boundary Validation}
    
    PolicyCheck -- Attempted Perms <= Member Perms --> AllowCreate[Provision MCP Credential]
    PolicyCheck -- Attempted Perms > Member Perms --> DenyCreate[HTTP 403: Cannot Delegate Exceeded Authority]
    
    subgraph EffectivePermCalc["Three-Layer Effective Permission Engine"]
        E1["Layer 1: Workspace Member Permissions"]
        E2["Layer 2: MCP Credential Granted Permissions"]
        E3["Layer 3: Workspace Subscription Entitlements"]
        E1 --> Formula["Effective Permission = L1 AND L2 AND L3"]
        E2 --> Formula
        E3 --> Formula
    end
```

#### Authoritative Business Rules for Delegated Administration:

1.  A Workspace Owner or authorized Workspace Admin can delegate MCP
    credential management to another workspace user.
2.  The delegated user can create, inspect, suspend, rotate, and revoke
    MCP credentials **strictly within the workspaces they are authorized
    to manage**.
3.  **The Principle of Delegated Authority Limits:** A delegated user
    **CANNOT** grant permissions greater than their own effective
    workspace permissions.
4.  A delegated user **CANNOT** grant themselves higher workspace
    privileges or create credentials with roles they do not possess.
5.  A delegated user **CANNOT** bypass active subscription entitlements
    or quota meters.
6.  **Effective Permission Computation:**
    $$\text{Effective MCP Permission} = \text{Workspace Permission} \land \text{MCP Credential Permission} \land \text{Subscription Entitlement}$$
    *If ANY layer denies access, the tool invocation is immediately
    rejected.*

------------------------------------------------------------------------

## 6. Tripartite Dashboard & RBAC Architecture

``` mermaid
graph TD
    App[SkyraQR Application Ecosystem]
    App --> D1[Customer Dashboard]
    App --> D2[Workspace Administration]
    App --> D3[Platform Owner Dashboard]

    subgraph D1_Content[Customer Dashboard: Normal Business Users]
        D1 --> C1[Overview & Quick Stats]
        D1 --> C2[QR Codes & Creation Studio]
        D1 --> C3[Analytics & Heatmaps]
        D1 --> C4[Campaigns & Landing Pages]
        D1 --> C5[Personal Settings]
    end

    subgraph D2_Content[Workspace Administration: Owner & Admin]
        D2 --> W1[Team Members & RBAC Roles]
        D2 --> W2[MCP Access Management & Credentials]
        D2 --> W3[Custom Branded Domains & SSL]
        D2 --> W4[API Keys & Outbound Webhooks]
        D2 --> W5[Subscription, Invoicing & Quotas]
        D2 --> W6[Workspace Security & Audit Logs]
    end

    subgraph D3_Content[Platform Owner Dashboard: Skyra Operations Only]
        D3 --> P1[Global ARR, MRR & Revenue]
        D3 --> P2[Total Workspaces & Users]
        D3 --> P3[Abuse Detection & Quarantined QRs]
        D3 --> P4[Infrastructure, DB & Queue Health]
        D3 --> P5[Plan, Entitlement & Feature Flags]
        D3 --> P6[Platform Audit Logs & Support Ops]
    end
```

### 6.1 Customer Dashboard

Designed for everyday marketers, restaurant managers, and content
creators: - Overview, QR Codes Catalog, Create QR Studio, Analytics &
Heatmaps, Campaigns, Landing Pages, Personal Settings.

### 6.2 Workspace Administration & MCP Access Management

Dedicated governance console for members holding `OWNER` or `ADMIN`
roles (or delegated `manage:mcp_credentials` permission): - Team Members
& RBAC (`OWNER`, `ADMIN`, `EDITOR`, `VIEWER`, `CLIENT_GUEST`). - **MCP
Access Management:** Create, configure, rotate, suspend, and revoke
credentials; inspect real-time agent invocation logs and rate limits. -
Custom Domains & SSL, Scoped API Keys, Outbound Webhooks, Subscription
Billing & Quota Meters, Workspace Audit Logs.

### 6.3 Platform Owner Dashboard

Isolated administrative system for Skyra operations staff
(`/platform-admin`): - Roles: `PLATFORM_OWNER`, `PLATFORM_ADMIN`,
`PLATFORM_SUPPORT`, `PLATFORM_ANALYST`. - Global ARR/MRR telemetry,
abuse quarantine, infrastructure health (Postgres pool, Redis memory,
stream depth), plan & entitlement configuration, and platform audit
logs.

------------------------------------------------------------------------

## 7. Core Feature Specifications & Frontend Role

### 7.1 Frontend Application Responsibilities

The user interface is powered by **Next.js 14+ (App Router)** with
**TypeScript**, **React**, **Tailwind CSS**, and **shadcn/ui**. -
**Role:** Presentation, client state, and user interaction. - **Strict
Boundary:** Next.js is **never** the authoritative business backend. All
business rules, entitlement enforcement, dynamic routing, and data
mutations are executed exclusively in the NestJS shared domain services.

### 7.2 Dynamic & Static QR Engines

-   **Dynamic QR Engine:** Encodes a unique 6-character Base62 short URL
    (e.g., `skyra.link/x7k9p2`). Short codes resolve to edge redirect
    workers where smart routing, health verification, and scan telemetry
    collection occur prior to issuing an HTTP 302/307 redirect.
-   **Static QR Engine:** Encodes data directly into the QR barcode
    matrix (e.g., raw text, direct Wi-Fi credentials). Zero database
    lookups or redirections; permanent and immutable once printed.
-   **Scannability Assurance Engine:** Evaluates
    background-to-foreground contrast ratio (WCAG AA standard) and
    module density in real time. Automatically alerts users if color
    selections or embedded logos risk unreadability.

### 7.3 Customization & Design Studio

-   **Matrix Patterns:** 12 module styles (Square, Rounded, Dots,
    Diamond, Leaf, Connected Lines, Fluid Beads, etc.).
-   **Eye Corner Shapes:** Independent outer border and inner pupil
    customizers.
-   **Coloration Engine:** Solid hex colors, linear gradients, and
    radial gradients.
-   **Branded Logo Integration:** Center logo upload with automatic
    background cutout, clamped to $\le 22\%$ of matrix area.
-   **Frame & CTA System:** 20+ preset decorative frames featuring
    customizable Call-to-Action text banners.
-   **Error Correction Levels (ECC):** Level L (7%), Level M (15%),
    Level Q (25%), Level H (30%).

------------------------------------------------------------------------

## 8. Advanced & Differentiating Features

### 8.1 Model Context Protocol (MCP) & Jarvis AI Integration

``` mermaid
flowchart TD
    Jarvis["Jarvis AI Agent (External Client)"] --> MCPClient["MCP Client Engine"]
    MCPClient -->|JSON-RPC 2.0 over Supported Transport / HTTPS| MCPServer["SkyraQR MCP Server"]
    
    subgraph MCPSecurity["MCP Authentication & Security Boundary"]
        MCPServer --> MCPAuth["MCP Credential Token Hash Validator"]
        MCPAuth --> MCPStatusCheck{"Status == ACTIVE and dates valid?"}
        MCPStatusCheck -- No --> DenyAuth[HTTP 401: Inactive or Expired]
        MCPStatusCheck -- Yes --> MCPScope["Verify Tool Scopes & Permissions"]
        MCPScope --> WorkspaceCtx["Inject Active Workspace Context"]
        WorkspaceCtx --> EntitlementCheck["Evaluate Subscription Entitlements"]
    end
    
    EntitlementCheck --> DomainServices["SkyraQR Unified Domain Service Layer"]
    
    subgraph Services["Core Business Services (Identical to REST API)"]
        DomainServices --> QRService["QR Management Service"]
        DomainServices --> AnalyticsService["Analytics Service"]
        DomainServices --> BillingService["Billing & Entitlement Service"]
    end
    
    Services --> DB[(PostgreSQL 16 DB)]
    Services --> Redis[(Redis Cluster)]

    MCPServer -.->|HIGH-RISK ACTION: delete_qr, change_billing| HumanConfirm{Human-in-the-Loop Confirmation Required?}
    HumanConfirm -- Pending Confirmation --> Halt[Stage in mcp_pending_actions & Notify Admin]
    HumanConfirm -- Confirmed by Admin --> Services
```

-   **Architecture Principle:** The MCP Server connects **exclusively**
    to SkyraQR's unified Domain Service Layer. **The MCP Server is
    strictly prohibited from executing direct database queries against
    PostgreSQL.**
-   **High-Risk Human Confirmation:** Destructive operations
    (`delete_qr`, `change_billing`, `manage:security`) stage in
    `mcp_pending_actions` until explicitly approved by a human Workspace
    Admin.
-   **Transport Specification:** Native MCP server implemented using the
    officially supported transport mechanisms of the selected production
    MCP SDK/version (with secure authenticated HTTPS communication).

### 8.2 MCP Role Model & Permission Taxonomy

SkyraQR establishes four standard MCP roles, comprised of granular,
independently assignable permissions:

``` mermaid
graph TD
    subgraph MCPRoles["Standard MCP Roles"]
        Viewer["1. MCP Viewer"]
        Editor["2. MCP Editor"]
        Manager["3. MCP Manager"]
        Admin["4. MCP Administrator"]
    end
    
    Viewer --> R_Read[All READ Permissions]
    Editor --> R_Read
    Editor --> R_Write[All WRITE Permissions]
    Manager --> R_Read
    Manager --> R_Write
    Manager --> R_Mgmt[Routing, Campaigns, Landing Management]
    Admin --> R_All[All READ, WRITE & MANAGEMENT Permissions]
```

  --------------------------------------------------------------------------------
  Permission        Granular Permission Key    Classification    Description
  Category                                                       
  ----------------- -------------------------- ----------------- -----------------
  **READ**          `read:workspace`           Standard          Inspect workspace
                                                                 metadata, plan
                                                                 tier, and
                                                                 settings

  **READ**          `read:qrs`                 Standard          List and fetch QR
                                                                 destinations,
                                                                 designs, and
                                                                 status

  **READ**          `read:analytics`           Standard          Retrieve
                                                                 aggregate scan
                                                                 counts,
                                                                 timeseries, and
                                                                 geo metrics

  **READ**          `read:usage`               Standard          Inspect quota
                                                                 meters and limit
                                                                 consumption

  **READ**          `read:health`              Standard          Query dead-link
                                                                 status and
                                                                 destination ping
                                                                 results

  **READ**          `read:campaigns`           Standard          List marketing
                                                                 campaigns and
                                                                 associated QR
                                                                 codes

  **READ**          `read:landing_pages`       Standard          Fetch
                                                                 micro-landing
                                                                 page schemas,
                                                                 menus, and vCards

  **READ**          `read:domains`             Standard          Inspect custom
                                                                 CNAME hostnames
                                                                 and SSL
                                                                 certificate
                                                                 status

  **READ**          `read:team`                Standard          List workspace
                                                                 team members and
                                                                 assigned roles

  **READ**          `read:audit`               Standard          Inspect workspace
                                                                 audit logs and
                                                                 history

  **WRITE**         `create:qrs`               Standard          Provision new
                                                                 Dynamic or Static
                                                                 QR codes

  **WRITE**         `update:qrs`               Standard          Modify
                                                                 destination URLs,
                                                                 tags, folders, or
                                                                 designs

  **WRITE**         `delete:qrs`               **HIGH-RISK**     Soft-delete a QR
                                                                 code (Requires
                                                                 human
                                                                 confirmation)

  **WRITE**         `create:campaigns`         Standard          Create new
                                                                 marketing
                                                                 campaign
                                                                 containers

  **WRITE**         `update:campaigns`         Standard          Update campaign
                                                                 metadata and
                                                                 associated QR
                                                                 lists

  **WRITE**         `delete:campaigns`         **HIGH-RISK**     Delete marketing
                                                                 campaign
                                                                 (Requires human
                                                                 confirmation)

  **WRITE**         `create:landing_pages`     Standard          Publish new
                                                                 digital menu,
                                                                 vCard, or product
                                                                 page

  **WRITE**         `update:landing_pages`     Standard          Update micro-page
                                                                 content, menu
                                                                 items, or styling

  **WRITE**         `delete:landing_pages`     **HIGH-RISK**     Delete
                                                                 micro-landing
                                                                 page (Requires
                                                                 human
                                                                 confirmation)

  **MANAGEMENT**    `manage:routing`           Standard          Create and update
                                                                 smart routing and
                                                                 A/B split rules

  **MANAGEMENT**    `manage:domains`           Standard          Connect custom
                                                                 domains and
                                                                 trigger DNS
                                                                 verification

  **MANAGEMENT**    `manage:api_keys`          **HIGH-RISK**     Create, rotate,
                                                                 and revoke REST
                                                                 API keys

  **MANAGEMENT**    `manage:mcp_credentials`   **HIGH-RISK**     Provision,
                                                                 suspend, rotate,
                                                                 or revoke MCP
                                                                 credentials

  **MANAGEMENT**    `manage:team`              **HIGH-RISK**     Invite, modify,
                                                                 or remove
                                                                 workspace members

  **MANAGEMENT**    `manage:billing`           **HIGH-RISK**     Upgrade,
                                                                 downgrade, or
                                                                 cancel
                                                                 subscription
                                                                 plans

  **MANAGEMENT**    `manage:security`          **HIGH-RISK**     Modify workspace
                                                                 MFA, IP
                                                                 allowlists, or
                                                                 security policies
  --------------------------------------------------------------------------------

### 8.3 MCP Credential Lifecycle Governance

``` mermaid
stateDiagram-v2
    [*] --> SCHEDULED: Created with starts_at in future
    [*] --> ACTIVE: Created with starts_at <= now()
    
    SCHEDULED --> ACTIVE: Current time reaches starts_at
    
    state ACTIVE {
        [*] --> InvocationsAllowed
        InvocationsAllowed --> TrackLastUsed: Updates last_used_at
    }
    
    ACTIVE --> SUSPENDED: Admin suspends credential
    SUSPENDED --> ACTIVE: Admin reactivates credential
    
    ACTIVE --> EXPIRED: Current time reaches expires_at
    SUSPENDED --> EXPIRED: Current time reaches expires_at
    
    ACTIVE --> REVOKED: Admin revokes credential / Key rotation
    SUSPENDED --> REVOKED: Admin revokes credential
    SCHEDULED --> REVOKED: Admin cancels credential
    
    REVOKED --> [*]: Terminated (Token permanently invalid)
    EXPIRED --> [*]: Inactive (Re-creation required)
```

#### Authoritative Credential Lifecycle Rules:

1.  **SCHEDULED:** Token does not work before `starts_at`. Inbound tool
    calls return `HTTP 401 Unauthorized` (`CREDENTIAL_NOT_YET_ACTIVE`).
2.  **ACTIVE:** Token functions normally between `starts_at` and
    `expires_at`. Every successful invocation updates `last_used_at`.
3.  **SUSPENDED:** Administrator temporarily halts token execution. Tool
    calls return `HTTP 401 Unauthorized` (`CREDENTIAL_SUSPENDED`). Can
    be reactivated to `ACTIVE`.
4.  **EXPIRED:** Token stops working automatically once
    `now() >= expires_at`. Returns `HTTP 401 Unauthorized`
    (`CREDENTIAL_EXPIRED`).
5.  **REVOKED:** Token is permanently and irreversibly invalidated.
    Returns `HTTP 401 Unauthorized` (`CREDENTIAL_REVOKED`).
6.  **Controlled Rotation:** Administrator issues a rotation request. A
    new token is generated and displayed once; the old credential status
    transitions to `REVOKED`.

### 8.4 Context-Aware Smart Routing & A/B Testing

-   **Deterministic A/B Traffic Splitting:**
    $$\text{bucket} = \text{hash}(\text{visitor\_key} \parallel \text{qr\_id}) \pmod{100}$$
    Where `visitor_key` is derived from the privacy-safe daily keyed
    scan identity. *Limitations:* Cross-device persistence is not
    guaranteed. Cross-day persistence is not guaranteed if the daily
    salt changes. An optional first-party cookie (`__skyra_ab_{qr_id}`)
    may be enabled for browser-level stickiness subject to privacy
    rules.
-   **Device OS Routing:** Inspects `User-Agent` headers at edge nodes
    to route iOS, Android, and Desktop users to distinct store links.
-   **Time-Based Dayparting:** Evaluates scanner local timezone to
    switch destinations automatically.

### 8.5 QR Health Monitoring & Dead-Link Defense

-   Asynchronous crawler inspects destination URLs every 12 hours via
    `HTTP HEAD`.
-   Persistent failures across 3 retries update status to `FAILING`,
    alert the Owner, and redirect traffic to a safe fallback page.

### 8.6 White-Label Agency Dashboards & Client Portals

-   Agencies can host SkyraQR under their custom domain
    (`app.agency.com`) with custom branding.
-   The `CLIENT_GUEST` role allows agency clients to review live
    analytics without editing permissions.

------------------------------------------------------------------------

## 9. QR Type Strategy & Comprehensive Generation Lifecycle

``` mermaid
flowchart TD
    Start[User / API / MCP Selects QR Type] --> AuthCheck{Authenticated & Active Session?}
    AuthCheck -- No --> ErrAuth[HTTP 401: Unauthorized]
    AuthCheck -- Yes --> WSRes{Workspace Resolved?}
    WSRes -- No --> ErrWS[HTTP 404: Workspace Not Found]
    WSRes -- Yes --> PlanRes[Resolve Workspace Subscription Plan]
    
    PlanRes --> EntitleCheck{Feature Entitled on Plan?}
    EntitleCheck -- No --> ErrEntitle[HTTP 403: Feature Not Included in Plan]
    EntitleCheck -- Yes --> QuotaCheck{Usage Quota Remaining?}
    QuotaCheck -- No --> ErrQuota[HTTP 429: Quota Limit Exhausted]
    QuotaCheck -- Yes --> ValidateInput{Zod Input Schema Valid?}
    
    ValidateInput -- Invalid --> ErrVal[HTTP 422: Validation Error]
    ValidateInput -- Valid --> SecCheck{Security Pre-Screen Passed?}
    SecCheck -- Malicious / Phishing --> ErrSec[HTTP 400: Flagged as Unsafe]
    SecCheck -- Clean --> TypeProc[Execute Type-Specific Processing]
    
    TypeProc --> IsDyn{Is QR Dynamic?}
    IsDyn -- Yes --> GenShort[Generate Base62 Short Code & Register Destination]
    IsDyn -- No --> EncodeRaw[Format Direct Barcode Payload]
    
    GenShort --> DesignProc[Apply Pattern, Colors, Eyes & Frame]
    EncodeRaw --> DesignProc
    
    DesignProc --> Scannability{Scannability Score >= 75?}
    Scannability -- Low Contrast --> WarnScan[Clamp Logo / Auto-Adjust Contrast]
    Scannability -- Pass --> PersistDB[(Persist QR, Design & Destination in DB)]
    WarnScan --> PersistDB
    
    PersistDB --> RenderVector[Render Lossless Vector Canvas SVG/PDF]
    RenderVector --> RecordUsage[Increment Workspace Usage Meter]
    RecordUsage --> AuditLog[Write Audit Log Event]
    AuditLog --> Success[Return QR Metadata + Asset URL]
```

### The 16 Supported QR Types

  -----------------------------------------------------------------------------------------------------------------------------------------------
     \#    QR Type           Modality         Purpose &       Required Fields       Optional Fields  Target Behavior              Minimum Tier
                                              Primary User                                                                        
  -------- ----------------- ---------------- --------------- --------------------- ---------------- ---------------------------- ---------------
   **1**   **Dynamic URL**   Dynamic          Marketing       `target_url`          `utm_source`,    Resolves short link -\>      Free (2 active)
                                              campaigns,                            `utm_medium`,    Smart routing -\> 302        
                                              billboards,                           `utm_campaign`   redirect                     
                                              print ads                                                                           

   **2**   **Static URL**    Static           Permanent raw   `raw_url`             None             Hardcoded into matrix;       Free
                                              links, hardware                                        direct browser load          (Unlimited)
                                              labels                                                                              

   **3**   **vCard Plus**    Dynamic          Digital         `first_name`,         `photo`,         Loads responsive micro-page  Starter
                                              business cards  `email`, `phone`      `company`,       with 1-tap `.vcf` download   
                                              for                                   `title`,                                      
                                              professionals                         `socials`, `bio`                              

   **4**   **Static vCard**  Static           Offline contact `first_name`, `phone` `last_name`,     Standard `BEGIN:VCARD` text  Free
                                              exchange                              `email`,         payload in matrix            (Unlimited)
                                                                                    `company`                                     

   **5**   **Digital Menu**  Dynamic          Contactless     Establishment `name`, Allergen tags,   Loads fast responsive menu   Starter
                                              restaurant &    $\ge 1$ Category,     item photos,     micro-page with dayparting   
                                              bar menus       $\ge 1$ Item          currency                                      
                                                                                    switcher                                      

   **6**   **PDF Showcase**  Dynamic          Catalogs,       Uploaded PDF file     File title,      Loads embedded mobile PDF    Starter
                                              brochures,      ($\le 50\text{MB}$)   cover image,     viewer micro-page            
                                              technical                             download toggle                               
                                              manuals                                                                             

   **7**   **Wi-Fi Access**  Static           Instant guest   `ssid`, `auth_type`   `password`,      Standard                     Free
                                              network         (WPA/WPA2/WEP)        `is_hidden`      `WIFI:S:...;P:...;;` string; (Unlimited)
                                              connection                                             1-tap connect                

   **8**   **Link-in-Bio**   Dynamic          Social media    Title, $\ge 1$        Profile avatar,  Loads responsive social link Free
                                              aggregators for Social/Web link       bio, brand theme aggregator micro-page        (Watermarked)
                                              creators                                                                            

   **9**   **WhatsApp        Dynamic/Static   Customer        `phone_number`        Pre-filled       Opens WhatsApp chat          Free
           Direct**                           support &                             default message  (`wa.me/{phone}?text=...`)   
                                              instant                                                                             
                                              inquiries                                                                           

   **10**  **Product Page**  Dynamic          Packaging       Product `title`,      Buy button URL,  Loads high-converting        Business
                                              unboxing, D2C   Description, Photo    SKU, specs,      product showcase micro-page  
                                              storytelling                          video embed                                   

   **11**  **Coupon /        Dynamic          Retail          Promo `title`,        Expiry           Loads coupon redeem          Business
           Promo**                            discounts &     `discount_code`       countdown,       micro-page with copy-code    
                                              seasonal                              barcode, terms,  button                       
                                              promotions                            store URL                                     

   **12**  **Event RSVP**    Dynamic          Conferences,    Event `title`,        End time, map    Loads event details          Business
                                              weddings,       `start_time`,         pin, `.ics`      micro-page with 1-tap        
                                              webinars        Location              calendar         calendar add                 
                                                                                    download                                      

   **13**  **Feedback Star** Dynamic          Customer        Survey `title`,       Google Review    Loads 1--5 star rating       Business
                                              satisfaction    Rating prompt         link, feedback   micro-page; high scores      
                                              surveys &                             email            route to Google              
                                              reviews                               destination                                   

   **14**  **Smart App       Dynamic          App developers  iOS App Store URL,    Web fallback     Inspects OS at edge;         Business
           Link**                             & publishers    Android Play URL      URL, custom      redirects to correct app     
                                                                                    tracking         store                        
                                                                                    campaign                                      

   **15**  **Audio / MP3**   Dynamic          Musicians,      Uploaded Audio file   Track title,     Loads responsive audio       Business
                                              podcasters,     ($\le 30\text{MB}$)   artist name,     player micro-page            
                                              museum audio                          cover art, bio                                
                                              tours                                                                               

   **16**  **GS1 Digital     Dynamic          FMCG smart      GTIN (Global Trade    Batch/Lot        GS1-conformant URI standard  Enterprise
           Link**                             packaging,      Item Number)          number, serial   syntax (`/01/{gtin}/...`)    
                                              supply chain                          number,                                       
                                                                                    regulatory URL                                
  -----------------------------------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 10. Dynamic QR Business Logic & Lifecycle

``` mermaid
sequenceDiagram
    autonumber
    actor Scanner as Smartphone Scanner
    participant Edge as Edge CDN POP
    participant Redir as QR Redirect Service
    participant Redis as Redis L2 Cache
    participant Stream as Redis Stream (stream:scans:raw)
    participant Dest as Target Destination / Micro-Page
    
    Scanner->>Edge: GET https://skyra.link/ab89z1
    Edge->>Redir: Forward request (Client IP, User-Agent, Country)
    Redir->>Redis: GET qr:ab89z1
    alt Redis Cache Hit (< 3ms)
        Redis-->>Redir: Return metadata, status, rules
    else Cache Miss (< 15ms)
        Redir->>DB: Query PostgreSQL read replica
        DB-->>Redir: Return record
        Redir->>Redis: Populate Redis (TTL 3600s)
    end
    
    Redir->>Redir: Evaluate status (Active, Paused, Expired)
    Redir->>Redir: Evaluate Smart Routing (OS, Geo, Dayparting, A/B)
    
    critical Durable Asynchronous Telemetry
        Redir->>Stream: XADD stream:scans:raw * (Durable enqueue with message ID ack)
    end
    
    Redir-->>Scanner: HTTP 302 Found (Location: Target URL)
    Scanner->>Dest: Navigate to destination
```

------------------------------------------------------------------------

## 11. End-to-End User Journeys

### Journey 1: New User Self-Serve Onboarding to Production QR

1.  User registers with email/password; system hashes password with
    Argon2id; provisions User and default Workspace.
2.  User verifies email; logs in and receives short-lived JWT +
    `HttpOnly` refresh cookie.
3.  Lands on **Customer Dashboard**; explores templates with clear
    status badges (**AVAILABLE**, **LIMITED**, **REQUIRES UPGRADE**).
4.  Creates Dynamic URL QR within Free tier limits; styles design and
    downloads vector SVG.

### Journey 2: Workspace Admin Connects Custom Branded Domain

1.  Workspace Owner navigates to **Workspace Administration**
    $\rightarrow$ **Domains**.
2.  Submits custom domain: `go.mybrand.com`; system outputs DNS CNAME
    target: `edge.skyra.link`.
3.  Admin updates DNS registrar; clicks **Verify DNS**.
4.  System confirms DNS propagation, provisions Let's Encrypt SSL
    certificate via ACME; marks domain **ACTIVE**.

### Journey 3: Delegated MCP Credential Issuance & Jarvis AI Execution

1.  Workspace Owner navigates to **Workspace Administration**
    $\rightarrow$ **Team Members**; invites Priya as `Workspace Admin`
    and grants `manage:mcp_credentials`.
2.  Priya navigates to **MCP Access Management**; creates an MCP
    credential for the Jarvis marketing agent with role `MCP Manager`
    and 90-day expiry.
3.  System validates that Priya's attempted permissions do not exceed
    her own effective privileges; mints `mcp_sk_live_...` and displays
    it **once**.
4.  Jarvis connects to SkyraQR MCP Server endpoint; invokes
    `get_scan_metrics` and `update_destination`.
5.  All operations are immutably logged in `audit_logs` and structured
    ELK streams with zero direct database exposure.

------------------------------------------------------------------------

## 12. Detailed Functional Requirements

``` mermaid
classDiagram
    class FunctionalRequirement {
        +String req_id
        +String title
        +String actor
        +String preconditions
        +List~String~ main_flow
        +List~String~ alternate_flows
        +List~String~ business_rules
        +List~String~ acceptance_criteria
    }
```

  ------------------------------------------------------------------------------
  ID                Requirement Name  Actor             Description & Business
                                                        Rules
  ----------------- ----------------- ----------------- ------------------------
  **BR-FR-001**     User Registration Visitor           Provisions `users`
                    & Workspace                         record with Argon2id
                    Provisioning                        password hash and
                                                        default `workspaces`
                                                        container. Dispatches
                                                        cryptographic
                                                        verification email.

  **BR-FR-002**     Sign-In & Refresh User              Authenticates user;
                    Token Rotation                      issues 15-min JWT access
                                                        token and 7-day
                                                        `HttpOnly` rotating
                                                        refresh token cookie.
                                                        Token replay immediately
                                                        revokes session family.

  **BR-FR-003**     Multi-Factor      User              RFC 6238 TOTP enrollment
                    Authentication                      with encrypted secret
                    (TOTP)                              and 8 single-use hashed
                                                        recovery codes.
                                                        Mandatory for Platform
                                                        Administrators.

  **BR-FR-004**     Password Reset &  User              Cryptographic reset
                    Token                               token (1-hour TTL);
                    Invalidation                        updating password
                                                        automatically revokes
                                                        all active Redis session
                                                        keys for that user.

  **BR-FR-005**     Customer          Member            Interface for everyday
                    Dashboard                           QR management, live
                    Experience                          canvas previews,
                                                        campaigns, landing
                                                        pages, and analytics.
                                                        Badges indicate plan
                                                        availability.

  **BR-FR-006**     Workspace         Admin             Console for managing
                    Administration &                    team members, RBAC roles
                    RBAC                                (`OWNER`, `ADMIN`,
                                                        `EDITOR`, `VIEWER`,
                                                        `CLIENT_GUEST`), custom
                                                        domains, API keys, and
                                                        billing.

  **BR-FR-007**     Platform Owner    Platform Staff    Dedicated, isolated
                    Administration                      console
                                                        (`/platform-admin`) for
                                                        managing global ARR/MRR,
                                                        system health, abuse
                                                        quarantines, and plan
                                                        configurations.

  **BR-FR-008**     Dynamic QR Short  Editor+           Generates
                    Code Mapping                        collision-resistant
                                                        6-character Base62 short
                                                        code linked to a
                                                        destination URL.
                                                        Verifies remaining
                                                        dynamic QR quota before
                                                        creation.

  **BR-FR-009**     Design Studio &   Editor+           Visual styling
                    Scannability                        customizer for patterns,
                    Scoring                             corner eyes, colors, and
                                                        logos. Evaluates WCAG
                                                        contrast ratio; clamps
                                                        center logo to
                                                        $\le 22\%$ matrix area.

  **BR-FR-010**     Lossless Vector & Member            Exports generated QR
                    Raster File                         codes in SVG, PDF (CMYK
                    Export                              print-ready), EPS, and
                                                        high-res PNG (up to
                                                        4096px).

  **BR-FR-011**     Context-Aware     System            Edge redirect worker
                    Device OS Routing                   inspects `User-Agent`
                                                        and routes iOS, Android,
                                                        and Desktop users to
                                                        distinct destination
                                                        URLs.

  **BR-FR-012**     Time-Based        System            Edge redirect worker
                    Dayparting                          evaluates scanner local
                                                        timezone to switch
                                                        destinations
                                                        automatically across
                                                        scheduled time windows.

  **BR-FR-013**     Deterministic A/B Marketer          Splits traffic between
                    Traffic Splitting                   two destination URLs
                                                        using deterministic
                                                        salted hash modulo math
                                                        with optional
                                                        first-party cookie
                                                        stickiness.

  **BR-FR-014**     Automated         System            Asynchronous crawler
                    Dead-Link Crawler                   inspects destination
                                                        URLs every 12 hours via
                                                        `HTTP HEAD`; persistent
                                                        failures trigger alerts
                                                        and reroute traffic to
                                                        fallback URLs.

  **BR-FR-015**     MCP Server        Jarvis Agent      Exposes standardized MCP
                    Interface for AI                    server enabling AI
                    Agents                              agents to invoke
                                                        read/write tools through
                                                        the domain service
                                                        layer. Zero direct
                                                        database access.

  **BR-FR-016**     Human             Jarvis / Owner    High-risk MCP tools
                    Confirmation for                    (`delete_workspace`,
                    High-Risk MCP                       `delete_qr`,
                    Tools                               `change_billing`) stage
                                                        in
                                                        `PENDING_CONFIRMATION`
                                                        until explicitly
                                                        confirmed by a human
                                                        Admin.

  **BR-FR-017**     Privacy-First     System            Ingests real-time scan
                    Telemetry                           events using HMAC-SHA256
                    Collection                          with a 24-hour rotating
                                                        secret salt. Raw client
                                                        IP addresses are
                                                        discarded immediately
                                                        from memory.

  **BR-FR-018**     Real-Time         Member / API      Interactive analytics
                    Telemetry & Daily                   charts backed by
                    Rollups                             pre-aggregated
                                                        `daily_scan_metrics`
                                                        tables, loading in
                                                        $< 50\text{ms}$ across
                                                        30-day query windows.

  **BR-FR-019**     Custom Domains &  Admin             Supports custom CNAME
                    Automated SSL                       subdomains
                                                        (`qr.brand.com`) with
                                                        automated Let's Encrypt
                                                        SSL certificate
                                                        provisioning via ACME
                                                        protocol.

  **BR-FR-020**     Bulk QR           Admin             Programmatically
                    Generation via                      provisions up to 5,000
                    CSV                                 QR codes from an
                                                        uploaded CSV batch file
                                                        via background worker
                                                        queue.

  **BR-FR-021**     Dual Billing      Owner             Supports global credit
                    Engine (Stripe +                    cards/USD via Stripe
                    Razorpay)                           Billing and native
                                                        Indian payments (UPI
                                                        AutoPay, Netbanking, GST
                                                        invoices) via Razorpay.

  **BR-FR-022**     Delegated         Owner / Admin     Allows owners and admins
                    Workspace Users                     to invite users, assign
                                                        workspace roles, and
                                                        delegate administrative
                                                        tasks within strict
                                                        boundaries.

  **BR-FR-023**     Delegated MCP     Delegated Admin   Permits authorized users
                    Administration                      to access MCP Access
                                                        Management; strictly
                                                        prevents delegating
                                                        permissions exceeding
                                                        the user's own
                                                        authority.

  **BR-FR-024**     MCP Credential    Delegated Admin   Generates high-entropy
                    Creation & Token                    `mcp_sk_live_...`
                    Hashing                             credentials; displays
                                                        token once; stores only
                                                        `token_prefix` and
                                                        SHA-256 `token_hash`.

  **BR-FR-025**     MCP Credential    Admin / System    Manages credential
                    Lifecycle                           states: `SCHEDULED`,
                    Governance                          `ACTIVE`, `SUSPENDED`,
                                                        `EXPIRED`, `REVOKED`.
                                                        Enforces temporal and
                                                        operational limits.

  **BR-FR-026**     MCP Roles &       Admin             Assigns standard roles
                    Granular                            (`MCP Viewer`,
                    Permissions                         `MCP Editor`,
                                                        `MCP Manager`,
                                                        `MCP Administrator`) or
                                                        granular custom
                                                        permissions.

  **BR-FR-027**     PostgreSQL        System            Authoritative immutable
                    Business &                          ledger in `audit_logs`
                    Security Audit                      capturing actor, action,
                    Logging                             resource, before/after
                                                        state, and request
                                                        metadata.

  **BR-FR-028**     Centralized ELK   System            Emits structured JSON
                    Observability &                     events to
                    Tracing                             Logstash/Elasticsearch
                                                        with correlated
                                                        `request_id` and
                                                        `trace_id` across all
                                                        application services.

  **BR-FR-029**     Automated         System            Sanitizes all logs and
                    Sensitive Secret                    audit events to prevent
                    Redaction                           leaking raw tokens,
                                                        password hashes, payment
                                                        data, or authorization
                                                        secrets.
  ------------------------------------------------------------------------------

------------------------------------------------------------------------

## 13. Traceability Matrix

  --------------------------------------------------------------------------------------------------------------------
  Requirement ID  Primary Architecture     API Endpoint Group                 Database Entity           Verification
                  Component                                                                             Method
  --------------- ------------------------ ---------------------------------- ------------------------- --------------
  **BR-FR-001**   `AuthService`            `/api/v1/auth/register`            `users`, `workspaces`     Unit & E2E
                                                                                                        Test

  **BR-FR-002**   `AuthService`, Redis     `/api/v1/auth/login`, `/refresh`   `user_sessions`,          E2E Security
                  Cluster                                                     `refresh_tokens`          Test

  **BR-FR-003**   `AuthService` (RFC 6238) `/api/v1/auth/mfa/*`               `user_mfa_settings`       Security Unit
                                                                                                        Test

  **BR-FR-004**   `AuthService`, Redis     `/api/v1/auth/password-reset`      `users`,                  Integration
                  Cluster                                                     `auth_audit_logs`         Test

  **BR-FR-005**   Next.js Frontend,        `/api/v1/qrs`,                     `qr_codes`, `qr_designs`  UI E2E Cypress
                  `QRService`              `/api/v1/workspaces`                                         Test

  **BR-FR-006**   `WorkspaceService`, RBAC `/api/v1/workspaces/:id/members`   `workspace_members`,      RBAC Matrix
                  Guard                                                       `roles`                   Test

  **BR-FR-007**   `PlatformAdminService`   `/platform-admin/api/v1/*`         `platform_users`,         Security
                                                                              `platform_roles`          Isolation Test

  **BR-FR-008**   `QRService`              `/api/v1/qrs`                      `qr_codes`,               Functional
                                                                              `qr_destinations`         Test

  **BR-FR-009**   `DesignService`          `/api/v1/qrs/preview`              `qr_designs`              Visual
                  (Canvas/SVG)                                                                          Regression
                                                                                                        Test

  **BR-FR-010**   `ExportService` (Vector  `/api/v1/qrs/:id/export`           `qr_codes`, `qr_designs`  PDF/SVG
                  Engine)                                                                               Verification

  **BR-FR-011**   Edge Redirect Worker     `GET /:shortCode`                  `redirect_rules`          Edge Latency
                                                                                                        Test

  **BR-FR-012**   Edge Redirect Worker     `GET /:shortCode`                  `redirect_rules`          Time-Window
                                                                                                        Test

  **BR-FR-013**   Edge Redirect Worker     `GET /:shortCode`                  `redirect_rules`          Statistical
                                                                                                        A/B Test

  **BR-FR-014**   `HealthCrawlerService`   `/api/v1/qrs/:id/health`           `qr_health_checks`        Background Job
                                                                                                        Test

  **BR-FR-015**   `MCPServer`, Domain      `/api/v1/mcp/*` (JSON-RPC)         `mcp_credentials`,        MCP Client E2E
                  Services                                                    `mcp_roles`               Test

  **BR-FR-016**   `MCPServer`,             `/api/v1/mcp/pending-actions/*`    `mcp_pending_actions`     Human Approval
                  `WorkspaceAdmin`                                                                      Flow

  **BR-FR-017**   Edge POP, Redis Stream   `stream:scans:raw`                 `scan_events`             Privacy Salt
                                                                              (Partitioned)             Verification

  **BR-FR-018**   `AnalyticsService`       `/api/v1/analytics/*`              `daily_scan_metrics`      Benchmark Load
                                                                                                        Test

  **BR-FR-019**   `DomainService`, ACME    `/api/v1/domains/*`                `custom_domains`          SSL
                  Engine                                                                                Verification
                                                                                                        Test

  **BR-FR-020**   `BulkQRWorker` (BullMQ)  `/api/v1/qrs/bulk`                 `qr_generation_jobs`      5,000 CSV
                                                                                                        Ingest Test

  **BR-FR-021**   `BillingService`         `/api/v1/billing/*`                `subscriptions`,          Webhook
                  (Stripe/Razorpay)                                           `invoices`                Simulator Test

  **BR-FR-022**   `WorkspaceService`       `/api/v1/workspaces/:id/invites`   `workspace_invitations`   Member
                                                                                                        Onboarding
                                                                                                        Test

  **BR-FR-023**   `MCPService`, Delegated  `/api/v1/mcp/credentials`          `mcp_credentials`,        Authority
                  Guard                                                       `roles`                   Boundary Test

  **BR-FR-024**   `MCPService`, Crypto     `/api/v1/mcp/credentials`          `mcp_credentials`         Hash Storage
                  Engine                                                                                Test

  **BR-FR-025**   `MCPService`, Cron       `/api/v1/mcp/credentials/:id/*`    `mcp_credentials`         Lifecycle
                  Worker                                                                                State Machine

  **BR-FR-026**   `MCPService`             `/api/v1/mcp/roles`, `/perms`      `mcp_roles`, `mcp_perms`  Permission
                                                                                                        Bundle Test

  **BR-FR-027**   `AuditService`           `/api/v1/audit-logs`               `audit_logs`              Immutability
                                                                                                        Verification

  **BR-FR-028**   Logger, Logstash /       Centralized ELK Ingest             Elasticsearch Index       ELK Tracing
                  Elasticsearch                                                                         Test

  **BR-FR-029**   Logging Sanitizer        All Ingress / Egress               ELK / `audit_logs`        Secret Leakage
                  Interceptor                                                                           Scanner
  --------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 14. Non-Functional Requirements (NFRs)

``` mermaid
graph TD
    NFR[SkyraQR Non-Functional Standards]
    NFR --> Perf[Performance & Latency]
    NFR --> Avail[Availability & Resilience]
    NFR --> Sec[Security & Privacy]
    NFR --> Scale[Scalability & Throughput]
    
    Perf --> P1["Target Edge Redirect: p95 < 20ms, p99 < 30ms"]
    Perf --> P2["Dashboard Load: FCP < 1.0s"]
    Avail --> A1[99.95% Redirect Uptime SLA]
    Avail --> A2[RPO < 1 Hour, RTO < 4 Hours]
    Sec --> S1[Zero Raw IP Storage in Telemetry]
    Sec --> S2[Safe Browsing Malware Defense]
    Scale --> SC1[10,000 sustained scans/sec]
    Scale --> SC2[Monthly Range Partitioning]
```

  ----------------------------------------------------------------------------------------------------------------------
  ID                Category            Target Metric                                           Description &
                                                                                                Architectural
                                                                                                Enforcement
  ----------------- ------------------- ------------------------------------------------------- ------------------------
  **BR-NFR-001**    **Redirect          $\text{p95} < 20\text{ms}, \text{p99} < 30\text{ms}$    Target p99 end-to-end
                    Latency**                                                                   edge redirection latency
                                                                                                under defined benchmark
                                                                                                conditions, excluding
                                                                                                network latency outside
                                                                                                SkyraQR control.

  **BR-NFR-002**    **Availability      $99.95\%$ Uptime                                        Applies to edge redirect
                    SLA**                                                                       infrastructure
                                                                                                ($< 4.38\text{ hours}$
                                                                                                downtime/year).
                                                                                                Multi-region edge
                                                                                                deployment.

  **BR-NFR-003**    **Ingestion         $10,000 \text{ scans/sec}$                              Decoupled durable
                    Throughput**                                                                ingestion via Redis
                                                                                                Streams
                                                                                                (`stream:scans:raw`);
                                                                                                zero blocking database
                                                                                                writes during redirect.

  **BR-NFR-004**    **Analytics         $\le 5\text{ seconds}$                                  Time from physical scan
                    Freshness**                                                                 execution to appearance
                                                                                                in real-time telemetry
                                                                                                dashboard counters.

  **BR-NFR-005**    **Privacy           Privacy-by-Design Aligned                               Raw IP addresses are not
                    Architecture**                                                              persisted in QR scan
                                                                                                telemetry; limited IP
                                                                                                data may be retained in
                                                                                                security/audit logs per
                                                                                                documented policies.

  **BR-NFR-006**    **Security          OWASP Top 10 Aligned                                    Strict CSP, HSTS,
                    Standards**                                                                 rate-limiting on auth
                                                                                                routes (5 req/15 min),
                                                                                                parameterized queries,
                                                                                                CORS lockdown.

  **BR-NFR-007**    **Malware Defense** Google Safe Browsing API                                Pre-screens dynamic
                                                                                                destination URLs at
                                                                                                creation; automated
                                                                                                12-hour re-check of
                                                                                                active destinations.

  **BR-NFR-008**    **Accessibility**   WCAG 2.1 Level AA                                       Customer dashboard and
                                                                                                all public micro-landing
                                                                                                pages comply with
                                                                                                contrast and keyboard
                                                                                                accessibility standards.

  **BR-NFR-009**    **Mobile            Lighthouse Mobile $\ge 90$                              Public micro-landing
                    Performance**                                                               pages achieve First
                                                                                                Contentful Paint (FCP)
                                                                                                $< 1.2\text{s}$ on 4G
                                                                                                cellular connections.

  **BR-NFR-010**    **Disaster          $\text{RPO} < 1\text{ hr}, \text{RTO} < 4\text{ hrs}$   Continuous PostgreSQL
                    Recovery**                                                                  WAL archiving to S3/R2;
                                                                                                daily cross-region
                                                                                                automated database
                                                                                                snapshots.

  **BR-NFR-011**    **API Performance** $\text{p95} < 100\text{ms}$                             Core management REST API
                                                                                                endpoints respond under
                                                                                                100ms under standard
                                                                                                load conditions.

  **BR-NFR-012**    **Barcode           ISO/IEC 18004:2015                                      Standard-compliant QR
                    Precision**                                                                 code generation ensuring
                                                                                                compatibility across
                                                                                                100% of standard
                                                                                                smartphone scanners.

  **BR-NFR-013**    **Export Asset      Lossless Vector Output                                  SVG, EPS, and PDF vector
                    Quality**                                                                   files contain zero
                                                                                                raster artifacting to
                                                                                                permit billboard-scale
                                                                                                printing.

  **BR-NFR-014**    **Tenant            Strict Multi-Tenancy                                    Every database query
                    Isolation**                                                                 scoped directly via
                                                                                                `workspace_id` or
                                                                                                indirectly via parent
                                                                                                relational foreign key
                                                                                                hierarchy.

  **BR-NFR-015**    **MCP Tool          $\text{p95} < 250\text{ms}$                             MCP tool invocations
                    Latency**                                                                   execute through domain
                                                                                                services and return
                                                                                                structured JSON in under
                                                                                                250ms.

  **BR-NFR-016**    **Platform Reuse    Zero generic UI duplication                             Shared UI/design-system
                    Boundary**                                                                  primitives and reusable
                                                                                                generic QR generation
                                                                                                must be consumed from
                                                                                                Skyra Platform rather
                                                                                                than reimplemented
                                                                                                inside SkyraQR.

  **BR-NFR-017**    **QR Core           Product-agnostic package                                `@skyra/qr` must have no
                    Isolation**                                                                 dependency on SkyraQR
                                                                                                database, billing,
                                                                                                workspace, analytics,
                                                                                                MCP, or tenant state.
  ----------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 15. Subscription, Entitlement Engine & Monetization Strategy

### 15.1 Before-Subscription and After-Subscription Experience

``` mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    Unauthenticated --> FreeTierAccount: Sign Up & Verify Email
    
    state FreeTierAccount {
        [*] --> ExploreDashboard
        ExploreDashboard --> ViewTemplates: Explore 16 QR Types
        ViewTemplates --> StatusBadges: Inspect UI Badges
        note right of StatusBadges
            AVAILABLE: Dynamic URL (up to 2), Static QRs
            LIMITED: Basic Analytics (7 days), Watermarked
            REQUIRES UPGRADE: Menus, Custom Domains, Smart Routing
        end note
        StatusBadges --> CreateFreeQR: Generate within Quota
        StatusBadges --> UpgradeCTA: Click Locked Feature
    }
    
    FreeTierAccount --> PaidSubscriber: Subscribe (Stripe / Razorpay)
    
    state PaidSubscriber {
        [*] --> EntitlementsUnlocked
        EntitlementsUnlocked --> RealTimeMeters: Active Usage Meters
        RealTimeMeters --> Threshold80: Usage reaches 80% (Warning Email)
        Threshold80 --> Threshold90: Usage reaches 90% (Urgent In-App Alert)
        Threshold90 --> Threshold100: Usage reaches 100% (Deterministic Quota Action)
    }
```

### 15.2 Subscription Tier Architecture

  --------------------------------------------------------------------------------------------------------------
  Dimension            Free Tier         Starter Tier      Business Tier     Agency Tier       Enterprise Tier
  -------------------- ----------------- ----------------- ----------------- ----------------- -----------------
  **Price (USD)**      \$0 / month       \$9 / month       \$29 / month      \$79 / month      Custom
                                         (\$90/yr)         (\$290/yr)        (\$790/yr)        (\$299+/mo)

  **Price (INR)**      ₹0 / month        ₹499 / month      ₹1,499 / mo       ₹3,999 / mo       Custom
                                         (₹4,990/yr)       (₹14,990/yr)      (₹39,990/yr)      (₹25,000+/mo)

  **Database           `NUMERIC(12,2)`   `NUMERIC(12,2)`   `NUMERIC(12,2)`   `NUMERIC(12,2)`   `NUMERIC(12,2)`
  Precision**                                                                                  

  **Active Dynamic     2 active          15 active         100 active        500 active        Unlimited
  QRs**                                                                                        

  **Static QRs**       Unlimited         Unlimited         Unlimited         Unlimited         Unlimited

  **Monthly Scans**    500 / month       25,000 / month    250,000 / month   1,500,000 / month Unlimited /
                                                                                               Custom

  **Analytics          7 days            90 days           365 days          2 Years           5 Years / Raw
  Retention**                                                                                  Export

  **Micro-Landing      Watermarked       All templates, No Custom CSS &      Custom CSS &      Custom Domain
  Pages**                                watermark         Badges            White-Label       Isolated

  **Custom Domains**   0                 0                 1 Custom Domain   5 Custom Domains  Unlimited
                                                                                               Dedicated

  **Team Member        1 (Solo)          2 Seats           5 Seats           15 Seats          Custom RBAC Seats
  Seats**                                                                                      

  **Workspaces**       1                 1                 3 Workspaces      10 Client         Unlimited
                                                                             Workspaces        Workspaces

  **Bulk Generation**  Not available     Up to 100         Up to 1,000       Up to 5,000       Programmatic API
                                         QRs/batch         QRs/batch         QRs/batch         Stream

  **Smart Routing**    Not available     OS Device Routing OS, Geo &         OS, Geo, Time,    Custom Edge Rules
                                                           Dayparting        A/B Split         Engine

  **REST API &         Not available     Read-only API     Full API (60      Full API (300     Dedicated API
  Webhooks**                                               req/min)          req/min)          Limits

  **MCP Server         Not available     Read-only tools   Read + Write      Full MCP + Jarvis Custom Agent
  Access**                                                 tools             Agent             Scopes

  **Dead-Link          Not available     Weekly check      12-hour crawl     6-hour crawl      Real-time health
  Crawler**                                                                                    monitor

  **White-Labeling**   SkyraQR branding  SkyraQR branding  Remove Skyra      Full Agency       Custom Portal &
                                                           branding          White-Label       Dedicated IP
  --------------------------------------------------------------------------------------------------------------

### 15.3 Authoritative Entitlement Policy Model

SkyraQR enforces a unified, unambiguous three-tier entitlement policy
model across the UI, REST API, and MCP Server:

  --------------------------------------------------------------------------------------------------
  Quota /        Relevant Plans Limit              Enforcement Layer Behavior When Limit Reached
  Feature Name                  Specification                        
  -------------- -------------- ------------------ ----------------- -------------------------------
  **Dynamic QR   All Tiers      Free: 2, Starter:  `QRService`       **BLOCK:** Feature denied. UI
  Creation**                    15, Business: 100,                   displays upgrade modal; REST
                                Agency: 500                          API returns
                                                                     `HTTP 403 Forbidden` if tier
                                                                     does not permit, or
                                                                     `HTTP 429 Too Many Requests`
                                                                     when active quota exhausted.
                                                                     Existing dynamic QRs continue
                                                                     scanning.

  **Monthly      All Tiers      Free: 500,         Redirect Worker   **SOFT_OVERAGE:** Scans are
  Scans**                       Starter: 25k,                        never blocked. In Free/Starter,
                                Business: 250k,                      admin alerts fire; in
                                Agency: 1.5M                         Business/Agency, overage
                                                                     billing applies per 10k
                                                                     additional scans.

  **Team Member  All Tiers      Free: 1, Starter:  `TeamService`     **BLOCK:** Inviting additional
  Seats**                       2, Business: 5,                      members denied. REST API
                                Agency: 15                           returns
                                                                     `HTTP 429 Too Many Requests`.
                                                                     Existing members retain full
                                                                     access.

  **Custom       Business+      Free: 0, Starter:  `DomainService`   **BLOCK:** Adding new domains
  Domains**                     0, Business: 1,                      denied (`HTTP 403` on
                                Agency: 5                            Free/Starter, `HTTP 429` on
                                                                     Business/Agency). Existing
                                                                     custom domains continue routing
                                                                     normally.

  **REST API     Business+      Free: 0, Starter:  API Gateway       **BLOCK:** In Free tier,
  Access**                      Read-only,                           requests return
                                Business/Agency:                     `HTTP 403 Forbidden` (feature
                                Full                                 not included). In
                                                                     Business/Agency, exceeding
                                                                     monthly request cap returns
                                                                     `HTTP 429 Too Many Requests`.

  **MCP AI       Starter+       Free: 0, Starter:  MCP Guard         **BLOCK:** Excluded tools
  Server Tools**                Read,                                return `HTTP 403` (requires
                                Business/Agency:                     plan upgrade). Exceeding
                                Read+Write                           request rate limit returns
                                                                     `HTTP 429`.

  **Workspace    All Tiers      Expired or         Entitlement       **READ_ONLY:** Workspace enters
  Downgrade**                   canceled           Engine            read-only grace period.
                                subscriptions                        Existing QR codes continue
                                                                     redirecting; creating or
                                                                     editing QRs is blocked until
                                                                     subscription is renewed.
  --------------------------------------------------------------------------------------------------

### 15.4 Advertising & Monetization Boundaries

SkyraQR explicitly upholds a strict B2B SaaS monetization policy: -
**Zero Third-Party Advertising:** SkyraQR **never** injects third-party
programmatic advertisements (e.g., Google AdSense, banners) into
customer-generated QR codes, customer destination URLs, paid
micro-landing pages, or agency white-label portals. - **Primary Revenue
Streams:** Subscription tiers, usage-based scan overages, custom
domains, high-capacity bulk generation add-ons, agency white-label
portals, and enterprise contracts. - **Free Tier Policy:** Free tier
micro-landing pages include a discreet "Powered by SkyraQR" footer link.
Users upgrade to Starter or Business tiers to remove this watermark.

------------------------------------------------------------------------

## 16. Privacy, Security Logging & Audit Retention Policy

To reconcile data protection with operational security auditing:

> **Core Policy Statement:**\
> *"Raw IP addresses are not persisted in QR scan telemetry; limited IP
> data may be retained in security/audit logs according to documented
> retention and access-control policies."*

  ---------------------------------------------------------------------------------------------------------------------
  Log / Data         Table Name              IP Retention    Primary Purpose  Retention Period       Access Controls
  Category                                   Detail                                                  
  ------------------ ----------------------- --------------- ---------------- ---------------------- ------------------
  **QR Scan          `scan_events`           **Zero Raw      Scan analytics   90 days (Starter), 365 Workspace members
  Telemetry**                                IP.** Only      and unique       days (Business), 2--5  with
                                             64-char         visitor          yrs                    `read:analytics`
                                             HMAC-SHA256     counting.        (Agency/Enterprise).   permission.
                                             salted hash                                             
                                             stored.                                                 

  **User Active      `user_sessions`         Client IP       Session          Purged immediately     Authenticated user
  Sessions**                                 address         management,      upon session           and Workspace
                                             recorded at     remote logout,   termination or after 7 Admin.
                                             login.          stolen session   days inactivity.       
                                                             detection.                              

  **Authentication   `auth_audit_logs`       Client IP       Brute-force      90 days rolling        Workspace Admins
  Audit**                                    address         investigation,   retention; auto-purged and Platform
                                             recorded on     account lockout, via cron.              Security staff.
                                             auth events.    audit trail.                            

  **Business Audit   `audit_logs`            Client IP       Authoritative    1 year (Business), 5   Workspace Admins
  Logs**                                     address         historical       years                  and Platform
                                             recorded on     ledger of all    (Agency/Enterprise,    Security staff.
                                             mutations.      configuration    SOC2 aligned).         
                                                             and resource                            
                                                             changes.                                

  **MCP Invocation   `mcp_invocation_logs`   Origin IP       AI agent audit   180 days rolling       Workspace Admins
  Logs**                                     address of MCP  trail and        retention.             and Platform
                                             client/agent.   rate-limit                              Security staff.
                                                             verification.                           

  **Platform         `platform_audit_logs`   Operator IP     Administrative   7 years statutory      Platform Owner and
  Operator Logs**                            address         accountability   compliance retention.  designated
                                             recorded on     and compliance.                         Security Auditors
                                             mutations.                                              only.
  ---------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 17. Observability & Centralized ELK Requirements

SkyraQR enforces a unified observability standard: 1. **Centralized
Structured JSON Logging:** Every component (Next.js frontend, NestJS
backend, Fastify edge redirect, background workers, MCP server) emits
machine-readable structured JSON events to Logstash / Elasticsearch. 2.
**Distributed Request Tracing:** Every HTTP and MCP request receives or
generates a unique `request_id` (UUIDv7) and `trace_id` (W3C trace
context format). These IDs propagate through controllers, domain
services, background queues, and outbound requests. 3. **Automated
Secret Redaction:** Logging interceptors automatically scrub
Authorization headers, password fields, API keys, MCP tokens, and credit
card values before serializing logs.

------------------------------------------------------------------------

## 18. Assumptions, Dependencies & Risks

### 18.1 Key Assumptions

-   Smartphone native camera apps will continue maintaining built-in QR
    barcode scanning without requiring third-party scanning apps.
-   Dynamic QR code redirection provides sufficient utility to sustain
    recurring monthly SaaS subscriptions for businesses.
-   Stripe and Razorpay maintain operational API availability in primary
    target jurisdictions.

### 18.2 System Dependencies

-   Cloudflare Enterprise Anycast DNS & Edge Network.
-   MaxMind GeoIP2 in-memory binary database.
-   Google Safe Browsing API v4 for real-time link reputation checks.
-   Stripe Billing & Razorpay Subscriptions payment gateways.

### 18.3 Risk Assessment & Mitigation

  -----------------------------------------------------------------------
  Risk Description  Severity          Probability       Architectural
                                                        Mitigation
  ----------------- ----------------- ----------------- -----------------
  **Phishing /      High              Medium            Pre-save
  Malware Abuse:**                                      screening via
  Bad actors use                                        Google Safe
  short links to                                        Browsing;
  disguise                                              automated 12-hr
  malicious                                             health crawl;
  websites.                                             1-click
                                                        quarantine in
                                                        Platform Owner
                                                        Dashboard.

  **Shared Domain   High              Low               Isolate free-tier
  Blacklisting:**                                       and paid-tier
  If `skyra.link`                                       domains;
  is flagged by                                         encourage
  spam filters,                                         Business/Agency
  customer codes                                        users to connect
  are impacted.                                         custom CNAME
                                                        domains.

  **Edge            Critical          Very Low          Stateless edge
  Redirection                                           worker
  Outage:**                                             architecture with
  Redirect cluster                                      multi-region
  downtime causes                                       failover,
  physical menus                                        in-memory
  and packaging to                                      caching, and
  fail globally.                                        automated static
                                                        fallback pages.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 19. Glossary

-   **Admin-Managed MCP Credentials:** High-entropy tokens
    (`mcp_sk_live_...`) generated and governed by workspace
    administrators with explicit permissions, expiration dates, and
    lifecycle states.
-   **Argon2id:** A hybrid memory-hard password hashing algorithm
    providing maximum resistance against GPU/ASIC brute-force cracking.
-   **Base62:** An alphanumeric encoding scheme utilizing `0-9`, `a-z`,
    and `A-Z`, optimal for collision-resistant compact URL shorteners.
-   **Dayparting:** The practice of dividing a day into discrete time
    windows to serve contextually relevant content (e.g., breakfast
    vs. dinner menus).
-   **Delegated Administration:** The security model allowing workspace
    owners to grant specific sub-administrators permission to manage MCP
    credentials without granting global platform privileges.
-   **DPDP Act 2023:** Digital Personal Data Protection Act of India,
    governing the processing of digital personal data.
-   **Dynamic QR Code:** A QR code encoding an intermediate short URL
    whose ultimate destination can be modified dynamically without
    altering the printed barcode.
-   **Model Context Protocol (MCP):** An open standard protocol enabling
    AI agents (e.g., Jarvis) to securely discover and invoke external
    tools and data sources.
-   **Reed-Solomon ECC:** Mathematical error correction embedded within
    QR codes enabling scannability even if portions are obscured or
    damaged.
-   **Static QR Code:** A QR barcode that hardcodes data directly into
    the matrix modules; permanent, immutable, and non-trackable.
-   **UUIDv7:** A time-ordered 128-bit universally unique identifier
    (RFC 9562) providing sequential B-tree indexing clustering and
    collision-free generation.
-   **vCard Plus:** A dynamic micro-landing page displaying professional
    contact details with 1-tap download into native iOS/Android address
    books.

------------------------------------------------------------------------

## 20. Revision & Version History

  ---------------------------------------------------------------------------
  Version           Date              Description           Author
  ----------------- ----------------- --------------------- -----------------
  **v1.0.0**        2026-08-15        Initial baseline BRD  Skyra Product
                                      release               Strategy

  **v2.0.0**        2026-08-25        Expansion to 16 QR    Skyra Product
                                      types, dual billing,  Strategy
                                      and MCP architecture  

  **v2.1.0**        2026-09-01        Architecture          Skyra Solution
                                      reconciliation and    Architecture
                                      strict NFR metrics    

  **v2.2.0**        2026-09-02        Final                 Skyra Solution
                                      pre-implementation    Architecture
                                      architecture          Group
                                      consistency           
                                      correction: Codename  
                                      policy, Next.js       
                                      frontend boundary,    
                                      Admin-Managed MCP     
                                      primary auth, and     
                                      NUMERIC(12,2)         
                                      precision             

  **v2.3.0**        2026-09-23        Reconciled with Skyra Skyra Product
                                      Platform: established Strategy &
                                      shared                Solution
                                      UI/design-system      Architecture
                                      ownership, introduced 
                                      reusable `@skyra/qr`  
                                      core boundary, and    
                                      clarified QR          
                                      product-vs-platform   
                                      responsibilities      
  ---------------------------------------------------------------------------

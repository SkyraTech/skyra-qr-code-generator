# Phase 2C Architecture Audit

## 1. Executive Summary
This read-only audit provides a comprehensive blueprint for implementing Phase 2C (Dynamic QR Routing Foundation). The current SkyraQR architecture successfully establishes authenticated QR management, but lacks the public resolution boundary required for dynamic QR redirects. We have determined that `shortCode`s are generated globally unique, meaning public resolution does not require tenant context. The upcoming implementation must establish an unauthenticated resolution path while enforcing basic security validations (e.g., URL protocol checks, lifecycle state, and expiration).

## 2. Current QR Architecture
**Frontend:**
Creation happens via `QrBuilder.tsx`, which maps form state to a `CreateQrCodeDto` and submits it to `/api/v1/qr-codes` using the authenticated `apiClient`.

**Backend:**
NestJS (`QrController`) intercepts the request using `SupabaseAuthGuard`, `WorkspaceContextGuard`, and `PermissionGuard`. It delegates to `QrService` and ultimately `QrRepository`, where an 8-character hex `shortCode` is generated and saved via Prisma.

## 3. Database Findings
- **QrCode:** Contains `id`, `workspaceId`, `qrTypeId`, `shortCode` (unique), `isDynamic`, `status`, `expiresAt`, `deletedAt`. 
- **QrDestination:** Linked 1:1 via `qrId`. Stores `targetUrl`.
- **QrVersion:** Exists in schema (`snapshotPayload`) but is **not** currently used by `QrRepository.update`. Updates currently mutate `QrDestination` in-place.
- **Tenant Scope:** `QrCode` includes `workspaceId`, but `shortCode` is strictly guaranteed to be globally unique by a `@unique` Prisma constraint.

## 4. ShortCode Findings
- **Generation:** Handled in `QrRepository.create` using `randomBytes(4).toString('hex')`.
- **Length:** 8 characters.
- **Uniqueness:** Enforced by `@unique` constraint in `schema.prisma`. 
- **Collision Handling:** Currently **missing**. If `randomBytes` produces a collision, Prisma will throw a unique constraint violation error. There is no retry loop.
- **Immutability:** The current update DTO does not allow changing the `shortCode`, effectively making it immutable.
- **Usage:** Currently generated for both static and dynamic QR codes unconditionally.

## 5. Current QR Payloads
| QR Type | Actual Payload | Static/Dynamic | Current Resolution Path |
|---|---|---|---|
| STATIC_URL | `qr.destination?.targetUrl` | Static | Direct to destination (Bypasses routing) |
| DYNAMIC_URL | `https://skyra.qr/r/<shortCode>` | Dynamic | Doesn't exist yet (hardcoded domain) |

*Note: The current backend matrix generation correctly distinguishes static vs. dynamic payloads.*

## 6. Current Public Routing
- **Status:** No public resolver endpoint exists in Next.js or NestJS.
- **Search Results:** There are no Next.js route handlers for `/r/[shortCode]` or `/[shortCode]`, and no unauthenticated Fastify/NestJS controllers for resolving QRs.

## 7. skyra.link Findings
- **Status:** `skyra.link` only exists as mock data inside frontend files (e.g., `dashboard/page.tsx`, `qr-codes/page.tsx`) and documentation.
- **Infrastructure:** It is **not** currently configured in any Next.js configuration, middleware, or `.env` templates. 
- **Backend:** `QrController` currently hardcodes the base URL as `https://skyra.qr` when generating matrices.

## 8. Authentication & Security Boundary
**Authenticated Boundary:** `/api/v1/qr-codes` requires `SupabaseAuthGuard`, `WorkspaceContextGuard`, and `PermissionGuard`.
**Public Boundary:** The new resolver must explicitly **bypass** these guards. However, it MUST validate:
- `deletedAt == null` (Not deleted)
- `status == 'ACTIVE'`
- `expiresAt` (If set, must be > now)
- `destination.targetUrl` exists.

## 9. Tenant Isolation
**FACT:** The `shortCode` is globally unique in the database schema (`@unique`).
**CONCLUSION:** Public resolution does **not** require a `workspaceId`. The resolver can safely query `QrCode.findUnique({ where: { shortCode } })` without risking cross-tenant data bleed, as long as it does not expose sensitive workspace data in the redirect payload.

## 10. Static vs Dynamic QR
**FACT:** `QrService.generateMatrix` currently encodes static QRs with direct target URLs, and dynamic QRs with a routing URL (`https://skyra.qr/r/{shortCode}`).
**CONCLUSION:** This is architecturally correct. No changes are needed to the static vs dynamic payload generation logic, other than updating the hardcoded `https://skyra.qr` domain.

## 11. Redirect Security
**FACT:** There is currently **no** validation preventing dangerous URLs like `javascript:alert(1)` or `data:text/html,...` from being saved as `targetUrl` in the database.
**CONCLUSION:** Phase 2C must introduce URL protocol validation (allowing only `http://` and `https://` schemas) before accepting a destination URL.

## 12. Lifecycle
- **Active States:** `status` currently defaults to `ACTIVE`.
- **Deleted States:** `softDelete` sets `status` to `ARCHIVED` and populates `deletedAt`.
- **Behavior:** The public resolver should return a `404 Not Found` or a generic "QR Code Inactive" page if `deletedAt != null`, `status != 'ACTIVE'`, or `expiresAt < now`.

## 13. Versioning
**FACT:** `QrRepository.update()` currently updates the `targetUrl` in place without generating a `QrVersion`.
**RECOMMENDATION:** Stick to simple in-place updates for Phase 2C. Implementing the full `QrVersion` snapshot logic is unnecessary for the basic routing foundation and should be deferred.

## 14. Performance
**FACT:** There is no Redis or caching infrastructure present in the repository.
**RECOMMENDATION:** Rely on standard database indexing. `shortCode` is already `@unique`, automatically creating a b-tree index in PostgreSQL. The resolution path should simply be: `Next.js Route` -> `NestJS API (Indexed DB Query)` -> `HTTP 302 Redirect`.

## 15. Recommended Routing Architecture
**Option Selected:** **Next.js Route Handler + NestJS Public API**
1. **NestJS Public API:** Create an unauthenticated `PublicQrController` mapped to `GET /api/v1/public/qr-codes/:shortCode` that returns the `targetUrl` (if valid, active, and unexpired) or throws appropriate HTTP errors.
2. **Next.js Route Handler:** Create `apps/web/src/app/r/[shortCode]/route.ts` which fetches from the NestJS Public API and issues a `NextResponse.redirect()`.

*Reasoning:* Next.js handles the public web traffic and routing, while NestJS remains the authoritative holder of business logic and database access.

## 16. Future Analytics Compatibility
The NestJS Public API resolver is the perfect place for an asynchronous analytics hook. Once the `targetUrl` is resolved, NestJS can fire a background event (e.g., via EventEmitter) to log the scan without blocking the HTTP 302 redirect. 

## 17. Future Smart Routing Compatibility
By routing through NestJS, the logic that returns `targetUrl` can later be abstracted into a `DestinationResolverService`. Phase 2C will simply return `qr.destination.targetUrl`, but Phase 3 can swap that logic to evaluate rules before returning a destination.

## 18. Platform Boundary
**FACT:** Phase 2C requires **NO** changes to Skyra Platform. Standard components and `@skyra/qr` are already sufficient.

## 19. Deployment / Domain
**RECOMMENDATION:** `skyra.link` is not yet configured. For Phase 2C, rely on an environment variable (e.g., `NEXT_PUBLIC_QR_DOMAIN`) to dictate the base URL for dynamic payloads, defaulting to the localhost frontend URL during development.

## 20. Phase 2C Scope

### MUST IMPLEMENT
- URL Protocol validation (HTTP/HTTPS only) on Create/Update QR DTOs.
- `PublicQrController` in NestJS to resolve `shortCode` securely (checking status, `deletedAt`, `expiresAt`).
- Next.js dynamic route `app/r/[shortCode]/route.ts` to execute the HTTP 302 redirect.
- Replace hardcoded `https://skyra.qr` with a configurable environment variable.

### SHOULD IMPLEMENT
- Basic collision retry logic in `QrRepository.create` for `randomBytes` short codes.

### OUT OF SCOPE
- Redis caching.
- `QrVersion` snapshot generation.
- Analytics/telemetry recording.
- Smart routing rule evaluation.
- Custom domain provisioning.

## 21. Risks / Blockers
1. **ShortCode Collision:** Missing retry logic could cause rare 500 errors during creation if an 8-char hex collides.
2. **Open Redirect Vulnerability:** Missing validation on `targetUrl` currently allows saving XSS payloads (e.g., `javascript:...`), which must be blocked.

## 22. Exact Files Likely To Change
- `apps/api/src/qr/dto/create-qr.dto.ts` (Add URL validation)
- `apps/api/src/qr/dto/update-qr.dto.ts` (Add URL validation)
- `apps/api/src/qr/repositories/qr.repository.ts` (Add shortCode collision retry loop)
- `apps/api/src/qr/qr.controller.ts` (Update hardcoded domain)
- `apps/api/src/qr/public-qr.controller.ts` (NEW: Unauthenticated resolver endpoint)
- `apps/api/src/qr/qr.module.ts` (Register public controller)
- `apps/web/src/app/r/[shortCode]/route.ts` (NEW: Next.js redirect handler)

## 23. Final Recommendation
The current architecture safely isolates workspaces and accurately generates dynamic payloads. The next step is strictly additive: building a secure, unauthenticated resolution pipeline. Ensure URL schema validation is added to prevent open redirect and XSS vulnerabilities before making the router live.

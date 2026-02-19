# Design: DinerPlacemat.com

## Context

DinerPlacemat.com is a greenfield project for the Orthodox Christian community. There is no existing codebase or infrastructure. The goal is to create a nostalgic, diner-placemat-style business directory that feels like a digital parish bulletin board.

**Technology Stack Decision**: Cloudflare ecosystem (Pages, D1, R2) provides:
- Generous free tier suitable for community project
- Edge deployment (fast globally, important for Orthodox diaspora)
- SQLite-based D1 database (familiar SQL, no managed DB complexity)
- Zero server maintenance

**Design Philosophy**: Intentionally simple. No React, no build step, no TypeScript. Vanilla HTML/CSS/JS to minimize complexity for a solo-maintained community project.

## Goals / Non-Goals

**Goals:**
- Create warm, nostalgic diner-placemat aesthetic
- Implement manual approval workflow for quality control
- Support 6-month expiration with extension capability
- Enable full-text search across listing fields
- Generate client-side puzzles for authentic placemat feel
- Single-admin authentication (no user management overhead)
- Responsive layout (desktop → mobile)

**Non-Goals:**
- User accounts for businesses (email-based contact only)
- Payment processing (free community service)
- Real-time updates or WebSockets
- Multi-language support (English only for v1)
- Analytics/tracking (privacy-focused)
- Automated expiration emails (manual admin check only)

## Decisions

### Architecture: Vanilla JS + Cloudflare Pages Functions

**Decision**: Use vanilla HTML/CSS/JS with Cloudflare Pages Functions for API

**Rationale**: 
- No build step = simpler deployment and debugging
- No framework lock-in = easier to maintain solo
- Pages Functions provide serverless API endpoints alongside static files
- One codebase, one deployment target

**Alternatives considered**:
- Next.js on Vercel: Overkill, adds build complexity
- React + CRA: Unnecessary for this UI complexity
- Django/Rails: Requires server management, defeats purpose of edge deployment

### Search: LIKE queries (Option 2)

**Decision**: Use SQLite LIKE queries with OR conditions for search

**Rationale**:
- Community size (Orthodox businesses) likely <1000 listings
- D1's FTS5 requires virtual tables and sync maintenance
- LIKE is simpler, sufficient for niche use case
- Query pattern: `business_name LIKE ? OR description LIKE ? OR parish LIKE ?`

**Trade-off**: Won't scale beyond ~10k listings, but that's acceptable for this community.

### Logo Upload: Base64 via API (Option C)

**Decision**: Client sends base64-encoded image to API, API streams to R2

**Rationale**:
- Logos are small (<1MB typical)
- One request flow is simpler than presigned URL dance
- No CORS configuration needed on R2 bucket
- 25MB Pages function limit is plenty for base64 overhead

**Alternatives considered**:
- Presigned URL direct to R2: More moving parts, CORS complexity
- Third-party upload service: External dependency, cost

### Database Schema: Single `listings` table

**Decision**: One table with status field (pending/approved/expired/rejected)

**Rationale**:
- Simplest mental model
- Expiration tracked via `expires_at` datetime field
- No separate tables for workflow states
- Single query can filter by status

### Game Generation: Pure client-side JavaScript

**Decision**: Generate mazes, word searches, tic-tac-toe in browser with vanilla JS

**Rationale**:
- No server state needed (games are ephemeral)
- Authentic "draw on placemat" feel
- SVG/Canvas rendering is lightweight
- Orthodox-themed word lists hardcoded in JS

**Algorithms**:
- **Mazes**: Recursive backtracker, render to SVG
- **Word searches**: Place words horizontally/vertically/diagonally, fill with random letters
- **Tic-tac-toe**: HTML table or Canvas, click-to-draw (no AI)

### Admin Auth: Password hash in D1 + JWT cookie

**Decision**: Single admin user, bcrypt password hash stored in D1, JWT in httpOnly cookie

**Rationale**:
- Only one admin needed (site owner)
- No user registration flow
- JWT prevents session DB lookups
- 24-hour expiry balances security vs convenience

**Alternatives considered**:
- HTTP Basic Auth: No session management, prompts browser popup (ugly)
- Cloudflare Access: External dependency, overkill for single user
- Magic link: Requires email infrastructure

## Risks / Trade-offs

**Risk**: Cloudflare free tier limits (100k requests/day, 500MB D1 storage)
→ **Mitigation**: Community project likely well within limits. Can upgrade to $5/month paid tier if needed.

**Risk**: D1 is beta/young product
→ **Mitigation**: SQLite semantics are mature. Backup strategy: regular `wrangler d1 backup` exports. Acceptable risk for community project.

**Risk**: No framework = harder to onboard future contributors
→ **Mitigation**: Code is simple by design. Well-commented vanilla JS is more accessible than complex framework setup. Trade-off accepted for maintainability.

**Risk**: LIKE search won't scale
→ **Mitigation**: Community is small and niche. If growth exceeds expectations, can migrate to D1 FTS5 or Algolia later.

**Risk**: Logo storage costs (R2)
→ **Mitigation**: R2 free tier: 10GB storage, 1M reads, 10M writes/month. Logos are small, free tier sufficient. Public bucket means egress is free.

## Migration Plan

This is a greenfield deployment:

1. **Create Cloudflare resources**:
   - D1 database via dashboard or wrangler
   - R2 bucket (public, CORS enabled)
   - Pages project

2. **Configure wrangler.toml** with bindings

3. **Deploy schema**:
   ```bash
   wrangler d1 execute dinerplacemat --file=./schema.sql
   ```

4. **Set admin password**:
   ```bash
   wrangler d1 execute dinerplacemat --command="INSERT INTO admin_user (id, password_hash) VALUES (1, '<bcrypt_hash>')"
   ```

5. **Deploy application**:
   ```bash
   wrangler pages deploy .
   ```

6. **Configure custom domain** (dinerplacemat.com) in Cloudflare dashboard

**Rollback**: Delete D1 database, R2 bucket, and Pages project. No data migration needed (greenfield).

## Open Questions

*None remaining - all decisions finalized during exploration phase.*

# Proposal: DinerPlacemat.com

## Why

Orthodox Christian businesses and individuals need a simple, community-focused platform to advertise their services to fellow Orthodox Christians. Traditional business directories are sterile and corporate. A "diner placemat" aesthetic—nostalgic, colorful, scattered with puzzles—creates a warm, parish-bulletin feel that resonates with the Orthodox community's values of fellowship and personal connection.

## What Changes

This change creates a complete web application deployed on Cloudflare:

- **Main listing page** with diner-placemat aesthetic: search bar at top, randomly-sized business cards scattered below, interspersed with puzzles/games (mazes, word searches, tic-tac-toe)
- **Intake form** accessible via hamburger menu: businesses submit contact info, description, logo, parish, and business type
- **Public R2 storage** for logo images
- **Admin panel** with single-user authentication for manual approval/rejection of listings
- **6-month expiration** system with manual extension capability
- **Full-text search** across business name, description, parish, location, and business type
- **Responsive design**: 4-column (desktop) → 2-column (tablet) → 1-column (mobile)
- **Client-side game generation**: SVG mazes, word searches (Orthodox-themed), tic-tac-toe

## Capabilities

### New Capabilities

- `listing-management`: CRUD operations for business listings, including submission, approval workflow, and expiration tracking
- `search-discovery`: Full-text search across listing fields with LIKE-based querying for niche community size
- `admin-moderation`: Single-user authentication and admin panel for manual listing approval, rejection, and lifecycle management
- `file-upload`: Logo image handling via base64 upload to R2 storage
- `game-generation`: Client-side generation of diner-placemat style puzzles (mazes, word searches, tic-tac-toe)

### Modified Capabilities

*None - this is a greenfield project.*

## Impact

- **New D1 database**: `listings` table with expiration tracking, `admin_user` table (single row)
- **New R2 bucket**: Public bucket for logo storage with CORS configuration
- **Cloudflare Pages deployment**: Static HTML/CSS/JS frontend with Pages Functions for API
- **No external dependencies**: Vanilla JavaScript, no build step, no framework lock-in
- **Single admin user**: Hardcoded or environment-variable based authentication (no user management system needed)

---

**Status**: Ready for implementation  
**Target**: MVP launch for Orthodox business community

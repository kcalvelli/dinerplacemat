# Implementation Tasks: DinerPlacemat.com

## 1. Project Setup and Infrastructure

- [x] 1.1 Initialize project structure with directories: `functions/api/`, `static/`, `static/css/`, `static/js/`
- [x] 1.2 Create `wrangler.toml` with D1 and R2 bindings configuration
- [x] 1.3 Create `schema.sql` with listings and admin_user tables
- [ ] 1.4 Set up Cloudflare D1 database via wrangler CLI (run: `wrangler d1 create dinerplacemat`)
- [ ] 1.5 Create public R2 bucket for logos and configure CORS (run: `wrangler r2 bucket create dinerplacemat-logos`)
- [ ] 1.6 Initialize admin_user table with bcrypt password hash (run: `wrangler d1 execute dinerplacemat --file=./schema.sql` then insert admin hash)
- [x] 1.7 Create `.gitignore` for wrangler secrets and node_modules

## 2. Frontend - Main Placemat Page

- [x] 2.1 Create `static/index.html` with diner aesthetic structure
- [x] 2.2 Implement hamburger menu with link to intake form
- [x] 2.3 Create search bar component with debounced input (300ms)
- [x] 2.4 Build CSS for diner color palette (cream, red checkerboard, retro pastels)
- [x] 2.5 Implement responsive masonry layout using CSS columns (4→2→1 column)
- [x] 2.6 Create listing card component with random sizing (small/medium/large)
- [x] 2.7 Add logo display with fallback to initials on error
- [x] 2.8 Implement fetch logic for `/api/listings` with search parameter
- [x] 2.9 Add loading state and error handling for API calls

## 3. Frontend - Game Generation

- [x] 3.1 Create `static/js/games.js` with three game generators
- [x] 3.2 Implement maze generator using recursive backtracker (SVG output, 20x20 desktop, 15x15 mobile)
- [x] 3.3 Build word search generator with Orthodox-themed word list (12x12 grid, 5-8 words)
- [x] 3.4 Create tic-tac-toe component (3x3 grid, click-to-draw, reset button)
- [x] 3.5 Implement game interspersal logic (random placement after 1-3 listings)
- [x] 3.6 Add responsive sizing for games on mobile viewports
- [x] 3.7 Style games with diner aesthetic (colors, fonts, borders)

## 4. Frontend - Intake Form

- [x] 4.1 Create `static/intake.html` with complete form structure
- [x] 4.2 Build form fields: business name*, email*, phone, website, business type* (dropdown), parish*, description* (textarea, 280 char limit)
- [x] 4.3 Implement logo file picker with client-side validation (type, size <5MB)
- [x] 4.4 Add base64 encoding and upload to `/api/upload-url` before form submission
- [x] 4.5 Create form validation with user-friendly error messages
- [x] 4.6 Implement form submission to `/api/intake` with success/error feedback
- [x] 4.7 Add character counter for description field

## 5. Frontend - Admin Panel

- [x] 5.1 Create `static/admin.html` with login form and dashboard sections
- [x] 5.2 Build login form with password field and error handling
- [x] 5.3 Implement JWT cookie handling (set on login, clear on logout)
- [x] 5.4 Create "Pending Approval" view with listing cards and approve/reject buttons
- [x] 5.5 Build "All Listings" view with status filters and expiration dates
- [x] 5.6 Implement approve action calling `/api/admin/approve`
- [x] 5.7 Implement reject action with reason text calling `/api/admin/reject`
- [x] 5.8 Add extend expiration action calling `/api/admin/extend`
- [x] 5.9 Implement delete action with confirmation dialog calling `/api/admin/delete`
- [x] 5.10 Style admin panel (utilitarian, clean, not diner-themed)

## 6. API - Listings Endpoints

- [x] 6.1 Create `functions/api/listings.js` with GET handler
- [x] 6.2 Implement search with LIKE queries across: business_name, description, parish, location_city, location_state, business_type
- [x] 6.3 Add filtering for approved status and non-expired (expires_at > now)
- [x] 6.4 Implement random ordering of results
- [x] 6.5 Create `functions/api/intake.js` with POST handler
- [x] 6.6 Validate required fields (business_name, email, business_type, parish, description)
- [x] 6.7 Validate description length (max 280 chars)
- [x] 6.8 Insert new listing with status "pending" and submitted_at timestamp
- [x] 6.9 Return 201 on success with listing ID

## 7. API - File Upload

- [x] 7.1 Create `functions/api/upload-url.js` with POST handler
- [x] 7.2 Implement base64 decoding with size validation (<5MB)
- [x] 7.3 Add file type validation (JPEG, PNG, GIF only)
- [x] 7.4 Generate unique filename with listing_id prefix
- [x] 7.5 Upload to R2 bucket and return public URL
- [x] 7.6 Set Cache-Control headers on R2 objects
- [x] 7.7 Return 400 for invalid type, 413 for oversized files

## 8. API - Admin Authentication

- [x] 8.1 Create `functions/api/admin/login.js` with POST handler
- [x] 8.2 Implement bcrypt password verification against admin_user table
- [x] 8.3 Generate JWT with 24-hour expiry on successful login
- [x] 8.4 Set HTTP-only cookie with JWT
- [x] 8.5 Create JWT verification middleware for all /api/admin/* endpoints
- [x] 8.6 Return 401 for invalid credentials or missing/expired JWT

## 9. API - Admin Moderation

- [x] 9.1 Create `functions/api/admin/pending.js` with GET handler
- [x] 9.2 Return all listings with status "pending", ordered by submitted_at ASC
- [x] 9.3 Create `functions/api/admin/approve.js` with POST handler
- [x] 9.4 Update listing: status="approved", approved_at=now, expires_at=now+6months
- [x] 9.5 Create `functions/api/admin/reject.js` with POST handler
- [x] 9.6 Update listing: status="rejected", store rejection_reason
- [x] 9.7 Create `functions/api/admin/all.js` with GET handler
- [x] 9.8 Support status filter parameter (pending, approved, expired, rejected, all)
- [x] 9.9 Calculate days until expiration or days since expired
- [x] 9.10 Create `functions/api/admin/extend.js` with POST handler
- [x] 9.11 Update listing: expires_at=now+6months, status="approved" (if was expired)
- [x] 9.12 Create `functions/api/admin/delete.js` with POST handler
- [x] 9.13 Delete listing from database and logo from R2 (best effort)

## 10. Deployment and Testing

- [ ] 10.1 Test all API endpoints locally with wrangler dev
- [ ] 10.2 Verify D1 queries work correctly
- [ ] 10.3 Test R2 logo upload and public access
- [ ] 10.4 Test admin authentication flow
- [ ] 10.5 Verify responsive layout on desktop, tablet, mobile
- [ ] 10.6 Test game generation and interspersal
- [ ] 10.7 Test intake form validation and submission
- [ ] 10.8 Deploy to Cloudflare Pages production
- [ ] 10.9 Configure custom domain (dinerplacemat.com)
- [ ] 10.10 Create admin user with production password hash
- [ ] 10.11 End-to-end test: submit intake → approve in admin → view on main page

## 11. Documentation

- [x] 11.1 Create README.md with project overview and local development instructions
- [x] 11.2 Document environment variables and secrets needed
- [x] 11.3 Add deployment instructions (CI/CD with GitHub Actions if desired)
- [x] 11.4 Create simple user guide for admin panel

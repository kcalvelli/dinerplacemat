# DinerPlacemat.com

A nostalgic, diner-placemat-style business directory for the Orthodox Christian community. Built with Cloudflare Pages, D1 (SQLite), and R2.

![Diner Aesthetic](https://img.shields.io/badge/style-diner%20placemat-red)
![Cloudflare](https://img.shields.io/badge/deploy-cloudflare%20pages-orange)

## Overview

DinerPlacemat.com brings the warmth of a neighborhood diner to the Orthodox Christian community. Businesses can submit their information through an intake form, and after manual approval by an admin, they appear on the main page as colorful "advertising cards" interspersed with puzzles and games—just like a real diner placemat!

### Features

- **Diner Aesthetic**: Cream backgrounds, red checkerboard borders, retro pastel cards
- **Business Directory**: Searchable by name, type, parish, or location
- **Game Cards**: Randomly generated mazes, word searches (Orthodox-themed), and tic-tac-toe
- **Manual Approval**: Admin panel for reviewing submissions
- **6-Month Expiration**: Listings automatically expire but can be extended
- **Responsive Design**: 4-column (desktop) → 2-column (tablet) → 1-column (mobile)
- **No Framework**: Pure HTML, CSS, and vanilla JavaScript—no build step required

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              CLOUDFLARE EDGE                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Frontend (Vanilla JS)                                │
│   ├── index.html      → Main placemat page              │
│   ├── intake.html     → Business submission form        │
│   ├── admin.html      → Admin dashboard                 │
│   └── css/styles.css  → Diner aesthetic                │
│                                                         │
│   Pages Functions (Serverless API)                     │
│   ├── /api/listings   → GET (search/filter)            │
│   ├── /api/intake     → POST (new submission)         │
│   ├── /api/upload-url → POST (logo upload)            │
│   └── /api/admin/*    → Moderation endpoints           │
│                                                         │
│   Data                                                  │
│   ├── D1 Database     → SQLite listings & admin_user   │
│   └── R2 Bucket       → Public logo storage            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Local Development

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repo-url>
   cd dinerplacemat
   ```

2. **Configure Wrangler:**
   ```bash
   wrangler login
   ```

3. **Create D1 Database:**
   ```bash
   wrangler d1 create dinerplacemat
   # Note the database_id from output, update wrangler.toml
   ```

4. **Create R2 Bucket:**
   ```bash
   wrangler r2 bucket create dinerplacemat-logos
   ```

5. **Update wrangler.toml:**
   Edit `wrangler.toml` with your database_id:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "dinerplacemat"
   database_id = "your-database-id-here"
   ```

6. **Deploy Schema:**
   ```bash
   wrangler d1 execute dinerplacemat --file=./schema.sql
   ```

7. **Set Admin Password:**
   ```bash
   # Generate bcrypt hash (use any bcrypt tool or Node.js)
   node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
   
   # Insert into database
   wrangler d1 execute dinerplacemat --command="INSERT INTO admin_user (id, password_hash) VALUES (1, '\$2a\$10\$...')"
   ```

8. **Set JWT Secret:**
   ```bash
   wrangler secret put JWT_SECRET
   # Enter a random secret string
   ```

9. **Run Locally:**
   ```bash
   wrangler pages dev .
   ```

10. **Open browser:**
    - Main page: http://localhost:8788
    - Intake form: http://localhost:8788/intake.html
    - Admin panel: http://localhost:8788/admin.html

## Deployment

### First Deploy

```bash
# Deploy to Cloudflare Pages
wrangler pages deploy .
```

Then in the Cloudflare dashboard:
1. Go to Workers & Pages → dinerplacemat
2. Settings → Functions → Add D1 database binding
3. Settings → Functions → Add R2 bucket binding
4. Add custom domain (dinerplacemat.com) if you have one

### Environment Variables

Set these in the Cloudflare dashboard (Settings → Environment variables):

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Random string for JWT signing |
| `ADMIN_USERNAME` | Fixed as "admin" |

### Admin Password

After first deploy, set the admin password:

```bash
wrangler d1 execute dinerplacemat --command="INSERT INTO admin_user (id, password_hash) VALUES (1, '\$2a\$10\$...')"
```

## API Endpoints

### Public Endpoints

- `GET /api/listings?search=query` - List approved, non-expired listings
- `POST /api/intake` - Submit new business listing
- `POST /api/upload-url` - Upload logo (returns public URL)

### Admin Endpoints (require JWT auth)

- `POST /api/admin/login` - Authenticate and set cookie
- `GET /api/admin/pending` - List pending submissions
- `POST /api/admin/approve` - Approve a listing
- `POST /api/admin/reject` - Reject a listing with reason
- `GET /api/admin/all?status=pending|approved|expired|rejected|all` - List all with filter
- `POST /api/admin/extend` - Extend expiration by 6 months
- `POST /api/admin/delete` - Delete listing and logo

## Database Schema

```sql
listings
├── id (PRIMARY KEY)
├── business_name (TEXT, required)
├── contact_email (TEXT, required)
├── contact_phone (TEXT)
├── description (TEXT, required, max 280 chars)
├── parish (TEXT, required)
├── location_city (TEXT)
├── location_state (TEXT)
├── business_type (TEXT, required)
├── website_url (TEXT)
├── logo_url (TEXT)
├── status (TEXT: pending|approved|expired|rejected)
├── submitted_at (DATETIME)
├── approved_at (DATETIME)
├── expires_at (DATETIME)
└── rejection_reason (TEXT)

admin_user (single row)
├── id (PRIMARY KEY = 1)
└── password_hash (TEXT)
```

## Admin Panel Guide

### Login
1. Navigate to `/admin.html`
2. Enter password (set during setup)
3. JWT cookie expires in 24 hours

### Pending Approval Tab
- Shows all listings awaiting approval
- **Approve**: Sets status to "approved", adds 6-month expiration
- **Reject**: Removes from public view, requires reason

### All Listings Tab
- Filter by: All, Pending, Approved, Expired, Rejected
- **Extend**: Adds 6 months to expiration date
- **Delete**: Permanently removes listing and logo

### Expiration Management
- Listings show days until expiration
- Expired listings highlighted in red
- Click "Extend" to renew for 6 more months

## Game Generation

Games are generated client-side with JavaScript:

- **Mazes**: Recursive backtracker algorithm → SVG rendering
- **Word Searches**: 12×12 grid with Orthodox vocabulary
- **Tic-Tac-Toe**: Simple 3×3 grid, click-to-draw (no AI)

Games appear randomly every 1-3 listings on page refresh.

## Security Notes

- **XSS Protection**: All user input is escaped before rendering
- **CSRF Protection**: Not needed (no user sessions, stateless API)
- **File Upload**: Limited to 5MB, JPEG/PNG/GIF only, validated server-side
- **Admin Auth**: bcrypt password hashing, JWT with 24hr expiry, HTTP-only cookies
- **Database**: Prepared statements prevent SQL injection

## Troubleshooting

### Logo Upload Fails
- Check R2 bucket binding in wrangler.toml
- Verify bucket exists: `wrangler r2 bucket list`
- Ensure logo is under 5MB

### Admin Login Fails
- Verify admin_user table has row with id=1
- Check password hash is valid bcrypt format
- Clear browser cookies and try again

### Listings Not Appearing
- Check status is "approved" in admin panel
- Verify expires_at is in the future
- Check browser console for API errors

## Contributing

This is a solo-maintained community project. Keep it simple:

- No build tools (no webpack, no TypeScript)
- No frameworks (no React, no Vue)
- Minimal dependencies (only bcrypt-edge for password hashing)
- Vanilla everything: HTML, CSS, JavaScript

## License

MIT License - free for the Orthodox community.

---

Built with ❤️ for the Orthodox Christian community.

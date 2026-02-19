-- Listings table with lifecycle tracking
CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    description TEXT NOT NULL,
    parish TEXT NOT NULL,
    location_city TEXT,
    location_state TEXT,
    business_type TEXT NOT NULL,
    website_url TEXT,
    logo_url TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'expired', 'rejected')),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME,
    expires_at DATETIME,
    rejection_reason TEXT
);

-- Admin user table (single row)
CREATE TABLE IF NOT EXISTS admin_user (
    id INTEGER PRIMARY KEY CHECK(id = 1),
    password_hash TEXT NOT NULL
);

-- Index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_expires ON listings(expires_at);
CREATE INDEX IF NOT EXISTS idx_listings_submitted ON listings(submitted_at);

-- Full-text search can use LIKE queries on these fields
-- business_name, description, parish, location_city, location_state, business_type

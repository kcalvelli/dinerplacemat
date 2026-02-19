# Specification: File Upload

## ADDED Requirements

### Requirement: Logos are uploaded via base64 encoding
The system SHALL accept logo images through API endpoint as base64 data.

#### Scenario: Valid image upload
- **WHEN** client POSTs to /api/upload-url with base64-encoded image data
- **AND** file size is under 5MB (after base64 overhead)
- **AND** image format is JPEG, PNG, or GIF
- **THEN** the system decodes base64 to binary
- **AND** stores file in R2 bucket with key format: logos/{listing_id}/{filename}
- **AND** returns public URL: https://{bucket}.r2.cloudflarestorage.com/logos/{listing_id}/{filename}

#### Scenario: Invalid file type
- **WHEN** client uploads non-image file (e.g., .exe, .pdf)
- **THEN** the system returns 400 Bad Request
- **AND** error message: "Invalid file type. Only JPEG, PNG, GIF allowed."

#### Scenario: File too large
- **WHEN** client uploads file larger than 5MB base64
- **THEN** the system returns 413 Payload Too Large
- **AND** error message: "File too large. Maximum 5MB."

### Requirement: Logos are stored in public R2 bucket
The system SHALL use Cloudflare R2 for logo storage.

#### Scenario: Public access
- **WHEN** a logo is successfully stored
- **THEN** the object is accessible via public URL without authentication
- **AND** CORS headers allow loading from dinerplacemat.com domain
- **AND** object has Cache-Control: public, max-age=31536000 (1 year)

#### Scenario: Logo deletion on listing removal
- **WHEN** a listing is deleted by admin
- **THEN** if listing had logo_url, the system deletes corresponding object from R2
- **AND** deletion is best-effort (listing deletion succeeds even if R2 delete fails)

### Requirement: Logo display is responsive
The system SHALL render logos appropriately across devices.

#### Scenario: Logo in card
- **WHEN** a listing card displays
- **THEN** logo is rendered with max-width: 100%
- **AND** height is auto (maintains aspect ratio)
- **AND** alt text is "{business_name} logo"
- **AND** if logo fails to load, show placeholder div with business initials

### Requirement: Pre-submission upload
The system SHALL support logo upload before intake form submission.

#### Scenario: Upload before submit
- **WHEN** user selects logo file in intake form
- **THEN** client immediately uploads to /api/upload-url (before form submit)
- **AND** on success, receives and stores logo_url
- **AND** on form submission, logo_url is included in listing data
- **AND** if form submission fails, orphaned logo remains in R2 (acceptable for v1)

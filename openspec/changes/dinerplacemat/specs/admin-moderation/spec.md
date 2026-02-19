# Specification: Admin Moderation

## ADDED Requirements

### Requirement: Single admin user authentication
The system SHALL provide authentication for a single administrative user.

#### Scenario: Admin login
- **WHEN** admin submits username (fixed as "admin") and password via login form
- **THEN** the system verifies password against bcrypt hash stored in admin_user table
- **AND** upon success, sets HTTP-only cookie with JWT token (24-hour expiry)
- **AND** redirects to admin dashboard

#### Scenario: Invalid credentials
- **WHEN** admin submits incorrect password
- **THEN** the system returns 401 Unauthorized
- **AND** displays error message "Invalid credentials"
- **AND** does not set any cookie

#### Scenario: Protected routes
- **WHEN** unauthenticated user attempts to access /admin.html or API endpoints under /api/admin/
- **THEN** the system returns 401 or redirects to login page
- **AND** all admin endpoints verify JWT before processing

### Requirement: Admin can view pending listings
The system SHALL provide moderation queue for submitted listings.

#### Scenario: View pending queue
- **WHEN** admin accesses pending listings endpoint
- **THEN** the system returns all listings with status = "pending"
- **AND** ordered by submitted_at (oldest first)
- **AND** includes all listing fields including logo preview URL

#### Scenario: Empty queue
- **WHEN** no pending listings exist
- **THEN** the system returns empty array
- **AND** admin UI displays "No submissions awaiting approval"

### Requirement: Admin can approve listings
The system SHALL enable approval action.

#### Scenario: Approve listing
- **WHEN** admin clicks approve for a pending listing
- **THEN** the system updates listing status to "approved"
- **AND** sets approved_at to current timestamp
- **AND** sets expires_at to current timestamp + 6 months
- **AND** returns success confirmation

### Requirement: Admin can reject listings
The system SHALL enable rejection with reason.

#### Scenario: Reject with reason
- **WHEN** admin clicks reject and provides reason text
- **THEN** the system updates listing status to "rejected"
- **AND** stores rejection_reason text
- **AND** the listing remains in database (for record keeping)
- **AND** rejected listings are never shown publicly

### Requirement: Admin can view all listings with filters
The system SHALL provide comprehensive listing management view.

#### Scenario: View all with status filter
- **WHEN** admin accesses all listings endpoint
- **THEN** the system accepts optional filter parameter: status (pending, approved, expired, rejected, all)
- **AND** returns matching listings ordered by submitted_at desc
- **AND** includes calculated days until expiration (or days since expired)

#### Scenario: Default view shows all approved
- **WHEN** admin accesses dashboard without filter
- **THEN** the system shows all listings with status = "approved" OR status = "expired"
- **AND** highlights expired listings with warning indicator

### Requirement: Admin can extend or delete any listing
The system SHALL provide lifecycle management actions.

#### Scenario: Extend expiration
- **WHEN** admin clicks extend on any listing (approved or expired)
- **THEN** the system sets expires_at to current timestamp + 6 months
- **AND** if listing was expired, sets status back to "approved"
- **AND** returns updated listing data

#### Scenario: Delete listing
- **WHEN** admin clicks delete on any listing
- **THEN** the system permanently removes listing from database
- **AND** if logo_url exists, deletes object from R2 bucket
- **AND** returns success confirmation
- **AND** action is irreversible (no soft delete)

# Specification: Listing Management

## ADDED Requirements

### Requirement: Business can submit listing via intake form
The system SHALL provide a form for businesses to submit their information for inclusion in the directory.

#### Scenario: Successful submission
- **WHEN** a user fills out the intake form with business name, email, business type, parish, and description
- **THEN** the system creates a new listing with status "pending"
- **AND** the listing is stored in the database with a submitted_at timestamp

#### Scenario: Submission with optional fields
- **WHEN** a user fills out required fields and optionally provides phone, website, and logo
- **THEN** the system stores all provided information
- **AND** marks the listing as pending approval

### Requirement: Listings have required and optional fields
The system SHALL enforce data structure for all listings.

#### Scenario: Valid listing data
- **WHEN** a listing is created
- **THEN** it MUST have: business_name (text, required), contact_email (text, required), business_type (enum, required), parish (text, required), description (text, required, max 280 chars)
- **AND** it MAY have: contact_phone (text), website_url (text), logo_url (text), location_city (text), location_state (text)

### Requirement: Listings track approval status and expiration
The system SHALL maintain lifecycle state for each listing.

#### Scenario: New listing status
- **WHEN** a listing is first submitted
- **THEN** its status SHALL be "pending"
- **AND** its approved_at SHALL be NULL
- **AND** its expires_at SHALL be NULL

#### Scenario: Approved listing expiration
- **WHEN** a listing is approved
- **THEN** its status becomes "approved"
- **AND** its approved_at is set to current timestamp
- **AND** its expires_at is set to approved_at + 6 months
- **AND** when current time exceeds expires_at, the status effectively becomes "expired"

### Requirement: Listings can be extended or deleted
The system SHALL support administrative lifecycle actions.

#### Scenario: Extend expiration
- **WHEN** an admin requests extension of an approved or expired listing
- **THEN** the system sets expires_at to current time + 6 months
- **AND** if status was "expired", it becomes "approved"

#### Scenario: Delete listing
- **WHEN** an admin requests deletion of any listing (pending, approved, or expired)
- **THEN** the system removes the listing from database
- **AND** if a logo exists in R2, it is deleted

### Requirement: Public page only shows approved non-expired listings
The system SHALL filter listings for public display.

#### Scenario: Public listing fetch
- **WHEN** the main page requests listings for display
- **THEN** the system returns only listings where status = "approved" AND expires_at > current_time
- **AND** listings are returned in random order for each request

# Specification: Search Discovery

## ADDED Requirements

### Requirement: Search queries match across multiple fields
The system SHALL support full-text search using LIKE queries across listing fields.

#### Scenario: Search by business name
- **WHEN** user searches for "bakery"
- **THEN** the system returns listings where business_name LIKE '%bakery%'
- **OR** description LIKE '%bakery%'
- **OR** parish LIKE '%bakery%'
- **OR** location_city LIKE '%bakery%'
- **OR** location_state LIKE '%bakery%'
- **OR** business_type LIKE '%bakery%'

#### Scenario: Multi-word search
- **WHEN** user searches for "tarpon bakery"
- **THEN** the system returns listings where any field matches 'tarpon%' AND any field matches 'bakery%'
- **AND** results are ordered by relevance (exact matches first)

#### Scenario: Empty search returns all
- **WHEN** user submits empty search query
- **THEN** the system returns all approved non-expired listings
- **AND** results are in random order

### Requirement: Search is case-insensitive
The system SHALL normalize search queries and data comparison.

#### Scenario: Case insensitive matching
- **WHEN** user searches for "BAKERY" or "Bakery" or "bakery"
- **THEN** the system returns the same results (SQLite LIKE is case-insensitive by default)

### Requirement: Search results update dynamically
The system SHALL provide responsive search experience.

#### Scenario: Debounced search input
- **WHEN** user types in search field
- **THEN** the system waits 300ms after last keystroke before executing search
- **AND** results are displayed without page reload
- **AND** a loading indicator shows during fetch

### Requirement: Search respects listing status
The system SHALL only return searchable listings.

#### Scenario: Pending listings excluded
- **WHEN** user searches for any term
- **THEN** listings with status "pending" are never returned
- **AND** listings with status "expired" (expires_at < now) are never returned

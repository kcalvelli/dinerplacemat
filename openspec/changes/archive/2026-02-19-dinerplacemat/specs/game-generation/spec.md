# Specification: Game Generation

## ADDED Requirements

### Requirement: Three game types are supported
The system SHALL generate mazes, word searches, and tic-tac-toe boards client-side.

#### Scenario: Maze generation
- **WHEN** page renders a maze game card
- **THEN** JavaScript generates a solvable maze using recursive backtracker algorithm
- **AND** maze is rendered as SVG with start (top-left) and end (bottom-right) markers
- **AND** maze dimensions are 20x20 cells for desktop, 15x15 for mobile
- **AND** solution path is hidden (user solves mentally or draws)

#### Scenario: Word search generation
- **WHEN** page renders a word search game card
- **THEN** JavaScript selects 5-8 words from Orthodox-themed word list
- **AND** places words horizontally, vertically, or diagonally in 12x12 grid
- **AND** fills empty cells with random letters
- **AND** displays word list below grid
- **AND** renders as HTML table with clickable cells (no win detection)

#### Scenario: Tic-tac-toe generation
- **WHEN** page renders a tic-tac-toe game card
- **THEN** JavaScript creates 3x3 grid using HTML table or Canvas
- **AND** user can click cells to place X or O alternately
- **AND** no AI opponent (solo "draw on placemat" mode)
- **AND** no win detection (just drawing)
- **AND" includes "Reset" button to clear board

### Requirement: Games use Orthodox-themed content
The system SHALL incorporate community-appropriate content.

#### Scenario: Word list includes Orthodox terms
- **WHEN** word search is generated
- **THEN** system selects from list including: LITURGY, EUCHARIST, ICON, CENSER, VESPERS, ORTHROS, PROSPHORA, CHOIR, PASCHA, NATIVITY, THEOTOKOS, CHRYSOSTOM
- **AND" word selection is random each generation
- **AND" words are uppercase for consistency

### Requirement: Games are interspersed randomly
The system SHALL place games among business cards organically.

#### Scenario: Random placement
- **WHEN** page loads and listings are fetched
- **THEN** JavaScript shuffles listings array
- **AND" inserts a game after every 1-3 listings (random interval)
- **AND" game type is randomly selected (maze, word, or tic-tac-toe)
- **AND" process continues until all listings displayed
- **AND" if games run out before listings, continue with just listings

#### Scenario: Game variety per load
- **WHEN" page is refreshed
- **THEN" a different random seed is used
- **AND" card sizes are re-randomized
- **AND" game positions change
- **AND" specific games (maze paths, word search words) are regenerated

### Requirement: Games are responsive
The system SHALL adapt games to screen size.

#### Scenario: Mobile maze
- **WHEN" game renders on mobile viewport (< 640px)
- **THEN" maze dimensions reduce to 15x15
- **AND" cell size is smaller (15px vs 20px)
- **AND" word search grid is 10x10 (vs 12x12 desktop)

#### Scenario: Touch interaction
- **WHEN" user is on touch device
- **THEN" tic-tac-toe cells have touch-friendly size (min 44x44px)
- **AND" no hover-dependent interactions

### Requirement: Games have diner aesthetic
The system SHALL match visual theme.

#### Scenario: Styling
- **WHEN" games render
- **THEN" they use same color palette as cards (retro pastels, off-white background)
- **AND" use diner-appropriate fonts (script or sans-serif)
- **AND" include subtle border/shadow like business cards
- **AND" have title: "Fun & Games" or "Puzzle Time" in diner style

### Requirement: Games are stateless
The system SHALL not persist game state.

#### Scenario: No save state
- **WHEN" user interacts with game (draws on tic-tac-toe, finds words)
- **THEN" progress is not saved to server or localStorage
- **AND" on page refresh, all games reset
- **AND" this is by design (authentic "paper placemat" ephemeral feel)

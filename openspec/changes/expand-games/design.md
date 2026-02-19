## Context

The diner placemat app renders business listings interspersed with interactive games in a CSS multi-column masonry layout. Games are currently selected at random from 5 types with no deduplication, leading to duplicate games on the same placemat. Connect Four uses `column-span: all` unnecessarily (the board fits in a single column). The word bank has 20 Orthodox-themed words shared between Word Search and Word Scramble. All game classes and event delegation live in `static/js/games.js`; layout and rendering logic lives in `static/js/app.js`.

## Goals / Non-Goals

**Goals:**
- 10 unique game types on each placemat, never showing the same game twice
- Game count scales proportionally with listing count
- Variable game card sizes that reflect real placemat variety
- Rich Orthodox word bank (~75 words) and trivia question bank (~45 questions)
- Connect Four renders as a normal single-column card

**Non-Goals:**
- AI opponents for two-player games (tic-tac-toe, connect four)
- Persistent game state across page loads
- Difficulty settings or user preferences
- Multiplayer networking

## Decisions

### 1. Deck-of-cards game selection
**Decision**: Shuffle an array of all game type identifiers, draw sequentially.

**Rationale**: Guarantees no duplicates with zero bookkeeping. If `maxGames <= availableTypes.length`, every game on the placemat is unique. Simpler than maintaining a "used" set or rejection sampling.

**Alternative considered**: Random selection with a "used" set — adds state tracking for the same result.

### 2. Scaling formula
**Decision**: `maxGames = clamp(3, availableTypes.length, Math.ceil(listings / 3))`

**Rationale**: Converges to ~25% games (matching real placemat ratios). Self-scales as game types are added — the ceiling is always the number of available types, so adding game #11 automatically allows 11 games at scale. Floor of 3 ensures the placemat feels alive even with few listings.

**Alternative considered**: Fixed cap at 8 (current) — doesn't scale and forces duplicates once types > cap.

### 3. Variable game sizing
**Decision**: Each game type declares an array of supported sizes. When generating a game, a size is chosen randomly from its supported sizes, weighted toward `small` (matching the listing card size distribution: `['small', 'small', 'small', 'large']`).

Game size declarations:
- **small only**: Tic-Tac-Toe, Word Scramble, Connect Four, Hangman, Trivia Quiz
- **small or large**: Word Search (8x8 / 12x12), Scribble Pad (small / large canvas), Maze (10x10 / 18x18), Crossword (4 words / 7 words), Memory Match (3x2 / 4x3 pairs)

**Rationale**: Creates visual variety like a real paper placemat where a big word search sits next to a small tic-tac-toe. Weighting toward small prevents games from dominating the layout.

### 4. Game classes follow existing pattern
**Decision**: Each new game is an ES6 class with `renderHTML()`, instance ID, global registry, and document-level event delegation — identical to the existing pattern.

**Rationale**: Consistency. All 5 existing games use this pattern. No reason to introduce a new architecture for 5 more.

### 5. Maze generation algorithm
**Decision**: Recursive backtracking (depth-first search). Generate a grid of cells with walls, carve passages by visiting unvisited neighbors randomly.

**Rationale**: Produces good-looking mazes with a guaranteed solution path. Well-documented algorithm, simple to implement, works at any grid size. The maze is display-only (no interactive solving) — the user traces the path visually or with the finger on a touchscreen.

### 6. Crossword generation approach
**Decision**: Greedy placement. Start with the longest word placed horizontally. For each subsequent word, find intersecting letters with already-placed words and place crossing words. Limit to 4 words (small) or 7 words (large).

**Rationale**: Full crossword generation (like NYT-quality) is a hard constraint-satisfaction problem. Greedy placement with a small word count produces visually appealing mini-crosswords suitable for a placemat. Clues are simple definitions drawn from a clue bank paired with the word bank.

### 7. Word bank and trivia bank as module-level constants
**Decision**: Both banks are `const` arrays defined at the top of `games.js`, same as the existing `ORTHODOX_WORDS`.

**Rationale**: No external data fetching needed. The banks are small (~75 words, ~45 questions) and static. Keeping them as constants keeps the system simple and offline-capable.

### 8. Connect Four sizing fix
**Decision**: Remove `span: 'wide'` from Connect Four's game config. The board (7 cols x 36px cells = ~294px) fits comfortably in a single column (~325px at desktop). Render it as a `small` card.

**Rationale**: The `column-span: all` was a defect. The board doesn't need full width and the wide span breaks the masonry flow.

## Risks / Trade-offs

- **Crossword generation may fail to place all words** → Accept fewer words if placement fails; always show at least 3 words. The greedy algorithm won't always find intersections for every word.
- **Maze rendering on mobile** → Small mazes (10x10) should be fine on mobile. Large mazes may need CSS scaling or should be excluded at narrow viewports.
- **Trivia question exhaustion** → With 45 questions showing 3-4 per card, roughly 12 unique rounds. Acceptable since the placemat randomizes on every page load, so repeat visitors see different mixes. Expand bank over time.
- **Word bank length variance** → Some words (TRANSFIGURATION, EPITRACHELION) are very long. Word Search handles this in large grids; Crossword and Hangman should filter by max length appropriate to their grid/display size.

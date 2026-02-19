## ADDED Requirements

### Requirement: No duplicate games per placemat
The system SHALL never display more than one instance of the same game type on a single placemat. Game selection SHALL use a shuffle-and-draw approach: all available game type identifiers are shuffled into a random order, and games are drawn sequentially from this shuffled list.

#### Scenario: All games are unique
- **WHEN** a placemat is rendered with N game slots
- **THEN** each game slot contains a different game type (no two slots have the same type)

#### Scenario: Game count does not exceed available types
- **WHEN** the maxGames value exceeds the number of available game types
- **THEN** maxGames is capped at the number of available game types

### Requirement: Scalable game count formula
The system SHALL calculate the maximum number of games using the formula: `maxGames = clamp(3, availableTypes.length, Math.ceil(listings / 3))` where `availableTypes.length` is the count of registered game types, and `listings` is the count of business listings being displayed.

#### Scenario: Minimum games with few listings
- **WHEN** the placemat has 0-8 business listings
- **THEN** maxGames is 3

#### Scenario: Proportional scaling
- **WHEN** the placemat has 12 business listings
- **THEN** maxGames is 4 (ceil(12/3) = 4)

#### Scenario: Cap at available types
- **WHEN** the placemat has 50 business listings and 10 game types are available
- **THEN** maxGames is 10 (capped at availableTypes.length)

### Requirement: Variable game sizing
Each game type SHALL declare an array of supported card sizes. When a game is generated, its card size SHALL be chosen randomly from its supported sizes, weighted toward smaller sizes (distribution: 3x small, 1x large for games supporting both).

Game size declarations:
- small only: Tic-Tac-Toe, Word Scramble, Connect Four, Hangman, Trivia Quiz
- small or large: Word Search, Scribble Pad, Maze, Crossword, Memory Match

#### Scenario: Game with single size
- **WHEN** a Tic-Tac-Toe game is generated
- **THEN** it always uses the "small" card size

#### Scenario: Game with variable size picks randomly
- **WHEN** a Word Search game is generated
- **THEN** it uses either "small" (8x8 grid, 75% chance) or "large" (12x12 grid, 25% chance) card size

#### Scenario: Size affects game content
- **WHEN** a Maze game is generated with size "large"
- **THEN** the maze grid is 18x18 (not the small 10x10)

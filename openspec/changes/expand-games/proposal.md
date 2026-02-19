## Why

The game system currently has 5 game types with no deduplication, meaning the same game can appear multiple times on a single placemat. The game count caps at 8 but with only 5 types, duplicates are guaranteed at scale. Connect Four has a layout defect (`column-span: all`) that breaks the masonry grid unnecessarily. The word bank is too small (20 words) to support multiple word-based games, and there's no variety in game card sizing.

## What Changes

- Add 5 new game types: Maze, Crossword, Hangman, Memory Match, Trivia Quiz
- Implement no-duplicate game selection (deck-of-cards shuffle instead of random picks)
- Fix Connect Four defect: remove `span: 'wide'`, render as normal single-column card
- Introduce variable game sizing: each game type declares supported sizes (small, large), chosen randomly per instance
- Expand Orthodox word bank from 20 to ~75 words across liturgical, theological, and cultural categories
- Add trivia question bank (~45 questions) for the Trivia Quiz game
- Revise game scaling formula: `clamp(3, availableTypes, ceil(listings / 3))` so it self-scales as game types are added

## Capabilities

### New Capabilities
- `new-games`: Five new game types (Maze, Crossword, Hangman, Memory Match, Trivia Quiz) with rendering, interactivity, and event delegation
- `game-selection`: No-duplicate game selection, variable sizing, and scalable game count formula
- `word-bank`: Expanded Orthodox word bank (~75 words) and trivia question bank (~45 questions)

### Modified Capabilities

## Impact

- `static/js/games.js`: New game classes, expanded word bank, trivia bank, updated GameManager
- `static/js/app.js`: Updated `renderPlacemat()` scaling formula, updated `createGameCard()` to remove Connect Four special-casing
- `static/css/styles.css`: New styles for maze, crossword, hangman, memory match, trivia; removal of `.card-wide` usage by Connect Four

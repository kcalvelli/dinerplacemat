## 1. Word Bank & Data

- [x] 1.1 Expand `ORTHODOX_WORDS` array from 20 to ~75 distinctly Orthodox words across all categories (Worship, Music, Feasts, Objects, Vestments, Sacraments, Theology, Saints)
- [x] 1.2 Add `ORTHODOX_CLUES` object mapping words to crossword clue strings
- [x] 1.3 Add `TRIVIA_QUESTIONS` array with 45 multiple-choice questions (question, correct answer, 3 distractors)

## 2. New Game Classes

- [x] 2.1 Implement `Maze` class with recursive backtracking generation, `renderHTML()`, start/end markers, small (10x10) and large (18x18) support
- [x] 2.2 Implement `Crossword` class with greedy word placement, numbered grid, clue display, interactive letter input, small (4 words) and large (7 words) support
- [x] 2.3 Implement `Hangman` class with visual figure (6 stages), letter buttons, word display with blanks, win/lose states, "New Word" button
- [x] 2.4 Implement `MemoryMatch` class with emoji pairs, card flip logic, match detection, 1-second non-match delay, small (3x2) and large (4x3) support
- [x] 2.5 Implement `TriviaQuiz` class with 3 random questions per instance, shuffled answers, correct/wrong highlighting, score summary

## 3. Event Delegation

- [x] 3.1 Add document-level event delegation for Crossword (cell click, letter input, direction toggle)
- [x] 3.2 Add document-level event delegation for Hangman (letter button clicks, new word button)
- [x] 3.3 Add document-level event delegation for Memory Match (card flip clicks)
- [x] 3.4 Add document-level event delegation for Trivia Quiz (answer button clicks)

## 4. Game Selection & Sizing

- [x] 4.1 Update `GameManager.generateRandomGame()` to include all 10 game types with size declarations (small-only vs small/large)
- [x] 4.2 Implement deck-of-cards shuffle selection: shuffle game type array, draw sequentially, no duplicates
- [x] 4.3 Implement variable sizing: pick random size from game's supported sizes (weighted 3:1 small:large)
- [x] 4.4 Update size-dependent game parameters (Word Search 8x8/12x12, Maze 10x10/18x18, etc.)

## 5. Layout Fixes

- [x] 5.1 Remove `span: 'wide'` from Connect Four config in `GameManager.generateRandomGame()`
- [x] 5.2 Update `renderPlacemat()` in `app.js` with new scaling formula: `clamp(3, availableTypes.length, Math.ceil(listings / 3))`
- [x] 5.3 Remove Connect Four wide-card special casing from `createGameCard()` if any exists beyond the config

## 6. CSS Styles

- [x] 6.1 Add Maze styles (grid cells, walls, start/end markers)
- [x] 6.2 Add Crossword styles (numbered grid cells, clue lists, active cell highlighting)
- [x] 6.3 Add Hangman styles (figure SVG/drawing, letter buttons grid, word display)
- [x] 6.4 Add Memory Match styles (card grid, flip animation, face-down/face-up states, matched state)
- [x] 6.5 Add Trivia Quiz styles (question blocks, answer buttons, correct/wrong coloring, score display)

## 7. Cleanup & Verification

- [x] 7.1 Verify no game type appears more than once on any rendered placemat (manual testing with various listing counts)
- [x] 7.2 Verify game count scales correctly: 0 listings → 3 games, 12 → 4, 30 → 10
- [x] 7.3 Verify Connect Four renders in a single column without layout disruption
- [x] 7.4 Verify all games render correctly on mobile (640px and below)

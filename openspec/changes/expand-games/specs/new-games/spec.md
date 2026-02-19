## ADDED Requirements

### Requirement: Maze game
The system SHALL provide a Maze game that generates a random solvable maze using recursive backtracking. The maze SHALL have a marked start and end point. The maze is visual-only (no interactive path tracking). The maze SHALL support two sizes: small (10x10) and large (18x18).

#### Scenario: Maze renders at small size
- **WHEN** a Maze game is generated with size "small"
- **THEN** a 10x10 grid maze is rendered with visible walls, a start marker, and an end marker

#### Scenario: Maze renders at large size
- **WHEN** a Maze game is generated with size "large"
- **THEN** an 18x18 grid maze is rendered with visible walls, a start marker, and an end marker

#### Scenario: Maze is always solvable
- **WHEN** a maze is generated
- **THEN** there SHALL exist exactly one path from start to end

### Requirement: Crossword game
The system SHALL provide a Crossword game that generates a mini crossword puzzle from the Orthodox word bank. The crossword SHALL display numbered clues (across and down) and an interactive grid where users can type letters. The crossword SHALL support two sizes: small (4 words) and large (7 words).

#### Scenario: Crossword renders with clues
- **WHEN** a Crossword game is generated
- **THEN** a grid is displayed with numbered cells, and clue lists for Across and Down are shown below the grid

#### Scenario: Crossword accepts letter input
- **WHEN** a user clicks a crossword cell and types a letter
- **THEN** the letter is displayed in the cell and focus advances to the next cell in the current word direction

#### Scenario: Crossword at small size
- **WHEN** a Crossword game is generated with size "small"
- **THEN** the crossword contains 4 intersecting words

#### Scenario: Crossword at large size
- **WHEN** a Crossword game is generated with size "large"
- **THEN** the crossword contains up to 7 intersecting words (minimum 3 if placement fails for some words)

### Requirement: Hangman game
The system SHALL provide a Hangman game that picks a random word from the Orthodox word bank and allows the user to guess letters. The game SHALL display a visual hangman figure that progresses with wrong guesses, letter buttons for guessing, and the word with blanks for unguessed letters. The game SHALL allow 6 wrong guesses before the game is lost. Hangman SHALL only use small card size.

#### Scenario: Hangman displays initial state
- **WHEN** a Hangman game is rendered
- **THEN** the word is shown as blanks, all letter buttons are enabled, and the hangman figure is empty

#### Scenario: Correct letter guess
- **WHEN** a user clicks a letter button that exists in the target word
- **THEN** all occurrences of that letter are revealed in the word display, and the letter button is marked as used

#### Scenario: Wrong letter guess
- **WHEN** a user clicks a letter button that does not exist in the target word
- **THEN** the hangman figure advances by one stage, the letter button is marked as wrong, and the wrong guess count increases

#### Scenario: Game won
- **WHEN** all letters in the word have been guessed
- **THEN** a success message is displayed and letter buttons are disabled

#### Scenario: Game lost
- **WHEN** the user has made 6 wrong guesses
- **THEN** the full hangman figure is shown, the correct word is revealed, and letter buttons are disabled

#### Scenario: New word
- **WHEN** the user clicks the "New Word" button
- **THEN** a new random word is selected and the game resets to initial state

### Requirement: Memory Match game
The system SHALL provide a Memory Match game that displays a grid of face-down cards with Orthodox-themed emoji pairs. The user flips two cards at a time; matching pairs stay face-up, non-matches flip back after a brief delay. The game SHALL support two sizes: small (3x2 grid, 3 pairs) and large (4x3 grid, 6 pairs).

#### Scenario: Memory Match initial state
- **WHEN** a Memory Match game is rendered
- **THEN** all cards are displayed face-down with a uniform back design

#### Scenario: First card flip
- **WHEN** the user clicks a face-down card
- **THEN** the card flips to reveal its emoji symbol

#### Scenario: Matching pair found
- **WHEN** the user flips a second card that matches the first flipped card
- **THEN** both cards remain face-up and are marked as matched

#### Scenario: Non-matching pair
- **WHEN** the user flips a second card that does not match the first flipped card
- **THEN** both cards flip back face-down after a 1-second delay

#### Scenario: Game complete
- **WHEN** all pairs have been matched
- **THEN** a success message is displayed

#### Scenario: Small size grid
- **WHEN** a Memory Match game is generated with size "small"
- **THEN** a 3x2 grid with 3 pairs (6 cards total) is displayed

#### Scenario: Large size grid
- **WHEN** a Memory Match game is generated with size "large"
- **THEN** a 4x3 grid with 6 pairs (12 cards total) is displayed

### Requirement: Trivia Quiz game
The system SHALL provide a Trivia Quiz game that displays 3 multiple-choice Orthodox trivia questions drawn randomly from the trivia question bank. Each question SHALL have 4 answer options with answers shuffled randomly. Trivia SHALL only use small card size.

#### Scenario: Trivia renders questions
- **WHEN** a Trivia Quiz game is rendered
- **THEN** 3 questions are displayed, each with 4 shuffled answer buttons

#### Scenario: Correct answer selected
- **WHEN** the user clicks the correct answer for a question
- **THEN** the correct answer is highlighted in green and the other buttons are disabled for that question

#### Scenario: Wrong answer selected
- **WHEN** the user clicks a wrong answer for a question
- **THEN** the selected answer is highlighted in red, the correct answer is highlighted in green, and all buttons for that question are disabled

#### Scenario: All questions answered
- **WHEN** the user has answered all 3 questions
- **THEN** a score summary is displayed (e.g., "2 out of 3!")

### Requirement: Connect Four sizing fix
The system SHALL render Connect Four as a normal single-column card without `column-span: all`. Connect Four SHALL use small card size only.

#### Scenario: Connect Four renders in single column
- **WHEN** a Connect Four game is generated
- **THEN** the game config SHALL NOT include `span: 'wide'` and the card SHALL render within a single column of the masonry grid

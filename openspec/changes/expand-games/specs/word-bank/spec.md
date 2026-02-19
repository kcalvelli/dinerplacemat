## ADDED Requirements

### Requirement: Expanded Orthodox word bank
The system SHALL define an expanded word bank of approximately 75 distinctly Orthodox words as a module-level constant array in `games.js`. Words SHALL be organized across the following categories: Worship & Liturgical, Music & Prayer, Feasts & Seasons, Sacred Objects & Spaces, Vestments & Clergy, Sacraments & Rites, Theology & Spiritual Life, and Saints & Titles. All words MUST be distinctly Orthodox — no Roman Catholic terminology (e.g., no "Advent", no "Confirmation"). The expanded bank replaces the existing `ORTHODOX_WORDS` array.

#### Scenario: Word bank contains Orthodox-only vocabulary
- **WHEN** the word bank is loaded
- **THEN** every word in the bank is a term used in Orthodox Christian tradition, and no Roman Catholic-specific terms are present

#### Scenario: Word bank supports all word-based games
- **WHEN** Word Search, Word Scramble, Crossword, or Hangman generates a game
- **THEN** words are drawn from the shared Orthodox word bank

#### Scenario: Short words available for compact games
- **WHEN** Hangman or Crossword needs words of 3-6 characters
- **THEN** the word bank contains at least 10 words of 6 characters or fewer (e.g., ICON, NAVE, MONK, DOME, MYRRH, CHOIR, CHANT, BASIL, ALTAR, FAITH)

### Requirement: Trivia question bank
The system SHALL define a trivia question bank of 45 multiple-choice questions as a module-level constant array in `games.js`. Each question SHALL have a question string, correct answer, and three incorrect answers. Questions SHALL cover: Feasts & Calendar, Liturgy & Worship, Church & Sacred Spaces, Saints & People, Sacraments & Practice, and Fun & Cultural categories. Questions MUST NOT frame Orthodox practices through a Western/Roman Catholic lens (e.g., no "What replaces Confirmation?"). Questions MUST NOT cover topics that vary controversially by jurisdiction.

#### Scenario: Trivia questions are self-contained
- **WHEN** a trivia question is displayed
- **THEN** the question, correct answer, and three distractors are all provided from the bank (no external data needed)

#### Scenario: Answers are shuffled at render time
- **WHEN** a trivia question is rendered
- **THEN** the 4 answer options (1 correct + 3 incorrect) are displayed in a random order, not with the correct answer always in the same position

#### Scenario: Questions respect the Orthodox audience
- **WHEN** any trivia question is reviewed
- **THEN** it does not compare Orthodox practice to Western Christian practice, does not frame Orthodoxy as derivative, and does not cover jurisdictionally controversial topics

### Requirement: Crossword clue bank
The system SHALL define clues paired with words from the Orthodox word bank for use in Crossword generation. Each clue SHALL be a brief definition or description suitable for a crossword puzzle (e.g., PASCHA → "The Orthodox celebration of the Resurrection", ICON → "Sacred image used in worship").

#### Scenario: Clues match word bank entries
- **WHEN** a Crossword game selects words from the word bank
- **THEN** each selected word has a corresponding clue available for display

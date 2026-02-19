/**
 * DinerPlacemat Games
 * Client-side generation of diner-style puzzles
 */

// Orthodox-themed words for games (word search, crossword, scramble, hangman)
const ORTHODOX_WORDS = [
    // Worship & Liturgical
    'LITURGY', 'EUCHARIST', 'VESPERS', 'ORTHROS', 'PROSPHORA',
    'PROSKOMIDE', 'TYPIKA', 'AKATHIST', 'COMMUNION', 'CONFESSION',
    'ANTIDORON', 'ARTOKLASIA',
    // Music & Prayer
    'TROPARION', 'KONTAKION', 'CANON', 'CHOIR', 'PRAYER',
    'CHANT', 'EKTENIA', 'DOXOLOGY',
    // Feasts & Seasons
    'PASCHA', 'NATIVITY', 'THEOPHANY', 'DORMITION', 'PENTECOST',
    'ASCENSION', 'TRANSFIGURATION', 'ANNUNCIATION', 'LAZARUS',
    'TRIODION', 'PENTECOSTARION',
    // Sacred Objects & Spaces
    'ICON', 'CENSER', 'ICONOSTASIS', 'CHALICE', 'ALTAR',
    'NAVE', 'NARTHEX', 'DOME', 'CANDLE', 'INCENSE',
    'ANTIMENSION', 'EPITAPHIOS',
    // Vestments & Clergy
    'PATRIARCH', 'BISHOP', 'PRIEST', 'DEACON', 'MONK',
    'ABBESS', 'PHELONION', 'ORARION', 'STICHARION',
    'EPITRACHELION',
    // Sacraments & Rites
    'BAPTISM', 'CHRISMATION', 'UNCTION', 'WEDDING', 'FUNERAL',
    'ORDINATION', 'CATECHUMEN',
    // Theology & Spiritual Life
    'THEOSIS', 'HESYCHASM', 'TRINITY', 'FASTING', 'PHILOKALIA',
    'SYNAXIS', 'MYRRH', 'THEOTOKOS',
    // Saints & Titles
    'CHRYSOSTOM', 'BASIL', 'ATHANASIUS', 'GREGORY', 'PHOTIOS',
    'SERAPHIM', 'SILOUAN'
];

// Crossword clues for Orthodox words
const ORTHODOX_CLUES = {
    LITURGY: 'The primary worship service of the Church',
    EUCHARIST: 'The sacrament of the Body and Blood of Christ',
    VESPERS: 'Evening worship service',
    ORTHROS: 'Morning worship service',
    PROSPHORA: 'Bread offered for the Liturgy',
    PROSKOMIDE: 'Preparation of the bread and wine before Liturgy',
    TYPIKA: 'Reader service used when no priest is available',
    AKATHIST: 'Hymn of praise sung while standing',
    COMMUNION: 'Receiving the Body and Blood of Christ',
    CONFESSION: 'Sacrament of repentance',
    ANTIDORON: 'Blessed bread distributed after Liturgy',
    ARTOKLASIA: 'Blessing of five loaves of bread',
    TROPARION: 'Short hymn for a feast or saint',
    KONTAKION: 'Hymn summarizing a feast or saint\'s life',
    CANON: 'Set of nine odes sung at Orthros',
    CHOIR: 'Singers who chant the hymns',
    PRAYER: 'Communication with God',
    CHANT: 'Sacred singing of the Church',
    EKTENIA: 'Litany of petitions',
    DOXOLOGY: 'Hymn of glory to God',
    PASCHA: 'The Feast of the Resurrection',
    NATIVITY: 'The birth of Christ',
    THEOPHANY: 'The baptism of Christ in the Jordan',
    DORMITION: 'The falling asleep of the Theotokos',
    PENTECOST: 'Descent of the Holy Spirit',
    ASCENSION: 'Christ\'s return to the Father',
    TRANSFIGURATION: 'Christ\'s revelation of divine glory on Mount Tabor',
    ANNUNCIATION: 'The angel\'s announcement to the Virgin Mary',
    LAZARUS: 'Friend of Christ raised from the dead',
    TRIODION: 'Liturgical book for Great Lent',
    PENTECOSTARION: 'Liturgical book for the Paschal season',
    ICON: 'Sacred image used in worship',
    CENSER: 'Vessel used to burn incense',
    ICONOSTASIS: 'Icon screen separating the nave from the altar',
    CHALICE: 'Cup used for Holy Communion',
    ALTAR: 'The holy table in the sanctuary',
    NAVE: 'Main area of the church where the faithful stand',
    NARTHEX: 'Entrance area of the church',
    DOME: 'Rounded roof representing heaven',
    CANDLE: 'Light offered in prayer',
    INCENSE: 'Fragrant smoke rising as prayer',
    ANTIMENSION: 'Cloth on the altar containing a relic',
    EPITAPHIOS: 'Embroidered cloth depicting Christ\'s burial',
    PATRIARCH: 'Head bishop of an autocephalous church',
    BISHOP: 'Overseer of a diocese',
    PRIEST: 'Ordained minister who serves a parish',
    DEACON: 'Ordained servant who assists in worship',
    MONK: 'Man living a monastic life of prayer',
    ABBESS: 'Head of a women\'s monastery',
    PHELONION: 'Outer vestment worn by a priest',
    ORARION: 'Deacon\'s liturgical stole',
    STICHARION: 'Long tunic vestment',
    EPITRACHELION: 'Priest\'s stole worn around the neck',
    BAPTISM: 'Sacrament of entry into the Church',
    CHRISMATION: 'Anointing with holy chrism',
    UNCTION: 'Sacrament of healing with holy oil',
    WEDDING: 'Sacrament of crowning in marriage',
    FUNERAL: 'Service commending the departed to God',
    ORDINATION: 'Setting apart for clergy service',
    CATECHUMEN: 'One preparing for Baptism',
    THEOSIS: 'Union with God; becoming like God by grace',
    HESYCHASM: 'Tradition of inner stillness and prayer',
    TRINITY: 'Father, Son, and Holy Spirit',
    FASTING: 'Abstaining from food as spiritual discipline',
    PHILOKALIA: 'Collection of writings on prayer and the spiritual life',
    SYNAXIS: 'Gathering for worship',
    MYRRH: 'Fragrant oil; gift of the Magi',
    THEOTOKOS: 'God-bearer; title of the Virgin Mary',
    CHRYSOSTOM: 'Golden-mouthed; title of St. John',
    BASIL: 'Great hierarch and liturgist of Caesarea',
    ATHANASIUS: 'Defender of the faith at Nicaea',
    GREGORY: 'The Theologian; archbishop of Constantinople',
    PHOTIOS: 'Patriarch and scholar of Constantinople',
    SERAPHIM: 'Of Sarov; beloved Russian saint',
    SILOUAN: 'Of Athos; monastic elder and saint'
};

// Trivia questions: [question, correct, wrong1, wrong2, wrong3]
const TRIVIA_QUESTIONS = [
    // Feasts & Calendar
    ['What is the Orthodox name for Easter?', 'Pascha', 'Paschal', 'Ressurectio', 'Anastasi'],
    ['The Dormition celebrates the falling asleep of who?', 'The Theotokos', 'St. Paul', 'St. Nicholas', 'St. Mary Magdalene'],
    ['Theophany commemorates Christ\'s baptism in which river?', 'Jordan', 'Nile', 'Euphrates', 'Galilee'],
    ['How many days does the Nativity Fast last?', '40', '30', '50', '14'],
    ['What day of the week is Pascha always celebrated?', 'Sunday', 'Saturday', 'Friday', 'It varies'],
    ['What feast is celebrated 40 days after Pascha?', 'Ascension', 'Pentecost', 'Transfiguration', 'Dormition'],
    ['Lazarus Saturday falls the day before what?', 'Palm Sunday', 'Pascha', 'Great and Holy Friday', 'Pentecost'],
    ['The Transfiguration took place on which mountain?', 'Mount Tabor', 'Mount Sinai', 'Mount Olympus', 'Mount Zion'],
    ['How many days after Pascha is Pentecost?', '50', '40', '30', '12'],
    ['What color are vestments typically during Pascha?', 'White and red', 'Purple', 'Blue', 'Black'],
    // Liturgy & Worship
    ['What is the bread used in the Liturgy called?', 'Prosphora', 'Artos', 'Antidoron', 'Koliva'],
    ['"Holy God, Holy Mighty, Holy Immortal" is called what?', 'The Trisagion', 'The Doxology', 'The Creed', 'The Troparia'],
    ['What is the blessed bread given after Liturgy called?', 'Antidoron', 'Prosphora', 'Artoklasia', 'Koliva'],
    ['Orthros is the Orthodox name for what service?', 'Matins', 'Vespers', 'Compline', 'Hours'],
    ['What is the service of lamentations on Great and Holy Friday evening?', 'The Epitaphios', 'The Bridegroom Service', 'Presanctified Liturgy', 'The Akathist'],
    ['What does "Kyrie Eleison" mean?', 'Lord, have mercy', 'Lord, hear us', 'Glory to God', 'God is great'],
    ['What does "Axios!" mean, proclaimed at an ordination?', 'He is worthy', 'Amen', 'So be it', 'It is done'],
    ['The Great Entrance carries what to the altar?', 'The bread and wine', 'The Gospel book', 'The cross', 'Icons'],
    // Church & Sacred Spaces
    ['What is the icon wall separating the nave from the altar called?', 'Iconostasis', 'Narthex', 'Templon', 'Ambon'],
    ['What is the entrance area of an Orthodox church called?', 'Narthex', 'Nave', 'Apse', 'Vestibule'],
    ['What is typically at the very top of an Orthodox church?', 'A cross', 'A bell', 'A dome', 'A weather vane'],
    ['The altar table in an Orthodox church faces which direction?', 'East', 'West', 'North', 'South'],
    ['According to tradition, who painted the first icon of the Theotokos?', 'St. Luke the Evangelist', 'St. John', 'St. Mark', 'St. Paul'],
    // Saints & People
    ['St. John Chrysostom\'s name means what?', 'Golden-mouthed', 'Golden-hearted', 'Golden-haired', 'Golden-handed'],
    ['Which saint is known as the patron of children and the basis for Santa Claus?', 'St. Nicholas', 'St. Basil', 'St. George', 'St. Andrew'],
    ['Who wrote the most commonly used Divine Liturgy?', 'St. John Chrysostom', 'St. Basil the Great', 'St. Gregory', 'St. Athanasius'],
    ['Theotokos is a title meaning what?', 'God-bearer', 'Most Holy', 'Mother of All', 'Queen of Heaven'],
    ['How many Ecumenical Councils does the Orthodox Church recognize?', '7', '12', '3', '21'],
    ['Which apostle is called the "Apostle to the Gentiles"?', 'St. Paul', 'St. Peter', 'St. Andrew', 'St. Thomas'],
    ['St. Basil the Great is associated with which day\'s celebration in Greek tradition?', 'January 1st', 'December 25th', 'March 25th', 'August 15th'],
    // Sacraments & Practice
    ['What is the Orthodox sacrament of anointing with oil called?', 'Holy Unction', 'Chrismation', 'Oil blessing', 'Anointing'],
    ['What do Orthodox Christians abstain from during a strict fast?', 'Meat, dairy, fish, oil, and wine', 'Only meat', 'Only meat and dairy', 'All food'],
    ['What greeting do Orthodox Christians exchange at Pascha?', '"Christ is Risen!"', '"Happy Easter!"', '"Peace be with you!"', '"He is coming!"'],
    ['What is the traditional response to "Christ is Risen"?', '"Truly He is Risen!"', '"Amen!"', '"Thanks be to God!"', '"And also with you!"'],
    ['What is the knotted rope used for prayer called?', 'Prayer rope', 'Prayer chain', 'Prayer cord', 'Prayer band'],
    ['On what date does the Orthodox liturgical year begin?', 'September 1', 'January 1', 'March 25', 'Sunday after Pascha'],
    // Fun & Cultural
    ['What food is traditionally associated with Pascha?', 'Red eggs', 'Chocolate bunnies', 'Hot cross buns', 'Lamb cake'],
    ['Why are Pascha eggs dyed red?', 'To represent the blood of Christ', 'For good luck', 'To celebrate spring', 'It is just tradition'],
    ['Koliva is a dish made from what, offered at memorial services?', 'Wheat berries', 'Rice', 'Barley', 'Lentils'],
    ['What is the traditional Paschal greeting in Greek?', 'Christos Anesti', 'Kala Christougenna', 'Chronia Polla', 'Kyrie Eleison'],
    ['What do Orthodox Christians bring to church to be blessed at Theophany?', 'Water', 'Bread', 'Candles', 'Icons'],
    ['What sweet bread is baked for New Year\'s in Greek tradition, with a coin inside?', 'Vasilopita', 'Tsoureki', 'Prosphora', 'Christopsomo'],
    ['Tsoureki is a sweet bread traditionally baked for which occasion?', 'Pascha', 'Nativity', 'Theophany', 'Name days'],
    ['What monastic peninsula in Greece is home to 20 Orthodox monasteries?', 'Mount Athos', 'Meteora', 'Patmos', 'Mount Sinai'],
    ['What is the name of the cloth on the altar table that contains a relic?', 'Antimension', 'Epitaphios', 'Epitrachelion', 'Orarion']
];

/**
 * Word Search Generator
 */
class WordSearchGenerator {
    constructor(size, numWords) {
        this.size = size;
        this.numWords = Math.min(numWords, ORTHODOX_WORDS.length);
        this.grid = [];
        this.words = [];
        this.placedWords = [];
        this.instanceId = Math.random().toString(36).substr(2, 9);
        this.selectedCells = new Set();
        this.foundWords = new Set();
    }

    generate() {
        // Initialize empty grid
        this.grid = Array(this.size).fill(null).map(() =>
            Array(this.size).fill(null)
        );

        // Select random words that actually fit in the grid
        const candidates = [...ORTHODOX_WORDS]
            .filter(w => w.length <= this.size)
            .sort(() => Math.random() - 0.5);

        // Try to place words until we hit our target count
        for (const word of candidates) {
            if (this.placedWords.length >= this.numWords) break;
            this.placeWord(word);
        }

        // Fill remaining empty cells with random letters
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.grid[y][x] === null) {
                    this.grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }

        // Verify each placed word is actually in the final grid
        this.words = this.placedWords
            .filter(p => this.verifyWordInGrid(p))
            .map(p => p.word);

        return { grid: this.grid, words: this.words, placed: this.placedWords };
    }

    placeWord(word) {
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal down
            [-1, 1],  // diagonal up
        ];

        // Shuffle directions and try each
        const shuffledDirs = directions.sort(() => Math.random() - 0.5);
        
        for (const [dx, dy] of shuffledDirs) {
            // Try random starting positions
            for (let attempts = 0; attempts < 100; attempts++) {
                const startX = Math.floor(Math.random() * this.size);
                const startY = Math.floor(Math.random() * this.size);
                
                if (this.canPlaceWord(word, startX, startY, dx, dy)) {
                    this.doPlaceWord(word, startX, startY, dx, dy);
                    this.placedWords.push({
                        word,
                        x: startX,
                        y: startY,
                        dx,
                        dy
                    });
                    return;
                }
            }
        }
    }

    canPlaceWord(word, x, y, dx, dy) {
        for (let i = 0; i < word.length; i++) {
            const nx = x + i * dx;
            const ny = y + i * dy;
            
            if (nx < 0 || nx >= this.size || ny < 0 || ny >= this.size) {
                return false;
            }
            
            // Cell must be null (empty) or already contain the same letter
            if (this.grid[ny][nx] !== null && this.grid[ny][nx] !== word[i]) {
                return false;
            }
        }
        return true;
    }

    doPlaceWord(word, x, y, dx, dy) {
        for (let i = 0; i < word.length; i++) {
            this.grid[y + i * dy][x + i * dx] = word[i];
        }
    }

    verifyWordInGrid(placed) {
        for (let i = 0; i < placed.word.length; i++) {
            const x = placed.x + i * placed.dx;
            const y = placed.y + i * placed.dy;
            if (y < 0 || y >= this.size || x < 0 || x >= this.size) return false;
            if (this.grid[y][x] !== placed.word[i]) return false;
        }
        return true;
    }

    renderHTML() {
        const result = this.generate();
        const cellSize = window.innerWidth < 640 ? 28 : 32;
        
        let html = `<div class="word-search-container" data-wordsearch-id="${this.instanceId}">`;
        html += `<table class="word-search-grid" data-wordsearch-id="${this.instanceId}">`;
        
        for (let y = 0; y < this.size; y++) {
            html += '<tr>';
            for (let x = 0; x < this.size; x++) {
                html += `<td class="word-search-cell" 
                    data-x="${x}" 
                    data-y="${y}" 
                    data-letter="${result.grid[y][x]}"
                    data-wordsearch-id="${this.instanceId}"
                    style="width:${cellSize}px;height:${cellSize}px;font-size:${cellSize*0.6}px">${result.grid[y][x]}</td>`;
            }
            html += '</tr>';
        }
        
        html += '</table>';
        html += '<div class="word-list">';
        html += '<h4>Find these words (click letters to highlight):</h4>';
        html += '<ul class="word-search-words">';
        for (const word of result.words) {
            html += `<li data-word="${word}">${word}</li>`;
        }
        html += '</ul>';
        html += '</div>';
        html += `<button class="word-search-clear-btn" data-wordsearch-id="${this.instanceId}">Clear Selection</button>`;
        html += '</div>';
        
        // Store the word search instance for later reference
        if (!window.wordSearches) window.wordSearches = {};
        window.wordSearches[this.instanceId] = this;
        
        return html;
    }
    
    toggleCell(x, y) {
        const key = `${x},${y}`;
        if (this.selectedCells.has(key)) {
            this.selectedCells.delete(key);
        } else {
            this.selectedCells.add(key);
        }
        this.updateCellVisuals();
        this.checkForWords();
    }
    
    updateCellVisuals() {
        const cells = document.querySelectorAll(`td[data-wordsearch-id="${this.instanceId}"]`);
        cells.forEach(cell => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            const key = `${x},${y}`;
            if (this.selectedCells.has(key)) {
                cell.classList.add('selected');
            } else {
                cell.classList.remove('selected');
            }
        });
    }
    
    checkForWords() {
        if (this.selectedCells.size === 0) return;
        
        // Get all selected positions
        const positions = Array.from(this.selectedCells).map(key => {
            const [x, y] = key.split(',').map(Number);
            return { x, y, letter: this.grid[y][x] };
        });
        
        // Check if selection forms a straight line (horizontal, vertical, or diagonal)
        if (positions.length < 3) return;
        
        // Sort by position to form a line
        positions.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
        
        // Check if positions are contiguous
        let dx = positions[1].x - positions[0].x;
        let dy = positions[1].y - positions[0].y;
        
        // Normalize direction
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const g = gcd(Math.abs(dx), Math.abs(dy));
        if (g > 1) {
            dx /= g;
            dy /= g;
        }
        
        // Check if all positions follow the same direction
        let isStraight = true;
        for (let i = 1; i < positions.length; i++) {
            const expectedX = positions[i - 1].x + dx;
            const expectedY = positions[i - 1].y + dy;
            if (positions[i].x !== expectedX || positions[i].y !== expectedY) {
                isStraight = false;
                break;
            }
        }
        
        if (!isStraight) return;
        
        // Form the word from selection
        const selectedWord = positions.map(p => p.letter).join('');
        const reversedWord = selectedWord.split('').reverse().join('');
        
        // Check if word matches any target word
        for (const word of this.words) {
            if ((selectedWord === word || reversedWord === word) && !this.foundWords.has(word)) {
                this.foundWords.add(word);
                this.markWordAsFound(word);
                this.clearSelection();
                break;
            }
        }
    }
    
    markWordAsFound(word) {
        const wordListItem = document.querySelector(`li[data-word="${word}"]`);
        if (wordListItem) {
            wordListItem.classList.add('found');
            wordListItem.style.textDecoration = 'line-through';
            wordListItem.style.opacity = '0.5';
        }
    }
    
    clearSelection() {
        this.selectedCells.clear();
        this.updateCellVisuals();
    }
}

/**
 * Tic-Tac-Toe Component
 */
class TicTacToe {
    constructor() {
        this.instanceId = 'ttt-' + Math.random().toString(36).substr(2, 9);
        this.board = Array(3).fill(null).map(() => Array(3).fill(''));
        this.currentPlayer = 'X';
        this.winner = null;
        this.gameOver = false;

        if (!window.ticTacToeGames) window.ticTacToeGames = {};
        window.ticTacToeGames[this.instanceId] = this;
    }

    renderHTML() {
        let html = `<div class="tic-tac-toe-container" data-ttt-id="${this.instanceId}">`;
        html += `<div class="ttt-status" data-ttt-id="${this.instanceId}">X's turn</div>`;
        html += '<div class="tic-tac-toe-board">';

        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                html += `<div class="tic-tac-toe-cell" data-x="${x}" data-y="${y}" data-ttt-id="${this.instanceId}">${this.board[y][x]}</div>`;
            }
        }

        html += '</div>';
        html += `<button class="reset-game-btn" data-ttt-id="${this.instanceId}">Reset Board</button>`;
        html += '</div>';

        return html;
    }

    makeMove(x, y) {
        if (this.gameOver || this.board[y][x] !== '') return false;
        this.board[y][x] = this.currentPlayer;
        if (this.checkWin(this.currentPlayer)) {
            this.winner = this.currentPlayer;
            this.gameOver = true;
        } else if (this.checkDraw()) {
            this.gameOver = true;
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }
        return true;
    }

    checkWin(player) {
        const b = this.board;
        for (let i = 0; i < 3; i++) {
            if (b[i][0] === player && b[i][1] === player && b[i][2] === player) return true;
            if (b[0][i] === player && b[1][i] === player && b[2][i] === player) return true;
        }
        if (b[0][0] === player && b[1][1] === player && b[2][2] === player) return true;
        if (b[0][2] === player && b[1][1] === player && b[2][0] === player) return true;
        return false;
    }

    checkDraw() {
        return this.board.every(row => row.every(cell => cell !== ''));
    }

    getStatus() {
        if (this.winner) return `${this.winner} wins!`;
        if (this.gameOver) return "It's a draw!";
        return `${this.currentPlayer}'s turn`;
    }

    reset() {
        this.board = Array(3).fill(null).map(() => Array(3).fill(''));
        this.currentPlayer = 'X';
        this.winner = null;
        this.gameOver = false;
    }
}

/**
 * Word Scramble Game
 * Unscramble the letters to form an Orthodox word
 */
class WordScramble {
    constructor() {
        // Pick a random word
        const originalWord = ORTHODOX_WORDS[Math.floor(Math.random() * ORTHODOX_WORDS.length)];
        this.targetWord = originalWord;
        this.instanceId = Math.random().toString(36).substr(2, 9);
        
        // Scramble the letters
        this.scrambledLetters = originalWord
            .split('')
            .sort(() => Math.random() - 0.5);
        
        this.selectedLetters = [];
        this.solved = false;
        
        // Store instance globally
        if (!window.scrambles) window.scrambles = {};
        window.scrambles[this.instanceId] = this;
    }
    
    renderHTML() {
        let html = `<div class="scramble-container" data-scramble-id="${this.instanceId}">`;
        html += '<div class="scramble-hint">Unscramble the letters:</div>';
        
        // Scrambled letters as clickable tiles
        html += '<div class="scramble-letters">';
        this.scrambledLetters.forEach((letter, index) => {
            html += `<button class="scramble-letter" 
                data-index="${index}" 
                data-letter="${letter}"
                data-scramble-id="${this.instanceId}"
                ${this.selectedLetters.includes(index) ? 'disabled class="scramble-letter used"' : ''}>
                ${letter}
            </button>`;
        });
        html += '</div>';
        
        // Answer display
        html += '<div class="scramble-answer">';
        html += '<span class="answer-text">';
        for (let i = 0; i < this.targetWord.length; i++) {
            if (i < this.selectedLetters.length) {
                const letterIndex = this.selectedLetters[i];
                html += this.scrambledLetters[letterIndex];
            } else {
                html += '_';
            }
        }
        html += '</span>';
        html += '</div>';
        
        // Success message (hidden initially)
        if (this.solved) {
            html += '<div class="scramble-success">🎉 Correct! Well done!</div>';
        }
        
        // Controls
        html += `<div class="scramble-controls">`;
        html += `<button class="scramble-clear-btn" data-scramble-id="${this.instanceId}">Clear</button>`;
        html += `<button class="scramble-new-btn" data-scramble-id="${this.instanceId}">New Word</button>`;
        html += `</div>`;
        
        html += '</div>';
        
        return html;
    }
    
    selectLetter(index) {
        if (this.solved || this.selectedLetters.includes(index)) return;
        
        this.selectedLetters.push(index);
        
        // Check if word is complete
        if (this.selectedLetters.length === this.targetWord.length) {
            const formedWord = this.selectedLetters
                .map(i => this.scrambledLetters[i])
                .join('');
            
            if (formedWord === this.targetWord) {
                this.solved = true;
            }
        }
    }
    
    clear() {
        this.selectedLetters = [];
        this.solved = false;
    }
    
    newWord() {
        // Replace this instance with a new one
        const newScramble = new WordScramble();
        window.scrambles[this.instanceId] = newScramble;
        
        // Find and update the container
        const container = document.querySelector(`[data-scramble-id="${this.instanceId}"]`);
        if (container) {
            const gameContainer = container.closest('.game-container');
            if (gameContainer) {
                gameContainer.innerHTML = newScramble.renderHTML();
            }
        }
    }
}

/**
 * Scribble Pad - Free drawing canvas
 */
class ScribblePad {
    constructor() {
        this.instanceId = 'scribble-' + Math.random().toString(36).substr(2, 9);
        this.isDrawing = false;
        this.canvas = null;
        this.ctx = null;
    }

    renderHTML(width, height) {
        width = width || 280;
        height = height || 200;
        
        return `
            <div class="scribble-container" data-scribble-id="${this.instanceId}">
                <canvas 
                    id="${this.instanceId}" 
                    class="scribble-canvas" 
                    width="${width}" 
                    height="${height}"
                    data-scribble-id="${this.instanceId}"
                ></canvas>
                <div class="scribble-controls">
                    <button class="scribble-clear-btn" data-scribble-id="${this.instanceId}">🗑️ Clear</button>
                    <button class="scribble-download-btn" data-scribble-id="${this.instanceId}">💾 Save</button>
                </div>
            </div>
        `;
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#DC143C';

        // Mouse events
        canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        canvas.addEventListener('mousemove', (e) => this.draw(e));
        canvas.addEventListener('mouseup', () => this.stopDrawing());
        canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Touch events
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        }, { passive: false });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        }, { passive: false });
        canvas.addEventListener('touchend', () => this.stopDrawing());
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    draw(e) {
        if (!this.isDrawing) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clear() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    download() {
        if (!this.canvas) return;
        const link = document.createElement('a');
        link.download = 'my-drawing.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

/**
 * Connect Four - Classic diner table game
 */
class ConnectFour {
    constructor() {
        this.instanceId = 'connect4-' + Math.random().toString(36).substr(2, 9);
        this.rows = 6;
        this.cols = 7;
        this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
        this.currentPlayer = 'red'; // 'red' or 'yellow'
        this.winner = null;
        
        // Store instance globally
        if (!window.connectFourGames) window.connectFourGames = {};
        window.connectFourGames[this.instanceId] = this;
    }

    renderHTML() {
        let html = `<div class="connect-four-container" data-connect4-id="${this.instanceId}">`;
        html += `<div class="connect-four-status">`;
        if (this.winner) {
            html += `<span class="winner">🎉 ${this.winner === 'red' ? 'Red' : 'Yellow'} Wins!</span>`;
        } else {
            html += `Current: <span class="current-player ${this.currentPlayer}">${this.currentPlayer === 'red' ? '🔴 Red' : '🟡 Yellow'}</span>`;
        }
        html += `</div>`;
        
        html += `<div class="connect-four-board">`;
        for (let row = 0; row < this.rows; row++) {
            html += `<div class="connect-four-row">`;
            for (let col = 0; col < this.cols; col++) {
                const cell = this.board[row][col];
                const cellClass = cell ? `cell ${cell}` : 'cell empty';
                html += `<div class="${cellClass}" 
                    data-row="${row}" 
                    data-col="${col}"
                    data-connect4-id="${this.instanceId}">
                </div>`;
            }
            html += `</div>`;
        }
        html += `</div>`;
        
        html += `<div class="connect-four-controls">`;
        html += `<button class="connect-four-reset-btn" data-connect4-id="${this.instanceId}">🔄 New Game</button>`;
        html += `</div>`;
        html += `</div>`;
        
        return html;
    }

    dropPiece(col) {
        if (this.winner) return false;
        
        // Find the lowest empty row in this column
        for (let row = this.rows - 1; row >= 0; row--) {
            if (!this.board[row][col]) {
                this.board[row][col] = this.currentPlayer;
                
                // Check for win
                if (this.checkWin(row, col)) {
                    this.winner = this.currentPlayer;
                } else {
                    // Switch player
                    this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
                }
                
                return true;
            }
        }
        
        return false; // Column is full
    }

    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal down-right
            [1, -1]   // diagonal down-left
        ];
        
        for (const [dr, dc] of directions) {
            let count = 1;
            
            // Check forward direction
            for (let i = 1; i < 4; i++) {
                const newRow = row + dr * i;
                const newCol = col + dc * i;
                if (this.isValid(newRow, newCol) && this.board[newRow][newCol] === player) {
                    count++;
                } else {
                    break;
                }
            }
            
            // Check backward direction
            for (let i = 1; i < 4; i++) {
                const newRow = row - dr * i;
                const newCol = col - dc * i;
                if (this.isValid(newRow, newCol) && this.board[newRow][newCol] === player) {
                    count++;
                } else {
                    break;
                }
            }
            
            if (count >= 4) return true;
        }
        
        return false;
    }

    isValid(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    reset() {
        this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
        this.currentPlayer = 'red';
        this.winner = null;
    }
}

/**
 * Maze Generator - Recursive backtracking
 */
class Maze {
    constructor(size) {
        this.size = size;
        this.instanceId = 'maze-' + Math.random().toString(36).substr(2, 9);
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        // Each cell has walls: top, right, bottom, left
        this.cells = Array(size).fill(null).map(() =>
            Array(size).fill(null).map(() => ({ top: true, right: true, bottom: true, left: true, visited: false }))
        );
        this.generate();

        if (!window.mazeGames) window.mazeGames = {};
        window.mazeGames[this.instanceId] = this;
    }

    generate() {
        const stack = [];
        const start = this.cells[0][0];
        start.visited = true;
        stack.push([0, 0]);

        while (stack.length > 0) {
            const [row, col] = stack[stack.length - 1];
            const neighbors = this.getUnvisitedNeighbors(row, col);

            if (neighbors.length === 0) {
                stack.pop();
            } else {
                const [nRow, nCol] = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.removeWall(row, col, nRow, nCol);
                this.cells[nRow][nCol].visited = true;
                stack.push([nRow, nCol]);
            }
        }
    }

    getUnvisitedNeighbors(row, col) {
        const neighbors = [];
        if (row > 0 && !this.cells[row - 1][col].visited) neighbors.push([row - 1, col]);
        if (row < this.size - 1 && !this.cells[row + 1][col].visited) neighbors.push([row + 1, col]);
        if (col > 0 && !this.cells[row][col - 1].visited) neighbors.push([row, col - 1]);
        if (col < this.size - 1 && !this.cells[row][col + 1].visited) neighbors.push([row, col + 1]);
        return neighbors;
    }

    removeWall(r1, c1, r2, c2) {
        if (r2 === r1 - 1) { this.cells[r1][c1].top = false; this.cells[r2][c2].bottom = false; }
        if (r2 === r1 + 1) { this.cells[r1][c1].bottom = false; this.cells[r2][c2].top = false; }
        if (c2 === c1 - 1) { this.cells[r1][c1].left = false; this.cells[r2][c2].right = false; }
        if (c2 === c1 + 1) { this.cells[r1][c1].right = false; this.cells[r2][c2].left = false; }
    }

    renderHTML() {
        const cellSize = this.size <= 10 ? 24 : 16;
        const wallWidth = 2;
        const totalSize = (cellSize + wallWidth) * this.size + wallWidth;

        let html = `<div class="maze-container" data-maze-id="${this.instanceId}">`;
        html += `<div class="maze-wrapper" style="position:relative;display:inline-block;">`;

        html += `<table class="maze-grid" style="border-collapse:collapse;">`;
        for (let r = 0; r < this.size; r++) {
            html += '<tr>';
            for (let c = 0; c < this.size; c++) {
                const cell = this.cells[r][c];
                const style = [
                    `width:${cellSize}px`,
                    `height:${cellSize}px`,
                    `border-top:${cell.top ? wallWidth + 'px solid #333' : wallWidth + 'px solid transparent'}`,
                    `border-right:${cell.right ? wallWidth + 'px solid #333' : wallWidth + 'px solid transparent'}`,
                    `border-bottom:${cell.bottom ? wallWidth + 'px solid #333' : wallWidth + 'px solid transparent'}`,
                    `border-left:${cell.left ? wallWidth + 'px solid #333' : wallWidth + 'px solid transparent'}`
                ].join(';');

                let content = '';
                if (r === 0 && c === 0) content = '<span class="maze-start">S</span>';
                if (r === this.size - 1 && c === this.size - 1) content = '<span class="maze-end">E</span>';

                html += `<td class="maze-cell" style="${style}">${content}</td>`;
            }
            html += '</tr>';
        }
        html += '</table>';

        // Drawing canvas overlay
        html += `<canvas class="maze-canvas" data-maze-id="${this.instanceId}" width="${totalSize}" height="${totalSize}"></canvas>`;
        html += `</div>`;
        html += `<div class="maze-controls">`;
        html += `<button class="maze-clear-btn" data-maze-id="${this.instanceId}">Clear Path</button>`;
        html += `</div>`;
        html += '</div>';
        return html;
    }

    initCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#DC143C';
        this.isDrawing = false;

        canvas.addEventListener('mousedown', (e) => this.startDraw(e));
        canvas.addEventListener('mousemove', (e) => this.draw(e));
        canvas.addEventListener('mouseup', () => this.stopDraw());
        canvas.addEventListener('mouseout', () => this.stopDraw());

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDraw(e.touches[0]);
        }, { passive: false });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        }, { passive: false });
        canvas.addEventListener('touchend', () => this.stopDraw());
    }

    startDraw(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.beginPath();
        this.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    draw(e) {
        if (!this.isDrawing) return;
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        this.ctx.stroke();
    }

    stopDraw() {
        this.isDrawing = false;
    }

    clearCanvas() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

/**
 * Crossword Generator - Greedy word placement
 */
class Crossword {
    constructor(numWords) {
        this.numWords = numWords;
        this.instanceId = 'cw-' + Math.random().toString(36).substr(2, 9);
        this.grid = {};
        this.placedWords = [];
        this.gridBounds = { minR: 0, maxR: 0, minC: 0, maxC: 0 };

        if (!window.crosswordGames) window.crosswordGames = {};
        window.crosswordGames[this.instanceId] = this;

        this.generate();
    }

    generate() {
        // Filter words suitable for crossword (3-12 chars)
        const candidates = ORTHODOX_WORDS.filter(w => w.length >= 3 && w.length <= 12)
            .sort(() => Math.random() - 0.5);

        if (candidates.length === 0) return;

        // Place first word horizontally at origin
        const first = candidates.shift();
        this.placeWordAt(first, 0, 0, 'across');

        // Try to place remaining words
        for (const word of candidates) {
            if (this.placedWords.length >= this.numWords) break;
            this.tryPlaceWord(word);
        }
    }

    placeWordAt(word, row, col, direction) {
        const entry = { word, row, col, direction, number: this.placedWords.length + 1 };
        for (let i = 0; i < word.length; i++) {
            const r = direction === 'down' ? row + i : row;
            const c = direction === 'across' ? col + i : col;
            this.grid[`${r},${c}`] = word[i];
            this.gridBounds.minR = Math.min(this.gridBounds.minR, r);
            this.gridBounds.maxR = Math.max(this.gridBounds.maxR, r);
            this.gridBounds.minC = Math.min(this.gridBounds.minC, c);
            this.gridBounds.maxC = Math.max(this.gridBounds.maxC, c);
        }
        this.placedWords.push(entry);
    }

    tryPlaceWord(word) {
        // Find intersections with placed letters
        const options = [];
        for (const placed of this.placedWords) {
            for (let pi = 0; pi < placed.word.length; pi++) {
                for (let wi = 0; wi < word.length; wi++) {
                    if (placed.word[pi] === word[wi]) {
                        const newDir = placed.direction === 'across' ? 'down' : 'across';
                        const pR = placed.direction === 'down' ? placed.row + pi : placed.row;
                        const pC = placed.direction === 'across' ? placed.col + pi : placed.col;
                        const startR = newDir === 'down' ? pR - wi : pR;
                        const startC = newDir === 'across' ? pC - wi : pC;
                        if (this.canPlace(word, startR, startC, newDir)) {
                            options.push({ row: startR, col: startC, direction: newDir });
                        }
                    }
                }
            }
        }
        if (options.length > 0) {
            const pick = options[Math.floor(Math.random() * options.length)];
            this.placeWordAt(word, pick.row, pick.col, pick.direction);
        }
    }

    canPlace(word, row, col, direction) {
        // Check each letter position
        for (let i = 0; i < word.length; i++) {
            const r = direction === 'down' ? row + i : row;
            const c = direction === 'across' ? col + i : col;
            const key = `${r},${c}`;
            const existing = this.grid[key];

            if (existing && existing !== word[i]) return false;

            if (!existing) {
                // Check adjacent cells perpendicular to direction
                if (direction === 'across') {
                    if (this.grid[`${r - 1},${c}`] || this.grid[`${r + 1},${c}`]) return false;
                } else {
                    if (this.grid[`${r},${c - 1}`] || this.grid[`${r},${c + 1}`]) return false;
                }
            }
        }

        // Check cells before and after the word
        const beforeR = direction === 'down' ? row - 1 : row;
        const beforeC = direction === 'across' ? col - 1 : col;
        const afterR = direction === 'down' ? row + word.length : row;
        const afterC = direction === 'across' ? col + word.length : col;
        if (this.grid[`${beforeR},${beforeC}`]) return false;
        if (this.grid[`${afterR},${afterC}`]) return false;

        return true;
    }

    renderHTML() {
        const { minR, maxR, minC, maxC } = this.gridBounds;
        const rows = maxR - minR + 1;
        const cols = maxC - minC + 1;

        // Build number map
        const numberMap = {};
        for (const entry of this.placedWords) {
            const key = `${entry.row},${entry.col}`;
            if (!numberMap[key]) numberMap[key] = entry.number;
        }

        let html = `<div class="crossword-container" data-crossword-id="${this.instanceId}">`;
        html += '<table class="crossword-grid">';

        for (let r = minR; r <= maxR; r++) {
            html += '<tr>';
            for (let c = minC; c <= maxC; c++) {
                const key = `${r},${c}`;
                if (this.grid[key]) {
                    const num = numberMap[key] || '';
                    html += `<td class="crossword-cell" data-crossword-id="${this.instanceId}" data-r="${r}" data-c="${c}">`;
                    if (num) html += `<span class="crossword-number">${num}</span>`;
                    html += `<input type="text" maxlength="1" class="crossword-input" data-crossword-id="${this.instanceId}" data-r="${r}" data-c="${c}" autocomplete="off">`;
                    html += '</td>';
                } else {
                    html += '<td class="crossword-blank"></td>';
                }
            }
            html += '</tr>';
        }

        html += '</table>';

        // Clues
        const acrossClues = this.placedWords.filter(w => w.direction === 'across');
        const downClues = this.placedWords.filter(w => w.direction === 'down');

        html += '<div class="crossword-clues">';
        if (acrossClues.length > 0) {
            html += '<div class="clue-section"><strong>Across</strong>';
            for (const clue of acrossClues) {
                html += `<div class="clue" data-crossword-id="${this.instanceId}" data-clue-number="${clue.number}">${clue.number}. ${ORTHODOX_CLUES[clue.word] || clue.word}</div>`;
            }
            html += '</div>';
        }
        if (downClues.length > 0) {
            html += '<div class="clue-section"><strong>Down</strong>';
            for (const clue of downClues) {
                html += `<div class="clue" data-crossword-id="${this.instanceId}" data-clue-number="${clue.number}">${clue.number}. ${ORTHODOX_CLUES[clue.word] || clue.word}</div>`;
            }
            html += '</div>';
        }
        html += '</div></div>';

        return html;
    }

    checkCompletedWords(container) {
        for (const entry of this.placedWords) {
            let correct = true;
            for (let i = 0; i < entry.word.length; i++) {
                const r = entry.direction === 'down' ? entry.row + i : entry.row;
                const c = entry.direction === 'across' ? entry.col + i : entry.col;
                const input = container.querySelector(`.crossword-input[data-r="${r}"][data-c="${c}"]`);
                if (!input || input.value.toUpperCase() !== entry.word[i]) {
                    correct = false;
                    break;
                }
            }
            const clueEl = container.querySelector(`.clue[data-clue-number="${entry.number}"]`);
            if (clueEl) {
                if (correct) {
                    clueEl.classList.add('clue-solved');
                } else {
                    clueEl.classList.remove('clue-solved');
                }
            }
        }
    }
}

/**
 * Hangman Game
 */
class Hangman {
    constructor() {
        this.instanceId = 'hm-' + Math.random().toString(36).substr(2, 9);
        // Filter to reasonable length words for hangman
        const candidates = ORTHODOX_WORDS.filter(w => w.length >= 3 && w.length <= 10);
        this.targetWord = candidates[Math.floor(Math.random() * candidates.length)];
        this.guessedLetters = new Set();
        this.wrongGuesses = 0;
        this.maxWrong = 6;
        this.solved = false;
        this.lost = false;

        if (!window.hangmanGames) window.hangmanGames = {};
        window.hangmanGames[this.instanceId] = this;
    }

    guessLetter(letter) {
        if (this.solved || this.lost || this.guessedLetters.has(letter)) return;
        this.guessedLetters.add(letter);

        if (!this.targetWord.includes(letter)) {
            this.wrongGuesses++;
            if (this.wrongGuesses >= this.maxWrong) this.lost = true;
        } else {
            // Check if all letters guessed
            const allGuessed = this.targetWord.split('').every(l => this.guessedLetters.has(l));
            if (allGuessed) this.solved = true;
        }
    }

    reset() {
        const candidates = ORTHODOX_WORDS.filter(w => w.length >= 3 && w.length <= 10);
        this.targetWord = candidates[Math.floor(Math.random() * candidates.length)];
        this.guessedLetters = new Set();
        this.wrongGuesses = 0;
        this.solved = false;
        this.lost = false;
    }

    renderHTML() {
        let html = `<div class="hangman-container" data-hangman-id="${this.instanceId}">`;

        // Hangman figure (SVG)
        html += '<svg class="hangman-figure" viewBox="0 0 120 140" width="120" height="140">';
        // Gallows
        html += '<line x1="10" y1="135" x2="70" y2="135" stroke="#333" stroke-width="3"/>';
        html += '<line x1="30" y1="135" x2="30" y2="10" stroke="#333" stroke-width="3"/>';
        html += '<line x1="30" y1="10" x2="80" y2="10" stroke="#333" stroke-width="3"/>';
        html += '<line x1="80" y1="10" x2="80" y2="30" stroke="#333" stroke-width="2"/>';
        // Body parts based on wrong guesses
        const parts = [
            '<circle cx="80" cy="40" r="10" stroke="#333" stroke-width="2" fill="none"/>', // head
            '<line x1="80" y1="50" x2="80" y2="85" stroke="#333" stroke-width="2"/>', // body
            '<line x1="80" y1="60" x2="60" y2="75" stroke="#333" stroke-width="2"/>', // left arm
            '<line x1="80" y1="60" x2="100" y2="75" stroke="#333" stroke-width="2"/>', // right arm
            '<line x1="80" y1="85" x2="60" y2="110" stroke="#333" stroke-width="2"/>', // left leg
            '<line x1="80" y1="85" x2="100" y2="110" stroke="#333" stroke-width="2"/>' // right leg
        ];
        for (let i = 0; i < this.wrongGuesses; i++) {
            html += parts[i];
        }
        html += '</svg>';

        // Word display
        html += '<div class="hangman-word">';
        for (const letter of this.targetWord) {
            if (this.guessedLetters.has(letter) || this.lost) {
                html += `<span class="hangman-letter revealed">${letter}</span>`;
            } else {
                html += '<span class="hangman-letter blank">_</span>';
            }
        }
        html += '</div>';

        // Status
        if (this.solved) {
            html += '<div class="hangman-status won">You got it!</div>';
        } else if (this.lost) {
            html += '<div class="hangman-status lost">The word was revealed above</div>';
        }

        // Letter buttons
        html += '<div class="hangman-letters">';
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(65 + i);
            const used = this.guessedLetters.has(letter);
            const wrong = used && !this.targetWord.includes(letter);
            const correct = used && this.targetWord.includes(letter);
            let cls = 'hangman-btn';
            if (wrong) cls += ' wrong';
            if (correct) cls += ' correct';
            if (used) cls += ' used';
            const disabled = used || this.solved || this.lost ? 'disabled' : '';
            html += `<button class="${cls}" data-hangman-id="${this.instanceId}" data-letter="${letter}" ${disabled}>${letter}</button>`;
        }
        html += '</div>';

        // New word button
        html += `<button class="hangman-new-btn" data-hangman-id="${this.instanceId}">New Word</button>`;
        html += '</div>';

        return html;
    }
}

/**
 * Memory Match Game
 */
class MemoryMatch {
    constructor(pairs) {
        this.instanceId = 'mm-' + Math.random().toString(36).substr(2, 9);
        this.pairs = pairs;
        const emojis = ['☦️', '🕯️', '⛪', '🔔', '🍞', '🕊️', '✝️', '📖', '🎶', '💧', '🌿', '⭐'];
        const selected = emojis.sort(() => Math.random() - 0.5).slice(0, pairs);
        this.cards = [...selected, ...selected].sort(() => Math.random() - 0.5);
        this.flipped = [];
        this.matched = new Set();
        this.busy = false;

        if (!window.memoryGames) window.memoryGames = {};
        window.memoryGames[this.instanceId] = this;
    }

    flipCard(index) {
        if (this.busy || this.matched.has(index) || this.flipped.includes(index)) return;
        this.flipped.push(index);

        if (this.flipped.length === 2) {
            const [a, b] = this.flipped;
            if (this.cards[a] === this.cards[b]) {
                this.matched.add(a);
                this.matched.add(b);
                this.flipped = [];
            } else {
                this.busy = true;
            }
        }
    }

    clearFlipped() {
        this.flipped = [];
        this.busy = false;
    }

    isComplete() {
        return this.matched.size === this.cards.length;
    }

    renderHTML() {
        const cols = this.pairs <= 3 ? 3 : 4;

        let html = `<div class="memory-container" data-memory-id="${this.instanceId}">`;
        html += `<div class="memory-grid" style="grid-template-columns: repeat(${cols}, 1fr)">`;

        for (let i = 0; i < this.cards.length; i++) {
            const isFlipped = this.flipped.includes(i) || this.matched.has(i);
            const isMatched = this.matched.has(i);
            let cls = 'memory-card';
            if (isFlipped) cls += ' flipped';
            if (isMatched) cls += ' matched';
            html += `<div class="${cls}" data-memory-id="${this.instanceId}" data-index="${i}">`;
            html += `<div class="memory-card-inner">`;
            html += `<div class="memory-card-back">?</div>`;
            html += `<div class="memory-card-front">${this.cards[i]}</div>`;
            html += `</div></div>`;
        }

        html += '</div>';

        if (this.isComplete()) {
            html += '<div class="memory-success">All matched!</div>';
        }

        html += '</div>';
        return html;
    }
}

/**
 * Trivia Quiz Game
 */
class TriviaQuiz {
    constructor() {
        this.instanceId = 'trivia-' + Math.random().toString(36).substr(2, 9);
        // Pick 3 random questions
        const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
        this.questions = shuffled.slice(0, 3).map(q => {
            const [question, correct, ...wrong] = q;
            const answers = [correct, ...wrong].sort(() => Math.random() - 0.5);
            return { question, correct, answers, answered: null };
        });
        this.score = 0;

        if (!window.triviaGames) window.triviaGames = {};
        window.triviaGames[this.instanceId] = this;
    }

    answer(qIndex, answer) {
        const q = this.questions[qIndex];
        if (q.answered !== null) return;
        q.answered = answer;
        if (answer === q.correct) this.score++;
    }

    allAnswered() {
        return this.questions.every(q => q.answered !== null);
    }

    renderHTML() {
        let html = `<div class="trivia-container" data-trivia-id="${this.instanceId}">`;

        this.questions.forEach((q, qi) => {
            html += `<div class="trivia-question">`;
            html += `<div class="trivia-q-text">${qi + 1}. ${q.question}</div>`;
            html += '<div class="trivia-answers">';
            for (const ans of q.answers) {
                let cls = 'trivia-btn';
                if (q.answered !== null) {
                    if (ans === q.correct) cls += ' correct';
                    if (ans === q.answered && ans !== q.correct) cls += ' wrong';
                }
                const disabled = q.answered !== null ? 'disabled' : '';
                html += `<button class="${cls}" data-trivia-id="${this.instanceId}" data-qi="${qi}" data-answer="${ans.replace(/"/g, '&quot;')}" ${disabled}>${ans}</button>`;
            }
            html += '</div></div>';
        });

        if (this.allAnswered()) {
            html += `<div class="trivia-score">${this.score} out of ${this.questions.length}!</div>`;
        }

        html += '</div>';
        return html;
    }
}

/**
 * Game Manager - Main interface
 */
class GameManager {
    constructor() {
        this.shuffledTypes = [];
        this.typeIndex = 0;
        this.gameTypes = [
            { type: 'wordsearch', title: '🔤 Word Search', sizes: ['small', 'small', 'small', 'large'] },
            { type: 'tictactoe', title: '⭕ Tic-Tac-Toe', sizes: ['small'] },
            { type: 'scramble', title: '📋 Unscramble', sizes: ['small'] },
            { type: 'scribble', title: '🖍️ Scribble Pad', sizes: ['small', 'small', 'small', 'large'] },
            { type: 'connect4', title: '🔴 Connect Four', sizes: ['small'] },
            { type: 'maze', title: '🏁 Maze', sizes: ['small', 'small', 'small', 'large'] },
            { type: 'crossword', title: '✏️ Crossword', sizes: ['small', 'small', 'small', 'large'] },
            { type: 'hangman', title: '🪢 Hangman', sizes: ['small'] },
            { type: 'memory', title: '🃏 Memory Match', sizes: ['small', 'small', 'small', 'large'] },
            { type: 'trivia', title: '❓ Trivia Quiz', sizes: ['small'] }
        ];
    }

    getAvailableTypeCount() {
        return this.gameTypes.length;
    }

    generateRandomGame() {
        // Draw from shuffled deck (no duplicates)
        if (this.typeIndex >= this.shuffledTypes.length) return null;
        const entry = this.shuffledTypes[this.typeIndex++];
        const size = entry.sizes[Math.floor(Math.random() * entry.sizes.length)];

        switch (entry.type) {
            case 'wordsearch': {
                const gridSize = size === 'large' ? 12 : 8;
                const numWords = size === 'large' ? Math.floor(Math.random() * 3) + 6 : Math.floor(Math.random() * 2) + 4;
                const ws = new WordSearchGenerator(gridSize, numWords);
                return { type: 'wordsearch', title: entry.title, content: ws.renderHTML(), height: size };
            }
            case 'tictactoe': {
                const ttt = new TicTacToe();
                return { type: 'tictactoe', title: entry.title, content: ttt.renderHTML(), height: size };
            }
            case 'scramble': {
                const s = new WordScramble();
                return { type: 'scramble', title: entry.title, content: s.renderHTML(), height: size };
            }
            case 'scribble': {
                const pad = new ScribblePad();
                const w = size === 'large' ? 320 : 220;
                const h = size === 'large' ? 240 : 160;
                return {
                    type: 'scribble', title: entry.title, height: size,
                    content: pad.renderHTML(w, h),
                    init: (element) => {
                        const canvas = element.querySelector('canvas');
                        if (canvas) { pad.init(canvas); canvas.scribblePad = pad; }
                    }
                };
            }
            case 'connect4': {
                const c4 = new ConnectFour();
                return { type: 'connect4', title: entry.title, content: c4.renderHTML(), height: size };
            }
            case 'maze': {
                const mazeSize = size === 'large' ? 18 : 10;
                const m = new Maze(mazeSize);
                return {
                    type: 'maze', title: entry.title, content: m.renderHTML(), height: size,
                    init: (element) => {
                        const canvas = element.querySelector('.maze-canvas');
                        if (canvas) m.initCanvas(canvas);
                    }
                };
            }
            case 'crossword': {
                const numWords = size === 'large' ? 7 : 4;
                const cw = new Crossword(numWords);
                return { type: 'crossword', title: entry.title, content: cw.renderHTML(), height: size };
            }
            case 'hangman': {
                const hm = new Hangman();
                return { type: 'hangman', title: entry.title, content: hm.renderHTML(), height: size };
            }
            case 'memory': {
                const pairs = size === 'large' ? 6 : 3;
                const mm = new MemoryMatch(pairs);
                return { type: 'memory', title: entry.title, content: mm.renderHTML(), height: size };
            }
            case 'trivia': {
                const tq = new TriviaQuiz();
                return { type: 'trivia', title: entry.title, content: tq.renderHTML(), height: size };
            }
        }
    }

    reset() {
        // Shuffle game types for deck-of-cards selection
        this.shuffledTypes = [...this.gameTypes].sort(() => Math.random() - 0.5);
        this.typeIndex = 0;
    }
}

// Global game manager instance
const gameManager = new GameManager();

// Tic-tac-toe event delegation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('tic-tac-toe-cell')) {
        const tttId = e.target.dataset.tttId;
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);

        if (window.ticTacToeGames && window.ticTacToeGames[tttId]) {
            const game = window.ticTacToeGames[tttId];
            if (game.makeMove(x, y)) {
                e.target.textContent = game.board[y][x];
                const container = e.target.closest('.tic-tac-toe-container');
                const status = container.querySelector('.ttt-status');
                if (status) {
                    status.textContent = game.getStatus();
                    status.className = 'ttt-status' + (game.winner ? ' ttt-win' : game.gameOver ? ' ttt-draw' : '');
                }
            }
        }
    }

    if (e.target.classList.contains('reset-game-btn')) {
        const tttId = e.target.dataset.tttId;
        if (window.ticTacToeGames && window.ticTacToeGames[tttId]) {
            const game = window.ticTacToeGames[tttId];
            game.reset();
            const container = e.target.closest('.tic-tac-toe-container');
            const board = container.querySelector('.tic-tac-toe-board');
            if (board) {
                board.querySelectorAll('.tic-tac-toe-cell').forEach(cell => {
                    cell.textContent = '';
                });
            }
            const status = container.querySelector('.ttt-status');
            if (status) {
                status.textContent = game.getStatus();
                status.className = 'ttt-status';
            }
        }
    }

    // Word search cell clicks
    if (e.target.classList.contains('word-search-cell')) {
        const wordSearchId = e.target.dataset.wordsearchId;
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);
        
        if (window.wordSearches && window.wordSearches[wordSearchId]) {
            window.wordSearches[wordSearchId].toggleCell(x, y);
        }
    }
    
    // Word search clear button
    if (e.target.classList.contains('word-search-clear-btn')) {
        const wordSearchId = e.target.dataset.wordsearchId;
        if (window.wordSearches && window.wordSearches[wordSearchId]) {
            window.wordSearches[wordSearchId].clearSelection();
        }
    }
});

// Scramble game event delegation
document.addEventListener('click', function(e) {
    // Scramble letter clicked
    if (e.target.classList.contains('scramble-letter')) {
        const scrambleId = e.target.dataset.scrambleId;
        const index = parseInt(e.target.dataset.index);
        
        if (window.scrambles && window.scrambles[scrambleId]) {
            const scramble = window.scrambles[scrambleId];
            scramble.selectLetter(index);
            
            // Re-render to show updated state
            const container = e.target.closest('.scramble-container');
            if (container) {
                const gameContainer = container.closest('.game-container');
                if (gameContainer) {
                    gameContainer.innerHTML = scramble.renderHTML();
                }
            }
        }
    }
    
    // Scramble clear button
    if (e.target.classList.contains('scramble-clear-btn')) {
        const scrambleId = e.target.dataset.scrambleId;
        if (window.scrambles && window.scrambles[scrambleId]) {
            const scramble = window.scrambles[scrambleId];
            scramble.clear();
            
            // Re-render
            const container = document.querySelector(`.scramble-container[data-scramble-id="${scrambleId}"]`);
            if (container) {
                const gameContainer = container.closest('.game-container');
                if (gameContainer) {
                    gameContainer.innerHTML = scramble.renderHTML();
                }
            }
        }
    }
    
    // Scramble new word button
    if (e.target.classList.contains('scramble-new-btn')) {
        const scrambleId = e.target.dataset.scrambleId;
        if (window.scrambles && window.scrambles[scrambleId]) {
            window.scrambles[scrambleId].newWord();
        }
    }
});

// Scribble pad event delegation
document.addEventListener('click', function(e) {
    // Scribble clear button
    if (e.target.classList.contains('scribble-clear-btn')) {
        const scribbleId = e.target.dataset.scribbleId;
        const canvas = document.getElementById(scribbleId);
        if (canvas && canvas.scribblePad) {
            canvas.scribblePad.clear();
        }
    }
    
    // Scribble download button
    if (e.target.classList.contains('scribble-download-btn')) {
        const scribbleId = e.target.dataset.scribbleId;
        const canvas = document.getElementById(scribbleId);
        if (canvas && canvas.scribblePad) {
            canvas.scribblePad.download();
        }
    }
});

// Connect Four event delegation
document.addEventListener('click', function(e) {
    // Connect Four cell clicked
    if (e.target.classList.contains('connect-four-board') || e.target.closest('.connect-four-board')) {
        const cell = e.target.closest('.cell');
        if (!cell) return;
        
        const connect4Id = cell.dataset.connect4Id;
        const col = parseInt(cell.dataset.col);
        
        if (window.connectFourGames && window.connectFourGames[connect4Id]) {
            const game = window.connectFourGames[connect4Id];
            
            if (game.dropPiece(col)) {
                // Re-render
                const container = document.querySelector(`.connect-four-container[data-connect4-id="${connect4Id}"]`);
                if (container) {
                    const gameContainer = container.closest('.game-container');
                    if (gameContainer) {
                        gameContainer.innerHTML = game.renderHTML();
                    }
                }
            }
        }
    }
    
    // Connect Four reset button
    if (e.target.classList.contains('connect-four-reset-btn')) {
        const connect4Id = e.target.dataset.connect4Id;
        if (window.connectFourGames && window.connectFourGames[connect4Id]) {
            const game = window.connectFourGames[connect4Id];
            game.reset();
            
            // Re-render
            const container = document.querySelector(`.connect-four-container[data-connect4-id="${connect4Id}"]`);
            if (container) {
                const gameContainer = container.closest('.game-container');
                if (gameContainer) {
                    gameContainer.innerHTML = game.renderHTML();
                }
            }
        }
    }
});

// Maze event delegation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('maze-clear-btn')) {
        const mazeId = e.target.dataset.mazeId;
        if (window.mazeGames && window.mazeGames[mazeId]) {
            window.mazeGames[mazeId].clearCanvas();
        }
    }
});

// Crossword event delegation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('crossword-input')) {
        e.target.select();
    }
});
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('crossword-input')) {
        const val = e.target.value.toUpperCase();
        e.target.value = val;
        // Move to next input in the row
        if (val) {
            const td = e.target.closest('td');
            const nextTd = td && td.nextElementSibling;
            if (nextTd) {
                const nextInput = nextTd.querySelector('.crossword-input');
                if (nextInput) nextInput.focus();
            }
        }
        // Check if any words are now complete
        const cwId = e.target.dataset.crosswordId;
        if (window.crosswordGames && window.crosswordGames[cwId]) {
            const container = e.target.closest('.crossword-container');
            if (container) window.crosswordGames[cwId].checkCompletedWords(container);
        }
    }
});

// Hangman event delegation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('hangman-btn') && !e.target.disabled) {
        const hmId = e.target.dataset.hangmanId;
        const letter = e.target.dataset.letter;
        if (window.hangmanGames && window.hangmanGames[hmId]) {
            const game = window.hangmanGames[hmId];
            game.guessLetter(letter);
            const container = document.querySelector(`.hangman-container[data-hangman-id="${hmId}"]`);
            if (container) {
                const gameContainer = container.closest('.game-container');
                if (gameContainer) gameContainer.innerHTML = game.renderHTML();
            }
        }
    }

    if (e.target.classList.contains('hangman-new-btn')) {
        const hmId = e.target.dataset.hangmanId;
        if (window.hangmanGames && window.hangmanGames[hmId]) {
            const game = window.hangmanGames[hmId];
            game.reset();
            const container = document.querySelector(`.hangman-container[data-hangman-id="${hmId}"]`);
            if (container) {
                const gameContainer = container.closest('.game-container');
                if (gameContainer) gameContainer.innerHTML = game.renderHTML();
            }
        }
    }
});

// Memory Match event delegation
document.addEventListener('click', function(e) {
    const card = e.target.closest('.memory-card');
    if (!card) return;
    const memId = card.dataset.memoryId;
    if (!memId) return;
    const index = parseInt(card.dataset.index);

    if (window.memoryGames && window.memoryGames[memId]) {
        const game = window.memoryGames[memId];
        game.flipCard(index);

        // Re-render
        const container = document.querySelector(`.memory-container[data-memory-id="${memId}"]`);
        if (container) {
            const gameContainer = container.closest('.game-container');
            if (gameContainer) gameContainer.innerHTML = game.renderHTML();
        }

        // If busy (non-match), flip back after delay
        if (game.busy) {
            setTimeout(() => {
                game.clearFlipped();
                const c = document.querySelector(`.memory-container[data-memory-id="${memId}"]`);
                if (c) {
                    const gc = c.closest('.game-container');
                    if (gc) gc.innerHTML = game.renderHTML();
                }
            }, 1000);
        }
    }
});

// Trivia Quiz event delegation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('trivia-btn') && !e.target.disabled) {
        const triviaId = e.target.dataset.triviaId;
        const qi = parseInt(e.target.dataset.qi);
        const answer = e.target.dataset.answer;

        if (window.triviaGames && window.triviaGames[triviaId]) {
            const game = window.triviaGames[triviaId];
            game.answer(qi, answer);
            const container = document.querySelector(`.trivia-container[data-trivia-id="${triviaId}"]`);
            if (container) {
                const gameContainer = container.closest('.game-container');
                if (gameContainer) gameContainer.innerHTML = game.renderHTML();
            }
        }
    }
});

// Export for use in app.js
window.GameManager = GameManager;
window.gameManager = gameManager;
window.ScribblePad = ScribblePad;
window.ConnectFour = ConnectFour;

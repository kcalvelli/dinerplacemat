/**
 * DinerPlacemat Games
 * Client-side generation of diner-style puzzles
 */

// Orthodox-themed words for word search
const ORTHODOX_WORDS = [
    'LITURGY', 'EUCHARIST', 'ICON', 'CENSER', 'VESPERS',
    'ORTHROS', 'PROSPHORA', 'CHOIR', 'PASCHA', 'NATIVITY',
    'THEOTOKOS', 'CHRYSOSTOM', 'DIVINE', 'PRAYER', 'FASTING',
    'CONFESSION', 'COMMUNION', 'BAPTISM', 'WEDDING', 'FUNERAL'
];

/**
 * Maze Generator using Recursive Backtracker
 */
class MazeGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.visited = [];
        this.instanceId = Math.random().toString(36).substr(2, 9);
        this.isDrawing = false;
        this.drawnPath = [];
        this.cellSize = window.innerWidth < 640 ? 24 : 35;
    }

    generate() {
        // Initialize grid with walls
        this.grid = Array(this.height).fill(null).map(() => 
            Array(this.width).fill(1)
        );
        this.visited = Array(this.height).fill(null).map(() => 
            Array(this.width).fill(false)
        );

        // Start from (0,0)
        this.carve(0, 0);
        
        return this.grid;
    }

    carve(x, y) {
        this.visited[y][x] = true;
        this.grid[y][x] = 0; // Path

        // Random directions
        const directions = [
            [0, -2], [2, 0], [0, 2], [-2, 0]
        ].sort(() => Math.random() - 0.5);

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height && !this.visited[ny][nx]) {
                // Carve wall between
                this.grid[y + dy/2][x + dx/2] = 0;
                this.carve(nx, ny);
            }
        }
    }

    renderSVG() {
        const cellSize = this.cellSize;
        const maze = this.generate();
        const svgWidth = this.width * cellSize;
        const svgHeight = this.height * cellSize;

        let svg = `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg" class="maze-svg maze-interactive" data-maze-id="${this.instanceId}" style="cursor: crosshair; touch-action: none;">`;
        
        // Background - clickable area for drawing
        svg += `<rect width="100%" height="100%" fill="white" class="maze-background" data-maze-id="${this.instanceId}"/>`;
        
        // Draw walls
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (maze[y][x] === 1) {
                    svg += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="#DC143C" class="maze-wall"/>`;
                }
            }
        }
        
        // Path for user's drawing
        svg += `<path class="maze-user-path" data-maze-id="${this.instanceId}" d="" stroke="#28a745" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
        
        // Start and end markers
        svg += `<text x="${cellSize/2}" y="${cellSize/2 + 4}" font-size="12" text-anchor="middle" fill="#333" class="maze-start">S</text>`;
        svg += `<text x="${(this.width-1) * cellSize + cellSize/2}" y="${(this.height-1) * cellSize + cellSize/2 + 4}" font-size="12" text-anchor="middle" fill="#333" class="maze-end">E</text>`;
        
        svg += '</svg>';
        
        // Store instance for event handling
        if (!window.mazes) window.mazes = {};
        window.mazes[this.instanceId] = this;
        
        return svg;
    }
    
    getCellFromPoint(x, y, svgElement) {
        const rect = svgElement.getBoundingClientRect();
        const scaleX = this.width * this.cellSize / rect.width;
        const scaleY = this.height * this.cellSize / rect.height;
        
        const svgX = (x - rect.left) * scaleX;
        const svgY = (y - rect.top) * scaleY;
        
        const cellX = Math.floor(svgX / this.cellSize);
        const cellY = Math.floor(svgY / this.cellSize);
        
        if (cellX >= 0 && cellX < this.width && cellY >= 0 && cellY < this.height) {
            return { x: cellX, y: cellY, isWall: this.grid[cellY][cellX] === 1 };
        }
        return null;
    }
    
    startDrawing(x, y, svgElement) {
        const cell = this.getCellFromPoint(x, y, svgElement);
        if (cell && !cell.isWall) {
            this.isDrawing = true;
            this.drawnPath = [{ x: cell.x, y: cell.y }];
            this.updatePath(svgElement);
        }
    }
    
    continueDrawing(x, y, svgElement) {
        if (!this.isDrawing) return;
        
        const cell = this.getCellFromPoint(x, y, svgElement);
        if (!cell || cell.isWall) {
            // Hit a wall, stop drawing
            this.isDrawing = false;
            this.checkWin(svgElement);
            return;
        }
        
        // Check if this cell is adjacent to the last cell in path
        const lastCell = this.drawnPath[this.drawnPath.length - 1];
        const dx = Math.abs(cell.x - lastCell.x);
        const dy = Math.abs(cell.y - lastCell.y);
        
        // Only allow movement to adjacent cells (not diagonal)
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            // Check if we're backtracking
            if (this.drawnPath.length > 1) {
                const secondLast = this.drawnPath[this.drawnPath.length - 2];
                if (cell.x === secondLast.x && cell.y === secondLast.y) {
                    // Backtracking, remove last cell
                    this.drawnPath.pop();
                } else {
                    // New cell, add to path
                    this.drawnPath.push({ x: cell.x, y: cell.y });
                }
            } else {
                this.drawnPath.push({ x: cell.x, y: cell.y });
            }
            this.updatePath(svgElement);
            this.checkWin(svgElement);
        }
    }
    
    stopDrawing(svgElement) {
        this.isDrawing = false;
        this.checkWin(svgElement);
    }
    
    updatePath(svgElement) {
        const pathElement = svgElement.querySelector('.maze-user-path');
        if (!pathElement || this.drawnPath.length === 0) return;
        
        let d = `M ${this.drawnPath[0].x * this.cellSize + this.cellSize/2} ${this.drawnPath[0].y * this.cellSize + this.cellSize/2}`;
        
        for (let i = 1; i < this.drawnPath.length; i++) {
            d += ` L ${this.drawnPath[i].x * this.cellSize + this.cellSize/2} ${this.drawnPath[i].y * this.cellSize + this.cellSize/2}`;
        }
        
        pathElement.setAttribute('d', d);
    }
    
    checkWin(svgElement) {
        if (this.drawnPath.length === 0) return;
        
        const startCell = this.drawnPath[0];
        const endCell = this.drawnPath[this.drawnPath.length - 1];
        
        // Check if started at S (0,0) and ended at E (width-1, height-1)
        if (startCell.x === 0 && startCell.y === 0 && 
            endCell.x === this.width - 1 && endCell.y === this.height - 1) {
            
            // Success! Change path color to gold
            const pathElement = svgElement.querySelector('.maze-user-path');
            if (pathElement) {
                pathElement.setAttribute('stroke', '#FFD700');
                pathElement.setAttribute('stroke-width', '5');
            }
            
            // Show success message
            const container = svgElement.closest('.game-card');
            if (container && !container.querySelector('.maze-success')) {
                const successMsg = document.createElement('div');
                successMsg.className = 'maze-success';
                successMsg.textContent = '🎉 Solved!';
                successMsg.style.cssText = 'color: #28a745; font-weight: bold; margin-top: 8px; font-size: 1.1rem;';
                container.querySelector('.game-container').appendChild(successMsg);
            }
        }
    }
    
    clearDrawing(svgElement) {
        this.isDrawing = false;
        this.drawnPath = [];
        const pathElement = svgElement.querySelector('.maze-user-path');
        if (pathElement) {
            pathElement.setAttribute('d', '');
            pathElement.setAttribute('stroke', '#28a745');
            pathElement.setAttribute('stroke-width', '3');
        }
    }
}

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

        // Select random words
        this.words = [...ORTHODOX_WORDS]
            .sort(() => Math.random() - 0.5)
            .slice(0, this.numWords);

        // Try to place each word FIRST (before adding random letters)
        for (const word of this.words) {
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
            for (let attempts = 0; attempts < 50; attempts++) {
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
        this.board = Array(3).fill(null).map(() => Array(3).fill(''));
        this.currentPlayer = 'X';
    }

    renderHTML() {
        let html = '<div class="tic-tac-toe-container">';
        html += '<div class="tic-tac-toe-board">';
        
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                html += `<div class="tic-tac-toe-cell" data-x="${x}" data-y="${y}">${this.board[y][x]}</div>`;
            }
        }
        
        html += '</div>';
        html += '<button class="reset-game-btn" onclick="resetTicTacToe()">Reset Board</button>';
        html += '</div>';
        
        return html;
    }

    makeMove(x, y) {
        if (this.board[y][x] === '') {
            this.board[y][x] = this.currentPlayer;
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            return true;
        }
        return false;
    }

    reset() {
        this.board = Array(3).fill(null).map(() => Array(3).fill(''));
        this.currentPlayer = 'X';
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

    renderHTML() {
        const width = 280;
        const height = 200;
        
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
 * Game Manager - Main interface
 */
class GameManager {
    constructor() {
        this.wordSearchGen = new WordSearchGenerator(12, 6);
        this.ticTacToe = new TicTacToe();
    }

    generateRandomGame() {
        const games = ['wordsearch', 'tictactoe', 'scramble', 'scribble', 'connect4'];
        const game = games[Math.floor(Math.random() * games.length)];
        
        switch (game) {
            case 'wordsearch':
                return {
                    type: 'wordsearch',
                    title: '🔤 Word Search',
                    content: this.wordSearchGen.renderHTML(),
                    height: 'large'
                };
            case 'tictactoe':
                return {
                    type: 'tictactoe',
                    title: '⭕ Tic-Tac-Toe',
                    content: this.ticTacToe.renderHTML(),
                    height: 'small'
                };
            case 'scramble':
                const scramble = new WordScramble();
                return {
                    type: 'scramble',
                    title: '📋 Unscramble',
                    content: scramble.renderHTML(),
                    height: 'small'
                };
            case 'scribble':
                const scribble = new ScribblePad();
                return {
                    type: 'scribble',
                    title: '🖍️ Scribble Pad',
                    content: scribble.renderHTML(),
                    height: 'large',
                    init: (element) => {
                        const canvas = element.querySelector('canvas');
                        if (canvas) scribble.init(canvas);
                    }
                };
            case 'connect4':
                const connect4 = new ConnectFour();
                return {
                    type: 'connect4',
                    title: '🔴 Connect Four',
                    content: connect4.renderHTML(),
                    height: 'large',
                    span: 'wide'
                };
        }
    }

    // Reset and regenerate all games
    reset() {
        this.wordSearchGen = new WordSearchGenerator(
            window.innerWidth < 640 ? 10 : 12,
            Math.floor(Math.random() * 4) + 5 // 5-8 words
        );
        this.ticTacToe.reset();
    }
}

// Global game manager instance
const gameManager = new GameManager();

// Tic-tac-toe event delegation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('tic-tac-toe-cell')) {
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);
        
        if (gameManager.ticTacToe.makeMove(x, y)) {
            e.target.textContent = gameManager.ticTacToe.board[y][x];
        }
    }
    
    if (e.target.classList.contains('reset-game-btn')) {
        gameManager.ticTacToe.reset();
        // Re-render the board
        const board = e.target.closest('.tic-tac-toe-container').querySelector('.tic-tac-toe-board');
        if (board) {
            const cells = board.querySelectorAll('.tic-tac-toe-cell');
            cells.forEach(cell => {
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
                cell.textContent = '';
            });
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

// Maze drawing events
let activeMazeId = null;
let activeSvgElement = null;

document.addEventListener('mousedown', function(e) {
    const svg = e.target.closest('.maze-interactive');
    if (svg) {
        const mazeId = svg.dataset.mazeId;
        if (window.mazes && window.mazes[mazeId]) {
            activeMazeId = mazeId;
            activeSvgElement = svg;
            window.mazes[mazeId].startDrawing(e.clientX, e.clientY, svg);
        }
    }
});

document.addEventListener('mousemove', function(e) {
    if (activeMazeId && activeSvgElement) {
        if (window.mazes[activeMazeId]) {
            window.mazes[activeMazeId].continueDrawing(e.clientX, e.clientY, activeSvgElement);
        }
    }
});

document.addEventListener('mouseup', function(e) {
    if (activeMazeId && activeSvgElement) {
        if (window.mazes[activeMazeId]) {
            window.mazes[activeMazeId].stopDrawing(activeSvgElement);
        }
        activeMazeId = null;
        activeSvgElement = null;
    }
});

// Touch events for mobile
document.addEventListener('touchstart', function(e) {
    const svg = e.target.closest('.maze-interactive');
    if (svg) {
        e.preventDefault();
        const mazeId = svg.dataset.mazeId;
        if (window.mazes && window.mazes[mazeId]) {
            activeMazeId = mazeId;
            activeSvgElement = svg;
            const touch = e.touches[0];
            window.mazes[mazeId].startDrawing(touch.clientX, touch.clientY, svg);
        }
    }
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    if (activeMazeId && activeSvgElement) {
        e.preventDefault();
        const touch = e.touches[0];
        if (window.mazes[activeMazeId]) {
            window.mazes[activeMazeId].continueDrawing(touch.clientX, touch.clientY, activeSvgElement);
        }
    }
}, { passive: false });

document.addEventListener('touchend', function(e) {
    if (activeMazeId && activeSvgElement) {
        if (window.mazes[activeMazeId]) {
            window.mazes[activeMazeId].stopDrawing(activeSvgElement);
        }
        activeMazeId = null;
        activeSvgElement = null;
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

// Export for use in app.js
window.GameManager = GameManager;
window.gameManager = gameManager;
window.ScribblePad = ScribblePad;
window.ConnectFour = ConnectFour;

let boardSize = 10;  // Standaard bordgrootte
let mineCount = 20;  // Standaard aantal mijnen
let board = [];
let revealedCells = 0;
let isGameOver = false;
const winAudio = document.getElementById('winAudio'); // Audio element voor win
const loseAudio = document.getElementById('loseAudio'); // Audio element voor verlies

// Pas de grid aan op basis van de boardSize
function updateBoardGrid(size) {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 30px)`;
    gameBoard.style.gridTemplateRows = `repeat(${size}, 30px)`;
}

// Maak het bord
function createBoard() {
    board = [];
    revealedCells = 0;
    isGameOver = false;
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    updateBoardGrid(boardSize);

    // Maak een lege cel
    for (let row = 0; row < boardSize; row++) {
        const rowArr = [];
        for (let col = 0; col < boardSize; col++) {
            const cell = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                mineCount: 0,
            };
            rowArr.push(cell);
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.addEventListener('click', () => revealCell(row, col));
            cellElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagCell(row, col);
            });
            gameBoard.appendChild(cellElement);
        }
        board.push(rowArr);
    }

    // Plaats de mijnen
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }

    // Bereken het aantal aangrenzende mijnen voor elke cel
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col].isMine) continue;
            let mineCount = 0;
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c].isMine) {
                        mineCount++;
                    }
                }
            }
            board[row][col].mineCount = mineCount;
        }
    }
}

// Toon een cel
function revealCell(row, col) {
    if (isGameOver || board[row][col].isRevealed || board[row][col].isFlagged) {
        return;
    }

    const cell = board[row][col];
    const cellElement = document.getElementById('gameBoard').children[row * boardSize + col];
    cell.isRevealed = true;
    cellElement.classList.add('revealed');

    if (cell.isMine) {
        cellElement.classList.add('mine');
        gameOver(false);
    } else {
        revealedCells++;
        if (cell.mineCount > 0) {
            cellElement.classList.add('num');
            cellElement.textContent = cell.mineCount;
        }
        if (revealedCells === boardSize * boardSize - mineCount) {
            gameOver(true);
        }
        if (cell.mineCount === 0) {
            // Ontdek alle aangrenzende cellen als er geen mijnen om deze cel heen zijn
            revealAdjacentCells(row, col);
        }
    }
}

// Ontdek de aangrenzende cellen
function revealAdjacentCells(row, col) {
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && !board[r][c].isRevealed) {
                revealCell(r, c);
            }
        }
    }
}

// Markeer of deactiveer een vlag
function flagCell(row, col) {
    if (isGameOver || board[row][col].isRevealed) {
        return;
    }

    const cell = board[row][col];
    const cellElement = document.getElementById('gameBoard').children[row * boardSize + col];

    if (cell.isFlagged) {
        cell.isFlagged = false;
        cellElement.classList.remove('flagged');
    } else {
        cell.isFlagged = true;
        cellElement.classList.add('flagged');
    }
}

function gameOver(isWin) {
    isGameOver = true;
    if (isWin) {
        triggerConfetti();
        winAudio.play();
        alert('Je hebt gewonnen!');
    } else {
        loseAudio.play();
        alert('Game Over! Probeer het opnieuw.');
    }
    setTimeout(createBoard, 1000);
}

// Trigger de confetti animatie
function triggerConfetti() {
    confetti({
        particleCount: 300,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#ff0', '#f00', '#0f0', '#00f', '#ff00ff'],
    });

    // Confetti op het bord
    const gameBoard = document.getElementById('gameBoard');
    setTimeout(() => {
        const cells = gameBoard.getElementsByClassName('cell');
        for (let i = 0; i < cells.length; i++) {
            confetti({
                particleCount: 10,
                spread: 20,
                origin: { x: (i % boardSize) / boardSize, y: Math.floor(i / boardSize) / boardSize },
                colors: ['#ff0', '#f00', '#0f0', '#00f', '#ff00ff'],
            });
        }
    }, 500);
}

// Start een nieuw spel
document.getElementById('restartBtn').addEventListener('click', createBoard);

// Wijzig het niveau
document.getElementById('easyBtn').addEventListener('click', () => setLevel(8, 10));     // 8x8, 10 mijnen
document.getElementById('mediumBtn').addEventListener('click', () => setLevel(10, 20));  // 10x10, 20 mijnen
document.getElementById('hardBtn').addEventListener('click', () => setLevel(12, 35));    // 12x12, 35 mijnen

// Verander het niveau
function setLevel(size, mines) {
    boardSize = size;
    mineCount = mines;
    createBoard();
}

// Start het spel bij het laden van de pagina
createBoard();
const boardSizes = {
    easy: { rows: 8, cols: 8, mines: 10 },
    medium: { rows: 12, cols: 12, mines: 25 },
    hard: { rows: 16, cols: 16, mines: 50 }
};

let board = [];
let revealed = [];
let flagged = [];
let rows = 8;
let cols = 8;
let mines = 10;
let gameOver = false;

const gameBoard = document.getElementById('gameBoard');
const easyBtn = document.getElementById('easyBtn');
const mediumBtn = document.getElementById('mediumBtn');
const hardBtn = document.getElementById('hardBtn');
const restartBtn = document.getElementById('restartBtn');
const winAudio = document.getElementById('winAudio');
const loseAudio = document.getElementById('loseAudio');

function init(size = 'easy') {
    const { rows: r, cols: c, mines: m } = boardSizes[size];
    rows = r; cols = c; mines = m;
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    revealed = Array.from({ length: rows }, () => Array(cols).fill(false));
    flagged = Array.from({ length: rows }, () => Array(cols).fill(false));
    gameOver = false;
    placeMines();
    calculateNumbers();
    renderBoard();
}

function placeMines() {
    let placed = 0;
    while (placed < mines) {
        let x = Math.floor(Math.random() * rows);
        let y = Math.floor(Math.random() * cols);
        if (board[x][y] !== 'M') {
            board[x][y] = 'M';
            placed++;
        }
    }
}

function calculateNumbers() {
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if (board[x][y] === 'M') continue;
            let count = 0;
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    let nx = x + dx, ny = y + dy;
                    if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && board[nx][ny] === 'M') {
                        count++;
                    }
                }
            }
            board[x][y] = count;
        }
    }
}

function renderBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 36px)`;
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 36px)`;
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            if (revealed[x][y]) {
                cell.classList.add('revealed');
                if (board[x][y] === 'M') {
                    cell.classList.add('mine');
                    cell.textContent = '💣';
                } else if (board[x][y] > 0) {
                    cell.classList.add('num');
                    cell.dataset.num = board[x][y];
                    cell.textContent = board[x][y];
                }
            } else if (flagged[x][y]) {
                cell.classList.add('flagged');
            }
            cell.oncontextmenu = (e) => {
                e.preventDefault();
                if (gameOver || revealed[x][y]) return;
                flagged[x][y] = !flagged[x][y];
                renderBoard();
            };
            cell.onclick = () => {
                if (gameOver || flagged[x][y]) return;
                revealCell(x, y);
            };
            gameBoard.appendChild(cell);
        }
    }
}

function revealCell(x, y) {
    if (revealed[x][y] || flagged[x][y]) return;
    revealed[x][y] = true;
    if (board[x][y] === 'M') {
        showAllMines();
        loseAudio.play();
        showLoseMessage();
        gameOver = true;
        return;
    }
    if (board[x][y] === 0) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
                    if (!revealed[nx][ny]) revealCell(nx, ny);
                }
            }
        }
    }
    renderBoard();
    if (checkWin()) {
        winAudio.play();
        showWinMessage();
        gameOver = true;
    }
}

function showAllMines() {
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if (board[x][y] === 'M') revealed[x][y] = true;
        }
    }
    renderBoard();
}

function checkWin() {
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if (board[x][y] !== 'M' && !revealed[x][y]) return false;
        }
    }
    return true;
}

// Mooie win-popup
function showWinMessage() {
    const oldMsg = document.querySelector('.winMessage');
    if (oldMsg) oldMsg.remove();

    const msg = document.createElement('div');
    msg.className = 'winMessage';
    msg.innerHTML = `
        <span class="icon">🎉</span>
        <span>Gefeliciteerd! Je hebt gewonnen!</span>
        <button id="playAgainBtn">Opnieuw spelen</button>
    `;
    document.body.appendChild(msg);

    document.getElementById('playAgainBtn').onclick = () => {
        location.reload();
    };

    if (window.confetti) {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
        });
    }
}

// Mooie verlies-popup
function showLoseMessage() {
    const oldMsg = document.querySelector('.winMessage');
    if (oldMsg) oldMsg.remove();

    const msg = document.createElement('div');
    msg.className = 'winMessage';
    msg.innerHTML = `
        <span class="icon">💥</span>
        <span>Helaas, je hebt verloren!</span>
        <button id="playAgainBtn">Opnieuw proberen</button>
    `;
    document.body.appendChild(msg);

    document.getElementById('playAgainBtn').onclick = () => {
        location.reload();
    };
}

easyBtn.onclick = () => init('easy');
mediumBtn.onclick = () => init('medium');
hardBtn.onclick = () => init('hard');
restartBtn.onclick = () => location.reload();

init('easy');
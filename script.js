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
let currentLevel = 'easy';

let timerInterval = null;
let seconds = 0;
let gameStarted = false;
let isFirstClick = true;

const gameBoard = document.getElementById('gameBoard');
const easyBtn = document.getElementById('easyBtn');
const mediumBtn = document.getElementById('mediumBtn');
const hardBtn = document.getElementById('hardBtn');
const restartBtn = document.getElementById('restartBtn');
const winAudio = document.getElementById('winAudio');
const loseAudio = document.getElementById('loseAudio');

// Highscore functies
function loadHighscores() {
    const easyScore = localStorage.getItem('minesweeper-highscore-easy');
    const mediumScore = localStorage.getItem('minesweeper-highscore-medium');
    const hardScore = localStorage.getItem('minesweeper-highscore-hard');
    
    document.getElementById('highscore-easy').textContent = easyScore || '--';
    document.getElementById('highscore-medium').textContent = mediumScore || '--';
    document.getElementById('highscore-hard').textContent = hardScore || '--';
    
    return { easy: easyScore, medium: mediumScore, hard: hardScore };
}

function saveHighscore(level, time) {
    const key = `minesweeper-highscore-${level}`;
    const currentHighscore = localStorage.getItem(key);
    
    if (!currentHighscore || time < parseInt(currentHighscore)) {
        localStorage.setItem(key, time);
        loadHighscores();
        return true;
    }
    
    return false;
}

// Timer functies
function startTimer() {
    if (timerInterval) return;
    
    seconds = 0;
    gameStarted = true;
    document.getElementById('timeDisplay').textContent = seconds;
    
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('timeDisplay').textContent = seconds;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    gameStarted = false;
    document.getElementById('timeDisplay').textContent = seconds;
}

function init(size = 'easy') {
    currentLevel = size;
    const { rows: r, cols: c, mines: m } = boardSizes[size];
    rows = r;
    cols = c;
    mines = m;
    
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    revealed = Array.from({ length: rows }, () => Array(cols).fill(false));
    flagged = Array.from({ length: rows }, () => Array(cols).fill(false));
    
    gameOver = false;
    isFirstClick = true;
    
    resetTimer();
    document.getElementById('minesCount').textContent = mines;
    
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
                    let nx = x + dx;
                    let ny = y + dy;
                    if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
                        if (board[nx][ny] === 'M') count++;
                    }
                }
            }
            board[x][y] = count;
        }
    }
}

function renderBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 28px)`;
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 28px)`;
    
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            
            if (revealed[x][y]) {
                cell.classList.add('revealed');
                if (board[x][y] === 'M') {
                    cell.classList.add('mine');
                    cell.textContent = '💣';
                } else if (board[x][y] > 0) {
                    cell.classList.add('num');
                    cell.setAttribute('data-num', board[x][y]);
                    cell.textContent = board[x][y];
                }
            } else if (flagged[x][y]) {
                cell.classList.add('flagged');
                cell.textContent = '🚩';
            }
            
            cell.onclick = () => {
                if (!gameOver && !flagged[x][y]) {
                    if (!gameStarted) startTimer();
                    revealCell(x, y);
                }
            };
            
            cell.oncontextmenu = (e) => {
                e.preventDefault();
                if (!gameOver && !revealed[x][y]) {
                    flagged[x][y] = !flagged[x][y];
                    renderBoard();
                }
            };
            
            gameBoard.appendChild(cell);
        }
    }
}

function showQuickLoseMessage() {
    const msg = document.createElement('div');
    msg.className = 'winMessage';
    msg.style.padding = '20px 40px';
    msg.style.fontSize = '1.5rem';
    msg.innerHTML = `
        <span class="icon" style="font-size: 2.5rem;">💥</span>
        <span>Helaas! Probeer opnieuw</span>
    `;
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.remove();
    }, 1500);
}

function revealCell(x, y) {
    if (revealed[x][y] || flagged[x][y]) return;
    
    revealed[x][y] = true;
    
    if (board[x][y] === 'M') {
        stopTimer();
        
        if (isFirstClick && seconds <= 1) {
            isFirstClick = false;
            showAllMines();
            renderBoard();
            showQuickLoseMessage();
            
            setTimeout(() => {
                init(currentLevel);
            }, 900);
            return;
        }
        
        isFirstClick = false;
        showAllMines();
        loseAudio.play();
        showLoseMessage();
        gameOver = true;
        return;
    }
    
    isFirstClick = false;
    
    if (board[x][y] === 0) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let nx = x + dx;
                let ny = y + dy;
                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
                    revealCell(nx, ny);
                }
            }
        }
    }
    
    renderBoard();
    
    // Direct win check na renderen
    if (checkWin()) {
        stopTimer();
        winAudio.play();
        showWinMessage();
        gameOver = true;
    }
}

function showAllMines() {
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if (board[x][y] === 'M') {
                revealed[x][y] = true;
            }
        }
    }
    renderBoard();
}

function checkWin() {
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if (board[x][y] !== 'M' && !revealed[x][y]) {
                return false;
            }
        }
    }
    return true;
}

function showWinMessage() {
    // Verwijder oude berichten
    const oldMsg = document.querySelector('.winMessage');
    if (oldMsg) oldMsg.remove();
    
    const isNewRecord = saveHighscore(currentLevel, seconds);
    
    const msg = document.createElement('div');
    msg.className = 'winMessage';
    
    const newRecordText = isNewRecord 
        ? '<div class="new-record" style="color: #00b894; font-size: 1.1rem; margin-top: 8px;">🏆 NIEUW RECORD! 🏆</div>' 
        : '';
    
    msg.innerHTML = `
        <span class="icon">🎉</span>
        <span>Gefeliciteerd! Je hebt gewonnen!</span>
        <div class="time-result">Tijd: ${seconds} seconden</div>
        ${newRecordText}
        <button id="playAgainBtn">Opnieuw spelen</button>
    `;
    
    document.body.appendChild(msg);
    
    // Stijl de knop
    const playAgainBtn = document.getElementById('playAgainBtn');
    playAgainBtn.style.cssText = `
        margin-top: 12px;
        padding: 10px 24px;
        background: #43cea2;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
    `;
    
    playAgainBtn.onclick = () => {
        msg.remove();
        init(currentLevel);
    };
    
    if (window.confetti) {
        const particleCount = isNewRecord ? 200 : 120;
        const spread = isNewRecord ? 100 : 80;
        confetti({ 
            particleCount: particleCount, 
            spread: spread, 
            origin: { y: 0.6 } 
        });
    }
}

function showLoseMessage() {
    // Verwijder oude berichten
    const oldMsg = document.querySelector('.winMessage');
    if (oldMsg) oldMsg.remove();
    
    const msg = document.createElement('div');
    msg.className = 'winMessage';
    
    msg.innerHTML = `
        <span class="icon">💥</span>
        <span>Helaas, je hebt verloren!</span>
        <div class="time-result">Tijd: ${seconds} seconden</div>
        <button id="playAgainBtn">Opnieuw proberen</button>
    `;
    
    document.body.appendChild(msg);
    
    // Stijl de knop
    const playAgainBtn = document.getElementById('playAgainBtn');
    playAgainBtn.style.cssText = `
        margin-top: 12px;
        padding: 10px 24px;
        background: #43cea2;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
    `;
    
    playAgainBtn.onclick = () => {
        msg.remove();
        init(currentLevel);
    };
}

// Event listeners
easyBtn.onclick = () => init('easy');
mediumBtn.onclick = () => init('medium');
hardBtn.onclick = () => init('hard');
restartBtn.onclick = () => init(currentLevel);

// Initialisatie
loadHighscores();
init();
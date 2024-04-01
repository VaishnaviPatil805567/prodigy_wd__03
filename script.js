const board = document.getElementById('board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

let currentPlayer = 'X';
let cells = Array.from({ length: 9 }, () => null);
let gameActive = true;

function handleClick(index) {
    if (gameActive && !cells[index]) {
        cells[index] = currentPlayer;
        render();
        if (checkWinner(currentPlayer)) {
            endGame(`${currentPlayer} wins!`);
        } else if (checkDraw()) {
            endGame("It's a draw!");
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            message.textContent = `Player ${currentPlayer}'s turn`;
            if (currentPlayer === 'O') {
           
                setTimeout(() => {
                    const bestMove = getBestMove();
                    handleClick(bestMove);
                }, 500);
            }
        }
    }
}

function minimax(depth, maximizingPlayer) {
    if (checkWinner('X')) {
        return -10 + depth;
    } else if (checkWinner('O')) {
        return 10 - depth;
    } else if (checkDraw()) {
        return 0;
    }

    if (maximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i]) {
                cells[i] = 'O';
                bestScore = Math.max(bestScore, minimax(depth + 1, false));
                cells[i] = null;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i]) {
                cells[i] = 'X';
                bestScore = Math.min(bestScore, minimax(depth + 1, true));
                cells[i] = null;
            }
        }
        return bestScore;
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < cells.length; i++) {
        if (!cells[i]) {
            cells[i] = 'O';
            let score = minimax(0, false);
            cells[i] = null;
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}


function render() {
    board.innerHTML = '';
    cells.forEach((cell, index) => {
        const cellElem = document.createElement('div');
        cellElem.classList.add('cell');
        cellElem.textContent = cell || '';
        cellElem.addEventListener('click', () => handleClick(index));
        board.appendChild(cellElem);
    });
}

function checkWinner(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]            
    ];

    return winPatterns.some(pattern => {
        return pattern.every(pos => cells[pos] === player);
    });
}

function checkDraw() {
    return cells.every(cell => cell !== null);
}

function endGame(messageText) {
    message.textContent = messageText;
    gameActive = false;
}

function restartGame() {
    cells = Array.from({ length: 9 }, () => null);
    currentPlayer = 'X';
    gameActive = true;
    render();
    message.textContent = `Player ${currentPlayer}'s turn`;
}

restartBtn.addEventListener('click', restartGame);

render();


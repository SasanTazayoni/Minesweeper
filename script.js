const boardSizeOptions = {
    small: 9,
    medium: 12,
    large: 15
};

const difficultyOptions = {
    easy: 0.1,
    medium: 0.2,
    hard: 0.3
};

let boardSize = boardSizeOptions.medium;
let currentDifficulty = 'easy';
let numberOfMines = Math.floor(boardSize * boardSize * difficultyOptions[currentDifficulty]);
const boardElement = document.querySelector(".board");
const minesLeft = document.querySelector(".subtext");
const gameModal = document.getElementById("gameModal");
const boardSizeSelector = document.querySelector('.board-size-selector');
const difficultySelector = document.querySelector('.game-difficulty-selector');
const tiles = [];
let flaggedCount = 0;
let gameOver = false;

function updateMinesLeft(count) {
    minesLeft.textContent = `Mines Left: ${count}`;
}

function createBoard() {
    boardElement.innerHTML = '';
    tiles.length = 0;
    boardElement.style.setProperty('--size', boardSize);
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.dataset.status = "hidden";
            tile.dataset.row = i;
            tile.dataset.col = j;
            boardElement.appendChild(tile);
            tiles.push(tile);
        }
    }
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < numberOfMines) {
        const index = Math.floor(Math.random() * tiles.length);
        const tile = tiles[index];
        if (tile.dataset.mine !== "true") {
            tile.dataset.mine = "true";
            minesPlaced++;
        }
    }
}

function resetGame() {
    gameOver = false;
    flaggedCount = 0;
    updateMinesLeft(numberOfMines);
    createBoard();
    placeMines();
    gameModal.style.display = "none";
}

boardElement.addEventListener("contextmenu", e => {
    e.preventDefault();
    if (gameOver) return;
    
    const tile = e.target;
    if (tile.classList.contains("tile")) {
        if (tile.dataset.status === "hidden") {
            tile.dataset.status = "flagged";
            flaggedCount++;
            updateMinesLeft(numberOfMines - flaggedCount);
        } else if (tile.dataset.status === "flagged") {
            tile.dataset.status = "hidden";
            flaggedCount--;
            updateMinesLeft(numberOfMines - flaggedCount);
        }
    }
});

boardElement.addEventListener("click", e => {
    if (gameOver) return;

    const tile = e.target;
    if (tile.classList.contains("tile")) {
        if (tile.dataset.status === "flagged") {
            return;
        }
        if (tile.dataset.mine === "true") {
            tile.dataset.status = "mine";
            revealAllMines();
            updateGameStatus('lose');
        } else {
            revealTile(tile);
            const unrevealedTiles = tiles.filter(tile =>
                tile.dataset.status === "hidden" && tile.dataset.mine !== "true"
            );
            if (unrevealedTiles.length === 0) {
                updateGameStatus('win');
            }
        }
    }
});

function revealTile(tile) {
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);
    
    if (tile.dataset.status !== "hidden" || tile.dataset.mine === "true") {
        return;
    }

    tile.dataset.status = "number";
    const adjacentTiles = getAdjacentTiles(row, col);

    const mineCount = adjacentTiles.filter(adjTile => adjTile.dataset.mine === "true").length;
    if (mineCount > 0) {
        tile.textContent = mineCount;
    } else {
        adjacentTiles.forEach(adjTile => revealTile(adjTile));
    }
}

function getAdjacentTiles(row, col) {
    const adjacentTiles = [];

    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
                const adjTile = tiles.find(t => t.dataset.row == i && t.dataset.col == j);
                if (adjTile && !(i === row && j === col)) {
                    adjacentTiles.push(adjTile);
                }
            }
        }
    }

    return adjacentTiles;
}

function revealAllMines() {
    tiles.forEach(tile => {
        if (tile.dataset.mine === "true") {
            tile.dataset.status = "mine";
        }
    });
}

function updateGameStatus(condition) {
    const modalMessage = document.getElementById("modalMessage");

    if (condition === 'lose') {
        modalMessage.textContent = "You Lose!";
    } else if (condition === 'win') {
        modalMessage.textContent = "You Win!";
    }

    gameModal.style.display = "block";
    gameOver = true;
}

document.getElementById("replayButton").addEventListener("click", resetGame);

document.getElementById("closeButton").addEventListener("click", () => {
    gameModal.style.display = "none";
});

document.querySelector('[data-reset]').addEventListener("click", resetGame);

gameModal.addEventListener("click", (event) => {
    if (event.target === gameModal) {
        gameModal.style.display = "none";
    }
});

boardSizeSelector.addEventListener('click', e => {
    if (e.target.matches('[data-size]')) {
        const size = e.target.dataset.size;
        boardSize = boardSizeOptions[size];
        numberOfMines = Math.floor(boardSize * boardSize * difficultyOptions[currentDifficulty]);

        document.querySelectorAll('.board-size-selector [data-size]').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        boardElement.style.setProperty('--size', boardSize);
        resetGame();
    }
});

difficultySelector.addEventListener('click', e => {
    if (e.target.matches('[data-difficulty]')) {
        const difficulty = e.target.dataset.difficulty;
        currentDifficulty = difficulty;
        numberOfMines = Math.floor(boardSize * boardSize * difficultyOptions[difficulty]);

        document.querySelectorAll('.game-difficulty-selector [data-difficulty]').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        resetGame();
    }
});

createBoard();
placeMines();
updateMinesLeft(numberOfMines);
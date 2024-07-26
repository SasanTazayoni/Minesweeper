const boardSize = 12;
const numberOfMines = Math.floor(boardSize * boardSize * 0.1);
const boardElement = document.querySelector(".board");
const minesLeft = document.querySelector(".subtext");
const tiles = [];
let flaggedCount = 0;
let gameOver = false;
const modal = document.getElementById("gameModal");

function updateMinesLeft(count) {
    minesLeft.textContent = `Mines Left: ${count}`;
}

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

    modal.style.display = "block";
    gameOver = true;
}

function resetGame() {
    gameOver = false;
    flaggedCount = 0;
    updateMinesLeft(numberOfMines);
    tiles.forEach(tile => {
        tile.dataset.status = "hidden";
        tile.dataset.mine = "false";
        tile.textContent = "";
    });
    placeMines();
    modal.style.display = "none";
}

document.getElementById("replayButton").addEventListener("click", resetGame);

document.getElementById("closeButton").addEventListener("click", () => {
    modal.style.display = "none";
});

placeMines();
updateMinesLeft(numberOfMines);
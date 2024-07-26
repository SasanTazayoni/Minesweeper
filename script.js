const boardSize = 12;
const numberOfMines = Math.floor(boardSize * boardSize * 0.1);
const boardElement = document.querySelector(".board");
const minesLeft = document.querySelector(".subtext");
const tiles = [];
let flaggedCount = 0;
let gameOver = false;

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
            tile.dataset.status = "number";
            const unrevealedTiles = tiles.filter(tile => tile.dataset.status === "hidden" && tile.dataset.mine !== "true");
            if (unrevealedTiles.length === 0) {
                updateGameStatus('win');
            }
        }
    }
});

function revealAllMines() {
    tiles.forEach(tile => {
        if (tile.dataset.mine === "true") {
            tile.dataset.status = "mine";
        }
    });
}

function updateGameStatus(condition) {
    if (condition === 'lose') {
        console.log("Lose");
        gameOver = true;
    } else if (condition === 'win') {
        console.log("Win");
        gameOver = true;
    }
}

placeMines();
updateMinesLeft(numberOfMines);
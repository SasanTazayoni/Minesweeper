const boardSize = 12;
const numberOfMines = Math.floor(boardSize * boardSize * 0.1);
const boardElement = document.querySelector(".board");
const tiles = [];

boardElement.style.setProperty('--size', boardSize);

for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.status = "hidden";
        boardElement.appendChild(tile);
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

placeMines();
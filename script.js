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
    const tile = e.target;
    if (tile.classList.contains("tile")) {
        if (tile.dataset.status === "hidden") {
            tile.dataset.status = "flagged";
        } else if (tile.dataset.status === "flagged") {
            tile.dataset.status = "hidden";
        }
    }
});

boardElement.addEventListener("click", e => {
    const tile = e.target;
    if (tile.classList.contains("tile")) {
        if (tile.dataset.status === "flagged") {
            return;
        }
        if (tile.dataset.mine === "true") {
            console.log("Mine!");
            tile.dataset.status = "mine";
        } else {
            console.log("Number");
            tile.dataset.status = "number";
        }
    }
});

placeMines();
const boardSize = 12;
const boardElement = document.querySelector(".board");

boardElement.style.setProperty('--size', boardSize);

for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.status = "hidden";
        boardElement.appendChild(tile);
    }
}
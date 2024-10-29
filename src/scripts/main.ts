import "../assets/css/styles.css";

type BoardSize = "small" | "medium" | "large";
type Difficulty = "easy" | "medium" | "hard";

const boardSizeOptions: Record<BoardSize, number> = {
  small: 9,
  medium: 12,
  large: 15,
};

const difficultyOptions: Record<Difficulty, number> = {
  easy: 0.15,
  medium: 0.18,
  hard: 0.21,
};

let boardSize: number = boardSizeOptions.medium;
let currentDifficulty: Difficulty = "easy";
let numberOfMines: number = Math.floor(
  boardSize * boardSize * difficultyOptions[currentDifficulty]
);
const boardElement = document.querySelector<HTMLDivElement>(".board")!;
const minesLeft = document.querySelector<HTMLDivElement>(".subtext")!;
const infoIcon = document.querySelector<HTMLSpanElement>("#infoIcon")!;
const infoModal = document.querySelector<HTMLDivElement>("#infoModal")!;
const gameModal = document.querySelector<HTMLDivElement>("#gameModal")!;
const boardSizeSelector = document.querySelector<HTMLDivElement>(
  ".board-size-selector"
)!;
const difficultySelector = document.querySelector<HTMLDivElement>(
  ".game-difficulty-selector"
)!;
const tiles: HTMLDivElement[] = [];
let flaggedCount = 0;
let gameOver = false;
let gameModalTimeout: ReturnType<typeof setTimeout> | null = null;

function updateMinesLeft(count: number): void {
  minesLeft.textContent = `Radioactive rooms: ${count}`;
}

function createBoard(): void {
  boardElement.innerHTML = "";
  tiles.length = 0;
  boardElement.style.setProperty("--size", boardSize.toString());

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.dataset.status = "hidden";

      if (typeof i === "number" && typeof j === "number") {
        tile.dataset.row = i.toString();
        tile.dataset.col = j.toString();
      } else {
        console.error("Invalid row or column index:", i, j);
      }

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
  if (gameModalTimeout) {
    clearTimeout(gameModalTimeout);
    gameModalTimeout = null;
  }

  gameOver = false;
  flaggedCount = 0;
  updateMinesLeft(numberOfMines);
  createBoard();
  placeMines();
  gameModal.style.display = "none";
}

boardElement.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (gameOver) return;

  const tile = e.target as HTMLDivElement;
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

boardElement.addEventListener("click", (e) => {
  if (gameOver) return;

  const tile = e.target as HTMLDivElement;
  if (tile.classList.contains("tile")) {
    if (tile.dataset.status === "flagged") {
      return;
    }
    if (tile.dataset.mine === "true") {
      tile.dataset.status = "mine";
      revealAllMines();
      updateGameStatus("lose");
    } else {
      revealTile(tile);
      const unrevealedTiles = tiles.filter(
        (tile) =>
          tile.dataset.status === "hidden" && tile.dataset.mine !== "true"
      );
      if (unrevealedTiles.length === 0) {
        updateGameStatus("win");
      }
    }
  }
});

function revealTile(tile: HTMLDivElement): void {
  const rowValue = tile.dataset.row;
  const colValue = tile.dataset.col;

  if (typeof rowValue !== "string" || typeof colValue !== "string") return;

  const row = parseInt(rowValue);
  const col = parseInt(colValue);

  if (tile.dataset.status !== "hidden" || tile.dataset.mine === "true") {
    return;
  }

  tile.dataset.status = "number";
  const adjacentTiles = getAdjacentTiles(row, col);

  const mineCount = adjacentTiles.filter(
    (adjTile) => adjTile.dataset.mine === "true"
  ).length;

  if (mineCount > 0) {
    tile.textContent = mineCount.toString();
  } else {
    adjacentTiles.forEach((adjTile) => revealTile(adjTile));
  }
}

function getAdjacentTiles(row: number, col: number) {
  const adjacentTiles = [];

  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
        const adjTile = tiles.find((t) => {
          const rowValue = t.dataset.row;
          const colValue = t.dataset.col;

          if (typeof rowValue === "string" && typeof colValue === "string") {
            return parseInt(rowValue) === i && parseInt(colValue) === j;
          }
        });
        if (adjTile && !(i === row && j === col)) {
          adjacentTiles.push(adjTile);
        }
      }
    }
  }

  return adjacentTiles;
}

function revealAllMines() {
  tiles.forEach((tile) => {
    if (tile.dataset.mine === "true") {
      tile.dataset.status = "mine";
    }
  });
}

function updateGameStatus(condition: string) {
  const modalMessage = document.querySelector<HTMLDivElement>("#modalMessage")!;

  if (condition === "lose") {
    modalMessage.textContent = "You Lose!";
  } else if (condition === "win") {
    modalMessage.textContent = "You Win!";
  }

  gameOver = true;
  showGameModal();
}

function showGameModal() {
  gameModalTimeout = setTimeout(() => {
    gameModal.style.display = "flex";
  }, 1500);
}

document
  .querySelector<HTMLButtonElement>("#replayButton")
  ?.addEventListener("click", resetGame);

document
  .querySelector<HTMLButtonElement>("#closeButton")
  ?.addEventListener("click", () => {
    const gameModal = document.querySelector<HTMLDivElement>("#gameModal");
    if (gameModal) {
      gameModal.style.display = "none";
    }
  });

document
  .querySelector<HTMLButtonElement>("#okButton")
  ?.addEventListener("click", () => {
    const infoModal = document.querySelector<HTMLDivElement>("#infoModal");
    if (infoModal && infoModal.style.display === "flex") {
      infoModal.style.display = "none";
    }
  });

document
  .querySelector<HTMLButtonElement>("[data-reset]")!
  .addEventListener("click", resetGame);

gameModal.addEventListener("click", (e) => {
  if (e.target === gameModal) {
    gameModal.style.display = "none";
  }
});

infoIcon.addEventListener("click", () => {
  infoModal.style.display = "flex";
});

infoModal.addEventListener("click", (e) => {
  if (e.target === infoModal) {
    infoModal.style.display = "none";
  }
});

boardSizeSelector.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  if (target.matches("[data-size]")) {
    const size = target.dataset.size as keyof typeof boardSizeOptions;
    boardSize = boardSizeOptions[size];
    numberOfMines = Math.floor(
      boardSize * boardSize * difficultyOptions[currentDifficulty]
    );

    document
      .querySelectorAll(".board-size-selector [data-size]")
      .forEach((btn) => {
        btn.classList.remove("active");
      });
    target.classList.add("active");

    boardElement.style.setProperty("--size", boardSize.toString());
    resetGame();
  }
});

difficultySelector.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  if (!target.matches("[data-difficulty]")) {
    return;
  } else {
    const difficulty = target.dataset.difficulty as Difficulty;
    currentDifficulty = difficulty;

    numberOfMines = Math.floor(
      boardSize * boardSize * difficultyOptions[difficulty]
    );

    document
      .querySelectorAll(".game-difficulty-selector [data-difficulty]")
      .forEach((btn) => {
        btn.classList.remove("active");
      });
    target.classList.add("active");

    resetGame();
  }
});

createBoard();
placeMines();
updateMinesLeft(numberOfMines);

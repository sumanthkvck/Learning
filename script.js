const configs = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const flagsEl = document.getElementById("flags-left");
const timeEl = document.getElementById("time");
const difficultyEl = document.getElementById("difficulty");
const newGameBtn = document.getElementById("new-game");

let state = null;

function startGame() {
  const { rows, cols, mines } = configs[difficultyEl.value];
  clearInterval(state?.timerId);

  state = {
    rows,
    cols,
    mines,
    board: Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        mine: false,
        revealed: false,
        flagged: false,
        adjacent: 0,
      }))
    ),
    firstClick: true,
    over: false,
    flagsLeft: mines,
    revealedCount: 0,
    elapsed: 0,
    timerId: null,
  };

  flagsEl.textContent = String(state.flagsLeft);
  timeEl.textContent = "0";
  statusEl.textContent = "In progress";

  renderBoard();
}

function renderBoard() {
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = `repeat(${state.cols}, min-content)`;

  state.board.forEach((row, r) => {
    row.forEach((cell, c) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "cell";
      el.dataset.row = String(r);
      el.dataset.col = String(c);
      el.setAttribute("role", "gridcell");
      el.addEventListener("click", onLeftClick);
      el.addEventListener("contextmenu", onRightClick);
      boardEl.appendChild(el);
      paintCell(el, cell);
    });
  });
}

function paintCell(el, cell) {
  el.classList.toggle("revealed", cell.revealed);
  el.classList.toggle("mine", cell.mine);
  el.dataset.value = String(cell.adjacent);

  if (cell.revealed) {
    if (cell.mine) {
      el.textContent = "💣";
      return;
    }
    el.textContent = cell.adjacent > 0 ? String(cell.adjacent) : "";
    return;
  }

  el.textContent = cell.flagged ? "🚩" : "";
}

function onLeftClick(e) {
  if (state.over) return;
  const row = Number(e.currentTarget.dataset.row);
  const col = Number(e.currentTarget.dataset.col);
  const cell = state.board[row][col];

  if (cell.revealed || cell.flagged) return;

  if (state.firstClick) {
    layMines(row, col);
    computeAdjacents();
    state.firstClick = false;
    state.timerId = setInterval(() => {
      state.elapsed += 1;
      timeEl.textContent = String(state.elapsed);
    }, 1000);
  }

  reveal(row, col);
  refreshBoard();
  checkWin();
}

function onRightClick(e) {
  e.preventDefault();
  if (state.over) return;
  const row = Number(e.currentTarget.dataset.row);
  const col = Number(e.currentTarget.dataset.col);
  const cell = state.board[row][col];

  if (cell.revealed) return;

  if (cell.flagged) {
    cell.flagged = false;
    state.flagsLeft += 1;
  } else if (state.flagsLeft > 0) {
    cell.flagged = true;
    state.flagsLeft -= 1;
  }

  flagsEl.textContent = String(state.flagsLeft);
  paintCell(e.currentTarget, cell);
}

function layMines(safeRow, safeCol) {
  let placed = 0;
  while (placed < state.mines) {
    const r = Math.floor(Math.random() * state.rows);
    const c = Math.floor(Math.random() * state.cols);
    const isSafe = r === safeRow && c === safeCol;
    if (!isSafe && !state.board[r][c].mine) {
      state.board[r][c].mine = true;
      placed += 1;
    }
  }
}

function neighbors(row, col) {
  const result = [];
  for (let r = row - 1; r <= row + 1; r += 1) {
    for (let c = col - 1; c <= col + 1; c += 1) {
      if (r === row && c === col) continue;
      if (r >= 0 && c >= 0 && r < state.rows && c < state.cols) {
        result.push([r, c]);
      }
    }
  }
  return result;
}

function computeAdjacents() {
  for (let r = 0; r < state.rows; r += 1) {
    for (let c = 0; c < state.cols; c += 1) {
      if (state.board[r][c].mine) continue;
      state.board[r][c].adjacent = neighbors(r, c).filter(
        ([nr, nc]) => state.board[nr][nc].mine
      ).length;
    }
  }
}

function reveal(row, col) {
  const stack = [[row, col]];

  while (stack.length) {
    const [r, c] = stack.pop();
    const cell = state.board[r][c];

    if (cell.revealed || cell.flagged) continue;

    cell.revealed = true;
    state.revealedCount += 1;

    if (cell.mine) {
      gameOver(false);
      return;
    }

    if (cell.adjacent === 0) {
      neighbors(r, c).forEach(([nr, nc]) => {
        const neighbor = state.board[nr][nc];
        if (!neighbor.revealed && !neighbor.mine) {
          stack.push([nr, nc]);
        }
      });
    }
  }
}

function gameOver(won) {
  state.over = true;
  clearInterval(state.timerId);
  statusEl.textContent = won ? "🎉 You won!" : "💥 Game over";

  if (!won) {
    for (let r = 0; r < state.rows; r += 1) {
      for (let c = 0; c < state.cols; c += 1) {
        const cell = state.board[r][c];
        if (cell.mine) cell.revealed = true;
      }
    }
  }

  refreshBoard();
}

function checkWin() {
  const safeCells = state.rows * state.cols - state.mines;
  if (!state.over && state.revealedCount >= safeCells) {
    gameOver(true);
  }
}

function refreshBoard() {
  const cells = boardEl.querySelectorAll(".cell");
  cells.forEach((el) => {
    const row = Number(el.dataset.row);
    const col = Number(el.dataset.col);
    paintCell(el, state.board[row][col]);
  });
}

newGameBtn.addEventListener("click", startGame);

difficultyEl.addEventListener("change", startGame);

startGame();

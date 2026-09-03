(() => {
  const SIZE = 4;
  const SOLVED = Array.from({ length: SIZE * SIZE }, (_, i) => (i + 1) % (SIZE * SIZE));

  const boardEl = document.getElementById("board");
  const statusTextEl = document.getElementById("statusText");
  const moveCountEl = document.getElementById("moveCount");
  const timerEl = document.getElementById("timer");
  const newGameBtn = document.getElementById("newGameBtn");
  const restartBtn = document.getElementById("restartBtn");

  let board = [...SOLVED];
  let initialBoard = [...SOLVED];
  let moves = 0;
  let seconds = 0;
  let timerId = null;
  let gameWon = false;

  function formatTime(totalSeconds) {
    const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const ss = String(totalSeconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function updateStats() {
    moveCountEl.textContent = String(moves);
    timerEl.textContent = formatTime(seconds);
  }

  function setStatus(message, solved = false) {
    statusTextEl.textContent = message;
    document.querySelector(".status-panel").classList.toggle("solved", solved);
  }

  function indexToPosition(index) {
    return { row: Math.floor(index / SIZE), col: index % SIZE };
  }

  function isAdjacent(i, j) {
    const a = indexToPosition(i);
    const b = indexToPosition(j);
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
  }

  function getValidMoveIndices(state) {
    const empty = state.indexOf(0);
    return state
      .map((_, index) => index)
      .filter((index) => index !== empty && isAdjacent(index, empty));
  }

  function isSolved(state) {
    return state.every((value, index) => value === SOLVED[index]);
  }

  function drawBoard() {
    boardEl.innerHTML = "";

    board.forEach((value, index) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile";
      tile.setAttribute("role", "gridcell");

      if (value === 0) {
        tile.classList.add("empty");
        tile.setAttribute("aria-label", "Empty space");
        tile.disabled = true;
      } else {
        tile.textContent = String(value);
        tile.setAttribute("aria-label", `Tile ${value}`);
        tile.addEventListener("click", () => attemptMove(index));
      }

      boardEl.appendChild(tile);
    });
  }

  function startTimer() {
    if (timerId || gameWon) return;

    timerId = window.setInterval(() => {
      seconds += 1;
      updateStats();
    }, 1000);
  }

  function stopTimer() {
    if (!timerId) return;
    window.clearInterval(timerId);
    timerId = null;
  }

  function shuffleBoard(steps = 200) {
    let state = [...SOLVED];
    let previousEmpty = -1;

    for (let i = 0; i < steps; i += 1) {
      const empty = state.indexOf(0);
      let candidates = getValidMoveIndices(state);

      if (previousEmpty !== -1) {
        candidates = candidates.filter((candidate) => candidate !== previousEmpty);
      }

      const picked = candidates[Math.floor(Math.random() * candidates.length)] ?? getValidMoveIndices(state)[0];
      [state[empty], state[picked]] = [state[picked], state[empty]];
      previousEmpty = empty;
    }

    if (isSolved(state)) {
      [state[state.length - 1], state[state.length - 2]] = [state[state.length - 2], state[state.length - 1]];
    }

    return state;
  }

  function checkWin() {
    if (!isSolved(board)) return;

    gameWon = true;
    stopTimer();
    setStatus(`Solved in ${moves} moves and ${formatTime(seconds)}!`, true);
  }

  function attemptMove(index) {
    if (gameWon) return;

    const empty = board.indexOf(0);
    if (!isAdjacent(index, empty)) {
      setStatus("Invalid move. Pick a tile next to the empty space.");
      return;
    }

    startTimer();
    [board[index], board[empty]] = [board[empty], board[index]];
    moves += 1;
    updateStats();
    drawBoard();

    checkWin();
    if (!gameWon) {
      setStatus("Keep going — you can solve it!");
    }
  }

  function startNewGame() {
    board = shuffleBoard();
    initialBoard = [...board];
    moves = 0;
    seconds = 0;
    gameWon = false;
    stopTimer();
    updateStats();
    drawBoard();
    setStatus("New game started. Good luck!");
  }

  function restartGame() {
    board = [...initialBoard];
    moves = 0;
    seconds = 0;
    gameWon = false;
    stopTimer();
    updateStats();
    drawBoard();
    setStatus("Puzzle reset to the current game's starting layout.");
  }

  newGameBtn.addEventListener("click", startNewGame);
  restartBtn.addEventListener("click", restartGame);

  drawBoard();
  updateStats();
})();

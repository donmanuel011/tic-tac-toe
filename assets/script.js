let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let xScore = 0;
let oScore = 0;

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

cells.forEach((cell) => {
  cell.addEventListener("click", () => handleClick(cell));
});

function updateScoreboard() {
  const scoreboard = document.getElementById("scoreboard");
  if (scoreboard) {
    scoreboard.innerHTML = `<span class="fw-bold">X</span>: ${xScore} &nbsp; | &nbsp; <span class="fw-bold">O</span>: ${oScore}`;
  }
}

function showWinnerModal(winner) {
  const modalBody = document.getElementById("winnerModalBody");
  modalBody.textContent = `${winner} wins the game! 🏆`;
  const winnerModalEl = document.getElementById("winnerModal");
  const winnerModal = new bootstrap.Modal(winnerModalEl);
  winnerModal.show();

  winnerModalEl.addEventListener("hidden.bs.modal", function handler() {
    resetScoreboard();
    resetGame();
    winnerModalEl.removeEventListener("hidden.bs.modal", handler);
  });
}

function setCursorForTurn() {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("cells-hover-x", "cells-hover-o");
    if (cell.textContent === "") {
      cell.onmouseenter = () => {
        cell.classList.add(
          currentPlayer === "X" ? "cells-hover-x" : "cells-hover-o"
        );
      };
      cell.onmouseleave = () => {
        cell.classList.remove("cells-hover-x", "cells-hover-o");
      };
    } else {
      cell.onmouseenter = null;
      cell.onmouseleave = null;
      cell.style.cursor = "default";
    }
  });
}

function handleClick(cell) {
  const index = cell.getAttribute("data-index");

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;

  if (checkWinner()) {
    if (statusText)
      statusText.textContent = `${currentPlayer} earns a point! 🎉`;
    gameActive = false;
    setTimeout(() => {
      resetGame();
      setCursorForTurn();
    }, 1300);
    if (currentPlayer === "X") xScore++;
    else oScore++;
    updateScoreboard();
    if (xScore === 5 || oScore === 5) {
      showWinnerModal(currentPlayer);
    }
    return;
  }

  if (board.every((cell) => cell !== "")) {
    if (statusText) statusText.textContent = "It's a draw!";
    gameActive = false;
    setTimeout(() => {
      resetGame();
      setCursorForTurn();
    }, 1300);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (statusText) statusText.textContent = `${currentPlayer}'s turn`;
  setCursorForTurn();
}

function checkWinner() {
  return winningCombos.some((combo) => {
    return combo.every((index) => board[index] === currentPlayer);
  });
}

function resetScoreboard() {
  xScore = 0;
  oScore = 0;
  updateScoreboard();
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  if (statusText) statusText.textContent = "X's turn";
  cells.forEach((cell) => (cell.textContent = ""));
  setCursorForTurn();
}

setCursorForTurn();
updateScoreboard();

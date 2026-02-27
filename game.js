'use strict';

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
];

const state = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  gameOver: false,
  scores: { X: 0, O: 0, draws: 0 },
};

// DOM refs
const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const resetScoreBtn = document.getElementById('reset-score-btn');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const scoreDraws = document.getElementById('score-draws');

function renderBoard() {
  cells.forEach((cell, i) => {
    const val = state.board[i];
    cell.textContent = val || '';
    cell.className = 'cell';
    if (val) cell.classList.add('taken', val.toLowerCase());
  });
}

function updateStatus(msg, type = '') {
  statusEl.textContent = msg;
  statusEl.className = 'status' + (type ? ` ${type}` : '');
}

function updateScoreboard() {
  scoreX.textContent = state.scores.X;
  scoreO.textContent = state.scores.O;
  scoreDraws.textContent = state.scores.draws;
}

function checkWinner() {
  for (const [a, b, c] of WINNING_COMBOS) {
    if (
      state.board[a] &&
      state.board[a] === state.board[b] &&
      state.board[a] === state.board[c]
    ) {
      return { winner: state.board[a], combo: [a, b, c] };
    }
  }
  if (state.board.every(Boolean)) return { winner: null, combo: [] };
  return null;
}

function highlightWinningCells(combo) {
  combo.forEach(i => cells[i].classList.add('winning'));
}

function handleCellClick(e) {
  const idx = parseInt(e.currentTarget.dataset.index, 10);
  if (state.gameOver || state.board[idx]) return;

  state.board[idx] = state.currentPlayer;
  renderBoard();

  const result = checkWinner();

  if (result) {
    state.gameOver = true;
    if (result.winner) {
      highlightWinningCells(result.combo);
      state.scores[result.winner]++;
      updateScoreboard();
      updateStatus(`Player ${result.winner} wins! 🎉`, 'winner');
    } else {
      state.scores.draws++;
      updateScoreboard();
      updateStatus("It's a draw!", 'draw');
    }
  } else {
    state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Player ${state.currentPlayer}'s turn`);
  }
}

function restartGame() {
  state.board = Array(9).fill(null);
  state.currentPlayer = 'X';
  state.gameOver = false;
  renderBoard();
  updateStatus("Player X's turn");
}

function resetScore() {
  state.scores = { X: 0, O: 0, draws: 0 };
  updateScoreboard();
  restartGame();
}

// Events
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
resetScoreBtn.addEventListener('click', resetScore);

// Init
renderBoard();
updateStatus("Player X's turn");
updateScoreboard();

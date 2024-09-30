import promptSync from 'prompt-sync';
import chalk from 'chalk';

const prompt = promptSync();

console.log("Starting Tic-Tac-Toe Game...");

// Initialize the game board
let board = [
  [' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', ' ']
];

// Function to display the game board
function displayBoard() {
  console.log(chalk.yellow('  0 1 2'));
  board.forEach((row, index) => {
    console.log(chalk.yellow(index), row.map(cell => {
      if (cell === 'X') return chalk.blue(cell);
      if (cell === 'O') return chalk.red(cell);
      return cell;
    }).join('|'));
  });
}

// Function to make a move
function makeMove(player) {
  let row, col;
  if (player === 'X') {
    while (true) {
      row = parseInt(prompt(`Player ${player}, enter row (0, 1, 2): `));
      col = parseInt(prompt(`Player ${player}, enter column (0, 1, 2): `));
      if (row >= 0 && row < 3 && col >= 0 && col < 3 && board[row][col] === ' ') {
        board[row][col] = player;
        break;
      } else {
        console.log('Invalid move, try again.');
      }
    }
  } else {
    // Simple AI for computer move
    do {
      row = Math.floor(Math.random() * 3);
      col = Math.floor(Math.random() * 3);
    } while (board[row][col] !== ' ');
    console.log(`Computer ${player} moves to (${row}, ${col})`);
    board[row][col] = player;
  }
}

// Function to check for a win
function checkWin(player) {
  // Check rows, columns, and diagonals
  for (let i = 0; i < 3; i++) {
    if (board[i].every(cell => cell === player) || board.every(row => row[i] === player)) {
      return true;
    }
  }
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;
  return false;
}

// Function to check for a draw
function checkDraw() {
  return board.flat().every(cell => cell !== ' ');
}

// Main game loop
function playGame() {
  let currentPlayer = 'X';
  while (true) {
    displayBoard();
    makeMove(currentPlayer);
    if (checkWin(currentPlayer)) {
      displayBoard();
      console.log(`Player ${currentPlayer} wins!`);
      break;
    }
    if (checkDraw()) {
      displayBoard();
      console.log('The game is a draw!');
      break;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

// Start the game
playGame();
console.log("Game Over");

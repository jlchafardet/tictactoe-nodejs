import promptSync from 'prompt-sync';
import chalk from 'chalk';
import fs from 'fs';

const prompt = promptSync();
const scoreFile = 'score.json';

console.log("Starting Tic-Tac-Toe Game...");

// Initialize the game board
let board = [
  [' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', ' ']
];

// Function to display the game board
function displayBoard() {
  console.clear();
  console.log(chalk.yellow('  1 2 3'));
  board.forEach((row, index) => {
    console.log(chalk.yellow(index * 3 + 1), row.map(cell => {
      if (cell === 'X') return chalk.blue(cell);
      if (cell === 'O') return chalk.red(cell);
      return cell;
    }).join('|'));
  });
}

// Function to make a move
function makeMove(player, smartMode) {
  let position, row, col;
  if (player === 'X') {
    while (true) {
      position = parseInt(prompt(`Player ${player}, enter position (1-9): `));
      if (position >= 1 && position <= 9) {
        row = Math.floor((position - 1) / 3);
        col = (position - 1) % 3;
        if (board[row][col] === ' ') {
          board[row][col] = player;
          break;
        } else {
          console.log('Position already taken, try again.');
        }
      } else {
        console.log('Invalid position, try again.');
      }
    }
  } else {
    if (smartMode) {
      const bestMove = findBestMove();
      row = bestMove.row;
      col = bestMove.col;
    } else {
      do {
        position = Math.floor(Math.random() * 9) + 1;
        row = Math.floor((position - 1) / 3);
        col = (position - 1) % 3;
      } while (board[row][col] !== ' ');
    }
    console.log(`Computer ${player} moves to position ${row * 3 + col + 1}`);
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

// Function to reset the board
function resetBoard() {
  board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ];
}

// Function to read the score from the JSON file
function readScore() {
  if (!fs.existsSync(scoreFile)) {
    return { playerWins: 0, computerWins: 0, ties: 0 };
  }
  const data = fs.readFileSync(scoreFile);
  return JSON.parse(data);
}

// Function to write the score to the JSON file
function writeScore(score) {
  fs.writeFileSync(scoreFile, JSON.stringify(score, null, 2));
}

// Function to display the score
function displayScore(score) {
  console.log(chalk.green(`Player Wins: ${score.playerWins}`));
  console.log(chalk.hex('#FFA500')(`Computer Wins: ${score.computerWins}`));
  console.log(chalk.cyan(`Ties: ${score.ties}`));
}

// Minimax algorithm to find the best move
function minimax(board, depth, isMaximizing) {
  const scores = {
    'O': 10,
    'X': -10,
    'tie': 0
  };

  if (checkWin('O')) return scores['O'];
  if (checkWin('X')) return scores['X'];
  if (checkDraw()) return scores['tie'];

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === ' ') {
          board[i][j] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i][j] = ' ';
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === ' ') {
          board[i][j] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i][j] = ' ';
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

// Function to find the best move for the computer
function findBestMove() {
  let bestScore = -Infinity;
  let move = { row: -1, col: -1 };
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === ' ') {
        board[i][j] = 'O';
        let score = minimax(board, 0, false);
        board[i][j] = ' ';
        if (score > bestScore) {
          bestScore = score;
          move = { row: i, col: j };
        }
      }
    }
  }
  return move;
}

// Main game loop
function playGame(smartMode) {
  let currentPlayer = 'X';
  const score = readScore();
  while (true) {
    displayBoard();
    makeMove(currentPlayer, smartMode);
    if (checkWin(currentPlayer)) {
      displayBoard();
      if (currentPlayer === 'X') {
        console.log(chalk.green(`Player ${chalk.blue('Player')} wins!`));
        score.playerWins++;
      } else {
        console.log(chalk.hex('#FFA500')(`Player ${chalk.red('Computer')} wins!`)); // Custom orange color
        score.computerWins++;
      }
      break;
    }
    if (checkDraw()) {
      displayBoard();
      console.log(chalk.cyan('The game is a draw!'));
      score.ties++;
      break;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
  writeScore(score);
}

// Function to start the game and ask if the player wants to play again
function startGame() {
  while (true) {
    const smartMode = prompt('Do you want to play against a smart computer? (y/n): ').toLowerCase() === 'y';
    playGame(smartMode);
    const playAgain = prompt('Do you want to play again? (y/n): ').toLowerCase();
    if (playAgain !== 'y') {
      console.log("Thanks for playing!");
      const score = readScore();
      displayScore(score);
      break;
    }
    resetBoard();
  }
}

// Start the game
startGame();
console.log("Game Over");
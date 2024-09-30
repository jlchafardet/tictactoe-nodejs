import promptSync from 'prompt-sync';
import chalk from 'chalk';
import fs from 'fs';

// Initialize the prompt-sync module to get user input
const prompt = promptSync();

// Define the file name where the score will be saved
const scoreFile = 'score.json';

console.log("Starting Tic-Tac-Toe Game...");

// Initialize the game board as a 3x3 grid filled with spaces
let board = [
  [' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', ' ']
];

// Function to display the game board
function displayBoard() {
  // Clear the console screen
  console.clear();
  // Print the column numbers in yellow
  console.log(chalk.yellow('  1 2 3'));
  // Print each row of the board
  board.forEach((row, index) => {
    // Print the row number in yellow and the cells in their respective colors
    console.log(chalk.yellow(index * 3 + 1), row.map(cell => {
      if (cell === 'X') return chalk.blue(cell); // Player's move in blue
      if (cell === 'O') return chalk.red(cell);  // Computer's move in red
      return cell; // Empty cell
    }).join('|'));
  });
}

// Function to make a move
function makeMove(player, smartMode) {
  let position, row, col;
  if (player === 'X') {
    // Player's turn
    while (true) {
      // Ask the player to enter a position (1-9)
      position = parseInt(prompt(`Player ${player}, enter position (1-9): `));
      // Check if the position is valid
      if (position >= 1 && position <= 9) {
        // Convert the position to row and column indices
        row = Math.floor((position - 1) / 3);
        col = (position - 1) % 3;
        // Check if the cell is empty
        if (board[row][col] === ' ') {
          // Place the player's move on the board
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
    // Computer's turn
    if (smartMode) {
      // If smart mode is enabled, find the best move using the Minimax algorithm
      const bestMove = findBestMove();
      row = bestMove.row;
      col = bestMove.col;
    } else {
      // If smart mode is not enabled, make a random move
      do {
        position = Math.floor(Math.random() * 9) + 1;
        row = Math.floor((position - 1) / 3);
        col = (position - 1) % 3;
      } while (board[row][col] !== ' ');
    }
    console.log(`Computer ${player} moves to position ${row * 3 + col + 1}`);
    // Place the computer's move on the board
    board[row][col] = player;
  }
}

// Function to check if a player has won
function checkWin(player) {
  // Check rows, columns, and diagonals for a win
  for (let i = 0; i < 3; i++) {
    if (board[i].every(cell => cell === player) || board.every(row => row[i] === player)) {
      return true;
    }
  }
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;
  return false;
}

// Function to check if the game is a draw
function checkDraw() {
  // Check if all cells are filled
  return board.flat().every(cell => cell !== ' ');
}

// Function to reset the board
function resetBoard() {
  // Reset the board to its initial state
  board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ];
}

// Function to read the score from the JSON file
function readScore() {
  // Check if the score file exists
  if (!fs.existsSync(scoreFile)) {
    // If not, return default scores
    return { playerWins: 0, computerWins: 0, ties: 0 };
  }
  // Read the score file and parse the JSON data
  const data = fs.readFileSync(scoreFile);
  return JSON.parse(data);
}

// Function to write the score to the JSON file
function writeScore(score) {
  // Write the score data to the file in JSON format
  fs.writeFileSync(scoreFile, JSON.stringify(score, null, 2));
}

// Function to display the score
function displayScore(score) {
  // Print the scores in their respective colors
  console.log(chalk.green(`Player Wins: ${score.playerWins}`));
  console.log(chalk.hex('#FFA500')(`Computer Wins: ${score.computerWins}`));
  console.log(chalk.cyan(`Ties: ${score.ties}`));
}

// Minimax algorithm to find the best move
function minimax(board, depth, isMaximizing) {
  // Define the scores for each outcome
  const scores = {
    'O': 10,
    'X': -10,
    'tie': 0
  };

  // Check for terminal states (win, lose, draw)
  if (checkWin('O')) return scores['O'];
  if (checkWin('X')) return scores['X'];
  if (checkDraw()) return scores['tie'];

  if (isMaximizing) {
    // Maximizing player (computer)
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
    // Minimizing player (human)
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
    // Ask the player if they want to play against a smart computer
    const smartMode = prompt('Do you want to play against a smart computer? (y/n): ').toLowerCase() === 'y';
    playGame(smartMode);
    // Ask the player if they want to play again
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
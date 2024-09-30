# Tic-Tac-Toe Game

This is a command-line Tic-Tac-Toe game implemented in Node.js. The game allows a player to play against the computer, with an option to play against a smart computer using the Minimax algorithm. The game also keeps track of the scores in a JSON file.

## How to Run the Game

1. **Install Node.js**: Make sure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

2. **Install Dependencies**: Navigate to the project directory and install the required dependencies using npm:

   ```sh
   npm install prompt-sync chalk
   ```

3. **Run the Game**: Execute the game script using Node.js:

   ```sh
   node tic-tac-toe.mjs
   ```

## How the Game Works

### Game Initialization

- The game starts by initializing a 3x3 game board filled with spaces.
- The game board is displayed in the console with column numbers in yellow and cells in their respective colors (blue for player moves and red for computer moves).

### Player and Computer Moves

- The player is prompted to enter a position (1-9) to make a move.
- The computer can either make a random move or use the Minimax algorithm to make the best possible move if smart mode is enabled.

### Win and Draw Conditions

- The game checks for win conditions by examining rows, columns, and diagonals.
- If all cells are filled and no player has won, the game is declared a draw.

### Score Tracking

- The game keeps track of the scores (wins, losses, and ties) in a JSON file (`score.json`).
- The scores are updated after each game and displayed when the player decides to exit the game.

### Smart Computer Mode

- The player is asked if they want to play against a smart computer.
- If smart mode is enabled, the computer uses the Minimax algorithm to evaluate the best move.

## Code Explanation

### Imports and Initialization

```javascript
import promptSync from 'prompt-sync';
import chalk from 'chalk';
import fs from 'fs';

const prompt = promptSync();
const scoreFile = 'score.json';

console.log("Starting Tic-Tac-Toe Game...");
```

- `prompt-sync`: A module to get user input from the console.
- `chalk`: A module to add colors to the console output.
- `fs`: A module to interact with the file system.
- `prompt`: Initializes the `prompt-sync` module.
- `scoreFile`: The name of the file where the score will be saved.

### Game Board Initialization

```javascript
let board = [
  [' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', ' ']
];
```

- `board`: A 3x3 grid initialized with spaces to represent the empty game board.

### Display Board

```javascript
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
```

- `displayBoard()`: Clears the console and prints the current state of the game board with colored cells.

### Make Move

```javascript
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
```

- `makeMove(player, smartMode)`: Handles the move for both the player and the computer. If `smartMode` is enabled, the computer uses the Minimax algorithm to make its move.

### Check Win

```javascript
function checkWin(player) {
  for (let i = 0; i < 3; i++) {
    if (board[i].every(cell => cell === player) || board.every(row => row[i] === player)) {
      return true;
    }
  }
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;
  return false;
}
```

- `checkWin(player)`: Checks if the specified player has won by examining rows, columns, and diagonals.

### Check Draw

```javascript
function checkDraw() {
  return board.flat().every(cell => cell !== ' ');
}
```

- `checkDraw()`: Checks if the game is a draw by verifying if all cells are filled.

### Reset Board

```javascript
function resetBoard() {
  board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ];
}
```

- `resetBoard()`: Resets the game board to its initial state.

### Read and Write Score

```javascript
function readScore() {
  if (!fs.existsSync(scoreFile)) {
    return { playerWins: 0, computerWins: 0, ties: 0 };
  }
  const data = fs.readFileSync(scoreFile);
  return JSON.parse(data);
}

function writeScore(score) {
  fs.writeFileSync(scoreFile, JSON.stringify(score, null, 2));
}
```

- `readScore()`: Reads the score from the `score.json` file. If the file doesn't exist, it returns default scores.
- `writeScore(score)`: Writes the score to the `score.json` file in JSON format.

### Display Score

```javascript
function displayScore(score) {
  console.log(chalk.green(`Player Wins: ${score.playerWins}`));
  console.log(chalk.hex('#FFA500')(`Computer Wins: ${score.computerWins}`));
  console.log(chalk.cyan(`Ties: ${score.ties}`));
}
```

- `displayScore(score)`: Displays the scores in their respective colors.

### Minimax Algorithm

```javascript
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
```

- `minimax(board, depth, isMaximizing)`: Implements the Minimax algorithm to evaluate the best move for the computer.

### Find Best Move

```javascript
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
```

- `findBestMove()`: Uses the Minimax algorithm to find the best move for the computer.

### Main Game Loop

```javascript
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
```

- `playGame(smartMode)`: The main game loop that alternates between the player and the computer, checks for win/draw conditions, and updates the score.

### Start Game

```javascript
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
```

- `startGame()`: Starts the game, asks if the player wants to play against a smart computer, and if they want to play again after each game.

### Start the Game

```javascript
startGame();
console.log("Game Over");
```

- Calls the `startGame` function to begin the game.

## Conclusion

This Tic-Tac-Toe game provides a fun way to play against the computer, with an option to challenge a smart opponent using the Minimax algorithm. The game also keeps track of scores and displays them at the end of the session. Enjoy playing and improving your programming skills!

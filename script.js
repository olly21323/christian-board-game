
const boardSize = 30;
let players = [{ pos: 0, name: "Player 1" }, { pos: 0, name: "Player 2" }];
let currentPlayer = 0;

const faithCards = [
  { q: "What did Noah build?", a: "ark" },
  { q: "Who betrayed Jesus?", a: "judas" },
  { q: "First book of the Bible?", a: "genesis" }
];
const actionCards = [
  "You helped someone — move forward 2!",
  "You prayed for a friend — roll again!"
];
const temptationCards = [
  "You lied — move back 2.",
  "You were selfish — skip next turn."
];

let skipTurn = [false, false];

function createBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  for (let i = 0; i < boardSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.id = 'cell-' + i;
    board.appendChild(cell);
  }
  updatePlayers();
}

function updatePlayers() {
  document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = '');
  players.forEach((player, index) => {
    const piece = document.createElement('div');
    piece.classList.add(index === 0 ? 'player1' : 'player2');
    document.getElementById('cell-' + player.pos).appendChild(piece);
  });
}

function rollDice() {
  if (skipTurn[currentPlayer]) {
    document.getElementById('status').innerText = players[currentPlayer].name + " skips a turn!";
    skipTurn[currentPlayer] = false;
    currentPlayer = 1 - currentPlayer;
    return;
  }

  const roll = Math.floor(Math.random() * 6) + 1;
  document.getElementById('diceResult').innerText = players[currentPlayer].name + " rolled a " + roll;
  players[currentPlayer].pos += roll;
  if (players[currentPlayer].pos >= boardSize - 1) {
    players[currentPlayer].pos = boardSize - 1;
    updatePlayers();
    document.getElementById('status').innerText = players[currentPlayer].name + " reached Heaven! They win!";
    return;
  }

  updatePlayers();
  drawCard();

  currentPlayer = 1 - currentPlayer;
  document.getElementById('status').innerText = players[currentPlayer].name + "'s Turn";
}

function drawCard() {
  const type = ["faith", "action", "temptation"][Math.floor(Math.random() * 3)];
  if (type === "faith") {
    const card = faithCards[Math.floor(Math.random() * faithCards.length)];
    const answer = prompt(card.q);
    if (answer && answer.trim().toLowerCase() === card.a) {
      alert("Correct! Move ahead 1 space.");
      players[currentPlayer].pos = Math.min(players[currentPlayer].pos + 1, boardSize - 1);
    } else {
      alert("Incorrect. The answer was " + card.a + ".");
    }
  } else if (type === "action") {
    const msg = actionCards[Math.floor(Math.random() * actionCards.length)];
    alert("Action Card: " + msg);
    if (msg.includes("move forward")) {
      players[currentPlayer].pos = Math.min(players[currentPlayer].pos + 2, boardSize - 1);
    }
    if (msg.includes("roll again")) {
      currentPlayer = 1 - currentPlayer;
    }
  } else {
    const msg = temptationCards[Math.floor(Math.random() * temptationCards.length)];
    alert("Temptation Card: " + msg);
    if (msg.includes("move back")) {
      players[currentPlayer].pos = Math.max(players[currentPlayer].pos - 2, 0);
    }
    if (msg.includes("skip")) {
      skipTurn[currentPlayer] = true;
    }
  }
  updatePlayers();
}

createBoard();

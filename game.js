import promptSync from "prompt-sync";

export function playGame36(game) {
  initializeGame(game);
  addPlayers(game);
  if (game.enable) {
    getFirstPlayer(game);
    initPlayerOrderList(game);
    playersPlay(game);
  }
}

export function initializeGame(game) {
  game.players = [];
  game.enable = false;
  game.totalScore = 0;
  game.firstPlayer = null;
  game.playerIdOrder = null;
  game.winner = null;
}

export function addPlayers(game) {
  console.log(`Let's start by entering the names of the 6 players`);
  const prompt = promptSync();
  if (!game.enable) {
    while (game.players.length < 6) {
      const playersLength = game.players.length;
      let playerName = prompt(
        `📝 Enter name for player ${playersLength + 1}: `
      );
      playerName = playerName.charAt(0).toUpperCase() + playerName.slice(1);
      if (playerName === "") playerName = `Player ${playersLength + 1}`;
      addPlayer(game, playerName);
    }
    console.log(`"✅ We have the name of each player`);
    startGame(game);
  } else {
    throw new Error("Can not add player when the game has begin");
  }
}

export function addPlayer(game, name) {
  game.players.push({ id: game.players.length + 1, name });
}

export function startGame(game) {
  if (!game.enable) {
    if (game.players.length !== 6)
      throw new Error("Number of players must be 6");
    else game.enable = true;
  } else {
    throw new Error("Game already enable");
  }
}

export function playersPlay(game) {
  console.log(`🚀 Let's play ! 🚀`);
  while (game.totalScore <= 36 && game.playerIdOrder.length > 0) {
    playerPlay(game);
  }
}

export function playerPlay(game) {
  const prompt = promptSync();
  const player = game.players.find(
    (player) => player.id === game.playerIdOrder[0]
  );
  prompt(`➡️ ${player.name} : press Enter to roll the dice)`);
  const randomDice = rollDice();
  console.log(`🎲 ${player.name} rolled a ${randomDice}`);
  checkTotalScore(game, randomDice);
}

export function checkTotalScore(game, randomDice) {
  const player = game.players.find(
    (player) => player.id === game.playerIdOrder[0]
  );
  const tempTotalScore = game.totalScore + randomDice;
  console.log(
    `Adding the dice roll result of ${randomDice} to the total score of ${game.totalScore} gives ${tempTotalScore}`
  );
  if (tempTotalScore > 36) eliminatePlayer(game, player);
  else {
    game.totalScore += randomDice;
    if (game.totalScore === 36) {
      game.enable = false;
      game.playerIdOrder = [];
      game.winner = player.id;
      stopGameWithWinner(game);
    } else incrementeOrder(game);
  }
}

export function startNewGame(game) {
  const prompt = promptSync();
  const newGame = prompt(
    "Do you want to start a new game ? (y/n): "
  ).toLowerCase();
  if (newGame === "y") {
    playGame36(game);
  } else {
    console.log("👋 Goodbye 👋");
  }
}

export function getFirstPlayer(game) {
  console.log(
    "💡 To determine the first player who will start the game, all players must roll the dice"
  );
  console.log("💡 The player who gets the highest score will start the game");
  console.log(
    "💡 If the highest score is obtained by multiple players, those players must roll the dice again until a tie-breaker is achieved"
  );

  let firstPlayer = getPlayerWithHighestScore(
    game,
    game.players.map((player) => player.id)
  );

  while (firstPlayer.length > 1) {
    let names = "";
    const firstPlayerLength = firstPlayer.length;
    for (let i = 0; i < firstPlayerLength; i++) {
      const player = game.players.find(
        (player) => player.id === firstPlayer[i].id
      );
      if (i === firstPlayerLength - 1) {
        names += `and ${player.name}`;
      } else if (i === firstPlayerLength - 2) {
        names += `${player.name} `;
      } else {
        names += `${player.name}, `;
      }
    }
    console.log(`🔔 ${names} all achieved a score of ${firstPlayer[0].score}`);
    console.log(
      `🔔 ${names} each need to roll the dice again to break the tie`
    );

    firstPlayer = getPlayerWithHighestScore(
      game,
      firstPlayer.map((player) => player.id)
    );
  }

  const firstplayer = game.players.find(
    (player) => player.id === firstPlayer[0].id
  );
  console.log(
    `${firstplayer.name} with a ${firstPlayer[0].score}, has achieved the highest score`
  );
  console.log(`🏅 ${firstplayer.name} will be the first to play 🏅`);
  game.firstPlayer = firstplayer.id;
}

export function initPlayerOrderList(game) {
  const playerIdList = game.players.map((player) => player.id);
  const indexOfFirstPlayerId = playerIdList.indexOf(game.firstPlayer);
  const playerSpliced = playerIdList.splice(0, indexOfFirstPlayerId);
  playerIdList.push(...playerSpliced);
  game.playerIdOrder = playerIdList;
}

export function getPlayerWithHighestScore(game, playerIdlist) {
  const prompt = promptSync();
  const resultsOfRollDice = [];
  const playerListLength = playerIdlist.length;
  for (let i = 0; i < playerListLength; i++) {
    const currentPlayer = game.players.find(
      (player) => player.id === playerIdlist[i]
    );
    prompt(`➡️ ${currentPlayer.name} : press Enter to roll the dice`);
    const randomDice = rollDice();
    console.log(`🎲 ${currentPlayer.name} rolled a ${randomDice}`);
    resultsOfRollDice.push({
      id: currentPlayer.id,
      score: randomDice,
    });
  }

  const highestScore = resultsOfRollDice.reduce((hScore, player) => {
    return player.score > hScore ? player.score : hScore;
  }, 0);

  const playerWithHighestScore = resultsOfRollDice.filter(
    (player) => player.score === highestScore
  );

  return playerWithHighestScore;
}

export function eliminatePlayer(game, player) {
  console.log(`❌ ${player.name} is eliminated ❌`);
  game.playerIdOrder.shift();
  if (game.playerIdOrder.length === 0) {
    game.enable = false;
    game.totalScore = 0;
    game.playerIdOrder = [];
    stopGameWithoutWinner(game);
  }
}

export function incrementeOrder(game) {
  const currentPlayer = game.playerIdOrder[0];
  game.playerIdOrder.shift();
  game.playerIdOrder.push(currentPlayer);
}

export function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

export function stopGameWithoutWinner(game) {
  console.log("😞 Lost !!! 😞");
  console.log(`❌ All players have been eliminated ❌`);
  startNewGame(game);
}

export function stopGameWithWinner(game) {
  const player = game.players.find((player) => player.id === game.winner);
  console.log("🎉🎉 Won !!! 🎉🎉");
  console.log(`🏆 ${player.name} has won the game 🏆`);
  console.log(`💰 ${player.name} wins the jackpot of 36 gold coins 💰`);
  startNewGame(game);
}

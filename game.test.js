// game.test.js
import { describe, it, expect, vi } from "vitest";
import promptSync from "prompt-sync";
import {
  initializeGame,
  addPlayers,
  startGame,
  addPlayer,
  rollDice,
  initPlayerOrderList,
  playerPlay,
  checkTotalScore,
} from "./game";

vi.mock("prompt-sync");

describe("At Initialize game", () => {
  const game = {
    players: [
      { id: 1, name: "Laurent" },
      { id: 2, name: "Marie" },
      { id: 3, name: "Jerome" },
      { id: 4, name: "Lidia" },
      { id: 5, name: "David" },
      { id: 6, name: "Noemie" },
    ],
    enable: true,
    totalScore: 32,
    firstPlayer: 4,
    playerIdOrder: [4, 5, 6, 1, 2, 3],
    winner: null,
  };
  it("Game should init with init data", () => {
    initializeGame(game);
    expect(game.players).toEqual([]);
    expect(game.enable).toBe(false);
    expect(game.totalScore).toBe(0);
    expect(game.firstPlayer).toBe(null);
    expect(game.playerIdOrder).toBe(null);
  });
});

describe("At adding players", () => {
  it("At adding players, state of player length should be 6", () => {
    const prompt = vi.fn();
    promptSync.mockReturnValue(prompt);

    prompt
      .mockReturnValueOnce("Laurent")
      .mockReturnValueOnce("Caroline")
      .mockReturnValueOnce("Jerome")
      .mockReturnValueOnce("Marie")
      .mockReturnValueOnce("Jacques")
      .mockReturnValueOnce("Annie");

    const game = {
      players: [],
      enable: false,
      totalScore: 0,
      playerIdOrder: null,
    };

    addPlayers(game);
    expect(game.players.length).toBe(6);
    expect(game.players).toEqual([
      {
        id: 1,
        name: "Laurent",
      },
      {
        id: 2,
        name: "Caroline",
      },
      {
        id: 3,
        name: "Jerome",
      },
      {
        id: 4,
        name: "Marie",
      },
      {
        id: 5,
        name: "Jacques",
      },
      {
        id: 6,
        name: "Annie",
      },
    ]);
    expect(game.players.length).toBe(6);
  });

  it("At adding players, if name is empty, add dynamic player name", () => {
    const prompt = vi.fn();
    promptSync.mockReturnValue(prompt);

    prompt
      .mockReturnValueOnce("Laurent")
      .mockReturnValueOnce("")
      .mockReturnValueOnce("")
      .mockReturnValueOnce("Marie")
      .mockReturnValueOnce("Jacques")
      .mockReturnValueOnce("");

    const game = {
      players: [],
      enable: false,
      totalScore: 0,
      playerIdOrder: null,
    };

    addPlayers(game);
    expect(game.players.length).toBe(6);
    expect(game.players).toEqual([
      {
        id: 1,
        name: "Laurent",
      },
      {
        id: 2,
        name: "Player 2",
      },
      {
        id: 3,
        name: "Player 3",
      },
      {
        id: 4,
        name: "Marie",
      },
      {
        id: 5,
        name: "Jacques",
      },
      {
        id: 6,
        name: "Player 6",
      },
    ]);
  });

  it("Can_not_add_players_when_the_game_has_begin", () => {
    const prompt = vi.fn();
    promptSync.mockReturnValue(prompt);

    prompt
      .mockReturnValueOnce("Laurent")
      .mockReturnValueOnce("Caroline")
      .mockReturnValueOnce("Jerome")
      .mockReturnValueOnce("Marie")
      .mockReturnValueOnce("Jacques")
      .mockReturnValueOnce("Annie");

    const game = {
      players: [],
      enable: false,
      totalScore: 0,
      playerIdOrder: null,
    };

    addPlayers(game);
    expect(game.enable).toBe(true);
    expect(() => addPlayers(game)).toThrow(
      "Can not add player when the game has begin"
    );
  });
});

describe("At adding player", () => {
  it("At adding player, state of player should add player", () => {
    const game = {
      players: [],
      enable: false,
      totalScore: 0,
      playerIdOrder: null,
    };

    addPlayer(game, "Laurent");
    expect(game.players.length).toBe(1);
    expect(game.players[0].name).toBe("Laurent");
  });
});

describe("At starting game", () => {
  it("Game can not start with no player", () => {
    const game = {
      players: [],
      enable: false,
      totalScore: 0,
      playerIdOrder: null,
    };
    expect(() => startGame(game)).toThrow("Number of players must be 6");
    expect(game.enable).toBe(false);
  });

  it("Game can not start with less than 6 players", () => {
    const game = {
      players: [],
      enable: false,
      totalScore: 0,
      playerIdOrder: null,
    };

    addPlayer(game, "Laurent");
    addPlayer(game, "Caroline");
    addPlayer(game, "Jerome");
    addPlayer(game, "Marie");
    addPlayer(game, "Jacques");
    expect(() => startGame(game)).toThrow("Number of players must be 6");
    expect(game.enable).toBe(false);
  });

  it("Game can not start with more than 6 players", () => {
    const game = {
      players: [],
      enable: false,
      totalScore: 0,
      playerIdOrder: null,
    };

    addPlayer(game, "Laurent");
    addPlayer(game, "Caroline");
    addPlayer(game, "Jerome");
    addPlayer(game, "Marie");
    addPlayer(game, "Jacques");
    addPlayer(game, "David");
    addPlayer(game, "Annie");
    expect(() => startGame(game)).toThrow("Number of players must be 6");
    expect(game.enable).toBe(false);
  });

  it("When all players added, state enable should change to true", () => {
    const prompt = vi.fn();
    promptSync.mockReturnValue(prompt);

    prompt
      .mockReturnValueOnce("Laurent")
      .mockReturnValueOnce("Caroline")
      .mockReturnValueOnce("Jerome")
      .mockReturnValueOnce("Marie")
      .mockReturnValueOnce("Jacques")
      .mockReturnValueOnce("Annie");

    const game = {
      players: [],
      enable: false,
      totalScore: 0,
      playerIdOrder: null,
    };

    addPlayers(game);
    expect(game.enable).toBe(true);
  });

  it("Starting game when game has already enable is not possible", () => {
    const prompt = vi.fn();
    promptSync.mockReturnValue(prompt);

    prompt
      .mockReturnValueOnce("Laurent")
      .mockReturnValueOnce("Caroline")
      .mockReturnValueOnce("Jerome")
      .mockReturnValueOnce("Marie")
      .mockReturnValueOnce("Jacques")
      .mockReturnValueOnce("Annie");

    const game = {
      players: [],
      enable: false,
      totalScore: 0,
      playerIdOrder: null,
    };

    addPlayers(game);
    expect(() => startGame(game)).toThrow("Game already enable");
  });

  it("At the starting game, totalScore should be 0", () => {
    const prompt = vi.fn();
    promptSync.mockReturnValue(prompt);

    prompt
      .mockReturnValueOnce("Laurent")
      .mockReturnValueOnce("Caroline")
      .mockReturnValueOnce("Jerome")
      .mockReturnValueOnce("Marie")
      .mockReturnValueOnce("Jacques")
      .mockReturnValueOnce("Annie");

    const game = {
      players: [],
      enable: false,
      totalScore: 0,
      playerIdOrder: null,
    };

    addPlayers(game);
    expect(game.totalScore).toBe(0);
  });
});

describe("At roll dice", () => {
  it("A dice value should be between 1 and 6", () => {
    const roll = rollDice();
    expect(roll).toBeGreaterThanOrEqual(1);
    expect(roll).toBeLessThanOrEqual(6);
  });
});

// describe("At determine first player to start game", () => {
//   it("should determine the player with the highest score to start game", () => {
//     throw "error";
//   });
// });

describe("At init player order list", () => {
  it("should determine the order of the players based on the first player", () => {
    const game = {
      players: [
        { id: 1, name: "Laurent" },
        { id: 2, name: "Marie" },
        { id: 3, name: "Jerome" },
        { id: 4, name: "Lidia" },
        { id: 5, name: "David" },
        { id: 6, name: "Noemie" },
      ],
      enable: true,
      totalScore: 0,
      firstPlayer: 4,
      playerIdOrder: null,
    };

    initPlayerOrderList(game);
    expect(game.playerIdOrder).toEqual([4, 5, 6, 1, 2, 3]);
  });
});

describe("At player play", () => {
  it("A player roll dice should incremente state totalScore with dice value", () => {
    const prompt = vi.fn();
    promptSync.mockReturnValue(prompt);

    prompt.mockReturnValueOnce("");

    const game = {
      players: [
        { id: 1, name: "Laurent" },
        { id: 2, name: "Marie" },
        { id: 3, name: "Jerome" },
        { id: 4, name: "Lidia" },
        { id: 5, name: "David" },
        { id: 6, name: "Noemie" },
      ],
      enable: true,
      totalScore: 0,
      firstPlayer: 4,
      playerIdOrder: [4, 5, 6, 1, 2, 3],
    };

    playerPlay(game);
    expect(game.totalScore).not.toBe(0);
  });

  it("A player roll dice should incremente state of playerIdOrder", () => {
    const prompt = vi.fn();
    promptSync.mockReturnValue(prompt);

    prompt.mockReturnValueOnce("");

    const game = {
      players: [
        { id: 1, name: "Laurent" },
        { id: 2, name: "Marie" },
        { id: 3, name: "Jerome" },
        { id: 4, name: "Lidia" },
        { id: 5, name: "David" },
        { id: 6, name: "Noemie" },
      ],
      enable: true,
      totalScore: 0,
      firstPlayer: 4,
      playerIdOrder: [4, 5, 6, 1, 2, 3],
    };

    playerPlay(game);
    expect(game.playerIdOrder).toEqual([5, 6, 1, 2, 3, 4]);
  });

  it("If the sum of the dice roll and the total score is less than 36, current player is not eliminated, next player can roll dice", () => {
    const prompt = vi.fn();
    promptSync.mockReturnValue(prompt);

    prompt.mockReturnValueOnce("");

    const game = {
      players: [
        { id: 1, name: "Laurent" },
        { id: 2, name: "Marie" },
        { id: 3, name: "Jerome" },
        { id: 4, name: "Lidia" },
        { id: 5, name: "David" },
        { id: 6, name: "Noemie" },
      ],
      enable: true,
      totalScore: 30,
      firstPlayer: 4,
      playerIdOrder: [6, 1, 2, 3, 4, 5],
    };

    checkTotalScore(game, 5);
    expect(game.totalScore).toBe(35);
    expect(game.playerIdOrder).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("If the sum of the dice roll and the total score is more than 36, current player is eliminated, next player can roll dice", () => {
    const prompt = vi.fn();
    promptSync.mockReturnValue(prompt);

    prompt.mockReturnValueOnce("");

    const game = {
      players: [
        { id: 1, name: "Laurent" },
        { id: 2, name: "Marie" },
        { id: 3, name: "Jerome" },
        { id: 4, name: "Lidia" },
        { id: 5, name: "David" },
        { id: 6, name: "Noemie" },
      ],
      enable: true,
      totalScore: 33,
      firstPlayer: 4,
      playerIdOrder: [3, 4, 5, 6, 1, 2],
    };

    checkTotalScore(game, 6);
    expect(game.totalScore).toBe(33);
    expect(game.playerIdOrder).toEqual([4, 5, 6, 1, 2]);
  });

  it("If the sum of the dice roll and the total score is more than 36, current player is eliminated, all players are eliminated", () => {
    const prompt = vi.fn();
    promptSync.mockReturnValue(prompt);

    prompt.mockReturnValueOnce("");

    const game = {
      players: [
        { id: 1, name: "Laurent" },
        { id: 2, name: "Marie" },
        { id: 3, name: "Jerome" },
        { id: 4, name: "Lidia" },
        { id: 5, name: "David" },
        { id: 6, name: "Noemie" },
      ],
      enable: true,
      totalScore: 33,
      firstPlayer: 4,
      playerIdOrder: [5],
    };

    checkTotalScore(game, 6);
    expect(game.totalScore).toBe(0);
    expect(game.enable).toBe(false);
    expect(game.playerIdOrder).toEqual([]);
  });

  it("If the sum of the dice roll and the total score is 36, current player win, the game is stopped", () => {
    const prompt = vi.fn();
    promptSync.mockReturnValue(prompt);

    prompt.mockReturnValueOnce("");

    const game = {
      players: [
        { id: 1, name: "Laurent" },
        { id: 2, name: "Marie" },
        { id: 3, name: "Jerome" },
        { id: 4, name: "Lidia" },
        { id: 5, name: "David" },
        { id: 6, name: "Noemie" },
      ],
      enable: true,
      totalScore: 33,
      firstPlayer: 4,
      playerIdOrder: [5, 3, 4],
    };

    checkTotalScore(game, 3);
    expect(game.totalScore).toBe(36);
    expect(game.enable).toBe(false);
    expect(game.playerIdOrder).toEqual([]);
    expect(game.winner).toBe(5);
  });
});

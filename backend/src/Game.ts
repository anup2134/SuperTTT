import { GameManager } from "./GameManager.js";
import { Player } from "./Player.js";
import crypto from "crypto";

interface Move {
  move: {
    i: number;
    j: number;
    x: number;
    y: number;
  };
  time: number;
}

export class Game {
  private player1: Player;
  private gameId: number;
  private player2: Player;
  private game: number[][][][];
  private moves: Move[];
  private completeBoards: { [key: string]: number };
  private winner: Player | null;
  private isDraw: boolean;
  private gameManagar: GameManager;
  private playerTurn: Player;

  constructor(player1: Player, player2: Player, gameManager: GameManager) {
    //console.log("new game initaited");
    const buffer = crypto.randomBytes(4);
    this.gameId = buffer.readUInt32LE(0);
    this.player1 = player1;
    this.player2 = player2;
    this.game = [];

    for (let i = 0; i < 3; i++) {
      const t3: number[][][] = [];
      for (let j = 0; j < 3; j++) {
        const t2: number[][] = [];
        for (let k = 0; k < 3; k++) {
          const t1: number[] = [];
          for (let l = 0; l < 3; l++) {
            t1.push(0);
          }
          t2.push(t1);
        }
        t3.push(t2);
      }
      this.game.push(t3);
    }

    this.moves = [];
    this.winner = null;
    this.isDraw = false;
    this.gameManagar = gameManager;
    this.playerTurn = Date.now() % 2 === 0 ? player1 : player2;
    player1.startGame(this, player2);
    player2.startGame(this, player1);

    this.playerTurn.getSocket().send(
      JSON.stringify({
        type: "init",
        message: "your turn",
      })
    );
    this.playerTurn
      .getOpponent()
      ?.getSocket()
      .send(
        JSON.stringify({
          type: "init",
          message: "opponent turn",
        })
      );
    this.playerTurn.startTimer();
    this.moves.push({ move: { i: -1, j: -1, x: -1, y: -1 }, time: Date.now() });
    this.completeBoards = {};
    // this.getBoardATM();
  }
  dispose() {
    this.winner = null;
  }
  endGame() {
    //console.log("game ended ", this.gameId);
    this.player1.dispose();
    this.player2.dispose();
    this.gameManagar.gameCompleted(this.gameId);
  }

  getGameId() {
    return this.gameId;
  }

  getPlayerTurn() {
    return this.playerTurn;
  }

  getPlayers() {
    return [this.player1, this.player2];
  }

  validateAndMakeMove(move: string, player: Player) {
    const { move: prevMove } = this.moves[this.moves.length - 1];

    if (this.playerTurn !== player) {
      player
        .getSocket()
        .send(JSON.stringify({ type: "warning", message: "not your turn" }));
      return;
    }
    if (isNaN(parseInt(move)) || move.length < 4) {
      player
        .getSocket()
        .send(JSON.stringify({ type: "warning", message: "invalid move" }));
      return;
    }

    const i = parseInt(move[0]);
    const j = parseInt(move[1]);
    const x = parseInt(move[2]);
    const y = parseInt(move[3]);

    if (x > 2 || y > 2 || i > 2 || j > 2 || x < 0 || y < 0 || i < 0 || j < 0) {
      player
        .getSocket()
        .send(JSON.stringify({ type: "warning", message: "invalid move" }));
      return;
    }

    if (this.game[i][j][x][y] !== 0) {
      player
        .getSocket()
        .send(JSON.stringify({ type: "warning", message: "invalid move" }));
      // //console.log(this.moves);
      // //console.log(this.game[i][j][x][y]);
      return;
    }

    if (this.moves.length === 1) {
      this.moves.push({ move: { i, j, x, y }, time: Date.now() });
      this.game[i][j][x][y] = player === this.player1 ? 1 : 2;
      this.playerTurn.endTimer();
      this.playerTurn = player === this.player1 ? this.player2 : this.player1;
      // this.getBoardATM();
      player.getSocket().send(JSON.stringify({ type: "OK" }));
      player
        .getOpponent()
        ?.getSocket()
        .send(JSON.stringify({ type: "move", move: { i, j, x, y } }));
      this.playerTurn.startTimer();
      return;
    }

    // let playAnyWhere = false;
    const board = move[0] + move[1];
    if (this.completeBoards[board]) {
      // //console.log("board already complete invalid");
      player
        .getSocket()
        .send(JSON.stringify({ type: "warning", message: "invalid move" }));
      return;
    }

    let playAnyWhere = false;
    if (this.completeBoards[`${prevMove.x}${prevMove.y}`]) {
      playAnyWhere = true;
      // //console.log("play anywhere");
    }

    // for (const board of this.completeBoards) {
    //   const { i: ci, j: cj } = board;
    //   if (ci === prevMove.x && cj === prevMove.y) {
    //     playAnyWhere = true;
    //     //console.log("play anywhere");
    //     // break;
    //   }
    //   if (ci === i && cj === j) {
    //     player
    //       .getSocket()
    //       .send(JSON.stringify({ type: "warning", message: "invalid move" }));
    //     return;
    //   }
    // }

    if ((prevMove.x !== i || prevMove.y !== j) && !playAnyWhere) {
      player
        .getSocket()
        .send(JSON.stringify({ type: "warning", message: "invalid move" }));
      return;
    }

    this.moves.push({ move: { i, j, x, y }, time: Date.now() });
    this.game[i][j][x][y] = player === this.player1 ? 1 : 2;
    this.setCompleteBoard(i, j, player);
    this.playerTurn.endTimer();
    this.playerTurn = player === this.player1 ? this.player2 : this.player1;
    // this.getBoardATM();
    player.getSocket().send(JSON.stringify({ type: "OK" }));
    player
      .getOpponent()
      ?.getSocket()
      .send(JSON.stringify({ type: "move", move: { i, j, x, y } }));
    this.playerTurn.startTimer();
    return;
  }

  setCompleteBoard(i: number, j: number, player: Player) {
    if (
      this.game[i][j][0][0] === this.game[i][j][1][1] &&
      this.game[i][j][1][1] === this.game[i][j][2][2] &&
      this.game[i][j][0][0] !== 0
    ) {
      // //console.log("board claimed:", i, j);
      this.completeBoards[`${i}${j}`] = player === this.player1 ? 1 : 2;
      this.checkForWinner(player);
      return;
    }

    if (
      this.game[i][j][0][2] === this.game[i][j][1][1] &&
      this.game[i][j][1][1] === this.game[i][j][2][0] &&
      this.game[i][j][0][2] !== 0
    ) {
      // //console.log("board claimed:", i, j);
      this.completeBoards[`${i}${j}`] = player === this.player1 ? 1 : 2;
      this.checkForWinner(player);
      return;
    }

    for (let l = 0; l < 3; l++) {
      if (
        this.game[i][j][l][0] === this.game[i][j][l][1] &&
        this.game[i][j][l][1] === this.game[i][j][l][2] &&
        this.game[i][j][l][0] !== 0
      ) {
        // //console.log("board claimed:", i, j);
        this.completeBoards[`${i}${j}`] = player === this.player1 ? 1 : 2;
        this.checkForWinner(player);
        return;
      }

      if (
        this.game[i][j][0][l] === this.game[i][j][1][l] &&
        this.game[i][j][1][l] === this.game[i][j][2][l] &&
        this.game[i][j][0][l] !== 0
      ) {
        // //console.log("board claimed:", i, j);
        this.completeBoards[`${i}${j}`] = player === this.player1 ? 1 : 2;
        this.checkForWinner(player);
        return;
      }
    }
  }

  checkForWinner(player: Player) {
    if (
      this.completeBoards["11"] &&
      this.completeBoards["00"] &&
      this.completeBoards["22"] &&
      this.completeBoards["11"] === this.completeBoards["00"] &&
      this.completeBoards["11"] === this.completeBoards["22"]
    ) {
      //console.log("game complete");
      this.setWinner(player);
      return;
    }

    if (
      this.completeBoards["11"] &&
      this.completeBoards["20"] &&
      this.completeBoards["02"] &&
      this.completeBoards["11"] === this.completeBoards["02"] &&
      this.completeBoards["11"] === this.completeBoards["20"]
    ) {
      //console.log("game complete");
      this.setWinner(player);
      return;
    }

    for (let i = 0; i < 3; i++) {
      if (
        this.completeBoards[`${i}0`] &&
        this.completeBoards[`${i}1`] &&
        this.completeBoards[`${i}2`] &&
        this.completeBoards[`${i}0`] === this.completeBoards[`${i}1`] &&
        this.completeBoards[`${i}0`] === this.completeBoards[`${i}2`]
      ) {
        //console.log("game complete");
        this.setWinner(player);
        return;
      }

      if (
        this.completeBoards[`0${i}`] &&
        this.completeBoards[`1${i}`] &&
        this.completeBoards[`2${i}`] &&
        this.completeBoards[`0${i}`] === this.completeBoards[`1${i}`] &&
        this.completeBoards[`0${i}`] === this.completeBoards[`2${i}`]
      ) {
        //console.log("game complete");
        this.setWinner(player);
        return;
      }
    }
  }

  setWinner(player: Player) {
    //console.log(`winner for game ${this.gameId}: `, player.getName());
    player
      .getSocket()
      .send(JSON.stringify({ type: "terminate", message: "won" }));
    player
      .getOpponent()
      ?.getSocket()
      .send(JSON.stringify({ type: "terminate", message: "lost" }));
    this.winner = player;
    this.endGame();
  }

  getBoardATM() {
    const board: string[][] = [];
    for (let i = 0; i < 3; i++) {
      for (let x = 0; x < 3; x++) {
        const line: string[] = [];
        for (let j = 0; j < 3; j++) {
          for (let y = 0; y < 3; y++) {
            line.push(this.game[i][j][x][y].toString());
          }
        }
        board.push(line);
      }
    }
    let map = "";
    board.forEach((line) => {
      line.forEach((item) => (map += item));
      map += "\n";
    });
    // //console.log(map);
    // player.getSocket().send(JSON.stringify({ board }));
  }
}

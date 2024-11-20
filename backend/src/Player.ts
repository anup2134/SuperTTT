import { WebSocket } from "ws";
import { Game } from "./Game.js";
import crypto from "crypto";

export class Player {
  private id: number;
  private name: string;
  private socket: WebSocket;
  private game: Game | null;
  private opponent: Player | null;
  private timerId: NodeJS.Timeout | null;

  constructor(name: string, socket: WebSocket) {
    console.log("player created ", name);
    const buffer = crypto.randomBytes(4);
    this.id = buffer.readUInt32LE(0);
    this.name = name;
    this.socket = socket;
    this.opponent = null;
    this.game = null;
    this.timerId = null;
  }

  dispose() {
    this.game = null;
    this.opponent = null;
    this.endTimer();
    this.timerId = null;
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getSocket(): WebSocket {
    return this.socket;
  }

  public getOpponent(): Player | null {
    return this.opponent;
  }

  public getGame(): Game | null {
    return this.game;
  }

  public startTimer() {
    console.log("timer started for ", this.name);

    this.timerId = setTimeout(() => {
      this.game?.setWinner(this.opponent!);
    }, 1000 * 35);
  }

  public endTimer() {
    clearTimeout(this.timerId!);
  }

  public startGame(game: Game, opponent: Player) {
    console.log("game started for ", this.name);
    this.opponent = opponent;
    this.game = game;
  }

  public move(move: string) {
    this.game?.validateAndMakeMove(move, this);
  }
}

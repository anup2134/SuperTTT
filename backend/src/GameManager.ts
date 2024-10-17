// import { WebSocket } from "ws";
import { Game } from "./Game.ts";
import { Player } from "./Player.ts";

export class GameManager {
  private games: Game[];
  private pendingPlayer: Player | null;

  constructor() {
    console.log("game manager initiated");
    this.games = [];
    this.pendingPlayer = null;
  }

  addPlayer(player: Player) {
    if (this.pendingPlayer !== null) {
      this.games.push(new Game(this.pendingPlayer, player, this));
      this.pendingPlayer = null;
      console.log(
        "players paired",
        player.getName(),
        player.getOpponent()?.getName()
      );
    } else {
      this.pendingPlayer = player;
      player
        .getSocket()
        .send(
          JSON.stringify({
            type: "queue_joined",
            message: "searching for an opponent",
          })
        );
      console.log("player in queue", player.getName());
    }
  }

  removePlayer(player: Player) {
    if (this.pendingPlayer !== null) {
      if (this.pendingPlayer === player) {
        console.log("player removed", player.getName());
        this.pendingPlayer = null;
      }
    }
    if (player.getGame() !== null) {
      const opponent = player.getOpponent();
      if (opponent) {
        player.getGame()?.setWinner(opponent);
        player.getGame()?.endGame();
        opponent.getSocket().close(1000, "Game completed");
      }
    }
  }

  gameCompleted(id: number) {
    console.log("game completed", id);
    this.games = this.games.filter((game) => {
      if (game.getGameId() === id) {
        game
          .getPlayers()
          .forEach((player) =>
            player.getSocket().close(1000, "Game completed")
          );
        game.dispose();
        return true;
      }
    });
  }
}

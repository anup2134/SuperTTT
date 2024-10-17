import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager.ts";
import { Player } from "./Player.ts";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const gameManager = new GameManager();

wss.on("connection", function connection(ws, req) {
  const params = req.url?.split("?")[1]?.split("=");
  const name = params ? params[1] : "";
  const player = new Player(name, ws);
  gameManager.addPlayer(player);

  ws.on("error", console.error);

  ws.on("message", (message) => {
    player.move(message.toString());
  });
  ws.on("close", () => {
    gameManager.removePlayer(player);
  });
});

app.get("/", (req, res) => {
  res.send("http get request");
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`server listening on port: ${3000}`);
});

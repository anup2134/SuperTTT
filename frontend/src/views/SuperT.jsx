import { useState } from "react";
import { getExpandLines, getGame } from "../components/utils/Objects";
import Board from "../components/Board";

const SuperTTT = () => {
  const [game, setGame] = useState(getGame());
  const [currentTurn, setCurrentTurn] = useState(1);
  const [completeBoards, setCompleteBoards] = useState({});
  const [prevMove, setPrevMove] = useState({});
  const [winner, setWinner] = useState(null);
  const [allowedAnywhere, setAllowedAnywhere] = useState(true);
  const [allowedGrid, setAllowedGrid] = useState("");
  const [totalMoves, setTotalMoves] = useState(0);
  const [expandLines, setExpandLines] = useState(getExpandLines());

  const validMove = (i, j) => {
    if (prevMove.x === undefined || prevMove.y === undefined) {
      return true;
    }
    if (completeBoards[`${i}${j}`]) {
      return false;
    }
    let playAnyWhere = false;
    if (completeBoards[`${prevMove.x}${prevMove.y}`]) {
      playAnyWhere = true;
    }

    if ((prevMove.x !== i || prevMove.y !== j) && !playAnyWhere) {
      return false;
    }

    return true;
  };

  const handleMove = (e) => {
    const move = e.target.id;

    if (game[move] !== 0) {
      return;
    }
    const i = parseInt(move[0]);
    const j = parseInt(move[1]);
    const x = parseInt(move[2]);
    const y = parseInt(move[3]);

    if (!validMove(i, j)) {
      return;
    }
    setPrevMove({ i, j, x, y, player: currentTurn });
    setGame((prevgame) => ({ ...prevgame, [move]: currentTurn }));
    setTotalMoves((prevCount) => prevCount + 1);
    setCurrentTurn((prevMove) => 3 - prevMove);
  };

  return (
    <Board
      game={game}
      myTurn={true}
      completeBoards={completeBoards}
      setCompleteBoards={setCompleteBoards}
      prevMove={prevMove}
      winner={winner}
      setWinner={setWinner}
      allowedAnywhere={allowedAnywhere}
      setAllowedAnywhere={setAllowedAnywhere}
      allowedGrid={allowedGrid}
      setAllowedGrid={setAllowedGrid}
      totalMoves={totalMoves}
      expandLines={expandLines}
      setExpandLines={setExpandLines}
      handleMove={handleMove}
    />
  );
};

export default SuperTTT;

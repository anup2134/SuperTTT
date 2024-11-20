import { useEffect, useState, useRef, useContext } from "react";
import { getExpandLines, getGame } from "../components/utils/Objects";
import Board from "../components/Board";
import Timer from "../components/Timer";
import { AppContext } from "../Context";

const Multiplayer = () => {
  const [ws, setWS] = useState(new WebSocket("ws://localhost:3000"));
  const [game, setGame] = useState(getGame());
  const [myTurn, setMyTurn] = useState(null);
  const mySymbol = useRef(null);
  const [completeBoards, setCompleteBoards] = useState({});
  const [prevMove, setPrevMove] = useState({});
  const [winner, setWinner] = useState(null);
  const [allowedAnywhere, setAllowedAnywhere] = useState(true);
  const [allowedGrid, setAllowedGrid] = useState("");
  const [totalMoves, setTotalMoves] = useState(0);
  const [expandLines, setExpandLines] = useState(getExpandLines());
  const { screenRes } = useContext(AppContext);

  //handle ws connection
  useEffect(() => {
    // const ws = ;
    // setWS(ws);
    ws.onopen = () => {
      console.log("connection established");
    };

    ws.onerror = (event) => {
      console.log("Error occurred:", event);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "queue_joined") {
        console.log(message.message);
      }

      if (message.type === "init") {
        if (message.message === "your turn") {
          console.log("your turn");
          mySymbol.current = 1;
          setMyTurn(true);
        } else {
          console.log("opponent's turn");
          mySymbol.current = 2;
          setMyTurn(false);
        }
      }

      if (message.type === "move") {
        handleOppMove(message.move);
      }

      if (message.type === "warning") {
        console.log("warning:", message.message);
      }
    };

    ws.onclose = () => {
      setGame(getGame());
      setMyTurn(null);
      mySymbol.current = null;
      setCompleteBoards({});
      setPrevMove({});
      setWinner(null);
      setAllowedAnywhere(true);
      setAllowedGrid("");
      setTotalMoves(0);
      setExpandLines(getExpandLines());
      console.log("Connection closed");
    };
    return () => ws.close();
  }, [ws]);

  console.log(ws);

  const handleOppMove = ({ i, j, x, y }) => {
    // console.log("opponent moved");
    console.log(i, j, x, y);
    console.log("setting prev move 2:", i, j, x, y, 3 - mySymbol.current);
    setPrevMove({ i, j, x, y, player: 3 - mySymbol.current });
    setGame((prevgame) => ({
      ...prevgame,
      [`${i}${j}${x}${y}`]: 3 - mySymbol.current,
    }));

    setMyTurn(true);
  };

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

  useEffect(() => {
    if (myTurn) {
      console.log("my turn");
    } else {
      console.log("opponent's turn");
    }
  }, [myTurn]);

  const handleMove = (e) => {
    if (!myTurn) {
      console.log("not your turn");
      return;
    }

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

    setPrevMove({ i, j, x, y, player: mySymbol.current });
    setMyTurn(false);
    setTotalMoves((prevCount) => prevCount + 1);
    setGame((prevgame) => ({ ...prevgame, [move]: mySymbol.current }));
    ws.send(e.target.id);
  };

  return (
    <Board
      game={game}
      myTurn={myTurn}
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
    >
      <div
        className={`${
          screenRes.width > screenRes.height
            ? "top-1/2 left-[110%] -translate-y-1/2 flex-col"
            : "top-[110%] gap-x-6 left-1/2 -translate-x-1/2 "
        } absolute flex mt-4`}
      >
        <Timer player={"You"} start={myTurn} />
        <Timer player={"Opponent"} start={!myTurn && mySymbol.current} />
      </div>
    </Board>
  );
};

export default Multiplayer;

import Gradient from "../components/Gradient";
import { useState, useEffect } from "react";
import X from "../assets/X.svg";
import O from "../assets/O.svg";
// import DRAW from "../assets/DRAW.svg";
import {
  HorizontalLine,
  VerticalLine,
  DiagonalLineLeft,
  DiagonalLineRight,
} from "../components/Lines";

const SuperT = () => {
  const getGame = () => {
    const game = {};

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          for (let l = 0; l < 3; l++) {
            game[`${i}${j}${k}${l}`] = 0;
          }
        }
      }
    }
    return game;
  };

  const getExpandLines = () => {
    const expandLines = {};
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        expandLines[`${i}${j}`] = null;
      }
    }
    return expandLines;
  };

  const [game, setGame] = useState(getGame());
  const [currentTurn, setCurrentTurn] = useState(1);
  const [completeBoards, setCompleteBoards] = useState({});
  const [prevMove, setPrevMove] = useState({});
  const [winner, setWinner] = useState(null);
  const [touchDevice, setTouchDevice] = useState(false);
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

  useEffect(() => {
    if (prevMove.i === undefined) {
      return;
    }
    if (
      game[`${prevMove.i}${prevMove.j}00`] ===
        game[`${prevMove.i}${prevMove.j}11`] &&
      game[`${prevMove.i}${prevMove.j}22`] ===
        game[`${prevMove.i}${prevMove.j}11`] &&
      game[`${prevMove.i}${prevMove.j}00`] !== 0
    ) {
      setExpandLines((prevExpandLines) => ({
        ...prevExpandLines,
        [`${prevMove.i}${prevMove.j}`]: "diagLeft",
      }));
      setCompleteBoards((prevCompleteBoards) => ({
        ...prevCompleteBoards,
        [`${prevMove.i}${prevMove.j}`]: prevMove.player,
      }));
      return;
    }

    if (
      game[`${prevMove.i}${prevMove.j}02`] ===
        game[`${prevMove.i}${prevMove.j}11`] &&
      game[`${prevMove.i}${prevMove.j}11`] ===
        game[`${prevMove.i}${prevMove.j}20`] &&
      game[`${prevMove.i}${prevMove.j}11`] !== 0
    ) {
      setExpandLines((prevExpandLines) => ({
        ...prevExpandLines,
        [`${prevMove.i}${prevMove.j}`]: "diagRight",
      }));
      setCompleteBoards((prevCompleteBoards) => ({
        ...prevCompleteBoards,
        [`${prevMove.i}${prevMove.j}`]: prevMove.player,
      }));
      return;
    }

    let count = 0;
    for (let i = 0; i < 3; i++) {
      if (game[`${prevMove.i}${prevMove.j}${i}0`] === 0) {
        count++;
      }
      if (game[`${prevMove.i}${prevMove.j}${i}1`] === 0) {
        count++;
      }
      if (game[`${prevMove.i}${prevMove.j}${i}2`] === 0) {
        count++;
      }
      if (
        game[`${prevMove.i}${prevMove.j}${i}0`] ===
          game[`${prevMove.i}${prevMove.j}${i}1`] &&
        game[`${prevMove.i}${prevMove.j}${i}2`] ===
          game[`${prevMove.i}${prevMove.j}${i}1`] &&
        game[`${prevMove.i}${prevMove.j}${i}0`] !== 0
      ) {
        setExpandLines((prevExpandLines) => ({
          ...prevExpandLines,
          [`${prevMove.i}${prevMove.j}`]: `hori${i}`,
        }));
        setCompleteBoards((prevCompleteBoards) => ({
          ...prevCompleteBoards,
          [`${prevMove.i}${prevMove.j}`]: prevMove.player,
        }));
        return;
      }
      if (
        game[`${prevMove.i}${prevMove.j}0${i}`] ===
          game[`${prevMove.i}${prevMove.j}1${i}`] &&
        game[`${prevMove.i}${prevMove.j}2${i}`] ===
          game[`${prevMove.i}${prevMove.j}1${i}`] &&
        game[`${prevMove.i}${prevMove.j}0${i}`] !== 0
      ) {
        setExpandLines((prevExpandLines) => ({
          ...prevExpandLines,
          [`${prevMove.i}${prevMove.j}`]: `vert${i}`,
        }));
        setCompleteBoards((prevCompleteBoards) => ({
          ...prevCompleteBoards,
          [`${prevMove.i}${prevMove.j}`]: prevMove.player,
        }));
        return;
      }
    }

    if (count === 0) {
      setCompleteBoards((prevCompleteBoards) => ({
        ...prevCompleteBoards,
        [`${prevMove.i}${prevMove.j}`]: "draw",
      }));
    }
  }, [prevMove, game]);

  useEffect(() => {
    if (prevMove.i === undefined) {
      setAllowedAnywhere(true);
      return;
    }
    if (completeBoards[`${prevMove.x}${prevMove.y}`]) {
      setAllowedAnywhere(true);
    } else {
      setAllowedGrid(`${prevMove.x}${prevMove.y}`);
      setAllowedAnywhere(false);
    }
  }, [prevMove, completeBoards]);

  useEffect(() => {
    if (
      completeBoards["11"] &&
      completeBoards["00"] &&
      completeBoards["22"] &&
      completeBoards["11"] === completeBoards["00"] &&
      completeBoards["11"] === completeBoards["22"]
    ) {
      setWinner(completeBoards["11"]);
      return;
    }

    if (
      completeBoards["11"] &&
      completeBoards["20"] &&
      completeBoards["02"] &&
      completeBoards["11"] === completeBoards["02"] &&
      completeBoards["11"] === completeBoards["20"]
    ) {
      setWinner(completeBoards["11"]);
      return;
    }

    for (let i = 0; i < 3; i++) {
      if (
        completeBoards[`${i}0`] &&
        completeBoards[`${i}1`] &&
        completeBoards[`${i}2`] &&
        completeBoards[`${i}0`] === completeBoards[`${i}1`] &&
        completeBoards[`${i}0`] === completeBoards[`${i}2`]
      ) {
        setWinner(completeBoards[`${i}0`]);
        return;
      }

      if (
        completeBoards[`0${i}`] &&
        completeBoards[`1${i}`] &&
        completeBoards[`2${i}`] &&
        completeBoards[`0${i}`] === completeBoards[`1${i}`] &&
        completeBoards[`0${i}`] === completeBoards[`2${i}`]
      ) {
        setWinner(completeBoards[`0${i}`]);
        return;
      }
    }
  }, [completeBoards]);

  useEffect(() => {
    // console.log(totalMoves);
    if (winner === null && totalMoves >= 81) {
      console.log("draw");
    } else if (winner) {
      console.log("winner is:", winner);
    }
  }, [winner, totalMoves]);

  const [screenRes, setScreenRes] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenRes({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleDevice = () => {
      setTouchDevice(true);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("touchstart", handleDevice);
    };
  }, []);

  return (
    <div className="mt-8 sm:mt-14 ">
      {!touchDevice && <Gradient />}
      {[0, 1, 2].map((i) => {
        return (
          <div
            key={i}
            id={i}
            className={`${
              screenRes.width <= screenRes.height
                ? "w-[90vw] h-[30vw] "
                : "w-[90vh] h-[30vh]"
            } border mx-auto flex border-[#04d9ff]`}
          >
            {[0, 1, 2].map((j) => {
              return (
                <div
                  key={`${i}${j}`}
                  id={`${i}${j}`}
                  className={`${
                    j !== 2 ? "border-r" : ""
                  } border-[#04d9ff] h-[100%] w-[33.3%] ${
                    allowedAnywhere
                      ? completeBoards[`${i}${j}`]
                        ? ""
                        : "hover:bg-[#ffffff33]"
                      : allowedGrid === `${i}${j}`
                      ? "hover:bg-[#ffffff33]"
                      : ""
                  } relative`}
                >
                  <DiagonalLineLeft expand={expandLines[`${i}${j}`]} />
                  <DiagonalLineRight expand={expandLines[`${i}${j}`]} />
                  <VerticalLine expand={expandLines[`${i}${j}`]} />
                  <HorizontalLine expand={expandLines[`${i}${j}`]} />
                  {[0, 1, 2].map((x) => {
                    return (
                      <div
                        key={`${i}${j}${x}`}
                        id={`${i}${j}${x}`}
                        className={`w-full h-[33.3%] ${
                          x !== 2 ? "border-b" : ""
                        } border-white flex`}
                      >
                        {[0, 1, 2].map((y) => {
                          return (
                            <div
                              key={`${i}${j}${x}${y}`}
                              id={`${i}${j}${x}${y}`}
                              className={`h-full w-[33.3%] ${
                                y !== 2 ? "border-r" : ""
                              } border-white  ${
                                allowedAnywhere
                                  ? completeBoards[`${i}${j}`] ||
                                    game[`${i}${j}${x}${y}`] !== 0
                                    ? "hover:cursor-not-allowed "
                                    : "hover:cursor-pointer hover:bg-black"
                                  : allowedGrid === `${i}${j}` &&
                                    game[`${i}${j}${x}${y}`] === 0
                                  ? "hover:cursor-pointer hover:bg-black"
                                  : "hover:cursor-not-allowed"
                              }  flex justify-center items-center`}
                              onClick={(e) => {
                                handleMove(e);
                              }}
                            >
                              {game[`${i}${j}${x}${y}`] === 1 ? (
                                <img src={X} className="w-full h-full" />
                              ) : null}
                              {game[`${i}${j}${x}${y}`] === 2 ? (
                                <img src={O} className="w-4/5 h-4/5" />
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default SuperT;

import { useEffect, useState, useRef } from "react";
import X from "../assets/X.svg";
import O from "../assets/O.svg";
import Gradient from "../components/Gradient";
import {
  HorizontalLine,
  VerticalLine,
  DiagonalLineLeft,
  DiagonalLineRight,
} from "../components/Lines";

const Board = () => {
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

  return (
    <div className="mt-8 sm:mt-14">
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
                    myTurn
                      ? allowedAnywhere
                        ? completeBoards[`${i}${j}`]
                          ? ""
                          : "hover:bg-[#ffffff33]"
                        : allowedGrid === `${i}${j}`
                        ? "hover:bg-[#ffffff33]"
                        : ""
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
                              } border-white ${
                                myTurn
                                  ? allowedAnywhere
                                    ? completeBoards[`${i}${j}`] ||
                                      game[`${i}${j}${x}${y}`] !== 0
                                      ? "hover:cursor-not-allowed "
                                      : "hover:cursor-pointer hover:bg-black"
                                    : allowedGrid === `${i}${j}` &&
                                      game[`${i}${j}${x}${y}`] === 0
                                    ? "hover:cursor-pointer hover:bg-black"
                                    : "hover:cursor-not-allowed"
                                  : "hover:cursor-not-allowed"
                              } flex justify-center items-center`}
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

export default Board;

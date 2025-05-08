/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import X from "../assets/X.svg";
import O from "../assets/O.svg";
import Gradient from "../components/Gradient";
import {
  HorizontalLine,
  VerticalLine,
  DiagonalLineLeft,
  DiagonalLineRight,
} from "../components/Lines";
import { AppContext } from "../Context";
import { Link } from "react-router-dom";
import Rules from "./Rules";

const Board = ({
  game,
  myTurn,
  completeBoards,
  setCompleteBoards,
  prevMove,
  winner,
  setWinner,
  allowedAnywhere,
  setAllowedAnywhere,
  allowedGrid,
  setGameComplete,
  setAllowedGrid,
  totalMoves,
  expandLines,
  setExpandLines,
  handleMove,
  children,
}) => {
  // const [touchDevice, setTouchDevice] = useState(false);
  const { screenRes } = useContext(AppContext);

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
    if (winner === null && totalMoves >= 81) {
      console.log("draw");
      setGameComplete(true);
    } else if (winner) {
      console.log("winner is:", winner);
      setGameComplete(true);
    }
  }, [winner, totalMoves]);

  // useEffect(() => {
  //   const handleDevice = () => {
  //     setTouchDevice(true);
  //   };

  //   window.addEventListener("touchstart", handleDevice);

  //   return () => {
  //     window.removeEventListener("touchstart", handleDevice);
  //   };
  // }, []);

  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <Gradient />
      {showRules && <Rules setShowRules={setShowRules} />}
      <div className="">
        {/* <div className="flex"> */}
        {/* </div> */}
        <div className="relative w-max m-auto">
          <div className="flex mb-4 sm:mt-0 mt-4">
            <Link
              to="/"
              className="text-base border-white border-2 rounded-full px-5 py-2 shadow-sm shadow-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-big-left-icon lucide-arrow-big-left"
              >
                <path d="M18 15h-6v4l-7-7 7-7v4h6v6z" />
              </svg>
            </Link>
            {/* <button
              className="text-base border-white border-2 rounded-full px-5 py-2  shadow-sm shadow-white"
              onClick={() => {
                setShowRules(true);
              }}
            >
              Rules
            </button> */}
          </div>
          {[0, 1, 2].map((i) => {
            return (
              <div
                key={i}
                id={i}
                className={`${
                  screenRes.width <= screenRes.height
                    ? "w-[90vw] h-[30vw]"
                    : "w-[90vh] h-[30vh]"
                } border flex border-[#04d9ff]`}
              >
                {/* <div></div> */}
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
          {children}
        </div>
      </div>
    </>
  );
};

export default Board;

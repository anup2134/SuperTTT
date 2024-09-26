import { useState } from "react";
import X from "../assets/X.svg";
import O from "../assets/O.svg";
import DRAW from "../assets/DRAW.svg";
import Header from "../components/Header";

const SuperTTT = () => {
  const sigleGame = Array(9).fill(null);
  const singleCell = Array(9).fill(null);

  const [enabledBoards, setEnabledBoards] = useState([
    0, 1, 2, 3, 4, 5, 6, 7, 8,
  ]);
  const [completedBoards, setCompletedBoards] = useState([]);
  const [boardWinner, setBoardWinner] = useState(new Array(9).fill(null));
  const [board, setBoard] = useState(
    new Array(9).fill(new Array(9).fill(null))
  );

  const [currMove, setCurrMove] = useState("X");

  const checkForWinner = (board) => {
    for (let i = 0; i < 3; i++) {
      if (
        board[i] === board[i + 3] &&
        board[i + 3] === board[i + 6] &&
        board[i] &&
        board[i + 3] &&
        board[i + 6]
      ) {
        return board[i];
      }
    }

    for (let i = 0; i < 7; i += 3) {
      if (
        board[i] === board[i + 1] &&
        board[i + 1] === board[i + 2] &&
        board[i] &&
        board[i + 1] &&
        board[i + 2]
      ) {
        return board[i];
      }
    }

    if (
      board[0] === board[4] &&
      board[8] === board[4] &&
      board[0] &&
      board[4] &&
      board[8]
    )
      return board[0];
    if (
      board[2] === board[4] &&
      board[6] === board[4] &&
      board[2] &&
      board[4] &&
      board[6]
    )
      return board[2];

    return false;
  };

  const handleBoard = (i, j) => {
    if (board[i][j]) {
      return;
    }

    if (enabledBoards.includes(i)) {
      const newBoard = board.map((row) => [...row]);
      if (currMove === "X") {
        newBoard[i][j] = X;
      } else {
        newBoard[i][j] = O;
      }

      const hasWinner = checkForWinner(newBoard[i]);
      if (hasWinner) {
        const newBoardWinner = [...boardWinner];
        newBoardWinner[i] = hasWinner;
        setBoardWinner(newBoardWinner);
        setCompletedBoards([...completedBoards, i]);
      } else {
        let nullCounts = 0;
        for (let cell of newBoard[i]) {
          if (!cell) {
            nullCounts++;
          }
        }
        if (nullCounts === 0) {
          const newBoardWinner = [...boardWinner];
          newBoardWinner[i] = DRAW;
          setBoardWinner(newBoardWinner);
          setCompletedBoards([...completedBoards, i]);
        }
      }
      if (completedBoards.includes(j)) {
        setEnabledBoards(
          [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(
            (idx) => !completedBoards.includes(idx)
          )
        );
      } else setEnabledBoards([j]);
      setBoard(newBoard);
      setCurrMove((prevMove) => {
        if (prevMove === "X") return "O";
        return "X";
      });
    }
  };

  return (
    <div className="flex h-full md:flex-col">
      <Header />
      <div className="w-[702px] h-[702px] border-white mt-5 mx-auto flex flex-wrap ">
        {sigleGame.map((row, i) =>
          completedBoards.includes(i) ? (
            <div
              key={i}
              className="w-[234px] h-[234px] border-2 border-cyan-500 cursor-not-allowed pointer-events-none text-center font-bold text-2xl"
            >
              <img src={boardWinner[i]} className="w-[230px] h-[230px]" />
            </div>
          ) : (
            <div
              key={i}
              className={`w-[234px] h-[234px] border-2 border-cyan-500 flex flex-wrap ${
                enabledBoards.includes(i)
                  ? "hover:bg-neutral-300"
                  : "cursor-not-allowed"
              }`}
            >
              {singleCell.map((cell, j) => (
                <div
                  key={`${i} ${j}`}
                  className={`w-[76.8px] h-[76.8px] border border-white ${
                    enabledBoards.includes(i) && !board[i][j]
                      ? "hover:bg-black"
                      : "cursor-not-allowed pointer-events-none"
                  }`}
                  onClick={() => handleBoard(i, j)}
                >
                  <img src={board[i][j]} />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SuperTTT;

import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

const GameEnd = forwardRef(({ winner }, ref) => {
  console.log(ref.current);
  const navigate = useNavigate();
  return (
    <div className="bg-black absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className="font-bold text-2xl text-center">
        {winner ? (ref.current === winner ? "You Won" : "You Lost") : "Draw"}
      </h1>
      <button
        className="border border-white p-1"
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </button>
      <button
        className="border border-white p-1"
        onClick={() => {
          navigate(0);
        }}
      >
        Play Again
      </button>
    </div>
  );
});

export default GameEnd;

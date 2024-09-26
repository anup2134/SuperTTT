import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [mouseLoc, setMouseLoc] = useState({ x: 0, y: 0 });
  const [cursorSize, setCursorSize] = useState({ width: 0, height: 0 });
  const cursorRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    const xCord = e.clientX;
    const yCord = e.clientY;
    setMouseLoc({ x: xCord, y: yCord });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        x: mouseLoc.x,
        y: mouseLoc.y,
      });
    }
  }, [mouseLoc]);

  useEffect(() => {
    if (cursorRef.current) {
      const width = cursorRef.current.offsetWidth;
      const height = cursorRef.current.offsetHeight;
      setCursorSize({ width, height });
    }
  }, [cursorRef]);

  const translateX = `calc(${mouseLoc.x}px - ${cursorSize.width / 2}px)`;
  const translateY = `calc(${mouseLoc.y}px - ${cursorSize.height / 2}px)`;

  return (
    <div className="relative ">
      <div
        className="opacity-40 rounded-full cursor"
        ref={cursorRef}
        style={{
          transform: `
            translate(${translateX}, ${translateY})
          `,
          pointerEvents: "none",
        }}
      ></div>
      <header className="title w-full text-5xl pt-4 flex justify-center items-center relative">
        <h1 className="text-center">Super Tic Tac Toe</h1>
        <button className="text-base border-white border-2 rounded-full px-5 py-2 absolute right-10 shadow-sm shadow-white">
          Rules
        </button>
      </header>
      <section className="mt-36">
        <div className="flex flex-col items-center gap-10 text-2xl">
          <button
            onClick={() => {
              navigate("/play");
            }}
            className=""
          >
            Single Player
          </button>
          <button>Play Online (random)</button>
          <button>Play with a friend</button>
        </div>
      </section>
    </div>
  );
};
export default HomePage;

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Rules from "../components/Rules";

const HomePage = () => {
  const [mouseLoc, setMouseLoc] = useState({ x: 0, y: 0 });
  const cursorRef = useRef(null);
  const navigate = useNavigate();
  const [showRules, setShowRules] = useState(false);

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

  useLayoutEffect(() => {
    if (cursorRef.current) {
      const animation = gsap.to(cursorRef.current, {
        x: mouseLoc.x,
        y: mouseLoc.y,
      });

      return () => {
        animation.kill();
      };
    }
  }, [cursorRef, mouseLoc]);

  useLayoutEffect(() => {
    if (cursorRef.current) {
      const cursorRect = cursorRef.current.getBoundingClientRect();
      const translateX = `calc(${mouseLoc.x}px - ${cursorRect.width / 2}px)`;
      const translateY = `calc(${mouseLoc.y}px - ${cursorRect.height / 2}px)`;
      cursorRef.current.style.transform = `translate(${translateX}, ${translateY})`;
    }
  }, [mouseLoc]);

  return (
    <>
      {showRules && <Rules setShowRules={setShowRules} />}
      <div className="relative">
        <div
          className="opacity-40 rounded-full cursor pointer-events-none sm:block hidden"
          ref={cursorRef}
        ></div>
        <header className="title w-full text-5xl pt-4 flex justify-center items-center relative">
          <h1 className="text-center medium">Super Tic Tac Toe</h1>
          {/* <button
            className="text-base border-white border-2 rounded-full px-5 py-2 absolute right-10 shadow-sm shadow-white"
            onClick={() => {
              setShowRules(true);
            }}
          >
            Rules
          </button> */}
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
            <button
              onClick={() => {
                navigate("/multiplayer");
              }}
            >
              Play Online
            </button>
            <button
              onClick={() => {
                setShowRules(true);
              }}
            >
              Rules
            </button>
          </div>
        </section>
      </div>
    </>
  );
};
export default HomePage;

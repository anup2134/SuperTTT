import { useState, useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";

const Header = () => {
  const [mouseLoc, setMouseLoc] = useState({ x: 0, y: 0 });
  const [cursorSize, setCursorSize] = useState({ width: 0, height: 0 });
  const cursorRef = useRef(null);
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
      <div
        className="opacity-40 rounded-full cursor pointer-events-none"
        ref={cursorRef}
      ></div>
      <header className="title text-5xl pt-4 mb-8 w-[400px] ">
        <div className="flex flex-col items-center justify-center h-svh">
          <h1 className="text-center ">Super Tic Tac Toe</h1>
          <button className="text-base border-white border-2 mt-4 rounded-full px-5 py-2 w-40 right-10 shadow-sm shadow-white">
            Rules
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;

import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
const Timer = ({ freezeTimer, start, player }) => {
  const [time, setTime] = useState(30);

  useEffect(() => {
    setTime(30);
    if (start && !freezeTimer) {
      const timeId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 1) clearInterval(timeId);
          return prevTime - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timeId);
      };
    }
  }, [start]);

  return (
    <div className="text-xl mb-5 flex flex-col justify-center items-center">
      <div className="text-white text-center mb-2">{`(${player})`}</div>
      <div
        className={`border p-3 border-white text-center text-xl w-max rounded-md ${
          start ? "" : "text-neutral-600"
        }`}
      >
        00:{time < 10 ? `0${time}` : time}
      </div>
    </div>
  );
};

export default Timer;

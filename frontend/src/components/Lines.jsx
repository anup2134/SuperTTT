export const HorizontalLine = ({ expand }) => {
  return (
    <div
      className={`${
        expand?.includes("hori") ?? false
          ? expand[expand.length - 1] === "0"
            ? "h-1.5 w-[96%] top-[16.6%]"
            : expand[expand.length - 1] === "1"
            ? "h-1.5 w-[96%] top-[50%]"
            : expand[expand.length - 1] === "2"
            ? "h-1.5 w-[96%] top-[83.3%]"
            : "h-0 w-0"
          : "h-0 w-0"
      } absolute bg-[#04d9ff] transition-all duration-500 rounded-full left-[50%] -translate-x-1/2 -translate-y-1/2`}
    ></div>
  );
};

export const VerticalLine = ({ expand }) => {
  return (
    <div
      className={`${
        expand?.includes("vert") ?? false
          ? expand[expand.length - 1] === "0"
            ? "w-1.5 h-[96%] left-[16.6%]"
            : expand[expand.length - 1] === "1"
            ? "w-1.5 h-[96%] left-[50%]"
            : expand[expand.length - 1] === "2"
            ? "w-1.5 h-[96%] left-[83.3%]"
            : "h-0 w-0"
          : "h-0 w-0"
      } absolute bg-[#04d9ff] transition-all duration-500 rounded-full top-[50%] -translate-y-1/2 -translate-x-1/2`}
    ></div>
  );
};

export const DiagonalLineRight = ({ expand }) => {
  return (
    <div
      className={`${
        expand === "diagRight" ? "w-1.5 h-[135%]" : "h-0 w-0"
      } absolute bg-[#04d9ff] rounded-full transition-all duration-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45`}
    ></div>
  );
};

export const DiagonalLineLeft = ({ expand }) => {
  return (
    <div
      className={`${
        expand === "diagLeft" ? "w-1.5 h-[135%]" : "h-0 w-0"
      } absolute bg-[#04d9ff] rounded-full transition-all duration-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45`}
    ></div>
  );
};

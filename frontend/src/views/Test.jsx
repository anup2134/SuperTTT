import { useState } from "react";
import {
  HorizontalLine,
  VerticalLine,
  DiagonalLineRight,
  DiagonalLineLeft,
} from "../components/Lines";

const Test = () => {
  const [expand, setExpand] = useState(false);
  return (
    <div
      className="relative m-10 w-[100px] h-[100px] border border-white"
      onClick={() => {
        setExpand(true);
      }}
    >
      <HorizontalLine expand={expand} />
      <VerticalLine expand={expand} />
      <DiagonalLineRight expand={expand} />
      <DiagonalLineLeft expand={expand} />
    </div>
  );
};

export default Test;

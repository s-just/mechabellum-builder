// Cell.jsx
import React from "react";

const Cell = ({ children, onClick, onMouseEnter, onMouseLeave, isHovered }) => {
  let result = "cell border border-sky-500 w-full h-full";

  if (isHovered) {
    result += " bg-sky-500";
  }

  return (
    <div
      className={result}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-2 flex items-center justify-center">{children}</div>
    </div>
  );
};

export default Cell;

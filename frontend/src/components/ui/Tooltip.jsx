import React, { useState } from "react";

function Tooltip({ children, text, placement }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipClasses = {
    top: "absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2",
    right: "absolute left-full top-1/2 transform -translate-y-1/2 ml-2",
    bottom: "absolute left-1/2 transform -translate-x-1/2 top-full mt-2",
    left: "absolute right-full top-1/2 transform -translate-y-1/2 -mr-2",
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div
          className={`hidden tooltip-arrow group-hover:block absolute bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 ${tooltipClasses[placement || "top"]}`}
        >
          {text}
        </div>
      )}
    </div>
  );
}

export default Tooltip;

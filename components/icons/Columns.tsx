import React from "react";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      fill="none"
      style={{pointerEvents:'none'}}
      viewBox="0 0 15 15"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.15 14V1H.85v13h1.3zm4 0V1h-1.3v13h1.3zm4-13v13h-1.3V1h1.3zm4 13V1h-1.3v13h1.3z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default Icon;
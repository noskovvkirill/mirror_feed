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
        d="M7 2H1.5a.5.5 0 00-.5.5V7h6V2zm1 0v5h6V2.5a.5.5 0 00-.5-.5H8zM7 8H1v4.5a.5.5 0 00.5.5H7V8zm1 5V8h6v4.5a.5.5 0 01-.5.5H8zM1.5 1A1.5 1.5 0 000 2.5v10A1.5 1.5 0 001.5 14h12a1.5 1.5 0 001.5-1.5v-10A1.5 1.5 0 0013.5 1h-12z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default Icon;
import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}: {label?: string}) {
  return (
    <AccessibleIcon.Root label={label ? label : 'Spaces'}>
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
          d="M2.15 4a1.85 1.85 0 113.7 0 1.85 1.85 0 01-3.7 0zM4 1.25a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5zM5.82 11L2.5 12.837V9.163L5.82 11zM2.64 8.212a.7.7 0 00-1.039.612v4.352a.7.7 0 001.039.613l3.933-2.176a.7.7 0 000-1.225L2.64 8.212zM8.3 9a.7.7 0 01.7-.7h4a.7.7 0 01.7.7v4a.7.7 0 01-.7.7H9a.7.7 0 01-.7-.7V9zm.9.2v3.6h3.6V9.2H9.2zm4.243-7.007a.45.45 0 00-.636-.636L11 3.364 9.193 1.557a.45.45 0 10-.636.636L10.364 4 8.557 5.807a.45.45 0 10.636.636L11 4.636l1.807 1.807a.45.45 0 00.636-.636L11.636 4l1.807-1.807z"
          clipRule="evenodd"
        ></path>
      </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}:{label?:string}) {
  return (
     <AccessibleIcon.Root label={label ? label : 'Stream'}>
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
          d="M.9 7.5a6.6 6.6 0 1113.2 0 6.6 6.6 0 01-13.2 0zm6.6-5.7a5.7 5.7 0 100 11.4 5.7 5.7 0 000-11.4zM3.075 7.5a4.425 4.425 0 118.85 0 4.425 4.425 0 01-8.85 0zM7.5 3.925a3.575 3.575 0 100 7.15 3.575 3.575 0 000-7.15zm0 1.325a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM6.05 7.5a1.45 1.45 0 112.9 0 1.45 1.45 0 01-2.9 0z"
          clipRule="evenodd"
        ></path>
      </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;

import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}:{label?:string}) {
  return (
    <AccessibleIcon.Root label={label ? label : 'Hide'}>
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
          d="M2.25 7.5a.5.5 0 01.5-.5h9.5a.5.5 0 010 1h-9.5a.5.5 0 01-.5-.5z"
          clipRule="evenodd"
        ></path>
      </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
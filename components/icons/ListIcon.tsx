import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}: {label?: string}) {
  return (
   <AccessibleIcon.Root label={label ? label : 'List'}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
       style={{pointerEvents:'none'}}
      fill="none"
      viewBox="0 0 15 15"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1.5 2h12a.5.5 0 01.5.5V7H1V2.5a.5.5 0 01.5-.5zM1 8v4.5a.5.5 0 00.5.5h12a.5.5 0 00.5-.5V8H1zM0 2.5A1.5 1.5 0 011.5 1h12A1.5 1.5 0 0115 2.5v10a1.5 1.5 0 01-1.5 1.5h-12A1.5 1.5 0 010 12.5v-10z"
        clipRule="evenodd"
      ></path>
    </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
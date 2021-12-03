import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}:{label?:string}) {
  return (
      <AccessibleIcon.Root label={label ? label : 'Pin Item'}>
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
          d="M10.329 1.136a.5.5 0 00-.708.707l.653.653-4.848 3.637-1.108-1.108a.5.5 0 00-.707.707l1.414 1.414 1.06 1.061-3.27 3.27a.5.5 0 10.708.708l3.27-3.27 1.06 1.06 1.415 1.414a.5.5 0 10.707-.707L8.867 9.574l3.637-4.848.653.653a.5.5 0 10.707-.707l-1.06-1.061-1.415-1.414-1.06-1.06zm-4.19 5.711l4.85-3.637.8.801-3.636 4.85L6.14 6.846z"
          clipRule="evenodd"
        ></path>
      </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;

import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}:{label?:string}) {
  return (
    <AccessibleIcon.Root label={label ? label : 'Add All'}>
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
        d="M2 3.5a.5.5 0 01.5-.5h10a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5v-6zm0 7.415A1.5 1.5 0 011 9.5v-6A1.5 1.5 0 012.5 2h10A1.5 1.5 0 0114 3.5v6a1.5 1.5 0 01-1 1.415v.585a1.5 1.5 0 01-1.5 1.5h-8A1.5 1.5 0 012 11.5v-.585zM12 11v.5a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5V11h9zM5 6.5a.5.5 0 01.5-.5H7V4.5a.5.5 0 011 0V6h1.5a.5.5 0 010 1H8v1.5a.5.5 0 01-1 0V7H5.5a.5.5 0 01-.5-.5z"
        clipRule="evenodd"
      ></path>
    </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
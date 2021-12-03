import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}:{label?:string}) {
  return (
    <AccessibleIcon.Root label={label ? label : 'Profile'}>
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
          d="M7.5.877a6.623 6.623 0 100 13.246A6.623 6.623 0 007.5.877zM1.827 7.5a5.673 5.673 0 1111.346 0 5.673 5.673 0 01-11.346 0zm3.21 1.714a.5.5 0 10-.82.572A3.996 3.996 0 007.5 11.5c1.36 0 2.56-.679 3.283-1.714a.5.5 0 00-.82-.572A2.996 2.996 0 017.5 10.5a2.996 2.996 0 01-2.463-1.286zm.338-2.364a.875.875 0 100-1.75.875.875 0 000 1.75zm5.125-.875a.875.875 0 11-1.75 0 .875.875 0 011.75 0z"
          clipRule="evenodd"
        ></path>
      </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}:{label?:string}) {
  return (
    <AccessibleIcon.Root label={label ? label : 'Bookmark'}>
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
        d="M3 2.5a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v11a.5.5 0 01-.765.424L7.5 11.59l-3.735 2.334A.5.5 0 013 13.5v-11zM4 3v9.598l2.97-1.856a1 1 0 011.06 0L11 12.598V3H4z"
        clipRule="evenodd"
      ></path>
    </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
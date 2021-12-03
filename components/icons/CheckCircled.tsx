import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}:{label?:string}) {
  return (
    <AccessibleIcon.Root label={label ? label : 'Check'}>
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
        d="M7.5.877a6.623 6.623 0 100 13.246A6.623 6.623 0 007.5.877zM1.827 7.5a5.673 5.673 0 1111.346 0 5.673 5.673 0 01-11.346 0zm8.332-1.962a.5.5 0 00-.818-.576L6.52 8.972 5.357 7.787a.5.5 0 00-.714.7L6.227 10.1a.5.5 0 00.765-.062l3.167-4.5z"
        clipRule="evenodd"
      ></path>
    </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
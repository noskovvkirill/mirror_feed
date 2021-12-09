import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}:{label?:string}) {
  return (
    <AccessibleIcon.Root label={label ? label : 'Drag'}>
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
        d="M5.5 4.625a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zm4 0a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM10.625 7.5a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0zM5.5 8.625a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zm5.125 2.875a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0zM5.5 12.625a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
        clipRule="evenodd"
      ></path>
    </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}: {label?: string}) {
  return (
    <AccessibleIcon.Root label={label ? label : 'Add'}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      id='addicon'
      fill="none"
      style={{pointerEvents:'none'}}
      viewBox="0 0 15 15"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 2.75a.5.5 0 00-1 0V7H2.75a.5.5 0 000 1H7v4.25a.5.5 0 001 0V8h4.25a.5.5 0 000-1H8V2.75z"
        clipRule="evenodd"
      ></path>
    </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
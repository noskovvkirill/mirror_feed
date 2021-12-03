import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}: {label?: string}) {
  return (
    <AccessibleIcon.Root label={label ? label : 'Mirror Feed Icon'}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      style={{position:'relative', top:'-1px', userSelect:'none', pointerEvents:'none'}}
      fill="none"
      viewBox="0 0 15 15"
    >
      <path
        // fill="inherit"
        stroke="currentColor"
        d="M12.123 4.41c.25.569.377 1.177.377 1.79V13a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5V6.2c0-.613.128-1.221.377-1.79a4.69 4.69 0 011.077-1.524 5.031 5.031 0 011.624-1.025 5.277 5.277 0 013.844 0c.61.239 1.16.588 1.624 1.025.463.438.828.956 1.077 1.525z"
      ></path>
      <path stroke="currentColor" strokeLinecap="round" d="M2.5 13l10-6.5"></path>
    </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
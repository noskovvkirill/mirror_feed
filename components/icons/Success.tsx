import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}:{label?:string}) {
  return (
    <AccessibleIcon.Root label={label ? label : 'Success'}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        id='successicon'
        height="15"
        style={{pointerEvents:'none'}}
        fill="none"
        viewBox="0 0 15 15"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M11.467 3.727c.289.189.37.576.181.865l-4.25 6.5a.625.625 0 01-.944.12l-2.75-2.5a.625.625 0 01.841-.925l2.208 2.007 3.849-5.886a.625.625 0 01.865-.181z"
          clipRule="evenodd"
        ></path>
      </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
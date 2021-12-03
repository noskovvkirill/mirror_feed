import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}: {label?: string}) {
  return (
    <AccessibleIcon.Root label={label ? label : 'Unpin item'}>
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
          d="M9.621 1.136a.5.5 0 01.707 0l1.061 1.06 1.414 1.415 1.06 1.06a.5.5 0 11-.706.708l-.653-.653-3.637 4.848 1.108 1.108a.5.5 0 01-.707.707L7.854 9.975l-1.061-1.06-3.27 3.27a.5.5 0 11-.708-.708l3.27-3.27-1.06-1.06-1.414-1.415a.5.5 0 11.707-.707l1.108 1.108 4.848-3.637-.653-.653a.5.5 0 010-.707z"
          clipRule="evenodd"
        ></path>
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M9.621 1.136a.5.5 0 01.707 0l1.061 1.06 1.414 1.415 1.06 1.06a.5.5 0 11-.706.708l-.653-.653-3.637 4.848 1.108 1.108a.5.5 0 01-.707.707L7.854 9.975l-1.061-1.06-3.27 3.27a.5.5 0 11-.708-.708l3.27-3.27-1.06-1.06-1.414-1.415a.5.5 0 11.707-.707l1.108 1.108 4.848-3.637-.653-.653a.5.5 0 010-.707z"
          clipRule="evenodd"
        ></path>
      </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}: {label?: string}) {
  return (
    <AccessibleIcon.Root label={label ? label : 'Notifications'}>
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
          d="M8.601 1.25a1.1 1.1 0 01-.8 1.06A4.5 4.5 0 0112 6.8v3.45c0 .806.033 1.457.724 1.803A.5.5 0 0112.5 13H8.161a1 1 0 11-1.323 0H2.5a.5.5 0 01-.224-.947c.691-.346.724-.997.724-1.803V6.8a4.5 4.5 0 014.2-4.49 1.1 1.1 0 111.401-1.06zM7.5 3.3A3.5 3.5 0 004 6.8v3.5c0 .446.001 1.108-.3 1.7h7.6c-.301-.592-.3-1.254-.3-1.7V6.8a3.5 3.5 0 00-3.5-3.5z"
          clipRule="evenodd"
        ></path>
      </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
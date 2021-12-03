import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({label}:{label?:string}) {
  return (
    <AccessibleIcon.Root label={label ? label : 'Explore'}>
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
        d="M7.5 1.8a5.7 5.7 0 100 11.4 5.7 5.7 0 000-11.4zM.9 7.5a6.6 6.6 0 1113.2 0 6.6 6.6 0 01-13.2 0z"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M13.5 7.9h-12v-.8h12v.8z"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.1 13.5v-12h.8v12h-.8zm3.275-6c0-2.173-.781-4.322-2.313-5.743l.476-.514c1.702 1.58 2.537 3.93 2.537 6.257 0 2.327-.835 4.678-2.537 6.257l-.476-.514c1.532-1.42 2.313-3.57 2.313-5.743zM4 7.5c0-2.324.808-4.673 2.458-6.253l.484.506C5.458 3.173 4.7 5.323 4.7 7.5c0 2.176.758 4.327 2.242 5.747l-.484.506C4.808 12.173 4 9.823 4 7.5z"
        clipRule="evenodd"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.5 3.958c2.17 0 4.375.401 5.87 1.236a.35.35 0 11-.34.612c-1.35-.754-3.422-1.148-5.53-1.148s-4.18.394-5.53 1.148a.35.35 0 11-.34-.612c1.495-.835 3.7-1.236 5.87-1.236zm0 6.892c2.17 0 4.375-.401 5.87-1.236a.35.35 0 10-.34-.612c-1.35.754-3.422 1.148-5.53 1.148s-4.18-.394-5.53-1.148a.35.35 0 10-.34.611c1.495.836 3.7 1.237 5.87 1.237z"
        clipRule="evenodd"
      ></path>
    </svg>
    </AccessibleIcon.Root>
  );
}

export default Icon;
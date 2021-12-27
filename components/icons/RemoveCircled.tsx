import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({ label }: { label?: string }) {
    return (
        <AccessibleIcon.Root label={label ? label : 'Remove'}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                style={{ pointerEvents: 'none' }}
                fill="none"
                viewBox="0 0 15 15"
            >
                <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M.877 7.5a6.623 6.623 0 1113.246 0 6.623 6.623 0 01-13.246 0zM7.5 1.827a5.673 5.673 0 100 11.346 5.673 5.673 0 000-11.346zm2.354 3.32a.5.5 0 010 .707L8.207 7.5l1.647 1.646a.5.5 0 01-.708.708L7.5 8.207 5.854 9.854a.5.5 0 01-.708-.708L6.793 7.5 5.146 5.854a.5.5 0 01.708-.708L7.5 6.793l1.646-1.647a.5.5 0 01.708 0z"
                    clipRule="evenodd"
                ></path>
            </svg>
        </AccessibleIcon.Root>
    );
}

export default Icon;
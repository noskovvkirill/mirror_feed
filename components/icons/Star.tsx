import React from "react";
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';

function Icon({ label }: { label?: string }) {
    return (
        <AccessibleIcon.Root label={label ? label : 'Notifications'}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                fill="none"
                viewBox="0 0 15 15"
            >
                <path
                    fill="currentColor"
                    d="M7.223.666a.3.3 0 01.554 0L9.413 4.6a.3.3 0 00.253.184l4.248.34a.3.3 0 01.171.528L10.85 8.424a.3.3 0 00-.097.297l.99 4.145a.3.3 0 01-.45.326L7.657 10.97a.3.3 0 00-.312 0l-3.637 2.222a.3.3 0 01-.448-.326l.989-4.145a.3.3 0 00-.097-.297L.915 5.652a.3.3 0 01.171-.527l4.248-.34a.3.3 0 00.253-.185L7.223.666z"
                ></path>
            </svg>
        </AccessibleIcon.Root>
    );
}

export default Icon;
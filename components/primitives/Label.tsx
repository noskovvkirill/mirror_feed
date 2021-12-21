import { styled } from "stitches.config";

const Label = styled("span", {
    userSelect: "none",
    variants: {
        color: {
            default: {
                color: 'inherit'
            },
            foreground: {
                color: '$foregroundText'
            },
            error: {
                color: '$error'
            }
        },
        size: {
            default: {
                fontSize: '$6'
            },
            normal: {
                fontSize: '$p'
            }
        }
    },
    defaultVariants: {
        color: "default",
        size: 'default'
    },
});

export default Label;
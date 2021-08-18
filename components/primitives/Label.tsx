import { styled } from "stitches.config";

const Label = styled("span", {
    fontSize: "$6",
    userSelect: "none",
    variants: {
        color: {
            default: {
            },
        },
    },
    defaultVariants: {
        color: "default",
    },
});

export default Label;
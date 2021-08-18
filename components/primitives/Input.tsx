import { styled } from "stitches.config";

const Input = styled("input", {
    padding: "$0 $2",
    borderRadius: "$1",
    border: "1px solid lightgray",
    color: "black",
    variants: {
        state: {
            error: {
                border: "1px solid red",
                color: "black",
            },
            normal: {
                border: "1px solid lightgray",
                color: "black",
            },
        },
    },
    defaultVariants: {
        state: "normal",
    },
});

export default Input;

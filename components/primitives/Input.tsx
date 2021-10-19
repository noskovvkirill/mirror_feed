import { styled } from "stitches.config";

const Input = styled("input", {
    padding: "$1 $2",
    borderRadius: "$2",
    backgroundColor:'transparent',
    border: "1px solid $foregroundBorder",
    // color: "$foregroundText",
    fontSize:'$6', 
    boxSizing:'border-box',
    variants: {
        state: {
            error: {
                border: "1px solid red",
                color: "black",
            },
            normal: {
                border: "1px solid $foregroundBorder",
                color:'$foregroundText',
            },
        },
    },
    defaultVariants: {
        state: "normal",
    },
});

export default Input;

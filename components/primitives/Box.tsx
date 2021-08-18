import { styled } from "stitches.config";

const Box = styled("div", {
    padding: 0,
    variants: {
        look: {
            default: {
            },
        },
        layout: {
            default: {
                display: "auto",
            },
            flexBoxRow: {
                display: "flex",
                flexDirection: "row",
                gap: "$1",
            },
            flexBoxColumn: {
                display: "flex",
                flexDirection: "column",
                gap: "$1",
            },
        },
    },
    defaultVariants: {
        look: "default",
        layout: "default",
    },
});
export default Box;
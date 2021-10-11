import { styled } from "../../stitches.config";

const StyledButton = styled("button", {
    transition: "$background",
    userSelect: "none",
    fontSize: "$6",
    padding: "$1 $2",
    width: "fit-content",
    borderRadius: "$2",
    display: "flex",
    cursor: "pointer",
    lineHeight: "130%",
    height: "fit-content",
    whiteSpace: "nowrap",
    background:'transparent',
    // backgroundColor: "rgba(255,255,255,0.75)",
    // mixBlendMode:'multiply',
    // backdropFilter:'opacity(0.75)',
    border: "0",
    variants: {
        look: {
            default: {
                border:'1px solid $foreground',
                color:'$foregroundText',
                "&:focus": {
                    
                },
                "&:active": {
                   
                },
                "&:hover": {
                    color:'$background',
                    backgroundColor:'$foregroundBronze',
                    border:'1px solid $foregroundBronze'
                },
                "&:disabled": {
                    color:'$background',
                    backgroundColor:'$foregroundBronze',
                    border:'1px solid $foregroundBronze'
                },
            },
            outlined: {
               
                "&:hover": {
                  
                },
                "&:focus": {
               
                },
                "&:active": {
                  
                },
                "&:disabled": {
                  
                },
            },
        },
    },
    defaultVariants: {
        look: "default",
    },
});

export default StyledButton;
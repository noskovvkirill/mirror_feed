import { styled } from "../../stitches.config";

const StyledButton = styled("button", {
    transition: "$background",
    userSelect: "none",
    fontSize: "$p",
    padding: "$1 $3",
    width: "fit-content",
    borderRadius: "$1",
    display: "flex",
    cursor: "pointer",
    lineHeight: "130%",
    height: "fit-content",
    whiteSpace: "nowrap",
    backgroundColor: "transparent",
    border: "0",
    variants: {
        look: {
            default: {
        
                "&:focus": {
                    
                },
                "&:active": {
                   
                },
                "&:hover": {
                    
                },
                "&:disabled": {
                    
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
import { styled } from "stitches.config"

const StyledTag = styled("div", {
    padding:'$0 $2',
    fontSize:'$6',
    borderRadius:'$round',
    whiteSpace:'nowrap',
    userSelect:'none',
    height:'fit-content',
    width:'fit-content',
    variants:{
        color:{ 
            default:{
              backgroundColor:'$highlight',
              color:'$foregroundText',
            },
            foreground:{
              backgroundColor:'$foreground',
              color:'$background',
            }  
        },
        isHighlighted:{
            true:{
                backgroundColor:'$foregroundTintBronze',
                color:'$foregroundTextBronze',
            },
            false:{
                  backgroundColor:'$highlight',
                  color:'$foregroundText',
            },
      }
    },
   defaultVariants:{
       color:'default',
       isHighlighted:'false',
   }
})

export default StyledTag
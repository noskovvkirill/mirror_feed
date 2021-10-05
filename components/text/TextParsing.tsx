import {styled} from 'stitches.config'
import { ReactPropTypes } from 'react'
import Box from '@/design-system/primitives/Box'

export const StyledImage = styled('img', {
    maxWidth:'100%',
    margin:'$2 0',
    variants:{
        inline:{
            true:{
                maxHeight:'480px',
            },
            false:{
                maxHeight:'70vh',
            }
        }
    },
    defaultVariants:{
        inline:true
    }
})

export const StyledLabel = styled('span',{
    display:'inline-block',
    padding:'$0 $2',
    borderRadius:'$round',
    fontSize:'$6',
    mixBlendMode:'multiply',
    transition:'$all',
    variants:{
        isHighlighted:{
            true:{
                backgroundColor:'$highlightBronze',
                color:'$foregroundTextBronze',
            },
            false:{
                  backgroundColor:'$highlight',
                  color:'$foregroundText',
            }
        }
    },
    defaultVariants:{
        isHighlighted:false
    }
})

export const StyledLink = styled('a', {
   fontSize:'$p',
   color:'$foregroundText',
   cursor:'pointer',
   transition:'$color',
   whiteSpace:'break-spaces',
   wordBreak:'break-all',
   textDecoration:'none',
   '&:hover':{
       textShadow:'$normal',
        color:'$foregroundText'
   },
})

export const StyledH1 = styled('h1', {
    fontSize:'$1',
    maxWidth:'720px',
    whiteSpace:'break-spaces',
   wordBreak:'break-all',
     variants:{
        isHighlighted:{
            true:{
                color:'$textBronze',
            },
            false:{
                  color:'$text',
            }
        }
    },
     defaultVariants:{
        isHighlighted:false
    }
})
export const StyledH2 = styled('h2', {
    fontSize:'$3',
    maxWidth:'720px',
    whiteSpace:'break-spaces',
    wordBreak:'break-all',
     variants:{
        isHighlighted:{
            true:{
                color:'$textBronze',
            },
            false:{
                  color:'$text',
            }
        }
    },
     defaultVariants:{
        isHighlighted:false
    }
})
export const StyledH3 = styled('h3', {
    fontSize:'$3',
    maxWidth:'720px',
    whiteSpace:'break-spaces',
   wordBreak:'break-all',
     variants:{
        isHighlighted:{
            true:{
                color:'$textBronze',
            },
            false:{
                  color:'$text',
            }
        }
    },
     defaultVariants:{
        isHighlighted:false
    }
})
export const StyledH4 = styled('h4', {
    fontSize:'$4',
    maxWidth:'720px',
    whiteSpace:'break-spaces',
   wordBreak:'break-all',
     variants:{
        isHighlighted:{
            true:{
                color:'$textBronze',
            },
            false:{
                  color:'$text',
            }
        }
    },
     defaultVariants:{
        isHighlighted:false
    }
})
export const StyledH5 = styled('h5', {
    fontSize:'$5',
    maxWidth:'720px',
    whiteSpace:'break-spaces',
   wordBreak:'break-all',
     variants:{
        isHighlighted:{
            true:{
                color:'$textBronze',
            },
            false:{
                  color:'$text',
            }
        }
    },
     defaultVariants:{
        isHighlighted:false
    }
})


export const Embeds = (props:ReactPropTypes & {href:string, children:React.ReactNode}) => {
    const myReg = `://`;
    if(props?.href.split(myReg)[0] === 'auction'){
        return(
            <Box css={{padding:'$1 $1 $4 $1', opacity:0.5, borderRadius:'$2', backgroundColor:'LightBlue'}}>
                <h5>AUCTION</h5>
                {props.children}
            </Box>
        )
    }

    if(props?.href.split(myReg)[0] === 'ethereum'){
        return(
            <Box css={{padding:'$1 $1 $4 $1', opacity:0.5, borderRadius:'$2', backgroundColor:'LightBlue'}}>
                <h5>ETHEREUM</h5>
                {props.children}
            </Box>
        )
    }

    return(
        <StyledLink {...props}/>
    )
}

export const StyledToc = styled('nav', {
    color:'red',
    padding:'$2',
    top:'256px',
    position:'sticky',
    'a':{
        color:'$foregroundBronze',
        fontSize:'$6',
        marginBottom:'$2'
    },
    'ol':{
        listStyle:'none'
    },
    'li':{
        marginBottom:'$2'
    }
})
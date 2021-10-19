import {styled} from 'stitches.config'

export const StyledList = styled('ul', {
    listStyle:'none',
    color:'$foregroundBronzeText',
    padding:'$2 0',
    li:{    
        color:'$foregroundBronzeText',
        marginBottom:'$2',
        '&:before':{
              content: "\u2022",
              color:'$foregroundBronzeText',
              opacity:0.3,
              display:'inline-block',
              width:'1em',
              marginRight:'$1'
        }
    },
    strong:{
        fontFamily:'Satoshi Variable',
        fontWeight:'$max'
    },
    b:{
        fontFamily:'Satoshi Variable',
        fontWeight:'$max'
    }
})


export const StyledQuote = styled('blockquote', {
    padding:'$0 $2',
    borderLeft:'1px solid $foregroundBronze',
    margin:'$2 0'
})

export const StyledImage = styled('img', {
    maxWidth:'100%',
    margin:'$2 0',
    borderRadius:'$2',
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
    userSelect:'none',
    // mixBlendMode:'multiply',
    transition:'$all',
    variants:{
        isHighlighted:{
            true:{
                backgroundColor:'$foregroundTintBronze',
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
   hyphens:'auto',
   '&:hover':{
       textShadow:'$normal',
        color:'$foregroundText'
   },
})

export const StyledH1 = styled('h1', {
    fontSize:'$1',
    maxWidth:'720px',
    whiteSpace:'break-spaces',
    // wordBreak:'break-all',
    hyphens:'auto',
    '&:target':{
        backgroundColor:'$foregroundBronze'
    },
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
    // wordBreak:'break-all',
    hyphens:'auto',
    '&:target':{
        backgroundColor:'$foregroundBronze'
    },
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
    // wordBreak:'break-all',
    hyphens:'auto',
    '&:target':{
        backgroundColor:'$foregroundBronze'
    },
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
    // wordBreak:'break-all',
    hyphens:'auto',
    '&:target':{
        backgroundColor:'$foregroundBronze'
    },
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
    // wordBreak:'break-all',
    hyphens:'auto',
    '&:target':{
        backgroundColor:'$foregroundBronze'
    },
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





export const StyledToc = styled('nav', {
    color:'$foregroundBronze',
    padding:'$2',
    paddingLeft:'calc($3 + 4px)',
    top:'256px',
    overflow:'scroll',
    position:'sticky',
    listStyle:'inside',
    'a':{
        userSelect:'none',
        opacity:0.5,
        color:'$foregroundBronze',
        fontSize:'$6',
        marginBottom:'$2',
        marginLeft:'-$1',
        // expand the reach of the text 
        //     '&::before': {
        //     content: '""',
        //     position: 'absolute',
        //     top: '50%',
        //     left: '50%',
        //     transform: 'translate(-50%, -50%)',
        //     width: '100%',
        //     height: '100%',
        //     minWidth: 44,
        //     minHeight: 44,
        // },
        '&:active':{
        backgroundColor:'$foregroundBronze'
        },
    },
    'ul':{
         listStyle:'none'
    },
    'ol':{
        listStyle:'none'
    },
    'li':{
        paddingLeft:'1px',
        marginBottom:'$2'
    }
})
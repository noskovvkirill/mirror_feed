import {styled} from 'stitches.config'
import { ReactPropTypes } from 'react'
import Box from '@/design-system/primitives/Box'
import Proposal from '@/design-system/text/Proposal'
import Editions from '@/design-system/text/Editions'
import LinkPreview from '@/design-system/text/LinkPreview'
import Nft from '@/design-system/text/Nft'

export const StyledList = styled('ul', {
    listStyle:'circle',
    color:'$foregroundBronzeText',
    padding:'$2 0',
    li:{    
        color:'$foregroundBronzeText',
        marginBottom:'$2'
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
    hyphens:'auto',
//    wordBreak:'break-all',
//    textDecoration:'none',
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








export const Embeds = (props:ReactPropTypes & {href:string, children:React.ReactNode}) => {
    const myReg = `://`;
    if(props?.href.split(myReg)[0] === 'auction'){
        return(
            <Box css={{padding:'$1 $1 $4 $1', display:'inline-flex', opacity:0.5, borderRadius:'$2', backgroundColor:'LightBlue'}}>
                <h5>AUCTION</h5>
                {props.children}
         
            </Box>
        )
    }

    if(props?.href.split(myReg)[0] === 'proposal'){
        return(<Proposal cid={props?.href.split(myReg)[1]}/>)
    }


    if(props?.href.split(myReg)[0] === 'edition'){
        const editions = new URLSearchParams(props?.href.split(myReg)[1].split('?')[1]).get('editionId')
        const contract = props?.href.split(myReg)[1].split('?')[0]
        return(
            // <></>
           <Editions editionId={Number(editions)} editionContractAddress={contract}/>
        )
        // return(<Editions cid={props?.href.split(myReg)[1]}/>)
    }

    if(props?.href.split(myReg)[0] === 'ethereum'){
        const links = props?.href.split(myReg)[1].split('/')
        return(
            <Nft contract={links[0]} tokenId={links[1]}/> 
        )
    }

    // if(props?.href.slice)
    // return(
    //     <LinkPreview {...props}/>
    // )

    return(
        <StyledLink {...props}/>
    )
}

export const StyledToc = styled('nav', {
    color:'$foregroundBronze',
    padding:'$2',
    paddingLeft:'$2',
    top:'256px',
    position:'sticky',
    listStyle:'inside',
    'a':{
        userSelect:'none',
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
         listStyle:'inside'
    },
    'ol':{
        listStyle:'inside'
    },
    'li':{
        paddingLeft:'1px',
        marginBottom:'$2'
    }
})
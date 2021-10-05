import {styled} from 'stitches.config'
//types
import {Entry} from '@/design-system/Article'
//primitives
import {StyledLabel} from '@/design-system/text/TextParsing'
import Box from '@/design-system/primitives/Box'
import Button from '@/design-system/primitives/Button'
//icons
import LinkIcon from '@/design-system/icons/Link'
//dayjs
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export interface BodyExternal {}
export interface BodyInternal extends BodyExternal {
    entry:Entry,
    body:React.ReactElement<unknown, string | React.JSXElementConstructor<any>>,
    isPreview?:boolean;
    isHover:boolean,
    isFocused:boolean;
    Open:(digest:string) => void;
}


const StyledMetadata = styled('div', {
    display:'flex',
    position:'relative',
    top:'calc($1 / 2)',
    gap:'$0', 
    alignItems:'center',
    justifyContent:'flex-start',
    marginBottom:"$1"
})


const StyledTitle = styled('div', {
    display:'flex',
    gap:'$1',
    alignItems:'center',
    maxWidth:'720px',
    whiteSpace:'break-spaces',
    'h1':{
        fontSize:"$1",
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

const StyledBody = styled('div', {
    display:'flex',
    width:'100%',
    variants:{
        isPreview:{
            true:{
                justifyContent:'flex-start',
            },
            false:{
                justifyContent:'center',
            }
        }
    },
    defaultVariants:{
        isPreview:true
    }
})


const StyledContents = styled('article',{
    overflow:'hidden',
    marginRight:'calc($4 * 1.5)',
    width:'768px',
     variants:{
        isHighlighted:{
            true:{
                '*':{
                   color:'$textBronze', 
                }
            },
            false:{
                  '*':{
                   color:'$textBronze', 
                }
            }
        }
    },
     defaultVariants:{
        isHighlighted:false
    }
})


const BodyComponent = (
    {
        entry,
        body,
        Open,
        isPreview=true,
        isHover,
        isFocused
    }:BodyInternal
) => (
    <StyledBody isPreview={isPreview}>
        <StyledContents isHighlighted={(isHover || isFocused) ? true : false}>
            <StyledMetadata>
                <StyledLabel isHighlighted={(isHover || isFocused) ? true : false}>{entry.author.displayName}</StyledLabel>
                <StyledLabel isHighlighted={(isHover || isFocused) ? true : false}>{dayjs.unix(entry.timestamp).fromNow() }</StyledLabel>
                <StyledLabel isHighlighted={(isHover || isFocused) ? true : false} css={{backgroundColor:'transparent', padding:'0 $1', cursor:'pointer'}} as='a' rel="noreferrer" href={`https://${entry.publication.ensLabel}.mirror.xyz/${entry.digest}`} target='_blank'><LinkIcon/></StyledLabel>
            </StyledMetadata>
            <StyledTitle isHighlighted={(isHover || isFocused) ? true : false}>
                <h1 style={{cursor:'pointer'}} onClick={()=>{
                    Open(`/article/${entry.digest}`)
                }}>{entry.title}</h1>
            </StyledTitle>
            {body}
            {!isPreview && (
                  <Box layout='flexBoxRow' css={{padding:'$2 0'}}>
                                <Button>remove from the reading list</Button>
                                <Button>Next: Bla-Bla</Button>
                  </Box>
            )}
        </StyledContents>
    </StyledBody>
)


export default BodyComponent
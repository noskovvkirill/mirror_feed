import {styled} from 'stitches.config'
//types
import {Entry} from '@/design-system/Article'
import {ReadingListItem} from 'contexts'
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
    readingList:ReadingListItem[],
    isPreview?:boolean;
    isHover:boolean,
    isFocused:boolean;
    Open:(digest:string) => void;
    setReadLater:(fn:(prevState:ReadingListItem[]) => ReadingListItem[]) => void;
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
        readingList,
        Open,
        isPreview=true,
        isHover,
        setReadLater,
        isFocused
    }:BodyInternal
) => (
    <StyledBody isPreview={isPreview}>
        <StyledContents isHighlighted={(isHover || isFocused) ? true : false}>
            <StyledMetadata>
                <StyledLabel isHighlighted={(isHover || isFocused) ? true : false}>{entry.author?.displayName ? entry.author.displayName : entry.author?.address?.slice(0,8)}</StyledLabel>
                <StyledLabel isHighlighted={(isHover || isFocused) ? true : false}>{dayjs.unix(entry.timestamp).fromNow() }</StyledLabel>
                {entry.publication?.ensLabel && (
                     <StyledLabel isHighlighted={(isHover || isFocused) ? true : false} css={{backgroundColor:'transparent', padding:'0 $1', cursor:'pointer'}} as='a' rel="noreferrer" href={`https://${entry.publication?.ensLabel}.mirror.xyz/${entry.digest}`} target='_blank'><LinkIcon/></StyledLabel>
                )}
                {!entry.publication?.ensLabel && (
                     <StyledLabel isHighlighted={(isHover || isFocused) ? true : false} css={{backgroundColor:'transparent', padding:'0 $1', cursor:'pointer'}} as='a' rel="noreferrer" href={`https://mirror.xyz/${entry.author.address}/${entry.digest}`} target='_blank'><LinkIcon/></StyledLabel>
                )}
            </StyledMetadata>
            <StyledTitle isHighlighted={(isHover || isFocused) ? true : false}>
                <h1 style={{cursor:'pointer'}} onClick={()=>{
                      entry.publication?.ensLabel 
                    ?  Open(`/${entry.publication?.ensLabel ? entry.publication?.ensLabel : entry.author.address}/${entry.digest}`)
                    :  Open(`/${entry.author.address}/${entry.digest}`)
                }}>{entry.title}</h1>
            </StyledTitle>
            {body}
            {!isPreview && (
                  <Box layout='flexBoxRow' css={{padding:'$2 0'}}>
                      {(readingList?.findIndex((item)=>item.entryDigest === entry.digest) !== -1) && (
                          <Button 
                                onClick={()=>{
                                    setReadLater((prevState:ReadingListItem[])=>{
                                    const indexUnPin = prevState.findIndex((itemPrev:ReadingListItem)=>itemPrev.entryDigest=== entry.digest)
                                    const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                                    return newArray
                                })}}
                                >Remove from the reading list</Button>
                      )}

                    

                      {/* {readingList && readingList[readingList?.findIndex((item)=>item.entryDigest === entry.digest) +1] 
                      ?  <>hasMore</>
                      :  <>has no more</>
                      } */}

                        {readingList.filter(item=>item.entryDigest !== entry.digest).length > 0 
                        ? <Button>Next: {readingList.filter(item=>item.entryDigest !== entry.digest)[0]?.title}</Button>
                        : <Box as='span' layout='flexBoxRow' css={{color:'$foregroundText', alignItems:'center', fontSize:'$6'}}>Your reading list is empty ✨</Box>
                        }
                  </Box>
            )}
        </StyledContents>
    </StyledBody>
)


export default BodyComponent
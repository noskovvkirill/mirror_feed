import {styled} from 'stitches.config'
import Button from '@/design-system/primitives/Button'
import React from 'react'
import {StyledImage, StyledLabel, StyledH1, StyledH2, StyledH3, StyledH4, StyledH5, StyledLink} from '@/design-system/text/TextParsing'
import LinkIcon from '@/design-system/icons/Link'
import AddIcon from '@/design-system/icons/Add'
import OpenIcon from '@/design-system/icons/Open'
import PinIcon from '@/design-system/icons/Pin'
import UnPinIcon from '@/design-system/icons/UnPin'
import RemoveIcon from '@/design-system/icons/Remove'

import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
// @ts-ignore
import rehypeTruncate from "rehype-truncate";
import remarkGfm from 'remark-gfm'
import {unified} from 'unified' 
import rehypeReact from 'rehype-react'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

import {useRouter} from 'next/router'
import useOnScreen from 'hooks/useOnScreen'
import {useRef} from 'react'
import ButtonControl from '@/design-system/primitives/ButtonControl'

//global state
//global state
import {ignoredPublication, pinnedItems, PinnedItem, IgnoredPublication, ReadingListItem} from 'contexts'
import { useRecoilState, useSetRecoilState} from 'recoil'

interface Props {
    entry: Entry;
    pinned:boolean,
}
export type Entry = {
  id:string,
  digest:string,
  timestamp:number,
  author:{
      displayName:string;
  },
  publication:{
      ensLabel:string;
  }
  title:string,
  body:any
}


const StyledContainer = styled('div',{
    display:'flex',
    flexDirection:'row',
    maxWidth:'1152px', 
    padding:'$4 $2',
    margin:'calc($4 * 1) 0',
    color:'$text',
    borderRadius:'$2',
    transition:'$background',
    variants:{
        isHighlighted:{
            true:{
                backgroundColor:'$highlightBronze',
            },
            false:{
                backgroundColor:'$background',
            }
        }
    },
    defaultVariants:{
        isHighlighted:false
    }
})

const StyledHeader = styled('div',{
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      gap:'$1',
      height:'100%',
      maxHeight:'640px',
      borderRadius:'$round',
      padding:'0',
      margin:'$2 $2 $2 0',
      width:'32px',
      color:'$foreground',
      mixBlendMode:'multiply',
     transition:'$all',
      cursor:'pointer',
      'h5':{
          userSelect:'none',
          whiteSpace:'nowrap',
          fontWeight:'400',
          transform:'rotate(-90deg)'
      },
       variants:{
        isHighlighted:{
            true:{
                '&:hover':{
                    backgroundColor:'$highlightBronze',
                    color:'$foregroundTextBronze',
                },
            },
            false:{
                '&:hover':{
                    backgroundColor:'$highlight',
                    color:'$foregroundText'
                },
            }
        }
    },
     defaultVariants:{
        isHighlighted:false
    }
})

const StyledMetadata = styled('div', {
    display:'flex',
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
        marginBottom:'$4'
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

const StyledBody = styled('div',{
    overflow:'hidden',
    marginRight:'calc($4 * 1.5)',
    width:'100%',
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

const StyledControls = styled('div',{
    display:'flex',
    flexDirection:'column',
    gap:'$1',
    padding:'0 $2 $1 $2',
    marginRight:'$2',
    width:'fit-content',
    boxSizing:'border-box',
    overflow:'hidden',
})


const StyledImageHidden = styled(StyledImage,{
    display:'none'
})



const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeTruncate, { maxChars: 1000, ignoreTags: ["ul", "h5", "h3", "h2", "h1"]  })
  .use(rehypeReact, {createElement: React.createElement, Fragment:React.Fragment, components:{
      img: StyledImageHidden,
      h1: StyledH1,
      h2: StyledH2,
      h3: StyledH3,
      h4: StyledH4,
      h5:StyledH5,
      a:StyledLink
  }})

function shorten(str:string, maxLen:number, separator = ' ') {
  if (str.length <= maxLen) return str;
  return str.substr(0, str.lastIndexOf(separator, maxLen));
} //that is a weird way to shorten the text, because I do that to markdown and may touch the styling symbols

const ArticlePreview = ({entry, pinned}:Props) => {
    const router = useRouter()
    const ref = useRef<HTMLDivElement | null>(null)
    const el = useOnScreen(ref, {threshold:1})
    const isFocused = !!el?.isIntersecting
    const setIgnoredList = useSetRecoilState(ignoredPublication)
    const setPinnedItem = useSetRecoilState(pinnedItems)

    if(pinned){
        return(
        <StyledContainer 
            css={{ width:'256px', height:'128px', flexDirection:'column', margin:'0', mixBlendMode:'multiply'}}
            isHighlighted={true}
            ref={ref}>
                    <StyledControls css={{flexDirection:'row', padding:'0', margin:'0',overflow:'visible', height:'fit-content'}}>
                        <ButtonControl
                        isHighlighted={true}
                        label='open'
                        onClick={()=>router.push(`/article/${entry.digest}`)}><OpenIcon/></ButtonControl>
                        <ButtonControl
                        label='to reading list'
                        isHighlighted={true}
                        onClick={()=>router.push(`/article/${entry.digest}`)}><AddIcon/></ButtonControl>
                        <ButtonControl
                            label='unpin item'
                            isHighlighted={true}
                            onClick={()=>
                            setPinnedItem((prevState:PinnedItem[])=>{
                                const indexUnPin = prevState.findIndex((item:PinnedItem)=>item.entry.digest === entry.digest)
                                const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                                return newArray
                            })
                            }><UnPinIcon/>
                        </ButtonControl>
                        {/* <ButtonControl
                        label='ignore this publication'
                        isHighlighted={isFocused}
                        onClick={()=>
                        setIgnoredList((prevState:IgnoredPublication[])=>[...prevState, {ensLabel:entry.publication.ensLabel}])
                        }><RemoveIcon/></ButtonControl> */}
                        {/* <StyledHeader isHighlighted={isFocused}>
                            <h5>{entry.publication.ensLabel}</h5>
                        </StyledHeader> */}

                    </StyledControls>
                    <StyledBody isHighlighted={true} css={{padding:'0', margin:0}}>
                        {/* <StyledMetadata> */}
                            {/* <StyledLabel isHighlighted={isFocused}>{entry.author.displayName}</StyledLabel> */}
                            {/* <StyledLabel isHighlighted={isFocused}>{dayjs.unix(entry.timestamp).fromNow() }</StyledLabel> */}
                            {/* <StyledLabel isHighlighted={isFocused} css={{backgroundColor:'transparent', padding:'0 $1', cursor:'pointer'}} as='a' rel="noreferrer" href={`https://${entry.publication.ensLabel}.mirror.xyz/${entry.digest}`} target='_blank'><LinkIcon/></StyledLabel> */}
                        {/* </StyledMetadata> */}
                        <StyledTitle css={{padding:0, margin:0}} isHighlighted={isFocused}>
                            <p style={{padding:0, margin:'16px 0px'}}>{entry.title}</p>
                        </StyledTitle>
                        {/* {processor.processSync(shorten(entry.body,2000)).result} */}
                    </StyledBody>
            </StyledContainer>
        )}

    return(
            <StyledContainer 
            isHighlighted={isFocused}
            ref={ref}>
                    <StyledControls>
                        <ButtonControl
                        isHighlighted={isFocused}
                        label='open'
                        onClick={()=>router.push(`/article/${entry.digest}`)}><OpenIcon/></ButtonControl>
                        <ButtonControl
                        label='to reading list'
                        isHighlighted={isFocused}
                        onClick={()=>router.push(`/article/${entry.digest}`)}><AddIcon/></ButtonControl>
                        <br/>
                        <ButtonControl
                            label='pin on top'
                            isHighlighted={isFocused}
                            onClick={()=>
                            setPinnedItem((prevState:PinnedItem[])=>[...prevState, {entry:entry}])
                            }><PinIcon/>
                        </ButtonControl>
                       
                  
                        <ButtonControl
                        label='ignore this publication'
                        isHighlighted={isFocused}
                        onClick={()=>
                        setIgnoredList((prevState:IgnoredPublication[])=>[...prevState, {ensLabel:entry.publication.ensLabel}])
                        }><RemoveIcon/></ButtonControl>
                        <StyledHeader isHighlighted={isFocused}>
                            <h5>{entry.publication.ensLabel}</h5>
                        </StyledHeader>

                    </StyledControls>
                    <StyledBody isHighlighted={isFocused}>
                        <StyledMetadata>
                            <StyledLabel isHighlighted={isFocused}>{entry.author.displayName}</StyledLabel>
                            <StyledLabel isHighlighted={isFocused}>{dayjs.unix(entry.timestamp).fromNow() }</StyledLabel>
                            <StyledLabel isHighlighted={isFocused} css={{backgroundColor:'transparent', padding:'0 $1', cursor:'pointer'}} as='a' rel="noreferrer" href={`https://${entry.publication.ensLabel}.mirror.xyz/${entry.digest}`} target='_blank'><LinkIcon/></StyledLabel>
                        </StyledMetadata>
                        <StyledTitle isHighlighted={isFocused}>
                            <h1>{entry.title}</h1>
                        </StyledTitle>
                        {processor.processSync(shorten(entry.body,2000)).result}
                    </StyledBody>
            </StyledContainer>
        // </div>
    )
}

export default ArticlePreview
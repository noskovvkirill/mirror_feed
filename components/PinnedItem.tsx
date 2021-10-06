import {styled} from 'stitches.config'
import React from 'react'
import AddIcon from '@/design-system/icons/Add'
import OpenIcon from '@/design-system/icons/Open'
import SuccessMarkIcon from '@/design-system/icons/Success'

import UnPinIcon from '@/design-system/icons/UnPin'


import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
// @ts-ignore
import rehypeTruncate from "rehype-truncate";
import ButtonControl from '@/design-system/primitives/ButtonControl'

//global state

import { pinnedItems, readLaterList, PinnedItem,  ReadingListItem} from 'contexts'
import { useSetRecoilState} from 'recoil'
import {useRouter} from 'next/router'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'

import type {Entry} from '@/design-system/Article'

interface Props {
    entry: Entry;
}


const StyledContainer = styled('div',{
    display:'flex',
    maxWidth:'1152px', 
    width:'256px', height:'128px', flexDirection:'column', margin:'0', mixBlendMode:'multiply',
    padding:'$2 $2',
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

// const StyledHeader = styled('div',{
//       display:'flex',
//       flexDirection:'column',
//       justifyContent:'center',
//       gap:'$1',
//       height:'100%',
//       maxHeight:'640px',
//       borderRadius:'$round',
//       padding:'0',
//       margin:'$2 $2 $2 0',
//       width:'32px',
//       color:'$foreground',
//       mixBlendMode:'multiply',
//      transition:'$all',
//       cursor:'pointer',
//       'h5':{
//           userSelect:'none',
//           whiteSpace:'nowrap',
//           fontWeight:'400',
//           transform:'rotate(-90deg)'
//       },
//        variants:{
//         isHighlighted:{
//             true:{
//                 '&:hover':{
//                     backgroundColor:'$highlightBronze',
//                     color:'$foregroundTextBronze',
//                 },
//             },
//             false:{
//                 '&:hover':{
//                     backgroundColor:'$highlight',
//                     color:'$foregroundText'
//                 },
//             }
//         }
//     },
//      defaultVariants:{
//         isHighlighted:false
//     }
// })



const StyledTitle = styled('div', {
    display:'flex',
    gap:'$1',
    padding:0, margin:0,
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
    padding:'0', margin:0,
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
    gap:'$1',
    flexDirection:'row',
    padding:'0',
    margin:'0',
    overflow:'visible',
    height:'fit-content',
    width:'fit-content',
    boxSizing:'border-box',

})


const PinnedComponent= ({entry}:Props) => {
    const setPinnedItem = useSetRecoilState(pinnedItems)
    const setReadLater = useSetRecoilState(readLaterList)
    const readingList = useRecoilValueAfterMount(readLaterList, [])

    const router = useRouter();
    return(
        <StyledContainer 
            // onClick={()=>{
            //     if(document){
            //         document.getElementById(`preview-${entry.digest}`)?.scrollIntoView();
            //     }
            // }} 
            // would be cool to navigate to the object, but it disappear on page reload :C 
            isHighlighted={true}
            >
                    <StyledControls>
                        <ButtonControl
                        isHighlighted={true}
                        label='open'
                        onClick={()=>{
                                 entry.publication?.ensLabel 
                                ?  router.push(`/${entry.publication?.ensLabel ? entry.publication?.ensLabel : entry.author.address}/${entry.digest}`)
                                :  router.push(`/${entry.author.address}/${entry.digest}`)
                        }}><OpenIcon/></ButtonControl>
                        {readingList.findIndex((item:ReadingListItem)=>item.entryDigest === entry.digest) === -1 
                        ? <ButtonControl
                        label='to reading list'
                        isHighlighted={true}
                        onClick={()=>{setReadLater((prevState:ReadingListItem[])=>[...prevState, {entryDigest:entry.digest, title:entry.title, ensLabel: entry.publication?.ensLabel ? entry.publication.ensLabel : entry.author.address }])}}><AddIcon/></ButtonControl>
                        : <ButtonControl
                        selected={true}
                        label='remove from the reading list'
                        isHighlighted={true}
                        onClick={()=>{
                            setReadLater((prevState:ReadingListItem[])=>{
                                const indexUnPin = prevState.findIndex((item:ReadingListItem)=>item.entryDigest=== entry.digest)
                                const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                                return newArray
                            })
                        }}>
                            <SuccessMarkIcon/>
                        </ButtonControl>
                        }


                        <ButtonControl
                            selected={true}
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
                    <StyledBody isHighlighted={true}>
                        {/* <StyledMetadata> */}
                            {/* <StyledLabel isHighlighted={isFocused}>{entry.author.displayName}</StyledLabel> */}
                            {/* <StyledLabel isHighlighted={isFocused}>{dayjs.unix(entry.timestamp).fromNow() }</StyledLabel> */}
                            {/* <StyledLabel isHighlighted={isFocused} css={{backgroundColor:'transparent', padding:'0 $1', cursor:'pointer'}} as='a' rel="noreferrer" href={`https://${entry.publication.ensLabel}.mirror.xyz/${entry.digest}`} target='_blank'><LinkIcon/></StyledLabel> */}
                        {/* </StyledMetadata> */}
                        <StyledTitle isHighlighted={true}>
                            <b style={{padding:0, margin:'16px 0px'}}>{entry.title}</b>
                        </StyledTitle>
                        {/* {processor.processSync(shorten(entry.body,2000)).result} */}
                    </StyledBody>
            </StyledContainer>
    )
}

export default PinnedComponent
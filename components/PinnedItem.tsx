/* eslint-disable @next/next/no-img-element */
import {styled} from 'stitches.config'
import React from 'react'
import AddIcon from '@/design-system/icons/Add'
import OpenIcon from '@/design-system/icons/Open'
import SuccessMarkIcon from '@/design-system/icons/Success'
import {StyledLabel} from '@/design-system/text/TextParsing'
import UnPinIcon from '@/design-system/icons/UnPin'

import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
// @ts-ignore
import rehypeTruncate from "rehype-truncate";
import ButtonControl from '@/design-system/primitives/ButtonControl'

//global state
import { pinnedItems, readLaterList,  ReadingListItem} from 'contexts'
import { useSetRecoilState} from 'recoil'
import {useRouter} from 'next/router'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'

import type {PinnedItem} from 'contexts'

interface Props {
    item: PinnedItem;
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




const PinnedComponent= ({item}:Props) => {
    const setPinnedItem = useSetRecoilState(pinnedItems)
    const setReadLater = useSetRecoilState(readLaterList)
    const readingList = useRecoilValueAfterMount(readLaterList, [])
    const router = useRouter();

    if(item.type === 'attachment'){
        return(
            <StyledContainer css={{objectFit:'scale-down', position:'relative', border:'1px solid $foregroundBronze'}}>
                <StyledControls css={{position:'absolute'}}>
                        <ButtonControl
                            selected={true}
                            label='unpin item'
                            isHighlighted={true}
                            onClick={()=>
                            setPinnedItem((prevState:PinnedItem[])=>{
                                const indexUnPin = prevState.findIndex((itemP:PinnedItem)=>{
                                  return itemP.id === item.id 
                            })
                                const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                                return newArray
                            })
                            }><UnPinIcon/>
                        </ButtonControl>
                        <StyledLabel css={{height:'fit-content'}} isHighlighted={true}>{item.item.mimeType}</StyledLabel>

                </StyledControls>
                 <StyledBody isHighlighted={true} css={{objectFit:'scale-down'}}>
                    <img alt='pinned item' src={item.item.url} width='100%' height='auto'/> 
                </StyledBody>
            </StyledContainer>
        )
    }

    if(item.type==='entry'){
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
                                 item.item.publication?.ensLabel 
                                ?  router.push(`/${item.item.publication?.ensLabel ? item.item.publication?.ensLabel : item.item.author.address}/${item.item.digest}`)
                                :  router.push(`/${item.item.author.address}/${item.item.digest}`)
                        }}><OpenIcon/></ButtonControl>
                        {readingList.findIndex((itemL:ReadingListItem)=>itemL.entryDigest === item.item.digest) === -1 
                        ? <ButtonControl
                        label='to reading list'
                        isHighlighted={true}
                        onClick={()=>{setReadLater((prevState:ReadingListItem[])=>[...prevState, {entryDigest:item.item.digest, title:item.item.title, ensLabel: item.item.publication?.ensLabel ? item.item.publication.ensLabel : item.item.author.address }])}}><AddIcon/></ButtonControl>
                        : <ButtonControl
                        selected={true}
                        label='remove from the reading list'
                        isHighlighted={true}
                        onClick={()=>{
                            setReadLater((prevState:ReadingListItem[])=>{
                                const indexUnPin = prevState.findIndex((itemL:ReadingListItem)=>itemL.entryDigest=== item.item.digest)
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
                                const indexUnPin = prevState.findIndex((itemP:PinnedItem)=>{
                                    if(itemP.type === 'entry'){
                                     if(item.item.digest === itemP.item.digest) return true
                                    } else return false 
                            })
                                const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                                return newArray
                            })
                            }><UnPinIcon/>
                        </ButtonControl>
                    </StyledControls>
                    <StyledBody isHighlighted={true}>
                        <StyledTitle isHighlighted={true}>
                            <b style={{padding:0, margin:'16px 0px'}}>{item.item.title}</b>
                        </StyledTitle>
                    </StyledBody>
            </StyledContainer>
    )}
    return(
        <StyledContainer></StyledContainer>
    )
}

export default PinnedComponent
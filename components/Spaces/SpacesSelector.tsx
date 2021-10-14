
import {styled} from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import Button from '@/design-system/primitives/Button'
import SpacesIcon from '@/design-system/icons/Spaces'
import React from 'react'
import * as Popover from '@radix-ui/react-popover';
import {useRouter} from 'next/router'
import {curationItems, CurationList} from 'contexts'
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'
import { useSetRecoilState } from 'recoil'
import CreateSpace from '@/design-system/Spaces/CreateSpace'
import {AddressPrettyPrint} from 'src/utils'
import Arc from '@/design-system/icons/Arc'

const StyledLabel = styled('div',{
    display:'flex',
    alignItems:'center',
    whiteSpace:'nowrap',
    justifyContent:'center',
    backgroundColor:'none',
    color:'$foregroundText',
    padding:'$1 $2',
    borderRadius:'$round',
    boxSizing:'border-box',
    fontSize:'$6',
    cursor:'pointer',
    transition:'$background',
    '&:hover':{
         color:'$background',
         backgroundColor:'$foregroundBronze', 
    },
    variants:{
        selected:{
            true:{
                color:'$foregroundTextBronze',
                backgroundColor:'$highlightBronze', 
            },
            false:{
                
            }
        }
    },
    defaultVariants:{
        selected:false
    }
    // border:'1px solid $foregroundBorder'
})


const StyledContent = styled(Popover.Content, {
  display:'flex',
  flexDirection:'column',
  gap:'$1',
  marginTop:'$1',
  borderRadius: '$2',
  padding: '$2',
  backgroundColor: '$background',
  border:'1px solid $foreground',
  color:'$foregroundText',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform, opacity',
    '&[data-state="open"]': {
      '&[data-side="top"]': { },
      '&[data-side="right"]': { },
      '&[data-side="bottom"]': { },
      '&[data-side="left"]': { },
    },
  },
  variants:{
      size:{
          default:{
              width:128
          },
          large:{
              width:256
          }
      }
  },
  defaultVariants:{
      size:'default'
  }
})


const StyledCurationButton = styled(Popover.Trigger, {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    background:'none',
    borderRadius:'$round',
    border:'1px solid $foreground',
    color:'$foregroundText',
    padding:'$1', 
    transition:'$background',
    cursor:'pointer',
    '&:hover':{
        color:'$background',
        background: 'radial-gradient(50% 50% at 50% 50%, #E0CEC7 48.96%, #FFFFFF 100%)',
        fill:'white',
        'path':{
            fill:'white'
        }
    },
    '&[data-state="open"]':{
        color:'$background',
        background: 'radial-gradient(50% 50% at 50% 50%, #E0CEC7 48.96%, #FFFFFF 100%)',
         'path':{
            fill:'white'
        }
    }
})





const SpacesSelector = ({publication, content, type, author}:{publication?:string, content?:string, author?:string, type?:'ens' | 'personal'}) => {
    const router = useRouter()
    const curated = useRecoilValueAfterMount(curationItems, [])
    const setCuratedPublications = useSetRecoilState(curationItems)
    return(
        <Box layout='flexBoxRow' css={{alignItems:'center', color:'$foreground', userSelect:'none'}}>
            <Popover.Root>
                <StyledCurationButton>
                    <Arc/>
                </StyledCurationButton>
        
                <StyledContent align="center">
                    <Box layout='flexBoxRow' css={{justifyContent:'space-between', alignItems:'center'}}>
                        Spaces
                        <CreateSpace          
                        setCuratedPublications={setCuratedPublications}/>
                    </Box>
                    <Button 
                    onClick={()=>{
                        router.push('/')
                    }}
                    css={
                       router.pathname === '/' ? {width:'100%', 
                            backgroundColor:'$highlightBronze',
                            color:'$foregroundTextBronze',
                            borderColor:'transparent'} 
                        : {width:'100%', borderColor:'transparent'}}
                    
                    >Main feed</Button>
                    {curated.map((list:CurationList, i:number)=>{
                        if(router.query.index?.toString() === list.title){ 
                          return(
                            <Button 
                            key={list.title+i}
                            onClick={()=>{
                                router.push(`/spaces/${list.title}`)
                            }}
                            css={{width:'100%', 
                            backgroundColor:'$highlightBronze',
                            color:'$foregroundTextBronze',
                            borderColor:'transparent'}}>
                                {list.title} 
                            </Button> 
                          )  
                        }
                        
                        return(
                        <Button 
                            key={list.title+i}
                            onClick={()=>{
                                router.push(`/spaces/${list.title}`)
                            }}
                            css={{width:'100%', borderColor:'transparent'}}>{list.title}</Button>
                        )
                    })}

                    <Button 
                      onClick={()=>{
                                router.push(`/explore`)
                            }}
                    css={{width:'100%', display:'flex', borderRadius:'0', border:'0', borderTop:'1px solid $foreground', justifyContent:'center'}}>
                        Explore
                    </Button>

                    
                         {/* <Button 
                    onClick={()=>{
                        router.push('/')
                    }}
                    css={{width:'100%', borderColor:'transparent'}}>+ Add Space</Button> */}

                    {/* <Box as='hr' css={{background:'$foreground'}}/> */}
                </StyledContent>
            </Popover.Root>
            {publication && (
                <>
                /
                <StyledLabel 
                onClick={()=>{
                    router.push(`/${type === 'personal' ? author : publication}?type=${type}`)
                }}
                selected={content ? false : true}>
                {AddressPrettyPrint(publication)}
                </StyledLabel>
                {/* <Button>Add</Button> */} 
                {content && (
                    <>
                    /
                    <StyledLabel selected={true}>
                        {content.length <=30 ? content : content.slice(0,27)+'...' }
                    </StyledLabel>
                    </>
                )}
                
               </>
            )}
        </Box>
    )
}

export default SpacesSelector
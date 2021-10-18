
import {styled, keyframes} from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import React from 'react'
import * as Popover from '@radix-ui/react-popover';
import {useRouter} from 'next/router'
import {curationItems, CurationList, portalState} from 'contexts'
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'
import { useSetRecoilState, useRecoilState } from 'recoil'
import CreateSpace from '@/design-system/Spaces/SpaceCreate'
import { useHotkeys } from 'react-hotkeys-hook'

import Arc from '@/design-system/icons/Arc'
import * as Tabs from '@radix-ui/react-tabs';
import PublicationsAdd from '@/design-system/Spaces/PublicationsAdd'

const AnimationContentDisplay = keyframes({
    '0%':{opacity:0, transform:`scale(0.25)`},
    '100%':{opacity:1, transform:`scale(1)`}
})

const AnimationContenPortal = keyframes({
    '0%':{opacity:0.5},
    '100%':{opacity:1}
})



const StyledContent = styled(Popover.Content, {
  display:'flex',
  position:'relative',
//   top:'-33px',
  flexDirection:'column',
  gap:'$1',
  marginTop:'calc(-34px - $2)',
  marginLeft:'calc(-$2 - 1px)', //balanced padding
  borderRadius: '$2',
  padding: '$2',
  paddingBottom:'0',
  backgroundColor: '$background',
  border:'1px solid $foreground',
  color:'$foregroundText',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform, opacity',
    '&[data-state="open"]': {
        animationName:AnimationContenPortal,
        willChange: 'transform, opacity',
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
          },
          huge:{
              width:274
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
    },
    variants:{
        isOpen:{
            true:{
                  color:'$background',
                   background: 'radial-gradient(50% 50% at 50% 50%, #E0CEC7 48.96%, #FFFFFF 100%)',
                    fill:'white',
                    'path':{
                        fill:'white'
                   }
            },
            false:{}
        }
    },
    defaultVariants:{
        isOpen:false
    }
})


const StyledTabsList = styled(Tabs.List, {
    width:'100%',
    boxSizing:'border-box',
    overflow:'hidden',
    display:'flex',
    flexDirection:'row',
    gap:'$0'
})

const StyledTabsTrigger = styled(Tabs.Trigger, {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    fontSize:'$6',
    padding:'$0 $2',
    boxSizing:'border-box',
    height:'33px',
    // width:'100%',
    cursor:'pointer',
    borderRadius:'$2',
    '&:hover':{
        color:'$foregroundTextBronze',
        background:'$highlightBronze',
    },
    '&[data-state="active"]':{
        color:'$background',
        backgroundColor:'$foregroundBronze'
    }
})

export const StyledSpaceSelector = styled('button', {
    padding:'$1 $2',
    width:'100%', 
    fontSize:'$6',
    borderColor:'transparent',
    display:'flex',
    borderRadius:'$2',
    cursor:'pointer',
    transition:'$background',
    justifyContent:'space-between',
    alignItems:'center',
    'span':{
        transform:'scale(0.8)',
        fontSize:'$6',
        lineHeight:'100%'
    },
    variants:{
        isActive:{
            true:{
                backgroundColor:'$highlightBronze',
                color:'$foregroundTextBronze',
            },
            false:{
                borderColor:'transparent',
                backgroundColor:'transparent',
                color:'$foregroundText',
                '&:hover':{
                    color:'$background',
                    backgroundColor:'$foregroundBronze',
                }
            }
        }
    },
    defaultVariants:{
        isActive:false
    }
})



const StyledTabsContent = styled(Tabs.Content, {
    transition:'$all',
    gap:'$1',
    display:'flex',
    flexDirection:'column',
     '&[data-state="active"]':{
        animationName:AnimationContentDisplay,
        animationDuration: '400ms',
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
     }
})

const StyledTabHeader = styled('div', {
    display:'flex',
    flexDirection:'row',
    gap:'$1',
    justifyContent:'space-between', 
    background:'transparent',
    backdropFilter:'opacity(0.5)',
    position:'sticky',
    bottom:'0',
    alignItems:'center',
    marginBottom:'$2'
})


const SpaceItem = ({index, isActive, title, Open}:{index:number, isActive:boolean, title:string, Open:(direction:string)=>void}) => {
    useHotkeys(`${index+2}, alt+${index+2}}`, () => {
        Open(`/spaces/${title}`)
    },[index, Open]);
    return(
        <StyledSpaceSelector isActive={isActive} onClick={()=>{
               Open(`/spaces/${title}`)
        }}>
            {title} 
            <span>⌥
                &#8201;
                {index+2}
            </span>
        </StyledSpaceSelector>
    )
}

const SpacesSelector = ({publication, content, type, author}:{publication?:string, content?:string, author?:string, type?:'ens' | 'personal'}) => {
    const router = useRouter()
    const curated = useRecoilValueAfterMount(curationItems, [])
    const setCuratedPublications = useSetRecoilState(curationItems)
    const [isPortal, setIsPortal] = useRecoilState(portalState)

    return(
        <Box layout='flexBoxRow' css={{alignItems:'center', color:'$foreground', userSelect:'none'}}>
            <Popover.Root 
            onOpenChange={(newState:boolean)=>setIsPortal(newState)}
            modal={true} open={isPortal}>
                <StyledCurationButton>
                    <Arc/>
                </StyledCurationButton>
                <StyledContent align="center" size='huge'>
                     <Tabs.Root defaultValue=
                     {(router.pathname === '/' || 
                       router.pathname === '/spaces/[index]' ||
                       router.pathname === '/spaces') 
                       ? 'spaces' : 'publications'
                     }>
                        <StyledTabHeader>
                            <Box layout='flexBoxRow' css={{gap:'$0', marginRight:'$1'}}>
                                <StyledCurationButton 
                                onClick={()=>setIsPortal(false)}
                                isOpen={true}  as='button' css={{width:'fit-content'}}>
                                    <Arc/>
                                </StyledCurationButton>
                                <CreateSpace          
                                setCuratedPublications={setCuratedPublications}/>
                            </Box>
                            <StyledTabsList>
                                <StyledTabsTrigger value='spaces'>Spaces</StyledTabsTrigger>
                                <StyledTabsTrigger value='publications'>Publications</StyledTabsTrigger>
                            </StyledTabsList>
                        </StyledTabHeader>
                        <StyledTabsContent key={'Main feed'} value={'spaces'}>
                            <SpaceItem index={-1} title={"Main feed"} Open={()=>{
                                setIsPortal(false)
                                router.push('/')
                            }}
                            isActive={router.pathname === '/' ? true : false}/>
                            {curated.map((list:CurationList, i:number)=>{return(
                                <SpaceItem index={i} key={list.title+i} isActive={router.query.index?.toString() === list.title ? true :  false}
                                Open={(direction:string)=>{
                                    setIsPortal(false)
                                    router.push(direction)}} title={list.title}/>
                            )})}
                            <Box css={{height:'$2'}}></Box>
                        </StyledTabsContent>
                        <StyledTabsContent value='publications'>
                            <PublicationsAdd 
                            author={author} publication={publication} content={content} type={type}/>
                        </StyledTabsContent>
                    </Tabs.Root>
                </StyledContent>
            </Popover.Root>
        </Box>
    )
}

export default SpacesSelector
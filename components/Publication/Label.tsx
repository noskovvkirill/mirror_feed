
import {styled} from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import Button from '@/design-system/primitives/Button'
import AddIcon from '@/design-system/icons/Add'
import React from 'react'
import * as Popover from '@radix-ui/react-popover';
import {useRouter} from 'next/router'

const StyledLabel = styled('div',{
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'none',
    color:'$foregroundText',
    padding:'$1 $2',
    borderRadius:'$2',
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
  width: 128,
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
    cursor:'pointer',
    '&:hover':{
        color:'$background',
        backgroundColor:'$foreground'
    },
    '&[data-state="open"]':{
        color:'$background',
        backgroundColor:'$foreground'
    }
})


const Label = ({publication, content, type, author}:{publication:string, content?:string, author?:string, type?:'ens' | 'personal'}) => {
    const router = useRouter()
    return(
        <Box layout='flexBoxRow' css={{alignItems:'center', color:'$foreground', userSelect:'none'}}>
            <Popover.Root>
                <StyledCurationButton>
                    <AddIcon/>
                </StyledCurationButton>
                <StyledContent align="center">
                    Spaces
                    <Button 
                    onClick={()=>{
                        router.push('/')
                    }}
                    css={{width:'100%', borderColor:'transparent'}}>Main feed</Button>
                    {/* <Box as='hr' css={{background:'$foreground'}}/> */}
                </StyledContent>
            </Popover.Root>
             /
            <StyledLabel 
            onClick={()=>{
                router.push(`/${type === 'personal' ? author : publication}?type=${type}`)
            }}
            selected={content ? false : true}>
               {publication}
            </StyledLabel>
            {content && (
                <>
                  /
                <StyledLabel selected={true}>
                    {content}
                </StyledLabel>
                </>
            )}
          
        </Box>
    )
}

export default Label
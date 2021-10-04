import * as Popover from '@radix-ui/react-popover';
import Box from '@/design-system/primitives/Box'
import { styled } from 'stitches.config';
import { ReactNode, ReactElement } from 'react';
import ButtonControl from '@/design-system/primitives/ButtonControl';

const StyledTrigger = styled(Popover.Trigger, {
    background:'transparent',
    border:'none',
    padding:0,
    margin:0
})

const StyledContent = styled(Popover.Content, {
  marginLeft:'$2',
  borderRadius: '$1',
  padding: '$4',
  width: 256,
  backgroundColor: '$foregroundBronze   ',
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

const ButtonPopover = ({icon, children}:{icon:ReactElement, children:ReactNode}) =>{
    return(
          <Popover.Root>    
              <StyledTrigger>
                  <ButtonControl isHighlighted={true} selected={false} label='columns'>
                  {icon}
                  </ButtonControl>
              </StyledTrigger>
              <StyledContent side='left' align='start'>
                    <Box layout='flexBoxColumn'>
                        {children}
                    </Box>
              </StyledContent>
          </Popover.Root>
    )
}

export default ButtonPopover
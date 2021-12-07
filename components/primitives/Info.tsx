import InfoIcon from '@/design-system/icons/Info'
import * as HoverCard from '@radix-ui/react-hover-card';
import Box from '@/design-system/primitives/Box'
import { styled } from 'stitches.config'
import React from 'react';


const StyledTrigger = styled(HoverCard.Trigger, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '0px solid $foregroundBorder',
    borderRadius: '$2',
    padding: '$1',
    boxSizing: 'border-box',
    width: '33px',
    height: '33px',
    cursor: 'pointer',
    color: 'inherit',
    // height:'fit-content',
    '&:hover': {
        color: '$background',
        backgroundColor: '$foreground',
    }
})

const StyledContent = styled(HoverCard.Content, {
    padding: '$2',
    width: 'calc($4 * 12)',
    border: '1px solid $foreground',
    borderRadius: '$2',
    color: '$foreground',
    background: '$background',
    '@media (prefers-reduced-motion: no-preference)': {
        animationDuration: '400ms',
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
        '&[data-state="open"]': {
            //   '&[data-side="top"]': { animationName: slideDownAndFade },
            //   '&[data-side="right"]': { animationName: slideLeftAndFade },
            //   '&[data-side="bottom"]': { animationName: slideUpAndFade },
            //   '&[data-side="left"]': { animationName: slideRightAndFade },
        },
    },
})

interface IInfo {
    children: React.ReactNode | React.ReactNode[] | undefined;
}

const Info = ({ children }: IInfo) => {
    return (
        <>
            <Box
                css={{
                    color: 'inherit',
                    height: 'px',
                    width: 'px',
                    margin: '-px',
                    position: 'absolute',
                    overflow: 'hidden',
                    padding: '0',
                    whiteSpace: 'wrap'
                }}></Box>
            <HoverCard.Root>
                <StyledTrigger>
                    <InfoIcon />
                </StyledTrigger>
                <StyledContent>
                    {children}
                </StyledContent>
            </HoverCard.Root>
        </>
    )
}

export default Info
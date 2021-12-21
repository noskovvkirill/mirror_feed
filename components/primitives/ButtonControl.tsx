import Button from '@/design-system/primitives/Button'
import { styled } from 'stitches.config'
import React, { ReactChild, useState, memo, forwardRef } from 'react'
import * as Portal from '@radix-ui/react-portal';

const StyledControl = styled(Button, {
    border: '1px solid $foreground',
    color: '$foregroundText',
    flexShrink: '0',
    //this is rude, but for some reason simple height:33px doesn't work in Safari 
    height: 'auto',
    minHeight: '33px',
    maxHeight: '33px',
    borderRadius: '$round',
    // transformOrigin:'center center',
    padding: '$1',
    display: 'flex',
    gap: '$0',
    overflow: 'visible',
    alignItems: 'center',
    fontSize: '$6',
    boxSizing: 'border-box',
    lineHeight: '$6',
    '&:focus': {
        outline: '0px solid $foreground',
        overflow: 'hidden'
    },
    '&[data-state="open"]': {
        border: '1px solid $foregroundBronze',
        backgroundColor: '$foregroundBronze',
        color: '$background'
    },
    variants: {
        monochrome: {
            true: {

            },
            false: {

            }
        },
        isHighlighted: {
            true: {
                border: '1px solid $foregroundBronze',
                color: '$foregroundTextBronze',
                '&:hover': {
                    background: '$foregroundBronze',
                    color: '$backgroundBronze'
                },
                "&:disabled": {
                    background: '$foregroundBronze',
                    color: '$backgroundBronze'
                },

            },
            false: {
                border: '1px solid $foregroundBorder',
                color: '$foregroundText',
                //   background:'$tint', 
                '&:hover': {
                    // background:'$foreground',
                    // color:'$background'
                    background: '$foregroundBronze',
                    color: '$backgroundBronze'
                },
            }
        },
        selected: {
            true: {
            },
            false: {
            }
        }
    },
    compoundVariants: [{
        selected: true,
        isHighlighted: true,
        css: {
            border: '1px solid $foregroundBronze',
            background: '$foregroundBronze',
            color: '$backgroundBronze',
            //transition changed to make it more visually pleasant when ArticlePreview appears. 
            //default transition stands out and they are irritating
            transition: "background",
            transitionTimingFunction: 'ease-in-out',
            transitionDuration: '1.0s',
            '&:hover': {
                border: '1px solid $foregroundBronze',
                background: '$foregroundBronze',
                color: '$backgroundBronze'
            }
        }
    },
    {
        selected: true,
        isHighlighted: false,
        css: {
            border: '1px solid $foreground',
            background: '$foreground',
            color: '$background',
            transition: "background",
            transitionTimingFunction: 'ease-in-out',
            transitionDuration: '1.0s',
            '&:hover': {
                border: '1px solid $foreground',
                background: '$foreground',
                color: '$background'
            }
        }
    }

    ],
    defaultVariants: {
        isHighlighted: false,
        selected: false,
    }
})

const Control = ({ children, direction, label, pos }: {
    children: ReactChild, label?: string, pos: {
        x: number, y: number
    }, direction?: 'right' | 'left' | 'top' | 'bottom'
}) => {

    if (direction === 'top' || direction === 'bottom') {
        return (
            <Portal.Root>
                <StyledControl
                    aria-label={label}
                    css={{
                        position: 'absolute',
                        // width:'auto',
                        background: '$foregroundBronze',
                        color: '$backgroundBronze',
                        pointerEvents: 'none', top: '100%', left: '100%',
                        transform: `translate(calc(${pos.x}px + 0%), ${pos.y}px) translateY(${100}%)`
                    }}
                    isHighlighted={true}
                >
                    <>
                        {/* {children} */}
                        {label}
                    </>
                </StyledControl>
            </Portal.Root>)
    }

    return (
        <Portal.Root>
            <StyledControl
                aria-label={label}
                css={{
                    position: 'absolute',
                    background: '$foregroundBronze',
                    color: '$backgroundBronze',
                    pointerEvents: 'none', top: 0, left: direction === 'right' ? 0 : '-100%',
                    transform: `translate(${pos.x}px, ${pos.y}px) translateX(${direction === 'right' ? 0 : -100}%)`
                }}
                isHighlighted={true}
            >
                {direction === 'right' && (
                    <>
                        {children}
                        {label}
                    </>
                )}
                {direction === 'left' && (
                    <>
                        {label}
                        {children}
                    </>
                )}

            </StyledControl>
        </Portal.Root>
    )
}

const ButtonControl = forwardRef((
    { children, selected,
        css,
        direction = 'right',
        label, isHighlighted, onClick, ...props }:
        {
            children: ReactChild, label?: string, css?: any; direction?: 'right' | 'left' | 'bottom' | 'top', selected?: boolean, isHighlighted: boolean, onClick?: (e: React.MouseEvent<HTMLButtonElement> | never) => void;
        }, ref: React.Ref<any>) => {
    const [isHover, setIsHover] = useState(false)
    const [pos, setPos] = useState({ x: -99999, y: -99999 })
    const [isFocused, setIsFocused] = useState(false)
    return (
        <>
            <StyledControl
                {...props}
                tabIndex={0}
                aria-label={label}
                selected={selected}
                css={{ position: 'relative', ...css }}
                onClick={onClick}
                onFocus={(e) => {
                    setIsFocused(true)
                    const target = e.target as HTMLElement;
                    const coord = target.getBoundingClientRect()
                    if (direction === 'right' || direction === 'top' || direction === 'bottom') {
                        setPos({ x: coord.x + window.scrollX, y: coord.y + window.scrollY })
                    } else {
                        setPos({ x: coord.x + window.scrollX + coord.width, y: coord.y + window.scrollY })
                    }
                }}
                onBlur={() => { setIsFocused(false); setPos({ x: -999999, y: -999999 }) }}
                onTouchStart={() => setIsHover(true)}
                onTouchEnd={() => setIsHover(false)}
                onMouseEnter={(e) => {
                    setIsHover(true)
                    const target = e.target as HTMLElement;
                    const coord = target.getBoundingClientRect()
                    if (direction === 'right' || direction === 'top' || direction === 'bottom') {
                        setPos({ x: coord.x + window.scrollX, y: coord.y + window.scrollY })
                    } else {
                        setPos({ x: coord.x + window.scrollX + coord.width, y: coord.y + window.scrollY })
                    }
                }}
                onMouseLeave={() => {
                    setIsHover(false)
                    setPos({ x: -999999, y: -999999 })
                }}
                isHighlighted={isHighlighted}
                ref={ref}
            >
                {children}
            </StyledControl>
            {(isHover || isFocused) && (
                <Control direction={direction} label={label} pos={pos}>{children}</Control>
            )}
        </>
    )
})

export default memo(ButtonControl)
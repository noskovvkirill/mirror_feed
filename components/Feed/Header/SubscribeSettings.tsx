import { styled, keyframes } from 'stitches.config'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState, forwardRef } from 'react'
import Loader from '@/design-system/primitives/Loader'
import Box from '@/design-system/primitives/Box'

const AnimationContentDisplay = keyframes({
    '0%': { opacity: 0, transform: `scaleY(0.90) ` },
    '100%': { opacity: 1, transform: `scaleY(1)` }
})

const StyledCurationButton = styled(DropdownMenu.Trigger, {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    justifyContent: 'center',
    background: 'none',
    userSelect: 'none',
    borderRadius: '$round',
    border: '0px',
    color: 'inherit',
    padding: '$1',
    transition: '$background',
    cursor: 'pointer',
    '&:hover': {
        color: '$foregroundTextBronze'
    },
    '&[data-state="open"]': {
        color: '$foregroundTextBronze'
    },
    '@bp1': {
        fontSize: '$6'
    }
})



const StyledContainer = styled(DropdownMenu.Content, {
    display: 'flex',
    flexDirection: 'column',
    zIndex: '100',
    alignItems: 'center',
    justifyContent: 'center',
    // boxShadow: '$large',
    width: '256px',
    gap: '$1',
    boxSizing: 'border-box',
    padding: '$2',
    borderRadius: '$2',
    color: '$foregroundText',
    transformOrigin: 'top center',
    position: 'absolute',
    border: '1px solid $foregroundBorder',
    background: '$background',
    //weird way to have boxShadow with multiply mode
    '&:before': {
        boxShadow: '$large',
        mixBlendMode: 'multiply',
        content: "",
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        pointerEvents: 'none',
        borderRadius: '$2',
    },

    '@media (prefers-reduced-motion: no-preference)': {
        '&[data-state="open"]': {
            animationName: `${AnimationContentDisplay}`,
            animationDuration: '400ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'forwards',
            willChange: 'transform, opacity'
        }
    }
})

const StyledItem = styled(DropdownMenu.Item, {
    width: '100%',
    padding: '$1 $2',
    cursor: 'pointer',
    borderRadius: '$2',
    boxSizing: 'border-box',
    border: '1px solid transparent',
    transition: '$background',
    outline: 'none',
    '&:hover': {
        color: '$background',
        backgroundColor: '$foregroundBronze',
        border: '1px solid $foregroundBronze'
    },
    variants: {
        disabled: {
            true: {
                pointerEvents: 'none',
                cursor: 'not-allowed',
                // backgroundColor: '$foreground'
            }
        },
        false: {

        }
    },
    '&:disabled': {
        color: 'red',
        cursor: 'not-allowed',
        backgroundColor: '$foreground'
    }
    // '&:hover': {
    //     border: '1px solid $foregroundBronze',
    //     color: '$foregroundBronze',
    //     background: '$foregroundTintBronze'
    // }
})


interface ISubscribeSettings {
    isSubscribed: boolean;
    disabled: boolean;
    Subscribe?: () => Promise<void>;
    Unsubscribe?: () => Promise<void>;
    size?: 'small' | 'default'
    onSelect?: (parentNode: any) => any;

}


const SubscribeSettings = ({ isSubscribed, Subscribe, Unsubscribe, disabled, size = 'default', onSelect }: ISubscribeSettings) => {
    const [isOpen, setIsOpen] = useState(false)
    const [loadingState, setLoadingState] = useState<'default' | 'loading' | 'success' | 'error'>('default')

    const onSubscribe = async (e) => {
        if (!Subscribe) return
        e.preventDefault()
        try {
            setLoadingState('loading')
            await Subscribe()
            setLoadingState('success')

            setIsOpen(false)

        } catch (e) {
            setLoadingState('error')
        }
    }
    const onUnSubscribe = async (e) => {
        if (!Unsubscribe) return
        e.preventDefault()
        try {
            setLoadingState('loading')
            await Unsubscribe()
            setLoadingState('success')

            setIsOpen(false)

        } catch (e) {
            setLoadingState('error')
        }
    }
    return (
        <DropdownMenu.Root

            modal={false}
            open={isOpen}
            onOpenChange={(newState: boolean) => {
                setIsOpen(newState)
                setLoadingState('default')
            }}>
            <StyledCurationButton
                onClick={(e) => {
                    e.stopPropagation()
                    if (onSelect) {
                        onSelect(e.target.parentNode.parentNode)
                    }
                }}
            >
                {size === 'small'
                    ? <>•••</>
                    : <>●&thinsp;●&thinsp;●</>
                }

            </StyledCurationButton>
            <StyledContainer
            // onCloseAutoFocus={(e) => e.preventDefault()}

            >

                {disabled && (
                    <Box layout='flexBoxRow' css={{
                        width: '100%',
                        borderRadius: '$2',
                        padding: '$1 $2',
                        color: '$foregroundBronze',
                        background: '$foregroundTintBronze',
                        fontSize: '$6'
                    }}>
                        Connect Wallet to subscribe/unsubscribe
                    </Box>
                )}

                {(!isSubscribed && Subscribe)
                    ? <StyledItem disabled={disabled} onSelect={onSubscribe}>
                        {loadingState === 'default' && (
                            <>Subsribe</>
                        )}
                        {loadingState === 'loading' && (
                            <Loader size='small' isInline >Patience...</Loader>
                        )}
                        {loadingState === 'success' && (
                            <>Subscribed</>
                        )}
                        {loadingState === 'error' && (
                            <>Something went wrong...</>
                        )}
                    </StyledItem>
                    : <>
                        {Unsubscribe && (
                            <StyledItem disabled={disabled} onSelect={onUnSubscribe}>
                                {loadingState === 'default' && (
                                    <>Unsubscribe</>
                                )}
                                {loadingState === 'loading' && (
                                    <Loader size='small' isInline >Patience...</Loader>
                                )}
                                {loadingState === 'success' && (
                                    <>Unsubscribed</>
                                )}
                                {loadingState === 'error' && (
                                    <>Something went wrong...</>
                                )}
                            </StyledItem>
                        )}
                    </>
                }

            </StyledContainer>
        </DropdownMenu.Root>
    )
}

export default SubscribeSettings
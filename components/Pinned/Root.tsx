import React from "react"
import Label from '@/design-system/primitives/Label'
import { styled } from "stitches.config"
import type { PinnedItem } from 'contexts'

const StyledContainer = styled('div', {
    display: 'flex',
    maxWidth: '1152px',
    width: '256px',
    height: '128px',
    boxSizing: 'border-box',
    flexDirection: 'column', margin: '0',
    gap: '$1',
    padding: '$2 $2',
    color: '$foregroundText',
    borderRadius: '$2',
    transition: '$background',
    variants: {
        color: {
            default: {
                backgroundColor: '$highlight',
            },
            foreground: {
                color: '$foregroundText',
                backgroundColor: '$foreground',
            },
        },
        isHighlighted: {
            true: {
                backgroundColor: '$highlightBronze',
            },
            false: {
                backgroundColor: '$highlight',
            }
        },
        isActive: {
            true: {
                opacity: 0.5
            },
            false: {
                opacity: 1
            },
        },
        isDragged: {
            true: {
                color: '$foregroundTextBronze',
                backgroundColor: '$highlightBronze',
            }
        }
    },
    defaultVariants: {
        isHighlighted: false,
        isActive: false,
        color: 'default'
    }
})

const StyledControls = styled('div', {
    display: 'flex',
    gap: '$1',
    flexDirection: 'row',
    padding: '0',
    margin: '0',
    overflow: 'visible',
    height: 'fit-content',
    width: 'fit-content',
    boxSizing: 'border-box',
})



const StyledBody = styled('div', {
    overflow: 'hidden',
    padding: '0', margin: 0,
    width: '100%',
    variants: {
        isHighlighted: {
            true: {
                '*': {
                    color: '$textBronze',
                }
            },
            false: {
                '*': {
                    color: '$textBronze',
                }
            }
        }
    },
    defaultVariants: {
        isHighlighted: false
    }
})



interface IContainer {
    children: React.ReactElement | React.ReactElement[],
    item: PinnedItem,
    isActive?: boolean;
    isDragged?: boolean,
    props?: React.ReactPropTypes,
}

const Root = ({ item, isActive = false, isDragged = false, children, ...props }: IContainer) => {
    return (
        <StyledContainer
            isDragged={isDragged}
            isActive={isActive} {...props}>
            <StyledControls>
                {
                    React.Children.map(children, (child) => {
                        return React.cloneElement(child, {
                            item: item,
                        });
                    })
                }
            </StyledControls>
            <StyledBody isHighlighted={false}>
                {/* <StyledTitle isHighlighted={false}> */}
                <Label size='normal' css={{ color: 'inherit', userSelect: 'none', margin: '$2 0' }}>
                    {item.item.title.slice(0, 45)}
                </Label>
                {/* </StyledTitle> */}
            </StyledBody>
        </StyledContainer>
    )
}

export default Root
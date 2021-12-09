import { styled } from 'stitches.config'
import { m } from 'framer-motion'
import { forwardRef, ReactElement } from 'react';

//types
import { EntryType } from '@/design-system/Entry'
import { ControlsInternal } from '@/design-system/Entry/Controls/EntryFull'
import { BodyInternal } from '@/design-system/Entry/Body'


const StyledContainer = styled('div', {
    display: 'flex',
    '@bp2': {
        flexDirection: 'row',
    },
    '@bp3': {
        flexDirection: 'row',
    },
    minHeight: '448px',
    contain: 'layout',
    willChange: 'transform',
    color: '$text',
    boxSizing: 'border-box',
    borderRadius: '$2',
    transition: '$background',
    variants: {
        isHighlighted: {
            true: {
                backgroundColor: '$highlightBronze',
            },
            false: {
                backgroundColor: '$background',
            }
        },
        isPreview: {
            true: {
                maxWidth: '$body',
                '@bp1': {
                    flexDirection: 'column',
                    margin: '0',
                    maxWidth: '100%',
                },
            },
            false: {
                maxWidth: '100%',
                minHeight: '640px'
            }
        },
        type: {
            card: {
                padding: '$4',
                flexDirection: 'column',
                width: '100%',
                gridColumn: 'span 1',
                margin: 'calc($2 * 1) 0',
                overflow: 'hidden',
                // height:'448px',
                // textOverflow:"fade(10px)" 
            },
            list: {
                margin: 'calc($4 * 1) 0',
                padding: '$4 $2',
                width: '100%',
                flexDirection: 'row',
                '@bp1': {
                    padding: '$4',
                    flexDirection: 'column',
                    width: '100%',
                    gridColumn: 'span 1',
                    margin: 'calc($2 * 1) 0',
                    overflow: 'hidden',
                },
            }
        }
    },
    compoundVariants: [
        {
            isPreview: false,
            type: 'list',
            css: {
                padding: 'calc($4 * 2) $2 calc($4 * 4) $2'
            }
        },
        {
            isPreview: false,
            type: 'card',
            css: {
                padding: 'calc($4 * 2) $2 calc($4 * 4) $2'
            }
        },

    ],
    defaultVariants: {
        isHighlighted: false,
        isPreview: true,
        type: 'list'
    }
})



//framer-motion component wrapping 

const StyledContainerComponent = forwardRef(function Component(props: any, ref: any) {
    return (
        <StyledContainer {...props} ref={ref} />)
});


const StyledContainerMotion = m(StyledContainerComponent)



interface Container {
    children: [
        Controls: ReactElement<ControlsInternal>,
        Body: ReactElement<BodyInternal>
    ];
    entry: EntryType;
    isPreview?: boolean;
    isHover: boolean;
    isFocused: boolean;
    isReadingList: boolean;
    setIsHover: (isHover: boolean) => void;
    view?: 'card' | 'list'
}


const Root = forwardRef<HTMLElement, Container>(
    function Forward({
        entry, children, view = 'list',
        isPreview = true, isHover, isFocused,
        setIsHover }, ref) {
        return (
            <StyledContainerMotion
                initial={{ position: 'relative' }}
                exit={isPreview && { opacity: 0, position: 'absolute' }}
                layout='position'
                type={view}
                layoutId={isPreview && `layout-${entry.digest}+${view}`} //transitions animations using framer motion
                key={`key-${entry.digest}`} //transitions animations using framer motion
                id={`preview-${entry.digest}`}
                onTouchStart={() => setIsHover(true)}
                onTouchEnd={() => setIsHover(false)}
                onMouseOver={() => {
                    setIsHover(true)
                }} //we need this because if the cursor already located in the area of the component, it doesn't highlight (there is no enter event)
                onMouseEnter={() => {
                    setIsHover(true)
                }}
                onMouseLeave={() => {
                    setIsHover(false)
                }}
                isPreview={isPreview}
                isHighlighted={!isPreview ? true : (isHover || isFocused) ? true : false}
                ref={ref}>
                {children}
            </StyledContainerMotion>
        )
    })


export default Root
import { styled, keyframes } from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import { PinnedItem, ReadingListItem, CurrentArticle } from 'contexts'
import * as ScrollArea from '@radix-ui/react-scroll-area';
import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { createPortal } from 'react-dom'
import Draggable from '@/design-system/Drag/Draggable'
import DragOverlay from '@/design-system/Drag/DragOverlay'

const AnimationContentDisplay = keyframes({
    '0%': { opacity: 0, transform: `translate(0%, -100%)` },
    '100%': { opacity: 1, transform: `translate(0%, 0%)` }
})
const StyledPinnedList = styled(ScrollArea.Root, {
    width: '100%',
    boxSizing: 'border-box',
    height: '100%',
    overflow: 'hidden',
    display: 'block',
    animationName: `${AnimationContentDisplay}`,
    animationDuration: '500ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'forwards',
    willChange: 'transform, opacity',
    '@bp1': {
        display: 'none'
    }
})

const StyledViewport = styled(ScrollArea.Viewport, {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: '$1',
    height: 'fit-content',
    boxSizing: 'border-box',
    borderRadius: '$2',
});

const StyledScrollbar = styled(ScrollArea.Scrollbar, {
    display: 'flex',
    // ensures no selection
    userSelect: 'none',
    // disable browser handling of all panning and zooming gestures on touch devices
    touchAction: 'none',
    position: 'absolute',
    top: 0,
    padding: '0',
    background: '$backgroundBronze',
    mixBlendMode: 'multiply',
    backdropFilter: 'opacity(0.5)',
    transition: '$all',
    '&:hover': { background: '$foregroundBronze' },
    '&[data-orientation="horizontal"]': {
        flexDirection: 'column',
        height: 'calc($1 * 1.5)',
    },
});



const StyledThumb = styled(ScrollArea.Thumb, {
    flex: 1,
    background: '$foregroundBronze',
    mixBlendMode: 'multiply',
    backdropFilter: 'opacity(0.5)',
    borderRadius: '$round',
    // increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        minWidth: 44,
        minHeight: 44,
    },
});




interface IPinnedList {
    activeId: string | null;
    isPinnedList: boolean;
    setReadLater: (fn: (prevState: ReadingListItem[]) => ReadingListItem[]) => void;
    routerQuery: {
        article: string | undefined;
        publication: string | undefined;
    };
    pinnedList: PinnedItem[];
    setPinnedList: (fn: (prevState: PinnedItem[]) => PinnedItem[]) => void;
    currentArticle: CurrentArticle | null;
}


const PinnedList = ({ activeId, isPinnedList, pinnedList }: IPinnedList) => {
    const { setNodeRef } = useDroppable({ id: 'droppable_pinnedList', });
    return (
        <>
            {isPinnedList && (
                <StyledPinnedList type='scroll'>
                    <StyledViewport asChild={false}>
                        <Box layout='flexBoxRow'
                            ref={setNodeRef}
                            css={{ paddingTop: '$2' }}>
                            {pinnedList.map((item: PinnedItem) => {
                                return (
                                    <Draggable id={item.id + 1}
                                        isActive={(activeId && (item.id + 1 === parseInt(activeId))) ? true : false}
                                        item={item}
                                        key={'pinned item' + item.id + 1} />
                                )
                            })}
                            {/* Placeholder to have an empty space around the end of the component */}
                            <Box css={{ width: '256px', userSelect: 'none', '@bp1': { display: 'none' } }}>
                                &nbsp;
                            </Box>
                        </Box>
                    </StyledViewport>

                    <StyledScrollbar orientation="horizontal">
                        <StyledThumb />
                    </StyledScrollbar>
                </StyledPinnedList>
            )}

            {typeof window !== 'undefined' && (
                <>
                    {createPortal(
                        <DragOverlay activeId={activeId} item={
                            activeId ? pinnedList.find((item) => item.id + 1 === parseInt(activeId))
                                : null
                        }
                        />, document.body)}
                </>
            )}


        </>

    )
}


export default PinnedList



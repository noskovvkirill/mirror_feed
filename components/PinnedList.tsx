import {styled} from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import ArrowDownIcon from '@/design-system/icons/ArrowDown'
import AddAllIcon from '@/design-system/icons/AddAll'
import {  PinnedItem, ReadingListItem, CurrentArticle} from 'contexts'
import SpacesSelector from '@/design-system/Spaces/SpacesSelector'
import PinnedComponent  from '@/design-system/PinnedItem' 
import ButtonControl from '@/design-system/primitives/ButtonControl'
import * as ScrollArea from '@radix-ui/react-scroll-area';
import React from 'react'
const StyledPinnedList = styled(ScrollArea.Root,{
    width:'100%',
    boxSizing:'border-box',
    overflow:'hidden',
    display:'block',
})

const StyledViewport = styled(ScrollArea.Viewport, {
  width: '100%',
  display:'flex',
  flexDirection:'row',
  gap:'$1',
  height: 'fit-content',
  boxSizing:'border-box',
  borderRadius: '$2',
});

const StyledScrollbar = styled(ScrollArea.Scrollbar, {
  display: 'flex',
  // ensures no selection
  userSelect: 'none',
  // disable browser handling of all panning and zooming gestures on touch devices
  touchAction: 'none',
  position:'absolute',
  top:0,
  padding: '0',
  background: '$backgroundBronze',
  mixBlendMode:'multiply',
  backdropFilter:'opacity(0.5)',
  transition: '$all',
  '&:hover': { background: '$foregroundBronze' },
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
    height:'calc($1 * 1.5)',
  },
});



const StyledThumb = styled(ScrollArea.Thumb, {
  flex: 1,
  background: '$foregroundBronze',
  mixBlendMode:'multiply',
  backdropFilter:'opacity(0.5)',
  borderRadius:'$round',
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


const StyledNavControls = styled(Box, {
    margin:'$4',
    alignItems:'flex-start', 
    justifyContent:'center', 
    marginRight:'$1', 
    background:'transparent'
})


interface IPinnedList {
    isPinnedList:boolean;
    setIsPinnedList:(newState:boolean) => void;
    setReadLater:(fn:(prevState:ReadingListItem[]) => ReadingListItem[]) => void;
    routerQuery:{
        article: string | undefined;
        publication:string | undefined;
    };
    pinnedList:PinnedItem[];
    setPinnedList: (fn:(prevState:PinnedItem[])=>PinnedItem[]) => void;
    currentArticle:CurrentArticle | null;
}



const PinnedList = ({ isPinnedList,  setIsPinnedList, setReadLater, routerQuery, pinnedList, setPinnedList, currentArticle}:IPinnedList) => {
    return(
    <>
        <StyledNavControls layout='flexBoxColumn'>
           <Box layout='flexBoxRow'>
                <ButtonControl
                isHighlighted={false}
                label={isPinnedList ? 'hide pinned' : 'show pinned' }
                onClick={()=>setIsPinnedList(!isPinnedList)}
                >
                    <Box css={{
                        pointerEvents:'none',
                        transform:isPinnedList ? 'rotate(180deg)' : ''}}> 
                        <ArrowDownIcon/>
                    </Box>
                </ButtonControl>
                {!isPinnedList && (
                    <Box layout='flexBoxRow' css={{userSelect:'none', fontSize:'$6', color:'$foregroundText', alignItems:'center', justifyContent:'center'}}>{pinnedList.length}</Box>
                )}
            </Box>

            <ButtonControl 
            isHighlighted={false}
            onClick={()=>{
                //Transform all the Entries to the reading list items and remove them from the list
                setReadLater((prevState:ReadingListItem[])=>{
                    const pinnedItemsToReadingList = pinnedList.map((item:PinnedItem)=>{
                        if(item.type === 'entry')
                        return({entryDigest:item.item.digest, title:item.item.title, ensLabel: item.item.publication?.ensLabel ? item.item.publication.ensLabel : item.item.author.address})
                        else return null
                    })
                    const pinnedItemsToReadingListFiltered:ReadingListItem[] = [...pinnedItemsToReadingList].filter((item):item is ReadingListItem=>item !== null)
                    return [...prevState, ...pinnedItemsToReadingListFiltered]
                })
                setPinnedList((prevState:PinnedItem[])=>{
                    return [...prevState].filter(item=>item.type === 'entry')
                })
            }}
            label='Add all to the reading list'>
                <AddAllIcon/>
            </ButtonControl>
            
            <SpacesSelector  
                type={currentArticle?.publication.type}
                author={currentArticle?.author}
                content={currentArticle?.title || routerQuery.article}
                publication={ currentArticle?.publication.ensLabel || routerQuery.publication}
            />
   
        </StyledNavControls>       
        {isPinnedList && (
            <StyledPinnedList type='scroll'>
                <StyledViewport asChild={false}>
                    <Box layout='flexBoxRow' css={{paddingTop:'$2'}}>
                        {pinnedList.map((item:PinnedItem)=>{
                            return(
                                <PinnedComponent key={'pinned item' + item.id} item={item}/>
                            )
                        })}

                        {/* Placeholder to have an empty space around the end of the component */}
                        <Box css={{width:'256px', userSelect:'none'}}>
                            &nbsp;
                        </Box>
                    </Box>
                </StyledViewport>
                <StyledScrollbar orientation="horizontal">
                    <StyledThumb/>
                </StyledScrollbar>
            </StyledPinnedList>
        )}
    </>
                     
)}

const areEqual = (prevProps:any, nextProps:any) => {
   if(prevProps.pinnedList.length === nextProps.pinnedList.length && prevProps.isPinnedList === nextProps.isPinnedList)
    return true
    else return false
}
export default React.memo(PinnedList, areEqual)
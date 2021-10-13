import {styled} from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import ArrowDownIcon from '@/design-system/icons/ArrowDown'
import AddAllIcon from '@/design-system/icons/AddAll'
import Nav from '@/design-system/Nav'

import Head from 'next/head'
import { ReactNode, useState} from 'react'
import {useRouter} from 'next/router'
import { useHotkeys } from 'react-hotkeys-hook'
import { pinnedItems, PinnedItem, readLaterList, ReadingListItem} from 'contexts'
import {  useSetRecoilState, useRecoilValue } from 'recoil'

import PublicationLabel from '@/design-system/Spaces/SpacesSelector'
import PinnedComponent  from '@/design-system/PinnedItem' 
import ButtonControl from '@/design-system/primitives/ButtonControl'
import * as ScrollArea from '@radix-ui/react-scroll-area';
import OnBoarding from '@/design-system/Onboarding'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'

import { Current } from 'contexts'




const StyledMain = styled('main', {
    backgroundColor: '$background',
    height: 'auto',
    boxSizing: 'border-box',
    // overflowY: 'scroll',
    // overflowX: 'hidden',
    padding: '$2 $4',
    display: 'flex',
    flex: '1',
    justifyContent:'flex-start',
    flexDirection: 'column',
    gap: '$5'
})


const StyledHeader = styled('header', {
    position:'sticky',
    zIndex:'100',
    width:'fit-content',
    maxWidth:'100%',
    boxSizing:'border-box',
    overflowY:'hidden',
    background:'none',
    backdropFilter:'opacity(0.25)',
    top:'0',
    padding: '$2 0 0 $4',
    color: '$text',
    justifyContent: 'flex-start',
    overflowX:'hidden',
    display: 'flex',
    alignItems:'flex-start',
    flexDirection: 'row', 
    gap:'$2',
})

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

type Props = {
    children?: ReactNode;
}

export const history: Array<{
  label: string,
  undo: () => void,
}> = [];


interface IPinnedList {
    isPinnedList:boolean;
    setIsPinnedList:(newState:boolean) => void;
    setReadLater:(fn:(prevState:ReadingListItem[]) => ReadingListItem[]) => void;
}


const PinnedList = ({ isPinnedList,  setIsPinnedList, setReadLater}:IPinnedList) => {
     const pinnedList =  useRecoilValueAfterMount(pinnedItems, [])
     const setPinnedList = useSetRecoilState(pinnedItems)
     const currentArticle = useRecoilValue(Current)

    return(
    <>
        <Box layout='flexBoxColumn'
            css={{margin:'$4',
            alignItems:'flex-start', 
            justifyContent:'center', 
            marginRight:'$1', 
            background:'transparent',
            }}
            >
           
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
                setReadLater((prevState:ReadingListItem[])=>{
                    const pinnedItemsToReadingList = pinnedList.map((item:PinnedItem)=>{
                        return({entryDigest:item.entry.digest, title:item.entry.title, ensLabel: item.entry.publication?.ensLabel ? item.entry.publication.ensLabel : item.entry.author.address})
                    })
                    return [...prevState, ...pinnedItemsToReadingList]
                })
                setPinnedList([])
            }}
            label='Add all to the reading list'>
                <AddAllIcon/>
            </ButtonControl>

            <PublicationLabel  type={currentArticle?.publication.type}
            ></PublicationLabel>
   

        </Box>

                  

                    {isPinnedList && (
                        <StyledPinnedList type='scroll'>
                        
                         <StyledViewport asChild={false}>
                             <Box layout='flexBoxRow' css={{paddingTop:'$2'}}>
                                {pinnedList.map((item:PinnedItem)=>{
                                    return(
                                        <PinnedComponent key={item.entry.digest}  entry={item.entry}/>
                                    )
                                })}
                            </Box>
                        </StyledViewport>
                        <StyledScrollbar orientation="horizontal">
                            <StyledThumb/>
                        </StyledScrollbar>
                     
            
                        </StyledPinnedList>
                    )}
    </>
                     
)}


const Layout = ({children}:Props) =>{
   
    const [isPinnedList, setIsPinnedList] = useState(false)
    const setReadLater = useSetRecoilState(readLaterList)
    const currentArticle = useRecoilValue(Current)
    const router = useRouter()

    useHotkeys('cmd+z, ctrl+z', () => {
        if(history.length>0){
            console.log('history', history)
            history[0].undo()
        } else {
            console.log('nothing to undo...')
        }
    },[history]);

    return(
            <Box>
                <Head>
                    <title>Mirror feed</title>
                    <meta name="description" content="Mirror.xyz curation feed" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <OnBoarding/>
                <Nav/>
                <StyledHeader css={!router.query.publication ? {position:'sticky'} : {position:'static'}}>
                    {router.query.publication && (
                        <Box css={{padding:'$4 $4 calc($4 * 2 + $1) $4'}}>
                            <PublicationLabel 
                            type={currentArticle?.publication.type}
                            author={currentArticle?.author}
                            content={
                                currentArticle?.title || router.query.article?.toString()}
                            publication={
                                currentArticle?.publication.ensLabel || router.query.publication.toString()
                            }></PublicationLabel>
                        </Box>
                    ) }
                    {!router.query.publication && (
                        <PinnedList 
                        isPinnedList={isPinnedList} setIsPinnedList={setIsPinnedList} setReadLater={setReadLater}/>
                    )}
                </StyledHeader>
                <StyledMain>
                    {children}
                </StyledMain>
            </Box>
    )
}

export default Layout
import {createPortal} from 'react-dom'
import {styled} from 'stitches.config'
import {dialogShow, overlayShow} from 'stitches.config'
import {useRef, useState, useEffect} from 'react'
//components
import Box from '@/design-system/primitives/Box'
import Input from '@/design-system/primitives/Input'
import Profile from '@/design-system/primitives/Profile'
//hooks
import { useOnClickOutside } from 'hooks/useClickOutside'
import useLockBodyScroll from 'hooks/useLockBodyScroll'
import SearchPublication from '@/design-system/Search/SearchPublication'

import CreateSpace from '@/design-system/Spaces/SpaceCreate'
import {curationItems, CurationList, portalState} from 'contexts'
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'
import { useSetRecoilState, useRecoilState } from 'recoil'
import {useRouter} from 'next/router'
import { useHotkeys } from 'react-hotkeys-hook'
import { useThrottleCallback} from '@react-hook/throttle'
import { Search } from 'src/search'



const StyledOverlay = styled('div', {
  backgroundColor:'$background',
  opacity:0.65,
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
       animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`
  },
});

const StyledSearchContainter = styled('div', {
    position:'fixed',
    display:'flex',
    flexDirection:'column',
    padding:'$4',
    boxSizing:'border-box',
    gap:'$2',
    width:'640px',
    maxWidth:'80vw',
    overflow:'scroll',
    height:'400px',
    zIndex:'1000',
    left:'50%',
    transformOrigin:'center center',
    top:'50%',
    backgroundColor:'$background',
    border:'1px solid $foregroundBorder',
    borderRadius:'$2',
    boxShadow:'$large',
    '@media (prefers-reduced-motion: no-preference)': {
       animation: `${dialogShow} 550ms cubic-bezier(0.16, 1, 0.3, 1)`,
       animationFillMode:'forwards'
  },
})

const StyledSearchHeader = styled('div', {
    display:'flex',
    flexDirection:'row',
    gap:'$1',
    alignItems:'center',
    justifyContent:'space-between'
})


export const StyledTabsContent = styled('div', {
    transition:'$all',
    gap:'$1',
    display:'flex',
    flexDirection:'column',
    padding:'$2 0',
    paddingBottom:'0'
})

export const StyledSpaceSelector = styled('button', {
    padding:'$1 $2',
    width:'100%', 
    fontSize:'$6',
    borderColor:'transparent',
    display:'flex',
    borderRadius:'$2',
    cursor:'pointer',
    transition:'$background',
    justifyContent:'space-between',
    alignItems:'center',
    'span':{
        transform:'scale(0.8)',
        fontSize:'$6',
        lineHeight:'100%'
    },
    variants:{
        isActive:{
            true:{
                backgroundColor:'$highlightBronze',
                color:'$foregroundTextBronze',
            },
            false:{
                borderColor:'transparent',
                backgroundColor:'transparent',
                color:'$foregroundText',
                '&:hover':{
                    color:'$background',
                    backgroundColor:'$foregroundBronze',
                }
            }
        }
    },
    defaultVariants:{
        isActive:false
    }
})

interface ISearch {
    setIsOpen:(newState:boolean) => void;
}


const SpaceItem = ({index, isActive, title, Open}:{index:number, isActive:boolean, title:string, Open:(direction:string)=>void}) => {
    useHotkeys(`${index+2}, alt+${index+2}}`, () => {
        Open(`/read/${title}`)
    },[index, Open]);
    return(
        <StyledSpaceSelector isActive={isActive} onClick={()=>{
               Open(`/read/${title}`)
        }}>
            {title} 
            <span>⌥
                &#8201;
                {index+2}
            </span>
        </StyledSpaceSelector>
    )
}


const SearchPanel = ({setIsOpen}:ISearch) => {
    useLockBodyScroll()
    const ref=useRef(null)
    const search = useRef<any>()
    useOnClickOutside(ref, ()=>{setIsOpen(false)})
    const curated = useRecoilValueAfterMount(curationItems, [])
    const setCuratedPublications = useSetRecoilState(curationItems)
    const router = useRouter()
    const [searchResult, setSearchResult] = useState<null | any>(null)
    const [searchState, setSearchState] = useState<'default' | 'loading' | 'not found' | 'error'>('default')
    const [isFavourites, setIsFavourites] = useState(true)

    useEffect(()=>{
        if(search.current){
            search.current.focus()
        }
    },[search])

    // useEffect(()=> { if(search.current.value !== ''){ setIsFavourites(false)} else setIsFavourites(true)},[search]) 
    const InputSearch = async (e:React.ChangeEvent<HTMLInputElement>) => {
            if(search.current.value !== ''){ setIsFavourites(false)} else setIsFavourites(true)
            setSearchState('loading')
            const target = e.target 
            if(target.value === '') {
                setSearchState('default')
                setSearchResult([])
                return
            }
            const result = await Search(target.value).catch(()=>setSearchState('error'))
            if(!result){
                setSearchState('error')
                return
            }
            if(result.length<=0) {
                setSearchResult([])
                setSearchState('not found')
                return
            }
            setSearchResult(result)
            setSearchState('default')
    }
    const thottleSearch = useThrottleCallback(InputSearch,1)

    return(
        <>
          {typeof window !== 'undefined' && (
                        <>
                        {createPortal(
                            <>
                            <StyledOverlay/>
                            <StyledSearchContainter ref={ref}>
                                <StyledSearchHeader>
                                    {/* <CreateSpace          
                                    setCuratedPublications={setCuratedPublications}/> */}
                                    <Input ref={search} css={{top:'0',marginBottom:'$0', width:'100%', height:'auto'}} type='search' 
                                    onChange={thottleSearch}
                                    placeholder='Search user address or publication'/>
                                 </StyledSearchHeader>
                
                                <Box css={{
                                    padding:'$2 0 0 0'
                                }}>
                                    <Box as='p' css={{padding:'0', color:'$foregroundText'}}>Trending Spaces</Box>

                                    <Box 
                                    layout='flexBoxRow'
                                    css={{
                                        gap:'$2',
                                        alignItems:'center',
                                        padding:'0 $1', borderRadius:'$2',
                                        // backgroundColor:'$tint', 
                                        width:'100%'}}>
                                    <Profile
                                    size={'lg'}
                                    profile={
                                    { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/200/200'}
                                    }/>
                                    <Profile
                                    size={'lg'}
                                    profile={
                                    { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/220/220'}
                                    }/>
                                    <Profile
                                    size={'lg'}
                                    profile={
                                    { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/230/230'}
                                    }/>
                                    <Profile
                                    size={'lg'}
                                    profile={
                                    { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/240/240'}
                                    }/>
                                    <Profile
                                    size={'lg'}
                                    profile={
                                    { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/200/200'}
                                    }/>
                                    </Box>
                                </Box>

                                <Box layout='flexBoxColumn'>
                                    {isFavourites && (
                                      <StyledTabsContent>
                                            <Box as='p' css={{padding:'0', color:'$foregroundText'}}>Saved Publications</Box>
                                            <SpaceItem index={-1} title={"Main feed"} Open={()=>{
                                                setIsOpen(false)
                                                router.push('/')
                                            }}
                                            isActive={router.pathname === '/' ? true : false}/>
                                            {curated.map((list:CurationList, i:number)=>{return(
                                                <SpaceItem index={i} key={list.title+i} isActive={router.query.index?.toString() === list.title ? true :  false}
                                                Open={(direction:string)=>{
                                                    setIsOpen(false)
                                                    router.push(direction)}} title={list.title}/>
                                            )})}

                                        </StyledTabsContent>
                                    )}
                                    <Box layout='flexBoxColumn' css={{padding:'$2 0'}}>
                                        <Box as='p' css={{ color:'$foregroundText'}}>
                                        {isFavourites ? 'All Publications' : 'Search Results'}
                                        </Box>
                                        <SearchPublication searchResult={searchResult} searchState={searchState}/>
                                    </Box>
                                </Box>
                            </StyledSearchContainter>
                            </>,
                            document.body)}
                        </>
          )}
        </>
    )
}

export default SearchPanel
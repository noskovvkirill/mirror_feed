import { createPortal } from 'react-dom'
import { styled } from 'stitches.config'
import { dialogShow, overlayShow } from 'stitches.config'
import { useRef, useState, useEffect } from 'react'
import useSWR from 'swr'
//components
import Box from '@/design-system/primitives/Box'
import Input from '@/design-system/primitives/Input'
import { TopCurators } from '@/design-system/Feed/Header'
//hooks
import { useOnClickOutside } from 'hooks/useClickOutside'
import useLockBodyScroll from 'hooks/useLockBodyScroll'
import SearchPublication from '@/design-system/Search/SearchPublication'
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { useRouter } from 'next/router'
import { useHotkeys } from 'react-hotkeys-hook'
import { useThrottleCallback } from '@react-hook/throttle'
import { Search } from 'src/search'
//state
import { curationItems, CurationList, Current } from 'contexts'

//type
import type { CurrentArticle } from 'contexts'

//icons
import PointIcon from '@/design-system/icons/Point'
import MainIcon from '@/design-system/icons/Main'
import ExploreIcon from '@/design-system/icons/Explore'



const StyledOverlay = styled('div', {
    backgroundColor: '$background',
    opacity: 0.65,
    position: 'fixed',
    inset: 0,
    '@media (prefers-reduced-motion: no-preference)': {
        animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`
    },
});

const StyledSearchContainter = styled('div', {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    padding: '$4',
    boxSizing: 'border-box',
    gap: '$2',
    width: '640px',
    maxWidth: '80vw',
    overflow: 'scroll',
    height: '400px',
    zIndex: '1000',
    left: '50%',
    transformOrigin: 'center center',
    top: '50%',
    backgroundColor: '$background',
    border: '1px solid $foregroundBorder',
    borderRadius: '$2',
    boxShadow: '$large',
    '@media (prefers-reduced-motion: no-preference)': {
        animation: `${dialogShow} 550ms cubic-bezier(0.16, 1, 0.3, 1)`,
        animationFillMode: 'forwards'
    },
})

const StyledSearchHeader = styled('div', {
    display: 'flex',
    flexDirection: 'row',
    gap: '$1',
    alignItems: 'center',
    justifyContent: 'space-between'
})


export const StyledTabsContent = styled('div', {
    transition: '$all',
    gap: '$1',
    display: 'flex',
    flexDirection: 'column',
    padding: '$2 0',
    paddingBottom: '0'
})

export const StyledSpaceSelector = styled('button', {
    padding: '$1 $2',
    width: '100%',
    fontSize: '$6',
    borderColor: 'transparent',
    display: 'flex',
    borderRadius: '$2',
    cursor: 'pointer',
    transition: '$background',
    justifyContent: 'space-between',
    alignItems: 'center',
    'span': {
        transform: 'scale(0.8)',
        fontSize: '$6',
        lineHeight: '100%'
    },
    variants: {
        isActive: {
            true: {
                backgroundColor: '$highlightBronze',
                color: '$foregroundTextBronze',
            },
            false: {
                borderColor: 'transparent',
                backgroundColor: 'transparent',
                color: '$foregroundText',
                '&:hover': {
                    color: '$background',
                    backgroundColor: '$foregroundBronze',
                }
            }
        }
    },
    defaultVariants: {
        isActive: false
    }
})

interface ISearch {
    setIsOpen: (newState: boolean) => void;
}


const SpaceItem = ({ index, isActive, title, Open }: { index: number, isActive: boolean, title: string, Open: (direction: string) => void }) => {
    useHotkeys(`${index + 2}, alt+${index + 2}}`, () => {
        Open(`/read/${title}`)
    }, [index, Open]);
    return (
        <StyledSpaceSelector isActive={isActive} onClick={() => {
            Open(`/read/${title}`)
        }}>
            {title}
            <span>⌥
                &#8201;
                {index + 2}
            </span>
        </StyledSpaceSelector>
    )
}

const fetcher = async (url: string) => { return await fetch(url).then(res => res.json()) }


const SearchPanel = ({ setIsOpen }: ISearch) => {

    const { data: topCurators, error } = useSWR('/api/getTopCurators', fetcher)

    useLockBodyScroll()
    const ref = useRef(null)
    const search = useRef<any>()
    useOnClickOutside(ref, () => { setIsOpen(false) })
    const curated = useRecoilValueAfterMount(curationItems, [])
    const setCuratedPublications = useSetRecoilState(curationItems)
    const currentItem = useRecoilValue(Current)

    const router = useRouter()
    const [searchResult, setSearchResult] = useState<null | any>(null)
    const [searchState, setSearchState] = useState<'default' | 'loading' | 'not found' | 'error'>('default')
    const [isFavourites, setIsFavourites] = useState(true)

    useEffect(() => {
        if (search.current) {
            search.current.focus()
        }
    }, [search])

    // useEffect(()=> { if(search.current.value !== ''){ setIsFavourites(false)} else setIsFavourites(true)},[search]) 
    const InputSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (search.current.value !== '') { setIsFavourites(false) } else setIsFavourites(true)
        setSearchState('loading')
        const target = e.target
        if (target.value === '') {
            setSearchState('default')
            setSearchResult([])
            return
        }
        const result = await Search(target.value).catch(() => setSearchState('error'))
        if (!result) {
            setSearchState('error')
            return
        }
        if (result.length <= 0) {
            setSearchResult([])
            setSearchState('not found')
            return
        }
        setSearchResult(result)
        setSearchState('default')
    }
    const thottleSearch = useThrottleCallback(InputSearch, 1)

    return (
        <>
            {typeof window !== 'undefined' && (
                <>
                    {createPortal(
                        <>
                            <StyledOverlay />
                            <StyledSearchContainter ref={ref}>
                                {currentItem && (
                                    <Box layout='flexBoxRow'
                                        as='ul'
                                        css={{
                                            border: '1px solid $highlight',
                                            borderRadius: '$round',
                                            listStyle: 'none',
                                            alignItems: 'center',
                                            gap: '0',
                                            boxSizing: 'border-box',
                                            backgroundColor: '$tint',
                                            color: '$foreground',
                                            minHeight: '24px',
                                            margin: '0 0',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            padding: '0 $2',
                                            // overflow: 'hidden'
                                        }}>
                                        <Box
                                            as='li'
                                            css={{
                                                display: 'flex',
                                                gap: '$1',
                                                padding: '0 $2',
                                                borderRadius: '$2 0 0 $2',
                                                backgroundColor: '$tint',
                                                boxSizing: 'border-box',
                                                fontSize: '$6',
                                                alignItems: 'center',
                                                borderRight: '1px solid $highlight',
                                                position: 'relative',
                                                '&:before': {
                                                    content: " ",
                                                    display: 'block',
                                                    width: 0,
                                                    height: 0,
                                                    borderTop: "25px solid transparent", /* Go big on the size, and let overflow hide */
                                                    borderBottom: "25px solid transparent",
                                                    borderLeft: "15px solid $highlight",
                                                    position: "absolute",
                                                    top: "50%",
                                                    marginTop: '-25px',
                                                    marginLeft: '2px',
                                                    left: '100%',
                                                    zIndex: 2,
                                                },
                                                '&:after': {
                                                    content: " ",
                                                    display: 'block',
                                                    width: 0,
                                                    height: 0,
                                                    borderTop: "25px solid transparent", /* Go big on the size, and let overflow hide */
                                                    borderBottom: "25px solid transparent",
                                                    borderLeft: "15px solid $tint",
                                                    position: "absolute",
                                                    top: "50%",
                                                    marginTop: '-25px',
                                                    left: '100%',
                                                    zIndex: 2,
                                                }

                                            }}>{currentItem?.publication ? currentItem?.publication.ensLabel :
                                                router.pathname === '/' ? <><MainIcon label='location icon' /> Main page</> : router.pathname
                                            }</Box>
                                        <Box
                                            as='li'
                                            css={{

                                                boxSizing: 'border-box',
                                                padding: '0 $2', fontSize: '$6',
                                                marginLeft: '$1'
                                            }}>{currentItem.title?.slice(0, 36)}&thinsp;...</Box>
                                    </Box>
                                )}
                                {/* {JSON.stringify(currentItem)} */}
                                <StyledSearchHeader>
                                    {/* <CreateSpace          
                                    setCuratedPublications={setCuratedPublications}/> */}
                                    <Input ref={search} css={{ top: '0', marginBottom: '$0', width: '100%', height: 'auto', '&:focus': { boxShadow: '$large' } }} type='search'
                                        onChange={thottleSearch}
                                        placeholder='Search user address or publication' />
                                </StyledSearchHeader>


                                <Box css={{
                                    padding: '0 0 0 0',
                                    marginBottom: '-$2'
                                }}>
                                    <Box as='p' css={{ padding: '0', color: '$foregroundText' }}>Trending Spaces</Box>
                                    {topCurators && (<TopCurators top={topCurators} />)}
                                </Box>

                                <Box layout='flexBoxColumn'>
                                    {isFavourites && (
                                        <StyledTabsContent>
                                            <Box as='p' css={{ padding: '0', color: '$foregroundText' }}>Saved Publications</Box>
                                            <SpaceItem index={-1} title={"Main feed"} Open={() => {
                                                setIsOpen(false)
                                                router.push('/')
                                            }}
                                                isActive={router.pathname === '/' ? true : false} />
                                            {curated.map((list: CurationList, i: number) => {
                                                return (
                                                    <SpaceItem index={i} key={list.title + i} isActive={router.query.index?.toString() === list.title ? true : false}
                                                        Open={(direction: string) => {
                                                            setIsOpen(false)
                                                            router.push(direction)
                                                        }} title={list.title} />
                                                )
                                            })}

                                        </StyledTabsContent>
                                    )}
                                    <Box layout='flexBoxColumn' css={{ padding: '$2 0' }}>
                                        <Box as='p' css={{ color: '$foregroundText' }}>
                                            {isFavourites ? 'All Publications' : 'Search Results'}
                                        </Box>
                                        <SearchPublication searchResult={searchResult} searchState={searchState} />
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
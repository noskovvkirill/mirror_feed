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
import { useThrottleCallback } from '@react-hook/throttle'
import { useHotkeys } from 'react-hotkeys-hook'

import { Search } from 'src/search'
//state
import { curationItems, Current } from 'contexts'

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
    '&:focus': {
        backgroundColor: '$highlightBronze',
        color: '$foregroundTextBronze',
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


const StyledRouter = styled('ul', {
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
    display: 'flex',
    flexDirection: 'row',
})

const StyledLocation = styled('li', {
    display: 'flex',
    gap: '$0',
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
})

interface ISearch {
    setIsOpen: (newState: boolean) => void;
}



const fetcher = async (url: string) => { return await fetch(url).then(res => res.json()) }


const SearchPanel = ({ setIsOpen }: ISearch) => {

    const { data: topCurators, error } = useSWR('/api/getTopCurators', fetcher)

    useLockBodyScroll()
    const ref = useRef(null)
    const curators = useRef<HTMLDivElement>(null)
    const search = useRef<any>()
    useOnClickOutside(ref, () => { setIsOpen(false) })
    const curated = useRecoilValueAfterMount(curationItems, [])
    const setCuratedPublications = useSetRecoilState(curationItems)
    const currentItem = useRecoilValue(Current)

    const router = useRouter()
    const [searchResult, setSearchResult] = useState<null | any>(null)
    const [searchState, setSearchState] = useState<'default' | 'loading' | 'not found' | 'error'>('default')

    // const FocusSpaces = Object.freeze({
    //     0: "search",
    //     1: "top",
    //     2: "publ"
    // });

    const [selectedSpace, setSelectedSpace] = useState<number>(-1)
    const [isHover, setIsHover] = useState<null | number>(null)
    const [isPointer, setIsPointer] = useState(true)

    useHotkeys('*', () => {
        document.body.style.cursor = 'auto'
    }, [])

    useHotkeys('esc, escape', () => {
        setIsOpen(false)
    }, [])

    useHotkeys(`up, tab+shift`, (e) => {
        if (selectedSpace === 2) {
            setIsPointer(false)
            document.body.style.cursor = 'none'
            if (typeof isHover === 'number' && isHover !== 0) {
                setIsHover(isHover - 1)
            } else {
                if (curators?.current) { curators.current.focus() }
                setIsHover(-1)
                setSelectedSpace((selected) => selected -= 1)
            }
        } else {
            // e.preventDefault()
            if (selectedSpace - 1 === 1) {
                if (curators?.current) { curators.current.focus() }
            } else {
                if (search?.current) { search.current.focus() }
            }
            if (selectedSpace !== 0) {
                setSelectedSpace((selected) => selected -= 1)
            }


        }
    }, [curated, isHover, selectedSpace]);

    useHotkeys(`down, tab`, (e) => {
        if (selectedSpace === 2) {
            if (curators?.current) { curators.current.blur() }
            setIsPointer(false)
            document.body.style.cursor = 'none'
            if (typeof isHover === 'number') {
                setIsHover(isHover + 1)
            }
        } else {
            if (selectedSpace === 0) {
                e.preventDefault()
                if (curators?.current) { curators.current.focus() }
            } else {
                setIsHover(0)
                if (curators?.current) { curators.current.blur() }
            }
            setSelectedSpace((selected) => selected += 1)

        }
    }, [curated, isHover, selectedSpace]);

    useEffect(() => {
        if (search.current) {
            search.current.focus()
        }
    }, [search])

    const InputSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                                    <StyledRouter>
                                        <StyledLocation>{currentItem?.publication ? currentItem?.publication.ensLabel :
                                            router.pathname === '/' ? <><MainIcon label='location icon' />&thinsp;Main page</> :
                                                router.pathname === '/explore' ? <><ExploreIcon label='location icon' />&thinsp;Explore page</> :
                                                    router.pathname === '/my' ? <><PointIcon label='location icon' />&thinsp;My Spaces</> : router.pathname
                                        }
                                        </StyledLocation>
                                        <Box as='li'
                                            css={{
                                                boxSizing: 'border-box',
                                                padding: '0 $2', fontSize: '$6',
                                                marginLeft: '$1'
                                            }}>{currentItem.title?.slice(0, 36)}&thinsp;...
                                        </Box>
                                    </StyledRouter>
                                )}
                                <StyledSearchHeader>
                                    <Input
                                        onKeyDown={(e) => {
                                            if (e.key === 'esc' || e.key === 'escape' || e.key === 'Escape') {
                                                setIsOpen(false)
                                                return
                                            }
                                            if (e.key === 'ArrowUp') {
                                                e.preventDefault()
                                            }
                                            if (e.key === 'ArrowDown' || e.key === 'Tab') {
                                                e.preventDefault()
                                                if (curators?.current) { curators.current.focus() }
                                                setSelectedSpace(1)
                                            }
                                        }}
                                        ref={search} css={{ top: '0', marginBottom: '$0', width: '100%', height: 'auto', '&:focus': { boxShadow: '$large' } }}
                                        // type='search'
                                        onChange={thottleSearch}
                                        placeholder='Search publication' />
                                </StyledSearchHeader>


                                <Box tabIndex={-1}>
                                    <Box as='span' css={{ padding: '0', color: '$foregroundText' }}>Trending Spaces</Box>
                                    <Box
                                        tabIndex={0}
                                        ref={curators} css={{
                                            padding: '0 $2',
                                            '&:focus': {
                                                outline: 'none',
                                                background: '$foregroundTintBronze',
                                                borderRadius: '$2'
                                            },
                                            '&:active': {
                                                outline: 'none',
                                                background: '$foregroundTintBronze',
                                                borderRadius: '$2'
                                            }
                                        }}
                                    >{topCurators && (<TopCurators top={topCurators} />)}</Box>
                                </Box>

                                <Box layout='flexBoxColumn'>
                                    <Box as='span' css={{ color: '$foregroundText' }}>
                                        Publications
                                    </Box>
                                    <SearchPublication
                                        isHover={isHover}
                                        setIsHover={setIsHover}
                                        isPointer={isPointer}
                                        setIsPointer={setIsPointer}
                                        curated={curated}
                                        setCuratedPublications={setCuratedPublications}
                                        searchResult={searchResult}
                                        searchState={searchState} />

                                </Box>
                            </StyledSearchContainter>
                        </>,
                        document.body)}
                </>
            )
            }
        </>
    )
}

export default SearchPanel
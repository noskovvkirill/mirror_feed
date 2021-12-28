import { createPortal } from 'react-dom'
import { styled, searchShow, contentShow, overlayShow } from 'stitches.config'
import { useRef, useState, useEffect } from 'react'
import useSWR from 'swr'
//components
import Box from '@/design-system/primitives/Box'
import Input from '@/design-system/primitives/Input'
import Button from '@/design-system/primitives/Button'
// import Profile from '@/design-system/primitives/Profile'
import Label from '@/design-system/primitives/Label'
import Loader from '@/design-system/primitives/Loader'
import Tag from '@/design-system/primitives/Tag'
import { TopCurators } from '@/design-system/Feed/Header'
import { SpacePublication } from '@/design-system/Search/SearchPublication'
//hooks
import { useOnClickOutside } from 'hooks/useClickOutside'
import useLockBodyScroll from 'hooks/useLockBodyScroll'
import SearchPublication from '@/design-system/Search/SearchPublication'
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { useRouter } from 'next/router'
import { useThrottleCallback } from '@react-hook/throttle'
import { useHotkeys } from 'react-hotkeys-hook'
//state
import { curationItems, Current } from 'contexts'
import { Search } from 'src/search'

//icons
import PointIcon from '@/design-system/icons/Point'
import MainIcon from '@/design-system/icons/Main'
import ExploreIcon from '@/design-system/icons/Explore'
import LinkIcon from '@/design-system/icons/Link'

//utils
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)



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
    height: '512px',
    maxHeight: '80vh',
    zIndex: '1000',
    left: '50%',
    transformOrigin: 'center center',
    top: 'calc($4 + $1)',
    backgroundColor: '$background',
    border: '1px solid $foregroundBorder',
    borderRadius: '$2',
    boxShadow: '$large',
    '@media (prefers-reduced-motion: no-preference)': {
        animation: `${searchShow} 550ms cubic-bezier(0.16, 1, 0.3, 1)`,
        animationFillMode: 'forwards'
    },
    '@bp1': {
        maxWidth: '100vw',
        width: '100%',
        top: '$4',
        height: '100%',
        padding: '$2'
    }
})

const StyledSearchHeader = styled('div', {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
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
    isSearch: boolean;

}



const fetcher = async (url: string) => { return await fetch(url).then(res => res.json()) }


//need to figure out how to use exactly the same input inside the searchpanel, probably with framer is the easiest solution


const SearchBar = ({ isSearch, setIsOpen, isVisible, setIsVisible }: ISearch & { isVisible: boolean, setIsVisible: (newState: boolean) => void; }) => {
    return (
        <>
            {!isSearch && !isVisible && (
                <Button
                    onMouseEnter={() => {
                        setIsVisible(true)
                    }}
                    css={{
                        width: '320px',
                        // height: '100%'
                        opacity: 0,
                    }}>
                    &nbsp;
                </Button>
            )}
            {!isSearch && isVisible && (
                <Button
                    css={{
                        display: 'flex',
                        transition: '$all',
                        '@media (prefers-reduced-motion: no-preference)': {
                            animationName: `${contentShow}`,
                            animationDuration: '500ms',
                            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                            animationFillMode: 'forwards',
                            willChange: 'transform, opacity',
                        },
                        '&:hover': {
                            border: '0',
                            background: '$tint',
                            color: '$foreground',
                            boxShadow: '$small',
                        },
                        justifyContent: 'center', boxSizing: 'border-box',
                        width: '320px',
                        '@bp1': {
                            width: '100%'
                        },
                        background: '$highlight', textAlign: 'center', border: '0px'
                    }}
                    onClick={() => setIsOpen(true)}
                >Search</Button>
            )}
            {isSearch && (
                <SearchPanel setIsOpen={setIsOpen} isSearch />
            )}
        </>
    )
}


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


    const [selectedSpace, setSelectedSpace] = useState<number>(-1)
    const [isHover, setIsHover] = useState<null | number>(null)
    const [isHoverSearch, setIsHoverSearch] = useState<null | number>(null)
    // const [isActive, setIsActive] = useState()

    const [searchMode, setSearchMode] = useState<'PUBLICATIONS' | 'ENTRIES'>('PUBLICATIONS')

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

    useEffect(() => {
        setIsHoverSearch(null)
    }, [isHover])
    useEffect(() => {
        setIsHover(null)
    }, [isHoverSearch])

    const handleSearch = async (query: string, mode: 'PUBLICATIONS' | 'ENTRIES') => {
        setSearchState('loading')
        const result = await Search(query, mode).catch(() => setSearchState('error'))
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

    const InputSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchState('loading')
        const target = e.target
        if (target.value === '') {
            setSearchState('default')
            setSearchResult([])
            return
        }
        handleSearch(target.value, searchMode)

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
                                        key={'input_search'}
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
                                        ref={search} css={{ transition: '$all', top: '0', width: '100%', height: 'auto', '&:focus': { boxShadow: '$large' } }}
                                        // type='search'
                                        onChange={thottleSearch}
                                        placeholder='Search publication' />
                                    <Box as='select'
                                        onChange={(newState: React.ChangeEvent<HTMLSelectElement>) => {
                                            console.log('select new value', newState.target.value)
                                            if (newState.target.value === 'Publications') {
                                                setSearchMode('PUBLICATIONS')
                                                setSearchResult([])
                                                if (search.current.value !== '' && search.current.value) {
                                                    handleSearch(search.current.value, 'PUBLICATIONS')
                                                }
                                            } else {
                                                setSearchMode('ENTRIES')
                                                setSearchResult([])
                                                if (search.current.value !== '' && search.current.value) {
                                                    handleSearch(search.current.value, 'ENTRIES')
                                                }
                                            }
                                        }}
                                        css={{
                                            position: 'absolute', right: 0, top: 0,
                                            border: '1px solid $foregroundBorder',
                                            borderLeft: 0,
                                            height: '100%',
                                            boxSizing: 'border-box',
                                            borderRadius: '0 $2 $2 0',
                                            background: '$highlight',
                                            appearance: 'none',
                                            color: '$foregroundText',
                                            outline: 'none',
                                            padding: '0 $2',
                                            paddingLeft: '$3',
                                            textAlign: 'center',
                                            fontSize: '$6',
                                            fontFamily: 'inherit',
                                            fontWeight: 'inherit',
                                            cursor: 'inherit',
                                            lineHeight: '$6'
                                        }}>
                                        <option>Publications</option>
                                        <option>Entries</option>
                                    </Box>
                                </StyledSearchHeader>

                                {searchState === 'loading' && (
                                    <Box css={{ padding: '$1 $2' }}> <Loader size='small' /></Box>
                                )}

                                {(searchResult?.length >= 0 && searchMode === 'PUBLICATIONS') && (
                                    <Box tabIndex={-1} css={{ padding: '0 0 $2 0' }} layout='flexBoxColumn'>
                                        {searchResult.map((item, index) => (
                                            <SpacePublication
                                                isPointer={isPointer}
                                                setIsActive={setIsHoverSearch}
                                                index={index}
                                                setCuratedPublications={setCuratedPublications}
                                                item={item}
                                                isFavourite={curated?.findIndex((publ: SubscribedPublication) => publ.ensLabel === item.ensLabel) !== -1}
                                                Open={(direction: string) => {
                                                    setIsOpen(false)
                                                    router.push(direction);
                                                }}
                                                isActive={isHoverSearch === (index) ? true : false}
                                                key={'search_result' + item.ensLabel} />
                                        ))}
                                    </Box>
                                )}

                                {(searchResult?.length >= 0 && searchMode === 'ENTRIES') && (
                                    <Box tabIndex={-1} css={{
                                        padding: '0 0 $2 0'
                                    }} layout='flexBoxColumn'>
                                        {search.current.value && searchResult?.length <= 0 && (
                                            <Label color='foreground'>Nothing was found</Label>
                                        )}
                                        {search.current.value && search.current.value === '' && (
                                            <Label>Search for something</Label>
                                        )
                                        }

                                        {searchResult.map((item: { publication: { ensLabel: string }, timestamp: number, title: string, digest: string }) => {
                                            return (
                                                <Box layout='flexBoxColumn'
                                                    key={item.digest + 'search_item_entry'}
                                                    onClick={() => {
                                                        setIsOpen(false)
                                                        router.push(`/${item.publication.ensLabel}/${item.digest}`)
                                                    }}
                                                    css={{
                                                        backgroundColor: '$tint', borderRadius: '$2', padding: '$1 $2',
                                                        cursor: 'pointer',
                                                        transition: '$background',
                                                        '&:hover': {
                                                            backgroundColor: '$highlightBronze',
                                                            color: '$foregroundTextBronze'
                                                        }
                                                    }}>
                                                    <Box layout='flexBoxRow' css={{ gap: '$0', alignItems: 'center' }}>
                                                        <Tag>{item.publication?.ensLabel}</Tag>
                                                        <Tag>{dayjs.unix(item.timestamp).fromNow()}</Tag>
                                                        <Tag css={{ backgroundColor: 'transparent', padding: '0 $1', cursor: 'pointer' }} as='a' rel="noreferrer" href={`https://${item.publication.ensLabel}.mirror.xyz/${item.digest}`} target='_blank'><LinkIcon /></Tag>
                                                    </Box>
                                                    <Label color={'foreground'} size='normal'>{item.title}</Label>
                                                </Box>

                                            )
                                        })}

                                    </Box>
                                )}



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
                                    >
                                        <TopCurators top={topCurators} loading={topCurators ? false : true} />
                                    </Box>
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
                                        setCuratedPublications={setCuratedPublications} />

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

export default SearchBar
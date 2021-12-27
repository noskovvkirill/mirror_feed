//components
import { styled, keyframes } from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import Nav from '@/design-system/Nav'
import Label from '@/design-system/primitives/Label'
import Tag from '@/design-system/primitives/Tag'
import OnBoarding from '@/design-system/Onboarding'
import Search from '@/design-system/Search'
import Portal from '@/design-system/Portal'
import Notifications from '@/design-system/Notifications'
import Head from 'next/head'
import Link from 'next/link'
//state
import React, { ReactNode, useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { pinnedItems, portalState, curatedSpaceNotSyncSelected, curatedSpaceNotSync } from 'contexts'
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil'
import useScrollPosition from '@react-hook/window-scroll'
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'
// import { DndContext } from '@dnd-kit/core';

//types
// import type { CuratedSpaceNotSync, CuratedSpaceItem, PinnedItem } from 'contexts'


export const AnimationContentDisplay = keyframes({
    '0%': { opacity: 0, transform: `translate(0%, 100%)` },
    '100%': { opacity: 1, transform: `translate(0%, 0%)` }
})

const StyledMain = styled('main', {
    backgroundColor: '$background',
    height: 'auto',
    boxSizing: 'border-box',
    padding: '$2 $4',
    display: 'flex',
    flex: '1',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    gap: '$5',
    '@bp1': {
        padding: '$2 $1'
    }
})


const StyledHeader = styled('header', {
    position: 'sticky',
    zIndex: '100',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    overflowY: 'hidden',
    background: 'transparent',
    // backdropFilter:'opacity(0.25)',
    top: '0',
    padding: '$2 $4 0 $4',
    paddingTop: '$5',
    color: '$text',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    gap: '$2',
    '@bp1': {
        width: "100%",
        overflow: 'hidden',
        padding: '$4 0 0 $4',
    }
})

const StyledNavControls = styled(Box, {
    margin: '0 0 0 $4',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: '$5',
    background: 'transparent',
    '@bp1': {
        margin: '0',
        justifyContent: 'flex-start'
    }
})


const StyledFooter = styled('footer', {
    transition: '$all',
    fontSize: '$6',
    color: '$foregroundText',
    opacity: 0.5,
    backdropFilter: 'opacity(50%)',
    mixBlendMode: 'screen',
    '@media (prefers-reduced-motion: no-preference)': {
        animationName: `${AnimationContentDisplay}`,
        animationDuration: '500ms',
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        animationFillMode: 'forwards',
    },
    willChange: 'transform, opacity',
    position: 'fixed',
    backgroundColor: '$tint',
    justifyContent: 'space-between', padding: '$1 $4', bottom: 0, left: 0, width: '100%', boxSizing: 'border-box'
})


type Props = {
    children?: ReactNode;
}

export const history: Array<{
    label: string,
    undo: () => void,
}> = [];


// // making spaces available through the global keys
// const SpaceKeysMapping = ({ index, Open }: { index: number, Open: () => void }) => {
//     useHotkeys(`alt+${index}`, () => {
//         Open()
//     }, [index, Open]);
//     return (<></>)
// }


const Layout = ({ children }: Props) => {
    const [isPinnedList, setIsPinnedList] = useState(false)
    // const setReadLater = useSetRecoilState(readLaterList)
    const pinnedList = useRecoilValueAfterMount(pinnedItems, [])
    const setPinnedList = useSetRecoilState(pinnedItems)
    // const currentArticle = useRecoilValue(Current)
    // const router = useRouter()

    // const curated = useRecoilValueAfterMount(curationItems, [])
    const [isPortal, setIsPortal] = useRecoilState(portalState)
    const [isSearch, setIsSearch] = useState(false)

    const [activeId, setActiveId] = useState<string | null>(null); //draggable

    const currentNotSync = useRecoilValue(curatedSpaceNotSyncSelected)
    const setMyCurated = useSetRecoilState(curatedSpaceNotSync(currentNotSync)) //personal curated items


    const [scrollDir, setScrollDir] = useState<'top' | 'bottom' | 'stale'>('stale')
    const scrollY = useScrollPosition(10) //framerate scroll check
    const [prevScroll, setPrevScroll] = useState(0)

    useEffect(() => {
        const currentScroll = scrollY
        if (currentScroll >= Math.floor(window.innerHeight / 3) && scrollDir === 'bottom') {
            setIsPinnedList(false)
        }
        if (currentScroll <= 10) {
            setIsPinnedList(true)
        }

        if ((prevScroll - currentScroll) > 150 && scrollDir !== 'top') {
            setScrollDir('top')
        }

        if ((prevScroll - currentScroll) > 150 && scrollDir === 'top') {
            setIsPinnedList(true)
        }
        if ((currentScroll - prevScroll) > 70 && scrollDir !== 'bottom') {
            setScrollDir('bottom')
        }
        setPrevScroll(scrollY)

    }, [scrollY])



    useHotkeys("cmd+/, ctrl+/", (e) => {
        setIsSearch(true)
    }, [])


    useHotkeys("*", (e) => {
        if (e.key === 'Alt') {
            setIsPortal({ isPortal: !isPortal.isPortal, modal: true })
        }
    }, { keyup: true }, [isPortal])

    useHotkeys('cmd+z, ctrl+z, command+z, Meta+z', () => {
        if (history.length > 0) {
            history[0].undo()
        } else {
            console.log('nothing to undo...')
        }
    }, [history]);

    return (
        <Box>
            <Head>
                <title>Mirror feed</title>
                <meta name="description" content="Mirror.xyz curation feed" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <OnBoarding />

            {/* <DndContext
                onDragEnd={(e) => {
                    const over = e.over
                    console.log('drop', e)
                    if (over?.id === 'droppable_pinnedList') {
                        const itemIndex = pinnedList.findIndex((item) => item.id === (parseInt(e.active.id) - 1))
                    }

                    if (over?.id === 'curated') {
                        const itemIndex = pinnedList.findIndex((item) => item.id === (parseInt(e.active.id) - 1))
                        if (itemIndex !== -1) {
                            setMyCurated((prevState: CuratedSpaceNotSync) => {
                                if (prevState) {
                                    const newState = Object.assign({}, prevState)
                                    const newItem = Object.assign({}, pinnedList[itemIndex]) as CuratedSpaceItem;
                                    const newStateItems = [...prevState.items, newItem]
                                    newState.items = newStateItems
                                    return newState
                                } else return prevState
                            })
                            setPinnedList((prevState: PinnedItem[]) => {
                                return [...prevState.slice(0, itemIndex), ...prevState.slice(itemIndex + 1)];
                            })
                        }
                    }
                    setActiveId(null)
                }}
                onDragStart={(e) => {
                    setActiveId(e.active.id)
                }}> */}

            {/* <StyledHeader css={{ position: 'sticky', height: '160px' }}> */}
            <StyledHeader css={{ position: 'sticky', height: 'fit-content', marginBottom: '$2' }}>

                <StyledNavControls layout='flexBoxColumn'>
                    <Portal
                        // isSearch={isSearch}
                        setIsSearch={setIsSearch}
                    />
                </StyledNavControls>
                {/* {isPinnedList && ( */}
                <Search
                    setIsVisible={setIsPinnedList}
                    isVisible={isPinnedList}
                    isSearch={isSearch}
                    setIsOpen={setIsSearch}
                />
                {/* )} */}

                <Nav pinnedListLength={pinnedList.length} isPinnedList={isPinnedList}
                    setIsPinnedList={setIsPinnedList} />

                {/* WORK IN PROGRESS */}
                {/* <PinnedList
                        activeId={activeId}
                        pinnedList={pinnedList}
                        setPinnedList={setPinnedList}
                        currentArticle={currentArticle}
                        routerQuery={{
                            article: router.query.article?.toString(),
                            publication: router.query.publication?.toString()
                        }}
                        isPinnedList={isPinnedList}
                        setReadLater={setReadLater}
                    /> */}
            </StyledHeader>
            <Notifications />
            <StyledMain>
                {children}
            </StyledMain>
            <StyledFooter css={{
                display: isPinnedList ? 'flex' : 'none',
            }}>
                <Box layout='flexBoxRow' css={{ alignItems: 'center', '@bp1': { visibility: 'hidden' } }}>
                    <Box layout='flexBoxRow' css={{ gap: '$0', alignItems: 'center' }}>
                        <Label>Search</Label>
                        <Tag color='default' css={{ backgroundColor: '$background', padding: '$0', borderRadius: '$1', fontSize: '10px' }}>CMD&thinsp;+&thinsp;/</Tag>
                    </Box>
                    <Box layout='flexBoxRow' css={{ gap: '$0', alignItems: 'center' }}>
                        <Label>Door</Label>
                        <Tag color='default' css={{ backgroundColor: '$background', padding: '$0', borderRadius: '$1', fontSize: '10px' }}>ALT</Tag>
                    </Box>
                </Box>
                <Box layout='flexBoxRow' css={{ alignItems: 'center' }}>
                    <Link passHref href={'/about'}><Label css={{ textDecoration: 'underline', cursor: 'pointer' }}>About</Label></Link>
                    <Label>2022</Label>
                </Box>
            </StyledFooter>
            {/* <Box as='footer' css={{
                    padding: '$0',
                    overflow: 'hidden',
                    // mixBlendMode: 'screen',
                    borderRadius: '$round',
                    position: 'fixed', right: '$4', bottom: '$4', width: 'calc($4*2)', height: 'calc($4 * 2)',
                    backgroundColor: '$highlight'
                }}>
                    <img src={'/welcome.png'} width='100%' height='100%' />
                </Box> */}
            {/* </DndContext> */}
        </Box>
    )
}

export default Layout
import { styled } from 'stitches.config';
import useSWRInfinite from 'swr/infinite'


import Box from '@/design-system/primitives/Box'
import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import useOnScreen from 'hooks/useOnScreen'

import Profile from '@/design-system/primitives/Profile'
import { AddressPrettyPrint } from 'src/utils'
import Loader from '@/design-system/primitives/Loader'
// import Tag from '@/design-system/primitives/Tag'
// import Label from '@/design-system/primitives/Label'
import Star from '@/design-system/icons/Star'
import NotStar from '@/design-system/icons/NotStar'

//types
import type { SubscribedPublication } from 'contexts'


export const StyledSpaceSelector = styled('button', {
    padding: '$2',
    height: '$4',
    // boxSizing: 'border-box',
    width: '100%',
    fontSize: '$6',
    borderColor: 'transparent',
    display: 'flex',
    borderRadius: '$2',
    cursor: 'pointer',
    transition: 'background 0.5s ease-out, color 0.8s cubic-bezier(0.875, 0.885, 0.875, 1.275)',
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
        outline: 'none'
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





export const SpacePublication = ({ index, isActive, isPointer, setCuratedPublications, isFavourite, isAvatar = true, item, setIsActive, Open }: { isPointer: boolean; setCuratedPublications?: any, isAvatar?: boolean; isFavourite: boolean; setIsActive: any, index: number, isActive: boolean, item: SubscribedPublication, Open: (direction: string) => void }) => {
    const ref = useRef<any>(null)
    const [isHover, setIsHover] = useState(false)
    useEffect(() => {
        if (isActive) {
            ref.current.focus()
        }
    }, [isActive])
    return (
        <Box layout='flexBoxRow'
            onClick={() => {
                Open(`/${item?.ensLabel}`)
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    Open(`/${item?.ensLabel}`)
                }
            }}
            css={{ pointerEvents: isPointer ? 'all' : 'none', alignItems: 'center' }}
            onMouseEnter={() => { if (isPointer) { setIsHover(true); setIsActive(index) } }}
            onMouseLeave={() => { if (isPointer) setIsHover(false) }}
            onFocus={() => { setIsActive(index) }}
        >
            <StyledSpaceSelector
                css={{ pointerEvents: isPointer ? 'all' : 'none' }}
                ref={ref}
                isActive={isActive}>
                <Box layout='flexBoxRow' css={{ gap: '$2', fontSize: '$6', alignItems: 'center' }}>

                    {isAvatar && (
                        <Profile size='sm' profile={item} />
                    )}
                    {item?.displayName ? item.displayName : item.ensLabel}
                </Box>

                {(isHover || isFavourite) && setCuratedPublications && (
                    <>
                        {isFavourite
                            ? <StyledSpaceSelector
                                onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    setCuratedPublications((prev: SubscribedPublication[]) => {
                                        return [...prev.filter((publ) => publ.ensLabel !== item.ensLabel)]
                                    })
                                }}
                                css={{ alignItems: 'center', justifyContent: 'center', width: '$3', height: '$3', padding: 0 }}
                                tabIndex={-1}>
                                <Star label='unstar' />
                            </StyledSpaceSelector>
                            : <StyledSpaceSelector
                                css={{ alignItems: 'center', justifyContent: 'center', width: '$3', height: '$3', padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    setCuratedPublications((prev: SubscribedPublication[]) => {
                                        const pub: SubscribedPublication = {
                                            avatarURL: item.avatarURL,
                                            displayName: item?.displayName,
                                            type: 'ens',
                                            ensLabel: item.ensLabel
                                        }
                                        return [...prev, pub];
                                    })
                                }}
                                tabIndex={-1}>
                                <NotStar label='unstar' />
                            </StyledSpaceSelector>
                        }

                    </>
                )}
            </StyledSpaceSelector>
        </Box>
    )
}





const getKey = (pageIndex: number, previousPageData: SubscribedPublication[] | null) => {
    if (previousPageData && !previousPageData.length) return null // reached the end
    return `${pageIndex * 10}`                // SWR key
}

const fetcher = async (key: string) => {
    let { data } = await fetch(`/api/getPublications?from=${key}&to=${parseInt(key) + 9}`).then(res => res.json())
    return data
}



const SearchPublication = ({ isHover, isPointer, setIsPointer, setIsHover, curated, setCuratedPublications }: any) => {

    const { data, error, isValidating, setSize } = useSWRInfinite(getKey, fetcher)
    const router = useRouter()
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useOnScreen(ref, {
        threshold: 0,
        rootMargin: '100%'
    })
    const isVisible = !!entry?.isIntersecting

    useEffect(() => {
        if (isVisible) {
            setSize((s) => s += 1)
        }
        const MouseMove = () => {
            document.body.style.cursor = 'auto'
            setIsPointer(true)
        }
        document.body.addEventListener('mousemove', MouseMove)
        return (() => {
            document.body.removeEventListener('mousemove', MouseMove)
        })
    }, [isVisible, setSize])


    return (
        <Box>
            <Box layout='flexBoxColumn' css={{
                height: 'fit-content', overflow: 'visible', scrollBehavior: 'smooth', scrollSnapType: 'y proximity'
            }}>

                {!data && [...curated].map((item: SubscribedPublication, index: number) => {
                    // console.log('item_', item)
                    return (
                        <SpacePublication
                            isPointer={isPointer}
                            key={index + item.ensLabel}
                            setIsActive={setIsHover}
                            index={index}
                            item={item}
                            setCuratedPublications={setCuratedPublications}
                            Open={(direction: string) => {
                                router.push(direction)
                            }}
                            isActive={isHover === (index) ? true : false}
                            isFavourite={true}
                        />)
                })}

                {data && [...curated, ...data?.flat().filter((item: SubscribedPublication) => {
                    return curated?.findIndex((publ: SubscribedPublication) => publ?.ensLabel === item?.ensLabel) === -1
                })].map((item: SubscribedPublication, index: number) => {
                    if (item) {
                        return (
                            <SpacePublication
                                isPointer={isPointer}
                                key={index + item.ensLabel}
                                setIsActive={setIsHover}
                                index={index}
                                setCuratedPublications={setCuratedPublications}
                                item={item}
                                isFavourite={curated?.findIndex((publ: SubscribedPublication) => publ.ensLabel === item.ensLabel) !== -1}
                                Open={(direction: string) => {
                                    router.push(direction)
                                }}
                                isActive={isHover === (index) ? true : false}
                            />)
                    } else return <></>

                })
                }
                <Box ref={ref} css={{ padding: '$1 $2' }}>
                    {isValidating && (
                        <Loader size='small' />
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default SearchPublication


{/* <Box css={searchResult?.length > 0 ? { paddingBottom: '0' } : {}}>
                    {searchResult?.map((item: SubscribedPublication & { address?: string }, index: number) => {
                        return (
                            <StyledSearchResult
                                tabIndex={0}
                                onClick={() => { router.push(`/${item.type === 'ens' ? item.ensLabel : item.address}?type=${item.type}`) }}
                                key={'search result' + index}>
                                <Box layout='flexBoxRow' css={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box layout='flexBoxRow' css={{ alignItems: 'center', fontSize: '$6' }}>
                                        <Profile size='sm' profile={item} />
                                        <>{AddressPrettyPrint(item.ensLabel)}</>
                                    </Box>
                                    <StyledLabel>
                                        {item.type === 'ens'
                                            ? "PUBLICATION"
                                            : "PRIVATE"
                                        }
                                    </StyledLabel>
                                </Box>
                            </StyledSearchResult>
                        )
                    })}
                    {searchState === 'loading' && (
                        <Box css={{ padding: '$2 $2 $2 $2' }}>
                            <Loader size='small' />
                        </Box>
                    )}

                    {searchState === 'not found' && (
                        <Box css={{ padding: '$2 $2 $2 $2', fontSize: '$6', color: '$text' }}>
                            Not found
                        </Box>
                    )}

                    {searchState === 'error' && (
                        <Box css={{ padding: '$1 $2 $2 $2', fontSize: '$6', color: '$text' }}>
                            <>Something went wrong...</>
                        </Box>
                    )}
                </Box> */}
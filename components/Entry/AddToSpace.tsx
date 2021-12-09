//utils
import { styled, keyframes } from 'stitches.config'
import { useRef, useEffect, useState, memo } from 'react'
// import Fuse from 'fuse.js'

//components
import Box from '@/design-system/primitives/Box'
import Input from '@/design-system/primitives/Input'
import Loader from '@/design-system/primitives/Loader'
import Label from '@/design-system/primitives/Label'
import ButtonControl from '@/design-system/primitives/ButtonControl'
import Link from 'next/link'
// import Button from '@/design-system/primitives/Button'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import AddIcon from '@/design-system/icons/Add'
import AddCircled from '@/design-system/icons/AddCircled'
import CheckCircled from '@/design-system/icons/CheckCircled'

// import MoreIcon from '@/design-system/icons/More'
//state
import { useRecoilValueLoadable, useRecoilCallback } from 'recoil'
import { userSpaces, curatedSpaceNotSync, PinnedItem } from 'contexts'
import { useAuth } from 'contexts/user'
// import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'
//types
import type { SpaceType } from 'contexts/spaces'
import type { CuratedSpaceNotSync, ReadingListItem } from 'contexts'
import type { UserType } from 'contexts/user'
import type { EntryType } from '@/design-system/Entry'

interface IAddToSpace {
    item: EntryType,
    setReadLater?: (fn: (prevState: ReadingListItem[]) => ReadingListItem[]) => void;
    direction?: 'top' | 'left' | 'right' | 'bottom',
    isHighlighted?: boolean,
}

const AnimationContentDisplay = keyframes({
    '0%': { opacity: 0, transform: `scale(0.90) ` },
    '100%': { opacity: 1, transform: `scale(1)` }
})



const StyledItem = styled(DropdownMenu.Item, {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '$1 $2',
    borderRadius: '$2',
    boxSizing: 'border-box',
    cursor: 'pointer',
    transition: '$background',
    '&:hover': {
        color: '$foregroundTextBronze',
        background: '$highlightBronze'
    },
    variants: {
        isHighlighted: {
            true: {
                color: '$foregroundTextBronze',
                background: '$highlightBronze'
            },
            false: {
                backgroundColor: '$highlight',
                color: '$foregroundText',
            }
        }
    },
    defaultVariants: {
        isHighlighted: false
    }
})

const StyledContainer = styled(DropdownMenu.Content, {
    display: 'flex',
    zIndex: 100000,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // boxShadow: '$large',
    //weird way to have boxShadow with multiply mode
    '&:before': {
        boxShadow: '$large',
        mixBlendMode: 'multiply',
        content: "",
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        pointerEvents: 'none',
        borderRadius: '$2',
    },
    gap: '$1',
    boxSizing: 'border-box',
    padding: '$2',
    borderRadius: '$2',
    width: '280px',
    position: 'absolute',
    border: '1px solid $foregroundBorder',
    background: '$background',
    '@media (prefers-reduced-motion: no-preference)': {
        '&[data-state="open"]': {
            animationName: `${AnimationContentDisplay}`,
            animationDuration: '400ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'forwards',
            willChange: 'transform, opacity'
        }
    }
})



const AddToSpace = ({ item, setReadLater, isHighlighted = true, direction = 'bottom' }: IAddToSpace) => {

    const search = useRef<HTMLInputElement | null>(null)
    const { user } = useAuth()
    const spaces = useRecoilValueLoadable<SpaceType[]>(userSpaces(user?.address || ''))
    // const fuse = new Fuse(spaces.contents,  {keys:['name']})

    const [isInReadingList, setIsInReadingList] = useState<boolean>(false)
    const [addState, setAddState] = useState<Array<number>>([-1, -1])
    //item && code
    //-1 is default && -2 is loading && -3 is success

    const UpdateSpace = useRecoilCallback(({ snapshot, set }) => async (spaceIndex: number) => {
        setAddState([spaceIndex, -2])
        const itemsCurrently: CuratedSpaceNotSync = await snapshot.getPromise(curatedSpaceNotSync(spaceIndex));
        if (itemsCurrently.items.find((obj) => obj.item.digest === item.digest)) {
            setTimeout(() => {
                setAddState([spaceIndex, -3])
            }, 500)
            return
        }
        let id = itemsCurrently.items[itemsCurrently.items.length - 1]?.id
        const newItem: PinnedItem = {
            id: id += 1,
            type: 'entry',
            item: item
        }
        const newItems: CuratedSpaceNotSync = { items: [...itemsCurrently.items, newItem] }
        set(curatedSpaceNotSync(spaceIndex), newItems)
        setTimeout(() => {
            setAddState([spaceIndex, -3])
        }, 500)
    }, [])

    useEffect(() => {
        if (search.current) {
            search.current.focus()
        }

    }, [item])


    return (
        <DropdownMenu.Root
            //  onOpenChange={()=>alert('yo')}
            modal={false}>
            <DropdownMenu.Trigger asChild>
                <ButtonControl
                    direction={direction}
                    isHighlighted={isHighlighted} label={'Save'}>
                    <AddIcon />
                </ButtonControl>
            </DropdownMenu.Trigger>
            <StyledContainer>
                <Label css={{ color: '$foregroundText' }}>Select the space</Label>
                {setReadLater && (
                    <StyledItem
                        isHighlighted={isInReadingList}
                        onSelect={(e) => {
                            e.preventDefault()
                            if (!isInReadingList) {
                                setReadLater((prevState: ReadingListItem[]) => {
                                    setIsInReadingList(true)
                                    if (prevState.findIndex((obj: ReadingListItem) => obj.entryDigest === item.digest) !== -1) return prevState
                                    return [...prevState,
                                    {
                                        entryDigest: item.digest,
                                        title: item.title,
                                        ensLabel: item.publication?.ensLabel ? item.publication.ensLabel : item.author.address
                                    }]
                                })
                            }
                            //     else {
                            //         setReadLater((prevState:ReadingListItem[])=>{
                            //         const indexUnPin = prevState.findIndex((obj:ReadingListItem)=>obj.entryDigest=== item.digest)
                            //         const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                            //         return newArray
                            //     })
                            //     setIsInReadingList(false)
                            // }
                        }
                        }

                    >
                        <Label size={'default'}>{isInReadingList ? 'Added to Reading List' : 'Add to Reading List'}</Label>
                        {isInReadingList ? <CheckCircled /> : <AddCircled />}
                    </StyledItem>
                )}
                <Box layout='flexBoxColumn' css={{ width: '100%', padding: '$2 0' }}>
                    {/* <Input 
                    onChange={(e)=>{
                        e.preventDefault()
                        e.stopPropagation()
                        const searchResult = fuse.search(e.target.value)
                        console.log('search result', searchResult)
                    }}
                    ref={search}
                    css={{width:'100%'}}
                    type='search' placeholder='Search spaces'/> */}
                    {spaces.state === 'hasValue' && spaces?.contents.length === 0 && (
                        <Link href={`/my`} passHref><Label css={{ color: '$foregroundText', textAlign: 'center' }}>No spaces found</Label></Link>
                    )}
                    {spaces.state === 'hasValue' && spaces.contents.map((space: SpaceType, index: number) => (
                        <StyledItem
                            isHighlighted={addState[0] === index}
                            onSelect={(e) => {
                                e.preventDefault()
                                UpdateSpace(index)
                            }}
                            key={'space-list-add' + space.tokenId.toString()}>
                            {addState[0] === index &&
                                <>
                                    {addState[1] === -2 && <span><Loader size='small' /></span>}
                                    {addState[1] === -3 && <Label size={'default'}>Added to the space</Label>}
                                </>
                            }
                            {addState[0] !== index && <Label size={'default'}>{space.name}</Label>}
                        </StyledItem>
                    ))}
                    {spaces.state === 'loading' || spaces.state === 'hasError' && (
                        <>
                            {user?.isConnected && <Loader size='small'>Loading spaces...</Loader>}
                            {user?.isConnected === false &&
                                <Label size='default' css={{ color: '$foregroundText', textAlign: 'center' }}>Please connect your wallet <br /> to see the spaces</Label>
                            }
                        </>
                    )}

                    {/* Button load more spaces —> will need on a scale  */}

                    {/* <Box layout='flexBoxRow' 
                    css={{width:'100%', alignItems:'center', justifyContent:'center'}}>
                        <Button css={{border:'1px solid $background'}}><MoreIcon/></Button>
                    </Box> */}
                </Box>
            </StyledContainer>


        </DropdownMenu.Root>
    )


}

export default memo(AddToSpace)
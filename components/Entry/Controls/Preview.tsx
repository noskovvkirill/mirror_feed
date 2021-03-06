import { styled } from 'stitches.config'

//components
import ButtonControl from '@/design-system/primitives/ButtonControl'
import OpenIcon from '@/design-system/icons/Open'
import PinIcon from '@/design-system/icons/Pin'

import AddToSpace from '@/design-system/Entry/AddToSpace'

//types
import type { PinnedItem, IgnoredPublication, ReadingListItem } from 'contexts'
import type { EntryType } from '@/design-system/Entry'

//utils
import { AddressPrettyPrint } from 'src/utils';

export interface ControlsInternal {
    entry: EntryType,
    view?: 'card' | 'list',
    isHover: boolean;
    isFocused: boolean;
    isReadingList: boolean;
    setIsHover: (isHover: boolean) => void;
    setReadLater: (fn: (prevState: ReadingListItem[]) => ReadingListItem[]) => void;
    setPinnedItem?: (fn: (prevState: PinnedItem[]) => PinnedItem[]) => void;
    setIgnoredList?: (fn: (prevState: IgnoredPublication[]) => IgnoredPublication[]) => void;
    Open: (digest: string) => void;
}

const StyledControls = styled('div', {
    display: 'flex',
    gap: '$1',
    padding: '0 $2 $1 $2',
    //it's getting squezed in some cases currently, figure out why and remove the hardcoded value
    boxSizing: 'border-box',
    // overflow:'hidden',
    flexDirection: 'column',
    marginRight: 'calc($4 + $1)',
    transition: '$all',
    variants: {
        isVisible: {
            true: {
                opacity: '1'
            },
            false: {
                opacity: '0',
                '@bp1': {
                    opacity: '1'
                }
            }
        },
        isPreview: {
            true: {},
            false: {}
        },
        type: {
            card: {
                padding: '0 0 $4 0',
                width: '100%',
                '@bp1': {
                    flexDirection: 'row',
                    width: '100%',
                },
                '@bp2': {
                    flexDirection: 'row',
                    marginRight: '$2',
                },
                '@bp3': {
                    flexDirection: 'row',
                    marginRight: 'calc($4 + $1)',
                },
            },
            list: {
                width: '80px',
                '@bp1': {
                    padding: '0 0 $4 0',
                    flexDirection: 'row',
                    width: '100%',
                },
                '@bp2': {
                    flexDirection: 'column',
                    marginRight: '$2',
                },
                '@bp3': {
                    flexDirection: 'column',
                    marginRight: 'calc($4 + $1)',
                },
            }
        }
    },
    defaultVariants: {
        isVisible: false,
        isPreview: true,
        type: 'list'
    }
})

const StyledHeader = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '$1',
    height: '100%',
    maxHeight: '640px',
    borderRadius: '$round',
    padding: '0',
    '@bp1': {
        margin: 0,
        marginLeft: '$2'
    },
    color: '$foregroundBronze',
    transition: '$background',
    cursor: 'pointer',
    'h5': {
        transition: '$color',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        fontWeight: '400',
        width: '100%',
    },
    variants: {
        isHighlighted: {
            true: {
                '&:hover': {
                    backgroundColor: '$foregroundTintBronze',
                    color: '$foregroundTextBronze',
                },
            },
            false: {
                '&:hover': {
                    backgroundColor: '$highlight',
                    color: '$foregroundText'
                },
                '@bp1': {
                    '&:hover': {
                        backgroundColor: '$foregroundTintBronze',
                        color: '$foregroundTextBronze',
                    },
                }
            }
        },
        type: {
            card: {
                margin: '0 0 $1 $2',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                'h5': {
                    '@bp1': {
                        margin: 0,
                    },
                    '@bp2': {
                        margin: 0
                    },
                    '@bp3': {
                        margin: 0,
                    },
                }
            },
            list: {
                margin: '$2 $2 $2 0',
                width: '32px',
                '@bp1': {
                    textAlign: 'center',
                    width: '100%',
                    height: '100%',
                    margin: '0 0 $1 $2',
                },
                'h5': {
                    '@bp1': {
                        margin: 0,
                    },
                    '@bp2': {
                        transform: 'rotate(180deg) translateX(-10%)',
                        writingMode: 'vertical-rl',
                    },
                    '@bp3': {
                        transform: 'rotate(180deg) translateX(-10%)',
                        writingMode: 'vertical-rl',
                    },
                }
            }
        }
    },
    defaultVariants: {
        isHighlighted: false,
        type: 'list'
    }
})

const ControlsPreview = (
    { entry, view = 'list', isHover, isFocused, isReadingList, setReadLater, setPinnedItem, setIgnoredList, Open }
        : ControlsInternal) => {
    return (
        <StyledControls type={view} isPreview={true} isVisible={(isHover || isFocused) ? true : false}>
            <ButtonControl
                direction={view === 'list' ? 'right' : 'bottom'}
                isHighlighted={(isHover || isFocused || (typeof window !== "undefined" && window?.innerWidth < 720)) ? true : false}
                label='open'
                onClick={() => {
                    entry.publication?.ensLabel
                        ? Open(`/${entry.publication?.ensLabel ? entry.publication?.ensLabel : entry.author.address}/${entry.digest}`)
                        : Open(`/${entry.author.address}/${entry.digest}`)
                }}>
                <OpenIcon />
            </ButtonControl>
            <AddToSpace
                isHighlighted={(isHover || isFocused || (typeof window !== "undefined" && window?.innerWidth < 720)) ? true : false}
                direction={view === 'list' ? 'right' : 'bottom'}
                setReadLater={setReadLater}
                item={entry}
            />
            <br style={{ userSelect: 'none' }} />

            {/* {setPinnedItem && (
                <ButtonControl
                    direction={view === 'list' ? 'right' : 'bottom'}
                    label='pin on top'
                    isHighlighted={(isHover || isFocused) ? true : false}
                    onClick={() =>
                        setPinnedItem((prevState: PinnedItem[]) => [...prevState, { id: prevState.length > 0 ? prevState[prevState.length - 1].id + 1 : 0, type: 'entry', item: entry }])
                    }>
                    <PinIcon />
                </ButtonControl>)} */}


            {/* {setIgnoredList && (
                <ButtonControl
                    direction={view==='list' ? 'right' :'bottom'}
                    label='ignore this publication'
                    isHighlighted={(isHover || isFocused) ? true : false}
                    onClick={()=>
                    setIgnoredList((prevState:IgnoredPublication[])=>[...prevState, {ensLabel:entry.publication?.ensLabel ?  entry.publication?.ensLabel : entry.author.address}])
                    }>
                        <RemoveIcon/>
                </ButtonControl>)} */}
            {entry.publication?.ensLabel
                ? <StyledHeader
                    type={view}
                    onClick={() => Open(`/${entry.publication.ensLabel}`)}
                    isHighlighted={(isHover || isFocused || (typeof window !== "undefined" && window?.innerWidth < 720)) ? true : false}>
                    <h5>{entry.publication.ensLabel}</h5>
                </StyledHeader>
                : <StyledHeader
                    type={view}
                    onClick={() => Open(`/${entry.author.address}?type=personal`)}
                    isHighlighted={(isHover || isFocused || (typeof window !== "undefined" && window?.innerWidth < 720)) ? true : false}>
                    <h5>
                        {entry.author.displayName ? entry.author.displayName : <>{AddressPrettyPrint(entry.author.address, 6)}</>}
                    </h5>
                </StyledHeader>
            }
        </StyledControls>
    )
}
export default ControlsPreview
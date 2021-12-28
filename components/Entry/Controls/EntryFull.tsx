import { styled } from 'stitches.config'

//components
import ButtonControl from '@/design-system/primitives/ButtonControl'
import SuccessMarkIcon from '@/design-system/icons/Success'
import AddIcon from '@/design-system/icons/Add'
import BackIcon from '@/design-system/icons/Back'
import AddToSpace from '@/design-system/Entry/AddToSpace'

//types
import type { PinnedItem, ReadingListItem } from 'contexts'
import type { EntryType } from '@/design-system/Entry'


export interface ControlsInternal {
    entry: EntryType,
    isReadingList: boolean;
    setReadLater: (fn: (prevState: ReadingListItem[]) => ReadingListItem[]) => void;
    setPinnedItem: (fn: (prevState: PinnedItem[]) => PinnedItem[]) => void;
    Close: () => void;
}

const StyledControls = styled('div', {
    display: 'flex',
    gap: '$1',
    padding: '0 $2 $1 $2',
    //it's getting squezed in some cases currently, figure out why and remove the hardcoded value
    width: '80px',
    boxSizing: 'border-box',
    // overflow:'hidden',
    flexDirection: 'column',
    marginRight: 'calc($4 + $1)',
    transition: '$all',
    '@bp1': {
        flexDirection: 'row',
        marginBottom: '$4',
        padding: '0 0'
    },
    '@bp2': {
        flexDirection: 'row',
        marginRight: '$2',
    },
    '@bp3': {
        //  width:'100%',
        flexDirection: 'column',
        marginRight: 'calc($4 + $1)',
    },
    variants: {
        isVisible: {
            true: {
                opacity: '1'
            },
            false: {
                opacity: '0'
            }
        },
    },
    defaultVariants: {
        isVisible: false,
    }
})


const ControlsEntryFull = (
    { entry, isReadingList, setReadLater, Close }
        : ControlsInternal) => {
    return (
        <StyledControls isVisible={true}>
            <ButtonControl
                isHighlighted={true}
                label='back'
                onClick={Close}>
                <BackIcon />
            </ButtonControl>
            <AddToSpace
                isHighlighted={true}
                direction={'right'}
                setReadLater={setReadLater}
                item={entry}
            />

        </StyledControls>
    )
}
export default ControlsEntryFull;
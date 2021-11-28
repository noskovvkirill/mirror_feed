import {styled} from 'stitches.config'

//components
import ButtonControl from '@/design-system/primitives/ButtonControl'
import SuccessMarkIcon from '@/design-system/icons/Success'
import AddIcon from '@/design-system/icons/Add'
import BackIcon from '@/design-system/icons/Back'

//types
import type {PinnedItem, ReadingListItem} from 'contexts'
import type {EntryType} from '@/design-system/Entry'


export interface ControlsInternal  {
    entry:EntryType,
    isReadingList:boolean;
    setReadLater:(fn:(prevState:ReadingListItem[]) => ReadingListItem[]) => void;
    setPinnedItem:(fn:(prevState:PinnedItem[]) => PinnedItem[]) => void;
    Close:() => void;
}

const StyledControls = styled('div',{
    display:'flex',
    gap:'$1',
    padding:'0 $2 $1 $2',
    //it's getting squezed in some cases currently, figure out why and remove the hardcoded value
    width:'80px',
    boxSizing:'border-box',
    // overflow:'hidden',
    flexDirection:'column',
    marginRight:'calc($4 + $1)',
    transition:'$all',
    '@bp1':{
        flexDirection:'row',
    },
    '@bp2':{
        flexDirection:'row',
        marginRight:'$2',
    },
     '@bp3':{
        //  width:'100%',
        flexDirection:'column',
         marginRight:'calc($4 + $1)',
    },
    variants:{
        isVisible:{
            true:{
                opacity:'1'
            },
            false:{
                opacity:'0'
            }
        },
    },
    defaultVariants:{
        isVisible:false,
    }
})


const ControlsEntryFull = (
    {entry, isReadingList, setReadLater, Close}
    :ControlsInternal) =>{
    return(
        <StyledControls  isVisible={true}>
                <ButtonControl
                        isHighlighted={true}
                        label='back'
                        onClick={Close}>
                            <BackIcon/>
                    </ButtonControl>

                            {!isReadingList
                ? <ButtonControl
                        selected={false}
                        key={'reading control'}
                        label='to reading list'
                        isHighlighted={true}
                        onClick={()=>{
                            setReadLater((prevState:ReadingListItem[])=>{
                                //check for dublicates just in case 
                                if(prevState.findIndex((item:ReadingListItem)=>item.entryDigest === entry.digest) !== -1) return prevState
                            return [...prevState, {entryDigest:entry.digest, title:entry.title, ensLabel: entry.publication?.ensLabel ? entry.publication.ensLabel : entry.author.address}]})
                        }}>
                        <AddIcon/>
                    </ButtonControl>
                :<ButtonControl
                        selected={true}
                        label='remove from the reading list'
                        isHighlighted={true}
                        onClick={()=>{
                        setReadLater((prevState:ReadingListItem[])=>{
                        const indexUnPin = prevState.findIndex((item:ReadingListItem)=>item.entryDigest=== entry.digest)
                        const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                        return newArray
                    })}}>
                    <SuccessMarkIcon/>
                </ButtonControl>
            }
            </StyledControls>
    )
}
export default ControlsEntryFull;
import Box from '@/design-system/primitives/Box'
import ButtonControl from '@/design-system/primitives/ButtonControl'
import SyncIcon from '@/design-system/icons/Sync'
import OpenIcon from '@/design-system/icons/Open'
import RemoveIcon from '@/design-system/icons/Remove'

import type {CuratedSpace} from 'contexts'

interface IStackControls{
    Sync?:(index:number)=>void;
    index:number;
    setCurated:(fn:(prevState:CuratedSpace | undefined)=>CuratedSpace)=>void
}

const StackControls = ({Sync, setCurated, index}:IStackControls) => {
    return(
    <Box layout='flexBoxColumn' css={{ 
         padding:'0 $2 $1 $2',
    //it's getting squezed in some cases currently, figure out why and remove the hardcoded value
    width:'80px',
    boxSizing:'border-box',
    // overflow:'hidden',
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
        flexDirection:'column',
         marginRight:'calc($4 + $1)',
    },
      }}>
        {Sync && (
            <ButtonControl 
            onClick={(e)=>{
                e.stopPropagation()
                Sync(index)}}
            isHighlighted={true}
            label='sync onchain'>
                <SyncIcon/>
        </ButtonControl>
        )}
        
        <br/>
        <ButtonControl
        // onClick={Sync}
        isHighlighted={true}
        label='open'>
            <OpenIcon/>
        </ButtonControl>
       
        <ButtonControl 
        onClick={(e)=>{
            e.stopPropagation()
            setCurated((prevState:CuratedSpace | undefined)=>{
                    if(prevState === undefined) return;
                    const newSpace:CuratedSpace | any = Object.assign({}, prevState)
                    delete newSpace.items;
                    const itemsNew =  [...prevState.items.slice(0, index), ...prevState.items.slice(index + 1)];
                    newSpace.items = itemsNew;
                    return newSpace
            })
        }}
        isHighlighted={true}
        label='remove from the stack'>
            <RemoveIcon/>
        </ButtonControl>
    </Box>
    )
}

export default StackControls
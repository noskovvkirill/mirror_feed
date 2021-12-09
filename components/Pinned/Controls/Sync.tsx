//components
import ButtonControl from '@/design-system/primitives/ButtonControl'
import OpenIcon from '@/design-system/icons/Open'
import RemoveIcon from '@/design-system/icons/Remove'
//global state 
//hooks
import {useRouter} from 'next/router'
//types
import type {PinnedItem} from 'contexts'

interface IControlsSync {
    item:PinnedItem;
    Remove:(item:PinnedItem)=>void;
}

const ControlsSync = ({item, Remove}:IControlsSync) => {
    const router = useRouter()
    return(
        <>
            <ButtonControl isHighlighted={false}
            label='open'
            direction='top'
            onClick={()=>{
                    item.item.publication?.ensLabel 
                    ?  router.push(`/${item.item.publication?.ensLabel ? item.item.publication?.ensLabel : item.item.author.address}/${item.item.digest}`)
                    :  router.push(`/${item.item.author.address}/${item.item.digest}`)
            }}>
                <OpenIcon />
            </ButtonControl>
             <ButtonControl 
            label='remove the queue'
            direction='top'
            onClick={()=>{
                Remove(item)
            }}
            isHighlighted={false}
            // label='remove from the stack'
            >
                <RemoveIcon/>
            </ButtonControl>
        </>
    )
}

export default ControlsSync
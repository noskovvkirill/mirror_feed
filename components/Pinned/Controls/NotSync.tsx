//components
import AddIcon from '@/design-system/icons/Add'
import OpenIcon from '@/design-system/icons/Open'
import SuccessMarkIcon from '@/design-system/icons/Success'
import UnPinIcon from '@/design-system/icons/UnPin'
import ButtonControl from '@/design-system/primitives/ButtonControl'
//global state
import { pinnedItems, readLaterList,  ReadingListItem} from 'contexts'
import { useSetRecoilState} from 'recoil'
import {useRouter} from 'next/router'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'
//types
import type {PinnedItem} from 'contexts'

interface IControlsNotSync {
    item?:PinnedItem; //inherits from the parent 
    children:React.ReactNode | React.ReactNode[];
    isHighlighted?:boolean;
}

const ControlsNotSync = ({item, children, isHighlighted=false}:IControlsNotSync) => {

    const setPinnedItem = useSetRecoilState(pinnedItems)
    const setReadLater = useSetRecoilState(readLaterList)
    const readingList = useRecoilValueAfterMount(readLaterList, [])
    const router = useRouter();
    
    if(!item) {
        return <>Component has to inherit item prop from the Root</>
    }
    return(
        <>
            <ButtonControl
            label='open'
            direction='top'
            isHighlighted={isHighlighted}
            onClick={()=>{
                    item.item.publication?.ensLabel 
                    ?  router.push(`/${item.item.publication?.ensLabel ? item.item.publication?.ensLabel : item.item.author.address}/${item.item.digest}`)
                    :  router.push(`/${item.item.author.address}/${item.item.digest}`)
            }}><OpenIcon/></ButtonControl>
            {readingList.findIndex((itemL:ReadingListItem)=>itemL.entryDigest === item.item.digest) === -1 
            ? <ButtonControl
            label='to reading list'
            direction='top'
            isHighlighted={isHighlighted}
            onClick={()=>{setReadLater((prevState:ReadingListItem[])=>[...prevState, {entryDigest:item.item.digest, title:item.item.title, ensLabel: item.item.publication?.ensLabel ? item.item.publication.ensLabel : item.item.author.address }])}}><AddIcon/></ButtonControl>
            : <ButtonControl
                label='remove from the reading list'
            direction='top'
            selected={true}
            isHighlighted={isHighlighted}
            onClick={()=>{
                setReadLater((prevState:ReadingListItem[])=>{
                    const indexUnPin = prevState.findIndex((itemL:ReadingListItem)=>itemL.entryDigest=== item.item.digest)
                    const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                    return newArray
                })
            }}>
                <SuccessMarkIcon/>
            </ButtonControl>
            }
            <ButtonControl
                label='unpin'
                direction='top'
                selected={true}
                isHighlighted={isHighlighted}
                onClick={()=>
                setPinnedItem((prevState:PinnedItem[])=>{
                    const indexUnPin = prevState.findIndex((itemP:PinnedItem)=>{
                        if(itemP.type === 'entry'){
                        if(item.item.digest === itemP.item.digest) return true
                        } else return false 
                })
                    const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                    return newArray
                })
                }><UnPinIcon/>
            </ButtonControl>
            {children}
        </>
    )
}
export default ControlsNotSync
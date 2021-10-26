//components
import Box from '@/design-system/primitives/Box'
import ContainerNotSynced from '@/design-system/Curation/ContainerNotSynced'
import ContainerSynced from '@/design-system/Curation/ContainerSynced'

import StackControls from '@/design-system/Curation/StackControls'
import Placeholder from '@/design-system/Curation/Placeholder'
import Settings from '@/design-system/Curation/Settings'
//hooks
import { useDroppable} from '@dnd-kit/core'
import {useState, useEffect, useRef} from 'react'
import useOnScreen from 'hooks/useOnScreen'
//types
import type {CuratedSpace, CuratedSpaceItem} from 'contexts'
import { AnimatePresence } from 'framer-motion'



const Droppable = ({id, children}:{id:string, children:React.ReactElement[] | React.ReactElement}) => {
    const {isOver, setNodeRef} = useDroppable({id: id});
       return(
         <div ref={setNodeRef} style={{
             padding:'', borderRadius:'8px', minHeight:'60vh', background:isOver ? 'rgba(144,144,144,0.25)' : 'inherit'}}>
            {children}
         </div> 
     )
}

interface ICuration {
    curated:CuratedSpace;
    setCurated:(fn:(prevState:CuratedSpace)=>CuratedSpace)=>void;
    Flip:(digest:number) => void;
    Sync:(digest:number)=>void;
    Open:(digest:string)=>void;
}

const Curation = ({curated, setCurated, Sync, Open, Flip}:ICuration) => {

    const [gapCards, setGapCards] = useState(80)
    const threshold= useRef(null)
    const el = useOnScreen(threshold, {threshold:1})
    const isFocused = !!el?.isIntersecting


    //used to programatically reduce the gap between cards on scroll

    //TODO add extra check that scroll is not in 0-100 position
    useEffect(()=>{
        if(isFocused){
            setGapCards(32)
        } else {
            setGapCards(80)
        }
    },[isFocused])

    const SyncByDigest = (index:number) => {
        const itemToSync = curated.items.filter(item=>!item.isSync)[index]
        if(itemToSync){
            if(itemToSync.type === 'entry'){
                const digest = itemToSync.item.id
                Sync(parseInt(digest))
            }
        }
        console.log('syncing', index, curated.items.filter(item=>!item.isSync)[index])
    }

    return(
            <Droppable id={'curated'}>
                <Box layout='flexBoxRow'>
                    {!curated || curated.items.length<=0 && (
                        <Placeholder/>
                    )}
                    {curated && (
                        <>
                            <Box layout='flexBoxColumn' css={{width:'100%'}}>
                                <Box layout='flexBoxColumn' 
                                css={{width:'1250px', height:`${(curated.items.filter(item=>!item.isSync).length-1)*80+512}px`, minHeight:'512px', overflow:'hidden', position:'relative'}}>
                                    <AnimatePresence>
                                    {curated.items.filter(item=>!item.isSync).map((item:CuratedSpaceItem, index:number, arr)=>{
                                            return(
                                            <ContainerNotSynced 
                                            gap={gapCards}
                                            item={item}
                                            Open={Open}
                                            Flip={Flip}
                                            key={'my_space_item_notsynced'+item.id}
                                            index={index} length={arr.length}>
                                                <StackControls index={index} Sync={SyncByDigest} setCurated={setCurated} />
                                            </ContainerNotSynced>
                                    )})}
                                    </AnimatePresence>
                                </Box>
                                
                                <Box layout='flexBoxRow' ref={threshold} css={{color:'$foreground', padding:'0 $2 0 $4', alignItems:'center', gap:'$2', justifyContent:'center', height:'1px', margin:'calc($4 * 2) 0'}}>
                                    <span style={{whiteSpace:'nowrap'}}>{curated.items.filter(item=>item.isSync).length} CURATED</span><Box as='hr'ref={threshold} css={{ width:'100%', background:'$highlight', height:'1px'}} />
                                </Box>

                                
                                <Box layout='flexBoxColumn' css={{width:'512px'}}>
                                    {curated.items.filter(item=>item.isSync).map((item:CuratedSpaceItem, index:number)=>{
                                            return(
                                            <ContainerSynced 
                                            item={item}
                                            Open={Open}
                                            key={'my_space_item_synced'+item.id}
                                        >
                                                <StackControls index={index}  setCurated={setCurated} />
                                            </ContainerSynced>
                                    )})}
                                
                                </Box>
                            </Box>
                            <Settings title={curated.title}/>
                        </>
                        )}
                    </Box>
            </Droppable>
    )
}

export default Curation
//components
import Box from '@/design-system/primitives/Box'
import ContainerNotSynced from '@/design-system/Curation/ContainerNotSynced'
import ContainerSynced from '@/design-system/Curation/ContainerSynced'

import StackControls from '@/design-system/Curation/StackControls'
import Placeholder from '@/design-system/Curation/Placeholder'
import Settings from '@/design-system/Curation/Settings'
//hooks
import { useDroppable} from '@dnd-kit/core'
import {useState, useEffect, useRef, useMemo, useCallback} from 'react'
import useOnScreen from 'hooks/useOnScreen'
//types
import type {CuratedSpace, CuratedSpaceNotSync, CuratedSpaceItem} from 'contexts'
import { AnimatePresence } from 'framer-motion'
import useScrollPosition from '@react-hook/window-scroll'
import type {UserType} from 'contexts/user'
import type {SpaceType} from 'contexts/spaces'
//Space


const Droppable = ({id, children}:{id:string, children:React.ReactElement[] | React.ReactElement}) => {
    const {isOver, setNodeRef} = useDroppable({id: id});
       return(
         <div ref={setNodeRef} style={{
             padding:'', borderRadius:'8px', minHeight:'60vh', 
            backgroundImage: isOver ? "radial-gradient(black 1px, transparent 0)" : 'inherit',
            backgroundSize: "12px 12px",
            backgroundPosition: "-19px -19px",
             }}>
            {children}
         </div> 
     )
}

interface ICuration {
    curated:CuratedSpace;
    notSync:CuratedSpaceNotSync;
    setCurated:(fn:(prevState:CuratedSpace | undefined)=>CuratedSpace)=>void;
    Flip:(digest:number) => void;
    Sync:(digest:number)=>void;
    Open:(digest:string)=>void;
    user:UserType;
    space:SpaceType;
}

const CalculateHeight = (length:number, gap:number, height:number) => {
    let gaps  = 0; 
    for(let i =0; i<=length; i++) {
            gaps+=(1-((length-1)*0.025)+i*0.025)*gap
    }
    return gaps+height
}

const Curation = ({curated, notSync, setCurated, Sync, Open, Flip, user, space}:ICuration) => {
    const intitialGap = 80
    const [gapCards, setGapCards] = useState(intitialGap)
    const threshold= useRef(null)
    const el = useOnScreen(threshold, {threshold:1})
    const isFocused = !!el?.isIntersecting
    const scrollY = useScrollPosition(15) //framerate scroll check
    const [isThreshold, setIsThreshold] = useState(false)



    useEffect(()=>{
        if(scrollY>120){
            setIsThreshold(true)
        } else {
            setIsThreshold(false)
        }
    },[scrollY])



    useEffect(()=>{
        if(isFocused && isThreshold){
            setGapCards(32)
        } else {
            setGapCards(80)
        }
    },[isFocused, isThreshold])


    return(
            <Droppable id={'curated'}>
                <Box layout='flexBoxRow'>
                     {(!notSync || notSync.items.length<=0 ) && (!curated || curated.items.length<=0) && (
                        <Placeholder/>
                    )}
                            <Box layout='flexBoxColumn' css={{width:'100%'}}>
                                 {notSync?.items.length>0 && (
                                    <Box layout='flexBoxColumn' 
                                    css={{width:'1250px', height:`${ notSync.items.length > 0 ? CalculateHeight((notSync.items.length-1),intitialGap,512) : 0}px`, overflow:'hidden', position:'relative'}}>
                                        <AnimatePresence>
                                            {notSync.items.map((item:CuratedSpaceItem, index:number, arr:CuratedSpaceItem[])=>{
                                                    return(
                                                    <ContainerNotSynced 
                                                    gap={gapCards}
                                                    item={item}
                                                    Open={Open}
                                                    Flip={Flip}
                                                    key={'my_space_item_notsynced'+item.id}
                                                    index={index} length={arr.length}>
                                                        <StackControls index={index} Sync={Sync} setCurated={setCurated} />
                                                    </ContainerNotSynced>
                                            )})}
                                        </AnimatePresence>
                                    </Box>
                                )}
                                {curated?.items.length>9 && (
                                    <>
                                        <Box layout='flexBoxRow' ref={threshold} css={{color:'$foreground', padding:'0 $2 0 $4', alignItems:'center', gap:'$2', justifyContent:'center', height:'1px', margin:'calc($4 * 2)', marginTop:notSync.items.length > 0 ? 'calc($4 * 2)' : 0, marginLeft:'0'}}>
                                            <span style={{whiteSpace:'nowrap'}}>{curated.items.length} CURATED</span><Box as='hr'ref={threshold} css={{ width:'100%', background:'$highlight', height:'1px'}} />
                                        </Box>

                                        
                                        <Box layout='flexBoxColumn' css={{width:'100%', gap:'calc($4 * 2)'}}>
                                            {curated.items.map((item:CuratedSpaceItem, index:number)=>{
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
                                    </>
                                )}
                            </Box>
                            <Settings 
                            space={space}
                            user={user}
                           />
                      
                    </Box>
            </Droppable>
    )
}

export default Curation
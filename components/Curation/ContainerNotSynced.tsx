import {styled} from 'stitches.config'
import React from 'react'
import { useRef, forwardRef, useEffect, useState, useMemo } from 'react'
import { processorShort, truncateText } from '@/design-system/Article'
import { CuratedSpaceItem } from 'contexts'
import BodyEntry from '@/design-system/Curation/Body'
import type {Entry} from '@/design-system/Article'
import {m} from 'framer-motion'

const StyledContainer = styled('div', {
    display:'flex',
    flexDirection:'row',
    position:'absolute',
    alignItems:'flex-start',
    justifyContent:'flex-start',
    width:'100%', 
    padding:'$4 $2',
    // margin:'calc($4 * 1) 0',
    maxWidth:'1152px', 
    boxSizing:'border-box',
    height:'512px',
    overflow:'hidden',
    color:'$text',
    cursor:'pointer',
    left:'0',
    top:'0',
    background:'$highlightBronze',
    border:'1px solid $highlightBronze',
    borderRadius:'$2',
    transformOrigin:'center center',
})

const StyledContainerComponent = forwardRef(function Component (props:any, ref:any) { return(
    <StyledContainer {...props} ref={ref} />)
});


const StyledContainerMotion = m(StyledContainerComponent)

interface IContainer {
    index:number;
    length:number;
    children:React.ReactNode | React.ReactNode[];
    item:CuratedSpaceItem;
    Open:(digest:string)=>void;
    Flip:(digest:number)=>void;
    gap:number;
}

interface IEntry {
    item:Entry;
    Open:(digest:string)=>void;
}


const RenderEntry = ({Open, item}:IEntry) => {
    const bodyTextShort =  processorShort.processSync(truncateText(item.body.slice(0,250))).result
    // const bodyTextShort =  useMemo(() => processorShort.processSync(truncateText(item.body)).result, [item.body])
    return(
            <BodyEntry
            Open={Open}
            body={bodyTextShort}
            isFocused={true}
            isPreview={true}
            entry={item}
            setReadLater={()=>{return}}
            readingList={[]}
            isHover={true}
        />
    )
}
const Container = ({index, gap, length, children, item, Open, Flip}:IContainer) => {
    return(
        <StyledContainerMotion 
        onClick={(e:React.SyntheticEvent)=>{
            e.stopPropagation();
            Flip(item.id)
        }}
        initial={{opacity:1, 
        transform:`translateY(${index*gap}px) scale(${1-((length-1)*0.025)+index*0.025})`,
        transition:{delay:(length-1)*0.125-index*0.125}
        }}
        animate={{opacity:1, 
        transform:`translateY(${index*gap}px) scale(${1-((length-1)*0.025)+index*0.025})`,
        transition:{delay:(length-1)*0.125-index*0.125}
        }}
        // exit={{opacity:1, transform: "translateY(1000px) scale(1)", transition:{duration:0.35}}}
        exit={{opacity:1, transform: "translateX(-1000px) rotate(-175deg)", transition:{duration:0.35}}}
        css={{
            zIndex:`${index}`,
            transition:'$all',
            filter:`brightness(${100-((length-1)*10)+index*10}%)`,
            // transform:lastPos.current,
            '&:hover':{
                border:'1px solid $foregroundBronze',
                filter:`brightness(105%)`,
            },
            }}
            
            >
            {children}
             {item && item.type === 'entry' && (
                <RenderEntry
                    Open={Open}
                    item={item.item}
                />
            )}
        </StyledContainerMotion>
    )
}

export default React.memo(Container)
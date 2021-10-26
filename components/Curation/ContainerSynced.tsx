import {styled} from 'stitches.config'
import React from 'react'
import { useMemo, forwardRef } from 'react'
import { processorShort, truncateText } from '@/design-system/Article'
import { CuratedSpaceItem } from 'contexts'
import BodyEntry from '@/design-system/Curation/Body'
import type {Entry} from '@/design-system/Article'

const StyledContainer = styled('div', {
    display:'flex',
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'flex-start',
    maxWidth:'1152px', 
    boxSizing:'border-box',
    height:'fit-content',
    overflow:'hidden',
    color:'$text',
    cursor:'pointer',
    left:'0',
    top:'0',
    background:'$highlightBronze',
    border:'1px solid $highlightBronze',
    padding:'$4',
    borderRadius:'$2',
    transformOrigin:'center center',
})


interface IContainer {
    children:React.ReactNode | React.ReactNode[];
    item:CuratedSpaceItem;
    Open:(digest:string)=>void;
}

interface IEntry {
    item:Entry;
    Open:(digest:string)=>void;
}


const RenderEntry = ({Open, item}:IEntry) => {
    const bodyTextShort =  useMemo(() => processorShort.processSync(truncateText(item.body)).result, [item.body])
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
const Container = ({children, item, Open}:IContainer) => {
    return(
        <StyledContainer 
        css={{transition:'$all'}}>
            {children}
             {item && item.type === 'entry' && (
                <RenderEntry
                    Open={Open}
                    item={item.item}
                />
            )}
        </StyledContainer>
    )
}

export default Container
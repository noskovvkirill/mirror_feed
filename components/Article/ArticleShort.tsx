//state
import React, {useMemo} from 'react'
import { useSetRecoilState} from 'recoil'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'
import {useRouter} from 'next/router'
import useOnScreen from 'hooks/useOnScreen'
import {useRef, useState} from 'react'
// text processor
import processorFull from '@/design-system/text/Processors/Short'
import {shorten} from '@/design-system/text/Processors/Short'
//state
import {ignoredPublication, pinnedItems, readLaterList } from 'contexts'
//types
import type {ReadingListItem} from 'contexts'
import type {EntryType} from '@/design-system/Entry'
//components
import * as Entry from '@/design-system/Entry'
import Metadata from '@/design-system/Article/Metadata'

type ArticleNewType = {
    entry: EntryType
    isPreview?: boolean,
    view?:'list' | 'card' 
}


const ArticleNew = ({entry, isPreview=true, view='list'}:ArticleNewType) => {
    const router = useRouter()
    const ref = useRef<HTMLDivElement | null>(null)
    const el = useOnScreen(ref, {threshold:1})
    const isFocused = !!el?.isIntersecting
    const setIgnoredList = useSetRecoilState(ignoredPublication)
    const setPinnedItem = useSetRecoilState(pinnedItems)
    const setReadLater = useSetRecoilState(readLaterList)
    const readingList = useRecoilValueAfterMount(readLaterList, [])
    const [isHover, setIsHover] = useState(false)
    const bodyText =  useMemo(() =>  processorFull.processSync(shorten(entry.body, 750)).result, [entry.body])

    return(
        <Entry.Root
            view={view}
            ref={ref}
            entry={entry}
            isPreview={isPreview}
            isHover={isHover}
            isFocused={isFocused}
            isReadingList={readingList.findIndex((item:ReadingListItem)=>item.entryDigest === entry.digest) === -1 ? false : true }
            setIsHover={(isHover:boolean)=>{
                setIsHover(isHover)
        }}
        >
            {isPreview 
            ?
            <Entry.ControlsPreview
                view={view}
                isFocused={isFocused}
                isHover={isHover}
                isReadingList={readingList.findIndex((item:ReadingListItem)=>item.entryDigest === entry.digest) === -1 ? false : true }
                entry={entry}
                Open={(digest:string)=>{
                    router.push(digest)
                }}
                setIgnoredList={setIgnoredList}
                setPinnedItem={setPinnedItem}
                setReadLater={setReadLater}
                setIsHover={setIsHover}/>
            : <Entry.ControlsEntryFull 
                entry={entry}
                isReadingList={readingList.findIndex((item:ReadingListItem)=>item.entryDigest === entry.digest) === -1 ? false : true }
                Close={()=>{
                  router.back()
                }}
                setPinnedItem={setPinnedItem}
                setReadLater={setReadLater}/>
            }
            <Entry.Body
               view={view}
                metadata={
                    <Metadata 
                    isPreview={isPreview}
                    isHover={isHover}
                    isFocused={isFocused}
                    entry={entry}
                    />
                }
                readingList={readingList}
                setReadLater={setReadLater}
                isPreview={isPreview}
                entry={entry}
                Open={(digest:string)=>{
                    router.push(digest, undefined, {scroll:true})
                }}
                isHover={isHover}
                isFocused={isFocused}
            >
               {bodyText && bodyText}
            </Entry.Body>
        </Entry.Root>
    )
}

export default ArticleNew
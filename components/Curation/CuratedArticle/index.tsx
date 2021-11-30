//state
import React, {useMemo, useCallback} from 'react'
import { useSetRecoilState} from 'recoil'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'
import {useRouter} from 'next/router'
import useOnScreen from 'hooks/useOnScreen'
import {useRef, useState} from 'react'
// text processor
import processorFull from '@/design-system/text/Processors/Short'
import { shorten } from '@/design-system/text/Processors/Short'
//state
import {ignoredPublication, pinnedItems, readLaterList, stakeSelectedItem } from 'contexts'
//types
import type {ReadingListItem} from 'contexts'
import type {EntryType} from '@/design-system/Entry'
import type {SpaceTypeProfile} from 'contexts/spaces'
import type {SpaceType} from 'contexts/spaces'

//components
import * as Entry from '@/design-system/Entry'
import Metadata from '@/design-system/Curation/CuratedArticle/Metadata'



type ArticleNewType = {
    entry: EntryType
    view?:'list' | 'card' 
    isPreview?: boolean
    stacked:number,
    space?:SpaceType,
    spaces?:SpaceTypeProfile[]
    isPinned?:boolean,
    totalSpaces?:number
}


const CuratedArticle = ({
    entry, 
    space,
    view='list',
    isPinned=false,
    isPreview=true, stacked, spaces, totalSpaces}:ArticleNewType) => {
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
    const setStakeSelectedItem = useSetRecoilState(stakeSelectedItem);

    const SetStakeSelected = useCallback((entry:EntryType) => {
        if(space){
            setStakeSelectedItem({
                isOpen:true,
                item:{entry:entry, staked:stacked},    
                space:space,
                type:'stake'
            })
        } else {
            alert('current space is unavailable')
        }
    },[space, entry])

    const SetUnStakeSelected = useCallback((entry:EntryType) => {
        if(space){
            setStakeSelectedItem({
                isOpen:true,
                item:{entry:entry, staked:stacked},    
                space:space,
                type:'unstake'
            })
        } else {
            alert('current space is unavailable')
        }
    },[space, entry])

    // const [isStake, setIsStake] = useState(false)
    // const [isUnstake, setIsUnstake] = useState(false)

    // const UnstakeCallback = () => {
    //     console.log('unstaking!')
    // }
    // const ExtraStakeCallback = () => {
    //      console.log('extra unstaking!')
    // }
        

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
            <Entry.ControlsPreview
                 view={view}
                isFocused={isFocused}
                isHover={isHover}
                isReadingList={readingList.findIndex((item:ReadingListItem)=>item.entryDigest === entry.digest) === -1 ? false : true }
                entry={entry}
                Open={(digest:string)=>{
                    router.push(digest)
                }}
                // setIgnoredList={setIgnoredList}
                setPinnedItem={isPinned ? setPinnedItem : undefined} 
                setReadLater={setReadLater}
                setIsHover={setIsHover}
                />

            <Entry.Body
                 view={view}
                metadata={<Metadata
                    SetStakeSelected={SetStakeSelected}
                    SetUnStakeSelected={SetUnStakeSelected}
                    spaces={spaces}
                    totalSpaces={totalSpaces}
                    isPreview={isPreview}
                    isHover={isHover}
                    isFocused={isFocused}
                    entry={entry}
                    stacked={stacked}
                    />}
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

export default CuratedArticle
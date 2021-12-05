import React from 'react'
//components
import Box from '@/design-system/primitives/Box'
import ButtonControl from '@/design-system/primitives/ButtonControl'
import SyncIcon from '@/design-system/icons/Sync'
import UnSyncIcon from '@/design-system/icons/UnSync'

import CuratedArticle from '@/design-system/Curation/CuratedArticle'
import Dropzone from '@/design-system/Curation/Dropzone'
import Header from '@/design-system/Curation/Header'
import Loader from '@/design-system/primitives/Loader'
import OnboardingCuration from '@/design-system/Curation/Onboarding'
//hooks
import { useAuth } from 'contexts/user'
import { useState, useEffect } from 'react'

//db
import localforage from 'localforage'

//types
import type { CuratedSpaceNotSync, PinnedItem } from 'contexts'
import type { SpaceType } from 'contexts/spaces'
import type { EntryType } from '@/design-system/Entry'

export type CuratedItem = { entry: EntryType, staked: number, totalStaked?: number, lastStakeTimestamp?: string };

interface ICuration {
    notSync: CuratedSpaceNotSync;
    view?: 'list' | 'card',
    isValidating: boolean;
    error: string;
    curated: CuratedItem[] | undefined,
    RemoveItem?: (item: PinnedItem) => void;
    OpenStake?: () => void;
    OpenUnStake?: () => void;
    space: SpaceType;
    syncState: "default" | "loading" | "error"
}


const Curation = ({
    isValidating, error,
    curated, notSync, view = 'list',
    OpenStake, OpenUnStake, RemoveItem, space, syncState }: ICuration) => {

    // const { data:curated, error, isValidating} = useSWR(`space-${space.tokenId}`, FetchEntries)
    const [data, setData] = useState<Array<{ entry: EntryType, staked: number }> | null | undefined>(undefined)
    const { user } = useAuth()

    //we get local data from local forage and replace it in a background when the new data is available
    const loadData = async () => {
        const data: Array<{ entry: EntryType, staked: number }> | null = await localforage.getItem(`${user?.address}_${space.tokenId}_${user?.network}`)
        setData(data)
    }

    useEffect(() => {
        console.log('loading user space data /curation')
        loadData()
    }, [space])

    useEffect(() => {
        if (isValidating === false && !error && curated && curated?.length > 0) {
            localforage.setItem(`${user?.address}_${space.tokenId}`, curated)
            setData(curated)
        }
    }, [isValidating, space])


    return (
        <Box layout='flexBoxColumn' css={{ width: 'fit-content', padding: '0' }}>
            <OnboardingCuration />
            <Header
                isOwner={user?.address?.toLowerCase() === space?.owner.toLowerCase() ? true : false}
                space={space}>
                <ButtonControl
                    isHighlighted={false}
                    label='Stake tokens'
                    onClick={OpenStake}
                >
                    <SyncIcon />
                </ButtonControl>
                <ButtonControl
                    label='Unstake tokens'
                    isHighlighted={false}
                    onClick={OpenUnStake}
                >
                    <UnSyncIcon />
                </ButtonControl>
            </Header>


            {(user?.address?.toLowerCase() === space?.owner.toLowerCase() && RemoveItem && OpenStake) && (
                <Box css={{ marginTop: '$4' }}>
                    <Dropzone
                        syncState={syncState}
                        notSync={notSync}
                        RemoveItem={RemoveItem}
                    />
                </Box>
            )}

            {(isValidating && data !== undefined) && (
                <Box css={{ padding: 'calc($4 * 2)' }}>
                    <Loader size='default'>
                        Revalidating your entries
                    </Loader>
                </Box>
            )}

            {data && (
                <Box>
                    {/* <Box layout='flexBoxRow' css={{color:'$foreground', padding:'0 $2 0 $4', alignItems:'center', gap:'$2', justifyContent:'center', height:'1px', margin:'calc($4 * 2)', marginRight:0, marginLeft:'0'}}>
                            Curated items {data.length}
                            <Box as='hr' css={{ width:'100%', background:'$highlight', height:'1px'}} />
                            Total Staked {space?.totalStaked && ethers.utils.formatEther(space.totalStaked.toString())} FEED
                        </Box> */}


                    <Box layout='flexBoxColumn' css={{ width: '100%', padding: 'calc($4 * 2) 0', gap: 'calc($4 * 2)' }}>
                        {data.map((item: { entry: EntryType, staked: number }) => {
                            if (item) {
                                return (
                                    <CuratedArticle
                                        space={space}
                                        view={view}
                                        key={'my_space_item_synced' + item.entry.id}
                                        entry={item.entry}
                                        isPreview={true}
                                        stacked={item.staked}
                                    />
                                )
                            } else return (<></>)
                        })}
                    </Box>
                </Box>
            )}

            <Box css={{ padding: 'calc($4 * 2)' }}>
                {(data === null) && (
                    <Box>
                        Curate your first item
                    </Box>
                )}
                {(data === undefined) && (
                    <Loader size='default' />
                )}

            </Box>

        </Box>
    )
}

export default React.memo(Curation)


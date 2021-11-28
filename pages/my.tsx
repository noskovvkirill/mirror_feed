//components
import Layout from '@/design-system/Layout'
import StakeTokens from '@/design-system/StakeTokens'
import UnStakeTokens from '@/design-system/UnStakeTokens'
import ExtraStakeTokens from '@/design-system/StakeTokens/ExtraStake'
//TODO replace under one component import 
import CreateMySpaceBody from '@/design-system/CreateSpace/Body'
import CreateMySpaceContainer from '@/design-system/CreateSpace/Container'
import CreateSpaceMint from '@/design-system/CreateSpace/Mint'
import CreateSpaceDialog  from '@/design-system/CreateSpace'
//
import Curation from '@/design-system/Curation'
import Loader from "@/design-system/primitives/Loader"
import Box from '@/design-system/primitives/Box'
import Profile from '@/design-system/primitives/Profile'
import PlaceHolderEmptySpace from '@/design-system/Curation/PlaceholderEmptySpace'
//state
import {useSetRecoilState, useRecoilState, useRecoilValueLoadable, useRecoilRefresher_UNSTABLE as useRecoilRefresher} from 'recoil'
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMountFamily'
import { curatedSpaceNotSync,  curatedSpaceSynced, curatedSpaceNotSyncSelected, userSpaces} from 'contexts'
import React, { useCallback, useState} from 'react'
import {useAuth} from 'contexts/user'
//
import { AnimatePresence } from 'framer-motion'
import {m} from 'framer-motion'
//contract
import {SpaceMethodsProvider, useSpace} from 'contexts/spaces'
import {StyledContributorsSidebar} from '@/design-system/Spaces'

//types
import type {TransactionResponse} from '@ethersproject/abstract-provider'
import type {PinnedItem, CuratedSpaceNotSync} from 'contexts'
import type {SpaceType} from 'contexts/spaces'




const SpaceBody = ({isStake, setIsStake, isUnstake, setIsUnstake, UpdateBalance, user}:any) => {
    const {
        GrabTestBalance,
        UpdateFEEDContract_INTERNAL,
        CreateSpace, 
        Approve
        } = useSpace()
    const [selectedSpace, setSelectedSpace] = useRecoilState<number>(curatedSpaceNotSyncSelected)
    const curated = useRecoilValueLoadable(curatedSpaceSynced(user.address))
    const refreshCurated = useRecoilRefresher(curatedSpaceSynced(user.address))

    const spaces = useRecoilValueLoadable<SpaceType[]>(userSpaces(user.address))
    const refreshSpaces = useRecoilRefresher(userSpaces(user.address))

    const OpenUnStake = useCallback(() => {
        setIsUnstake(true)
    },[])

    const OpenStake = useCallback(() => {
        setIsStake(true)
    },[])

    const [syncState, setSyncState] = useState<"default" | "loading" | "error">("default")


    const notsync = useRecoilValueAfterMount(curatedSpaceNotSync, {items:[]}, selectedSpace)
    const setNotSync = useSetRecoilState(curatedSpaceNotSync(selectedSpace))
    //removes not sync element
    const RemoveItem = (item:PinnedItem) => {
        const itemIndex = notsync.items.findIndex((obj:PinnedItem)=>obj.item.id === item.item.id)
        if(typeof itemIndex !== "number") return;
        setNotSync((prevState:CuratedSpaceNotSync) => {
            const items = [...prevState.items]
            const arr = [...items.slice(0, itemIndex), ...items.slice(itemIndex + 1)];
            const notSyncItemsNew = {items:arr};
            return notSyncItemsNew
        })
    }

    const NewSpaceCallback = useCallback(async (tx:TransactionResponse) => {
         try{
            await tx.wait()
            refreshSpaces()
        } catch(e){
             setSyncState("error")
        }
    },[])

     const UnStakeCallback = useCallback(async (tx:TransactionResponse) => {
        setSyncState("loading")
        try{
            await tx.wait()
            setSyncState("default")
            setNotSync({items:[]})
            refreshCurated()
        } catch(e){
             setSyncState("error")
        }
    },[])

    const StakeCallback = useCallback(async (tx:TransactionResponse) => {
        setSyncState("loading")
        try{
            await tx.wait()
            setSyncState("default")
            setNotSync({items:[]})
            refreshCurated()
        } catch(e){
             setSyncState("error")
        }
    },[])

      const ExtraStakeCallback = useCallback(async (tx:TransactionResponse) => {
        setSyncState("loading")
        try{
            await tx.wait()
            setSyncState("default")
            refreshCurated()
        } catch(e){
             setSyncState("error")
        }
    },[])

    if(spaces.state === "hasValue"){
        return(
            <AnimatePresence>
                <button onClick={async ()=>{
                    const tx = await UpdateFEEDContract_INTERNAL()
                    console.log('tx', tx)
                }}>Update Gov</button>
                {spaces.contents.length>0
                ?   <m.div key='curation'>
                        <ExtraStakeTokens stakeCallback={ExtraStakeCallback}/>
                        <StakeTokens 
                        stakeCallback={StakeCallback}
                        selectedId={selectedSpace}
                        spaceId={parseInt(spaces.contents[selectedSpace].tokenId)}
                        spaceTitle={spaces.contents[selectedSpace].name}
                        isOpen={isStake} setIsOpen={setIsStake}/>
                        <UnStakeTokens
                        totalStaked={spaces.contents[selectedSpace].totalStaked}
                        items={curated.state === 'hasValue' ? curated.contents : []}
                        isOpen={isUnstake} setIsOpen={setIsUnstake}
                        unstakeCallback={UnStakeCallback}
                        spaceId={parseInt(spaces.contents[selectedSpace].tokenId)}
                        spaceTitle={spaces.contents[selectedSpace].name}
                        />
                        <Box layout='flexBoxRow' css={{justifyContent:'space-between'}}>
                            <Curation 
                                curated={curated.state === 'hasValue' ? curated.contents : undefined}
                                error={curated.state === 'hasError' ? 'something went wrong ': ''}
                                isValidating={curated.state === 'loading' ? true : false}
                                syncState={syncState}
                                space={spaces.contents[selectedSpace]}
                                OpenUnStake={OpenUnStake}
                                OpenStake={OpenStake} 
                                RemoveItem={RemoveItem}
                                notSync={notsync}
                            />
                            <StyledContributorsSidebar 
                         >  
                            {spaces.state === 'hasValue' &&(
                                <Box layout='flexBoxColumn' css={{width:'fit-content', alignItems:'center', justifyContent:'center'}}>
                                {spaces.contents.map((space:SpaceType, index:number)=>{
                                    return(
                                        <Box  
                                        tabIndex={0}
                                        onClick={()=>setSelectedSpace(index)}
                                        key={'selector'+space.tokenId}>
                                        <Profile 
                                        isSelected={selectedSpace === index}
                                        profile={{
                                            avatarURL:space.avatarURL,
                                            name:space.name,
                                        }}
                                       />
                                        </Box>
                                    )
                                })}
                                    <CreateSpaceDialog newSpaceCallback={NewSpaceCallback}/>
                               </Box> )}
                            </StyledContributorsSidebar>
                        </Box>
                    </m.div>
                :  <CreateMySpaceContainer>
                        <CreateMySpaceBody/>
                        <CreateSpaceMint 
                            newSpaceCallback={NewSpaceCallback}
                            allowance={{gov:user?.allowance?.gov,space:user?.allowance?.space}}
                            balance={user.balance || 0} 
                            UpdateBalance={UpdateBalance}
                            Approve={Approve}
                            GrabTestBalance={GrabTestBalance}
                            NewSpace={(name:string, avatarURL:string)=>{return CreateSpace(name, avatarURL)}}
                        />
                    </CreateMySpaceContainer>
                }
            </AnimatePresence>
    )} 
    return(
       <Box layout='flexBoxRow' css={{padding:'$2', width:'100%', height:'100%', boxSizing:'border-box', alignItems:'center', justifyContent:'center'}}> 
            <Loader size='default'/>
        </Box>
    )
} 


const MySpace = () => {
    const [isStake, setIsStake] = useState(false)
    const [isUnstake, setIsUnstake] = useState(false)
    const {user, UpdateBalance, isLoading } = useAuth()

    if(!user || !user.provider){
        return(
            <Layout>
                <PlaceHolderEmptySpace/>
            </Layout>
        )
    }
    return(
        <Layout>
            {(user && !isLoading) && (
               <SpaceMethodsProvider user={user}>
                    <SpaceBody 
                        user={user} 
                        UpdateBalance={UpdateBalance}
                        isUnstake={isUnstake}
                        setIsUnstake={setIsUnstake}
                        isStake={isStake}
                        setIsStake={setIsStake}     
                    />
                </SpaceMethodsProvider>
            )}
        </Layout>
    )
}

export default MySpace



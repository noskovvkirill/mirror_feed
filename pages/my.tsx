//components
// import Box from '@/design-system/primitives/Box'
import Layout from '@/design-system/Layout'
import OnAddCurated from '@/design-system/OnAddCurated'
import CreateMySpace from '@/design-system/CreateMySpace'
import Curation from '@/design-system/Curation'
import Loader from "@/design-system/primitives/Loader"
import Box from '@/design-system/primitives/Box'
//state
import {useRecoilStateLoadable} from 'recoil'
import { CuratedSpace, CuratedSpaceNotSync, curatedSpace, curatedSpaceNotSync } from 'contexts'
import React, { useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {useAuth} from 'contexts/user'

//contract
import { AnimatePresence } from 'framer-motion'
import {m} from 'framer-motion'
import {SpaceMethodsProvider, useSpace} from 'contexts/spaces'
import Placeholder from '@/design-system/Curation/Placeholder'


const SpaceBody = ({isOpen, setIsOpen, setNotSync, setIsCreate, user, notsync, curated, setCurated}:any) => {
    const {space,
        CreateSpace, 
        SyncToSpace,
        CheckMyStake,
        CheckSpace,
        UnStakeToSpace,
        StakeToSpace} = useSpace()
    const router = useRouter()
    
    const Flip = (id:number) => {
        if(notsync.state === 'hasValue'){
            setNotSync((curated:CuratedSpaceNotSync)=>{
                const arr = curated.items 
                const itemIndex = arr.findIndex((item)=>item.id === id);
                if(itemIndex === -1){
                    alert('item was not found..')
                    console.log('item was not found', itemIndex)
                    return curated;
                }
                const copyArr = [...arr];
                [copyArr[itemIndex], copyArr[copyArr.length-1]] = [copyArr[copyArr.length-1], copyArr[itemIndex]];
                return {items:copyArr}
            })
        }
    }

    useEffect(()=>{
        console.log('space!!!', space, notsync, curated)
    },[space])

    if(space){
    return(
      <AnimatePresence>
                        {space?.id !== 0 && space?.id
                        ?   
                            <m.div key='curation'>
                                <OnAddCurated isOpen={isOpen} setIsOpen={setIsOpen}/>
                                        <Curation 
                                            space={space}
                                            user={user}
                                            Flip={Flip}
                                            Open={(digest:string)=>router.push(digest)} 
                                            Sync={SyncToSpace} 
                                            notSync={notsync}
                                            curated={curated} 
                                            setCurated={setCurated}
                                        />
                             
                            </m.div>
                        : <CreateMySpace 
                            balance={user.balance || 0} 
                            NewSpace={(name:string)=>{return CreateSpace(name)}} setIsOpen={setIsCreate}/>
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
    const [notsync, setNotSync] = useRecoilStateLoadable(curatedSpaceNotSync)
    const [curated, setCurated] = useRecoilStateLoadable(curatedSpace)
    const [isOpen, setIsOpen] = useState(false)
    const [isCreate, setIsCreate] = useState(false)
    const {user} = useAuth()


    if(!user || !user.provider){
        return(
            <Layout>
                <Box layout='flexBoxRow' css={{padding:'$2', width:'100%', height:'100%', boxSizing:'border-box', alignItems:'center', justifyContent:'center'}}>
                    <Loader size='default'/>
                </Box>
            </Layout>
        )
    }

    return(
        <Layout>
            {(user && notsync.state === 'hasValue' && curated.state === 'hasValue') && (
                <SpaceMethodsProvider user={user}>
                    <SpaceBody 
                        notsync={notsync.contents}
                        curated={curated.contents}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        setNotSync={setNotSync}
                        setIsCreate={setIsCreate}
                        user={user} 
                    />
                </SpaceMethodsProvider>
            )}
        </Layout>
    )
}

export default MySpace
import {styled} from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import Nav from '@/design-system/Nav'

import Head from 'next/head'
import React, { ReactNode, useState} from 'react'
import {useRouter} from 'next/router'
import { useHotkeys } from 'react-hotkeys-hook'
import { pinnedItems, readLaterList, curationItems, portalState} from 'contexts'
import type {CurationList} from 'contexts'
import {  useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil'

import OnBoarding from '@/design-system/Onboarding'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'
import PinnedList from '@/design-system/PinnedList'
import { Current } from 'contexts'


const StyledMain = styled('main', {
    backgroundColor: '$background',
    height: 'auto',
    boxSizing: 'border-box',
    padding: '$2 $4',
    display: 'flex',
    flex: '1',
    justifyContent:'flex-start',
    flexDirection: 'column',
    gap: '$5'
})


const StyledHeader = styled('header', {
    position:'sticky',
    zIndex:'100',
    width:'fit-content',
    maxWidth:'100%',
    boxSizing:'border-box',
    overflowY:'hidden',
    background:'transparent',
    backdropFilter:'opacity(0.25)',
    top:'0',
    padding: '$2 0 0 $4',
    color: '$text',
    justifyContent: 'flex-start',
    overflowX:'hidden',
    display: 'flex',
    alignItems:'flex-start',
    flexDirection: 'row', 
    gap:'$2',
})


type Props = {
    children?: ReactNode;
}

export const history: Array<{
  label: string,
  undo: () => void,
}> = [];


// making spaces available through the global keys
const SpaceKeysMapping = ({index, Open}:{index:number, Open:()=>void}) => {
    useHotkeys(`alt+${index}`, () => {
        Open()
    },[index, Open]);
    return(<></>)
}


const Layout = ({children}:Props) =>{
    const [isPinnedList, setIsPinnedList] = useState(false)
    const setReadLater = useSetRecoilState(readLaterList)
    const pinnedList =  useRecoilValueAfterMount(pinnedItems, [])
    const setPinnedList = useSetRecoilState(pinnedItems)
    const currentArticle = useRecoilValue(Current)
    const router = useRouter()
    const curated = useRecoilValueAfterMount(curationItems, [])
    const [isPortal, setIsPortal] = useRecoilState(portalState)

    useHotkeys("*", (e) => {
        if(e.key === 'Alt'){
             setIsPortal(!isPortal)
        } 
    },{keyup:true},[])
    
    useHotkeys('cmd+z, ctrl+z', () => {
        if(history.length>0){
            history[0].undo()
        } else {
            console.log('nothing to undo...')
        }
    },[history]);

    return(
            <Box>
                <Head>
                    <title>Mirror feed</title>
                    <meta name="description" content="Mirror.xyz curation feed" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <OnBoarding/>
                <Nav/>

                {/* Main feed key */}
                <SpaceKeysMapping index={1}
                Open={()=>router.push('/')}/>
                {curated.length > 0 && (
                    <>
                    {curated.map((item:CurationList, i)=>(
                        <SpaceKeysMapping 
                        index={i+2}
                        key={'hotkey curation'+i} Open={()=>{
                            router.push(`/spaces/${item.title}`)}}/>
                    ))}
                    </>
                )}

                <StyledHeader css={{position:'sticky', height:'160px'}}>
                    <PinnedList 
                        pinnedList={pinnedList}
                        setPinnedList={setPinnedList}
                        currentArticle={currentArticle}
                        routerQuery={{
                            article:router.query.article?.toString(),
                            publication:router.query.publication?.toString()
                        }}
                        isPinnedList={isPinnedList} 
                        setIsPinnedList={setIsPinnedList}
                        setReadLater={setReadLater}
                    />
                </StyledHeader>
                <StyledMain>
                    {children}
                </StyledMain>
            </Box>
    )
}

export default Layout
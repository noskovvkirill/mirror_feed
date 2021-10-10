import type {CurationList, SubscribedPublication} from 'contexts'
import {curationItems, pinnedItems} from 'contexts'
import type {PinnedItem} from 'contexts'
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'
import { useSetRecoilState } from 'recoil'
import {GetServerSideProps} from 'next'

//data
import {getMergedPublication, getContributorsListAvatars} from 'src/publication-contents'
import useSWRInfinite from 'swr/infinite'
import useSWR from 'swr'

import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import Article from '@/design-system/Article'
import {useRef, useEffect} from 'react'
import useOnScreen from 'hooks/useOnScreen'
// import ButtonControl from '@/design-system/primitives/ButtonControl'
import ButtonPopover from '@/design-system/primitives/ButtonPopover'
import User from '@/design-system/primitives/Profile'
// import AddIcon from '@/design-system/icons/Add'
import DeleteIcon from '@/design-system/icons/Delete'
// import EditIcon from '@/design-system/icons/Edit'
import StyledButton from '@/design-system/primitives/Button'
import {useRouter} from 'next/router'
import SpaceAdd from '@/design-system/Spaces/SpaceAdd'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const {index} = ctx.query
    return {
        props: {
            index
        }
    }
}



const Space = ({list}:{list:SubscribedPublication[]}) => {
    const {data, error, setSize, isValidating} = useSWRInfinite((_, previousPageData)=>{
        if (!previousPageData) return [list] // reached the end
        return [list, previousPageData[1]]
    }, getMergedPublication)
    const pinnedList = useRecoilValueAfterMount(pinnedItems, null) //we set the items to null to prevent initial rendering with empty values and waiting for the list to loa
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useOnScreen(ref, {})
    const isVisible = !!entry?.isIntersecting

    useEffect(()=>{
      if(isVisible){
         setSize((s)=>s+=1)
      }
    },[isVisible, setSize])


    //JUST in case, sometimes it happens... I investigate 
    if(typeof list === 'number' || typeof list === 'string'){
        return(
             <Box css={{width:'100%', padding:'$4', color:'$foregroundTextBronze'}}>
                List is corrupted :-(())
                <br/>
                Please, delete item (right sidebar)
            </Box> 
        )
    }

    if(list.length === 0) {
        return(
            <Box css={{width:'100%', padding:'$4', color:'$foregroundTextBronze'}}>
                List is empty. Add the publication to the list to see the content :-)      
            </Box>
        )
    }

    if(error){
        return(
            <Box css={{width:'100%', padding:'$4', color:'$foregroundTextBronze'}}>
                Something went wrong
                {JSON.stringify(error)}
            </Box>
        )
    }
    return(
        <Box layout='flexBoxRow' css={{width:'100%', justifyContent:'space-between'}}>
            <Box layout='flexBoxColumn'>
            {(data && pinnedList !== null )&&(
                <>
                    {data.map((page)=>{
                        if(page[0]) { 
                            return page[0].map((entry)=>{
                                if(pinnedList.findIndex((item:PinnedItem)=>item.entry.digest === entry.digest) !== -1){
                                    return;
                                } else {
                                    return(<Article entry={entry} key={entry.digest}/>)
                                }
                        })} else return;
                    })}
                </>
            )}
             <Box css={{padding:'$2 calc($4 * 4 + $1)', boxSizing:'border-box', height:'48px', transition:'$all', color:'$foregroundText'}}>
                {(isValidating || !data) && (
                <>Patience</>)}
            </Box>
            <div ref={ref}> &nbsp;</div>
            </Box>
        </Box>
    )
}


const Contributors = ({list}:{list:SubscribedPublication[]}) =>{
    const {data, error, isValidating} = useSWR([list], getContributorsListAvatars, {
         revalidateIfStale: true,
         revalidateOnFocus: false,
         revalidateOnReconnect: true
    })
    const router = useRouter()
    if(!data) {
        return(
             <Box layout='flexBoxColumn' css={{flexWrap:'wrap'}}>
                <User key={'contributor placeholder'} profile={{displayName:'', address:'', avatarURL:undefined}}/>
             </Box>
        )
    }
    return(
        <Box layout='flexBoxColumn' css={{flexWrap:'wrap'}}>
            
            {data?.map((contributor, index)=>{
                return(
                <Box 
                // I woud like to give an abiility 
                onClick={()=>{
                    contributor.publications[0] 
                    ? router.push(`/${encodeURIComponent(contributor.publications[0].ensLabel)}`)
                    : router.push(`/${encodeURIComponent(contributor.address)}`)
                    }}
                key={'contributor'+index + contributor.displayName} ><User profile={contributor}/></Box>
                )
            })}
          
        </Box>
    )
}

const Spaces = ({index}:{index:string}) => {
    const curated = useRecoilValueAfterMount(curationItems, null)
    const setCurated = useSetRecoilState(curationItems)
    const router = useRouter()
    if(curated){
        return(
            <Layout>
                 {curated.find((i:CurationList)=>i.title === index)?.publications && (
                     <Box layout='flexBoxRow'>
                        <Space list={
                            curated.find((i:CurationList)=>i.title === index)?.publications || []
                        }/>
                        <Box 
                            layout='flexBoxColumn'
                            css={{
                            marginTop:'calc($4 + $1)',  
                            padding:'$2 $4', 
                            width:'fit-content',
                            height:'fit-content',
                            alignItems:'flex-end',
                            // boxShadow:'$normal',
                            borderRadius:'$2',
                            }}>
                            <Box layout='flexBoxRow' css={{alignItems:'center'}}> 
                                <SpaceAdd 
                                current={curated.find((i:CurationList)=>i.title === index)?.publications || []}
                                listName={index} setCuratedPublications={setCurated}/>
                            </Box>
                                <Box layout='flexBoxColumn' css={{width:'fit-content', alignItems:'center', justifyContent:'center'}}>
                                    <Contributors list={ curated.find((i:CurationList)=>i.title === index)?.publications || []}/>
                                </Box>
                                <ButtonPopover isHighlighted={false} icon={<DeleteIcon/>} label='Delete'>
                                    <Box layout='flexBoxColumn' css={{color:'$foregroundTextBronze'}}>
                                        <span>Are you sure you want to delete the <b>{index}</b>?</span>
                                        <StyledButton onClick={()=>{
                                            setCurated((prevState:CurationList[])=>{
                                                const indexUnPin = prevState.findIndex((item:CurationList)=>item.title=== index)
                                                const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                                                return newArray
                                            })
                                            router.push('/')
                                        }}>Delete</StyledButton>
                                        <Box as='span' css={{fontSize:'$6'}}>You will be redirected to the main page</Box>
                                    </Box>
                                </ButtonPopover>
                        </Box>
                    </Box>
                 )}

            </Layout>
        )
     }
     return(
         <Layout>
             <Box css={{padding:'$2 calc($4 * 4 + $1)', boxSizing:'border-box', height:'48px', transition:'$all', color:'$foregroundText'}}>
            <>Patience</>
          </Box>
         </Layout>
     )
}

export default Spaces 
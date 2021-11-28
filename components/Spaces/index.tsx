//types
import type {CurationList, SubscribedPublication, PinnedItem} from 'contexts'
//data
import {getMergedPublication} from 'src/publication-contents'
import useSWRInfinite from 'swr/infinite'
import {pinnedItems} from 'contexts'

//state
import {useRef, useEffect} from 'react'
import {useRouter} from 'next/router'
import useOnScreen from 'hooks/useOnScreen'
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'

//components
import {styled} from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import Article from '@/design-system/Article'
import Contributors from '@/design-system/Contributors'
import SpaceAdd from '@/design-system/Spaces/SpaceAdd'
import ButtonPopover from '@/design-system/primitives/ButtonPopover'
import DeleteIcon from '@/design-system/icons/Delete'
import StyledButton from '@/design-system/primitives/Button'



export const StyledContributorsSidebar = styled('ul', {
    display:'flex',
    flexDirection:'column',
    gap:'$1',
    marginTop:'calc($4 + $1)',  
    padding:'$2 $4', 
    width:'fit-content',
    height:'fit-content',
    alignItems:'flex-end',
    borderRadius:'$2',
    listStyle:'none'
})



 
interface ISpace {
    contributors:string[];
    current: SubscribedPublication[];
    currentSpace:string;
    setCurated:(fn:(prevState:CurationList[]) => CurationList[]) => void;
}

const Space = ({contributors, current, setCurated, currentSpace}:ISpace) => {
    const {data, error, setSize, isValidating} = useSWRInfinite((_, previousPageData)=>{
        if(previousPageData && !previousPageData[1]) return null // reached the end
        if (!previousPageData) return [contributors, undefined] // first query
        return [contributors, previousPageData[1]]
    }, getMergedPublication)
    const pinnedList = useRecoilValueAfterMount(pinnedItems, null) //we set the items to null to prevent initial rendering with empty values and waiting for the list to loa
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useOnScreen(ref, {})
    const isVisible = !!entry?.isIntersecting
    const router = useRouter()

    useEffect(()=>{
      if(isVisible){
         setSize((s)=>s+=1)
      }
    },[isVisible, setSize])

    if(error){
        return(
            <Box css={{width:'100%', padding:'$4', color:'$foregroundTextBronze'}}>
                Something went wrong
                {JSON.stringify(error)}
            </Box>
        )
    } 
    return(
        <Box layout='flexBoxRow'>
            <Box layout='flexBoxRow' css={{width:'100%', justifyContent:'space-between'}}>
                <Box layout='flexBoxColumn'>
                    {(data && pinnedList !== null )&&(
                        <>
                        {data.map((page)=>{
                            if(page[0]) { 
                                return page[0].map((entry)=>{
                                    if(pinnedList.findIndex((item:PinnedItem)=>item.type === 'entry' && item.item.digest === entry.digest) !== -1){
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
             <StyledContributorsSidebar>
                <Box layout='flexBoxRow' css={{alignItems:'center'}}> 
                    <SpaceAdd 
                    current={current}
                    listName={currentSpace} 
                    setCuratedPublications={setCurated}/>
                </Box>
                <Box layout='flexBoxColumn' css={{width:'fit-content', alignItems:'center', justifyContent:'center'}}>
                    {current.length >0 && (
                        <Contributors data={current} Open={(href:string)=>router.push(href)}/>
                    )}
                </Box>
                <ButtonPopover isHighlighted={false} icon={<DeleteIcon/>} label='Delete'>
                    <Box layout='flexBoxColumn' css={{color:'$foregroundTextBronze'}}>
                        <span>Are you sure you want to delete the <b>{currentSpace}</b>?</span>
                        <StyledButton onClick={()=>{
                            setCurated((prevState:CurationList[])=>{
                                const indexUnPin = prevState.findIndex((item:CurationList)=>item.title=== currentSpace)
                                const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                                return newArray
                            })
                            router.push('/')
                            }}>Delete
                        </StyledButton>
                        <Box as='span' css={{fontSize:'$6'}}>You will be redirected to the main page</Box>
                    </Box>
                </ButtonPopover>
            </StyledContributorsSidebar>
        </Box>
    )
}

export default Space
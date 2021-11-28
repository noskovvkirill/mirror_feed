import { styled } from 'stitches.config';
import useSWRInfinite from 'swr/infinite'
import Box from '@/design-system/primitives/Box'
import React from 'react'
import {useEffect,  useRef} from 'react'
import {useRouter} from 'next/router'
import useOnScreen from 'hooks/useOnScreen'
import {request} from 'graphql-request'
import {  SubscribedPublication} from 'contexts'

import User  from '@/design-system/primitives/Profile'
import {AddressPrettyPrint} from 'src/utils'
import Loader from '@/design-system/primitives/Loader'
import {queryPublicationsEns} from 'src/queries'

export const StyledSpaceSelector = styled('button', {
    padding:'$1 $2',
    width:'100%', 
    fontSize:'$6',
    borderColor:'transparent',
    display:'flex',
    borderRadius:'$2',
    cursor:'pointer',
    transition:'$background',
    justifyContent:'space-between',
    alignItems:'center',
    'span':{
        transform:'scale(0.8)',
        fontSize:'$6',
        lineHeight:'100%'
    },
    variants:{
        isActive:{
            true:{
                backgroundColor:'$highlightBronze',
                color:'$foregroundTextBronze',
            },
            false:{
                borderColor:'transparent',
                backgroundColor:'transparent',
                color:'$foregroundText',
                '&:hover':{
                    color:'$background',
                    backgroundColor:'$foregroundBronze',
                }
            }
        }
    },
    defaultVariants:{
        isActive:false
    }
})

const StyledLabel = styled('div', {
    fontSize:'$6',
    color:'$background',
    borderRadius:'$round',
    padding:'$0 $1',
    background:'$foreground'
})


const StyledSearchResult = styled('div', {
    display:'flex',
    flexDirection:'row',
    margin:'$1 0',
    padding:'$1 $1',
    fontSize:'$6',
    cursor:'pointer',
    justifyContent:'space-between',
    alignItems:'center',
    borderRadius:'$2',
    // margin:'$0 0',
    transition:'$background',
    '&:hover':{
        backgroundColor:'$highlight',
        color:'$foregroundText',
        [`& ${StyledLabel}`]:{
            // backgroundColor:'$foreground'
        }
    },
    variants:{
        type:{
            default:{

                borderBottom:'1px solid $highlight',
            },
            list:{
                borderRadius:'$1',
                color:'$foregroundTextBronze',
                background:'$highlightBronze',
            }
        }
    },
    defaultVariants:{
        type:'default'
    }
})





type EnsDomain = {
    name:string,
    labelName:string
}



const getKey = (pageIndex:number, previousPageData:EnsDomain[]  |  null) => {
  if (previousPageData && !previousPageData.length) return null // reached the end
  return `${pageIndex*10}`                // SWR key
}

const fetcher = async (key:number) => {
    console.log('key', key)
    let data:EnsDomain[] = await request('https://api.thegraph.com/subgraphs/name/ensdomains/ens', queryPublicationsEns, {skip:Number(key)}).then(({ domain }) =>{
      return domain.subdomains
        .filter((i:any) => i.labelName !== null)
  });

  return data
}



const SearchPublication = ({searchResult, searchState}:any) => {
 
   const {data, error, isValidating, setSize} = useSWRInfinite(getKey, fetcher)
   const router = useRouter()
   const ref = useRef<HTMLDivElement | null>(null)
   const entry = useOnScreen(ref, {})
   const isVisible = !!entry?.isIntersecting



//    useEffect(()=> { if(search) search.current.focus()},[]) //focusing on Input to quickly search
   useEffect(()=>{
      if(isVisible){
         setSize((s)=>s+=1)
      }
    },[isVisible, setSize])

  
    return(
        <Box>
            <Box layout='flexBoxColumn' css={{height:'fit-content', overflow:'visible'}}>
                <Box css={searchResult?.length>0 ? {paddingBottom:'0'} : {}}>
                    {searchResult?.map((item:SubscribedPublication & {address?:string}, index:number)=>{
                        return(
                            <StyledSearchResult
                            tabIndex={0}
                            onClick={()=>{router.push(`/${item.type === 'ens' ? item.ensLabel : item.address}?type=${item.type}`)}}
                            key={'search result'+index}>  
                                <Box layout='flexBoxRow' css={{width:'100%', alignItems:'center', justifyContent:'space-between'}}>              
                                    <Box layout='flexBoxRow' css={{alignItems:'center', fontSize:'$6'}}>
                                        <User size='sm' profile={item}/>
                                        <>{AddressPrettyPrint(item.ensLabel)}</>     
                                    </Box>
                                    <StyledLabel>
                                        {item.type === 'ens' 
                                        ? "PUBLICATION"
                                        : "PRIVATE"
                                        }
                                    </StyledLabel>  
                                </Box>
                            </StyledSearchResult>
                        )
                    })} 
                    {searchState === 'loading' && (
                        <Box css={{padding:'$2 $2 $2 $2'}}>
                            <Loader size='small'/>
                        </Box>
                    )}

                    {searchState === 'not found' && (
                        <Box css={{padding:'$2 $2 $2 $2', fontSize:'$6', color:'$text'}}>
                            Not found
                        </Box>
                    )}
                
                    {searchState === 'error' && (
                        <Box css={{padding:'$1 $2 $2 $2', fontSize:'$6', color:'$text'}}>
                            <>Something went wrong...</>
                        </Box>
                    )}
                </Box>

                {data?.map((page:EnsDomain[])=>page.map((item:EnsDomain)=>(
                    <Box layout='flexBoxRow' key={item.name}>
                        <StyledSpaceSelector
                        onClick={()=>{router.push(`/${item.labelName}?type=ens`)}}
                        key={item.name}>
                            {item.labelName}
                        </StyledSpaceSelector>
                    </Box>
                ))
                )}
                <Box ref={ref} css={{padding:'$1 $2'}}>
                    {isValidating && (
                        <Loader size='small'/>
                    )}
                </Box>
            </Box>      
        </Box>
    )
}

export default SearchPublication
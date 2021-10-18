import { styled } from 'stitches.config';
import useSWRInfinite from 'swr/infinite'
import Box from '@/design-system/primitives/Box'
import Input from '@/design-system/primitives/Input'
import React from 'react'
import {useEffect, useState, useRef} from 'react'
import {useRouter} from 'next/router'
import useOnScreen from 'hooks/useOnScreen'
import {request, gql} from 'graphql-request'
import {  SubscribedPublication} from 'contexts'
import { Search } from 'src/search'
import User  from '@/design-system/primitives/Profile'
import {AddressPrettyPrint} from 'src/utils'
import Loader from '@/design-system/primitives/Loader'
import {StyledSpaceSelector} from '@/design-system/Spaces/SpacesSelector'
import {queryPublicationsEns} from 'src/queries'
import {useThrottle, useThrottleCallback} from '@react-hook/throttle'
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



const PublicationsAdd = ({publication, content, type, author}:{publication?:string, content?:string, author?:string, type?:'ens' | 'personal'}) => {
   const [searchResult, setSearchResult] = useState<null | any>(null)
   const [searchState, setSearchState] = useState<'default' | 'loading' | 'not found' | 'error'>('default')
   const {data, error, isValidating, setSize} = useSWRInfinite(getKey, fetcher)
   const router = useRouter()
   const ref = useRef<HTMLDivElement | null>(null)
   const entry = useOnScreen(ref, {})
   const isVisible = !!entry?.isIntersecting
   const search = useRef<any>()


   useEffect(()=> { if(search) search.current.focus()},[]) //focusing on Input to quickly search
   useEffect(()=>{
      if(isVisible){
         setSize((s)=>s+=1)
      }
    },[isVisible, setSize])

    const InputSearch = async (e:React.ChangeEvent<HTMLInputElement>) => {
            setSearchState('loading')
            const target = e.target 
            if(target.value === '') {
                setSearchState('default')
                setSearchResult([])
                return
            }
            const result = await Search(target.value).catch(()=>setSearchState('error'))
            if(!result){
                setSearchState('error')
                return
            }
            if(result.length<=0) {
                setSearchResult([])
                setSearchState('not found')
                return
            }
            setSearchResult(result)
            setSearchState('default')
    }
    const thottleSearch = useThrottleCallback(InputSearch,1)


    return(
        <Box>
            <Box layout='flexBoxColumn' css={{height:'272px', overflow:'scroll'}}>
                {(publication && type && router.query.publication) && (
                    <Box css={{paddingBottom:'$1'}}>
                        <StyledSpaceSelector
                        isActive={true}
                        css={{cursor:'initial'}}
                        key={"current item publication" + author}>
                            {AddressPrettyPrint(publication)}
                        </StyledSpaceSelector>
                    </Box>
                )}
             
                <Input ref={search} css={{top:'0',marginBottom:'$0', width:'100%'}} type='search' 
                    onChange={thottleSearch}
                    placeholder='Search user address or publication'/>

                <Box css={searchResult?.length>0 ? {paddingBottom:'0'} : {}}>
                    {searchResult?.map((item:SubscribedPublication & {address?:string}, index:number)=>{
                        return(
                            <StyledSearchResult
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
                                        {/* {item.type.toUpperCase()} */}
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
                        {/* <PublicationToSpace/> */}
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

export default PublicationsAdd
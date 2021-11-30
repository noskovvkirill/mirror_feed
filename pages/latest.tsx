import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import Article from '@/design-system/Article/ArticleShort'
import Heading from '@/design-system/primitives/Heading'
import * as Header from '@/design-system/Feed/Header'

import { request } from 'graphql-request';
import type { GetServerSideProps } from 'next'
import useSWRInfinite from 'swr/infinite'
import {useRef, useEffect, useState} from 'react'
import useOnScreen from 'hooks/useOnScreen'
import Loader from '@/design-system/primitives/Loader'
//global state
import {ignoredPublication, pinnedItems, PinnedItem, IgnoredPublication, settings} from 'contexts'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'
import {useRecoilValue} from 'recoil'
import {queryEntry, queryAll} from 'src/queries'

import { createClient } from '@supabase/supabase-js'

import {styled} from 'stitches.config'

export const getServerSideProps: GetServerSideProps = async () => {
  const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
    const supabaseKey = process.env.SERVICE_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey) 
     const { data, error } = await supabase
    .from('mirroritems')
    .select()
    .order('timestamp', {ascending: false})
    .limit(19)


     const entries = await Promise.all(data.map(async (item:any) => {
    return(await request('https://mirror-api.com/graphql', queryEntry, {
       digest: item.digest
    }).then((data:any) =>
      ({entry:data.entry,       
    })
    ).catch((e)=>{console.log(e); return})
    )
  }))

    const entrieFiltered = entries.filter(function( element:any ) {
        return element !== undefined;
    });
    
    if(error || !data){
         return({notFound:true})
    } 

  return {props:{entries:entrieFiltered}}
 
};
type Props = {
    entries:any[]
    lastCursor:string | undefined
}

const getKey = (pageIndex:number, previousPageData:any) => {
    try{
    console.log('get key', pageIndex, previousPageData)
//  if (previousPageData && !previousPageData.length) return null // reached the end
    const key =  `/api/getMirrorItems?from=${20*pageIndex+1}&to=${20*pageIndex+1+19}`
  return key 
    } catch(e){
        console.log(e)
    }
}

const fetcher = async (url:string) => {
    const data =  await fetch(url).then(res => res.json()).then(({data})=>data)
      const entries = await Promise.all(data.map(async (item:any) => {
    return(await request('https://mirror-api.com/graphql', queryEntry, {
       digest: item.digest
    }).then((data:any) =>
      ({entry:data.entry,       
    })
    ).catch((e)=>{console.log(e); return})
    )
  }))

  return entries

}

const StyledSelect = styled('select', {
    background:'$background',
    appearance:'none',
    border:'0',
        color:'$highlight',
    outline:'none',
     width: '100%',
     padding:'0 $2',
     margin:'1px 0 0 0',
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  fontSize: 'inherit',
  cursor: 'inherit',
  lineHeight: '100%'
})

const StyledOption = styled('option', {
    fontSize:'$1',
    border:'0',
    color:'$highlight',
      backgroundColor:'red!important',
      '&:focus':{
        backgroundColor:'red!important',
      },
    '&[data-state="active"]':{
        color:'$highlight',
          backgroundColor:'red!important',
        WebkitAppearance: 'none',
        appearance: 'none',
        outline: 'none',
    }

})




const Data = ({entries}:Props) =>{
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useOnScreen(ref, {
    threshold: 0,
    rootMargin:'100%'
  })
    const isVisible = !!entry?.isIntersecting

    const ignoredList = useRecoilValueAfterMount(ignoredPublication, null) //we set the items to null to prevent initial rendering with empty values and waiting for the list to load
    const pinnedList = useRecoilValueAfterMount(pinnedItems, null) //we set the items to null to prevent initial rendering with empty values and waiting for the list to load

    const appSettings = useRecoilValue(settings)

    const { data, error, isValidating, setSize, size } = useSWRInfinite(getKey, fetcher, {fallbackData: [entries]}) // tslint:disable-line
    
    const [fetchOption, setFetchOption] = useState<string>('publications')

    useEffect(()=>{
      if(isVisible){
         setSize((s)=>s+=1)
      }
    },[isVisible, setSize])
 
  
    if(error) return <Layout>Error ocurred..</Layout>
    if (!data) return <Layout>Patience...</Layout>

    return(
    <Layout>
      <Box layout='flexBoxRow' css={{width:'100%', justifyContent:'space-between'}}>
        <Box layout='flexBoxColumn'>

            <Header.Root controls={<Header.ViewControls/>}>
             <Box layout='flexBoxColumn' css={{width:'100%'}}>
                <Box layout='flexBoxRow'>
                    <Heading 
                    size={'h1'}
                    color={"foregroundText"}>
                        Show
                    </Heading>
                    <Heading 
                    size={'h1'}
                    color={"highlight"}>
                       <StyledSelect 
                       onChange={(e)=>setFetchOption(e.target.value)}
          
                       > 
                          <StyledOption value={"publications"} data-state={fetchOption==='publications' ? "active" : ""}>Publications</StyledOption>
                           <StyledOption value={"all"} data-state={fetchOption==='all' ? "active" : ""}>All</StyledOption>
                        </StyledSelect>
                    </Heading>
                    </Box>
                </Box>
            </Header.Root>

         
          {ignoredList !== null && pinnedList !== null && (
           <Box css={{
            display:appSettings.view === 'card' ? 'grid' : 'list',
            gridColumnGap:'32px',
            height:'fit-content',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gridTemplateRows: "repeat(auto, minmax(0, 1fr))",
            width:'$body',
            overflow:'visible',
          }}>   
            {data.map((page:any, indexPage:number)=>{
              return page?.map(({entry, index}:any)=>{
                if(ignoredList.findIndex((item:IgnoredPublication)=>entry.publication?.ensLabel === item.ensLabel || entry.author.address === item.ensLabel) === -1){
                    if(pinnedList.findIndex((item:PinnedItem)=>item.type === 'entry' && item.item.digest === entry.digest) !== -1){
                      return <></>;
                    } else {
                        return(
                          <Article 
                          view={appSettings.view}
                          key={entry.digest+appSettings.view+index*indexPage} entry={entry}/>
                        )
                      }
                } else {
                  return;
                }
              })
            })}
             </Box>
           )
           }
          
    
          <Box css={{padding:'$2 calc($4 * 4 + $1)', boxSizing:'border-box', height:'48px', transition:'$all', color:'$foregroundText'}}>
              {isValidating &&
              (<Loader size='default'/>)
              }
            </Box>
            <div 
            style={{backgroundColor:'red', opacity:0, bottom:0, height:'256px'}}
            ref={ref}> &nbsp;</div>
          </Box>
        </Box>
    </Layout>
    )
}

export default Data
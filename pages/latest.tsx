import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import Article from '@/design-system/Article/ArticleShort'
import Heading from '@/design-system/primitives/Heading'
import * as Header from '@/design-system/Feed/Header'

import { request } from 'graphql-request';
import type { GetServerSideProps } from 'next'
import useSWRInfinite from 'swr/infinite'
import {useRef, useEffect} from 'react'
import useOnScreen from 'hooks/useOnScreen'
import Loader from '@/design-system/primitives/Loader'
//global state
import {ignoredPublication, pinnedItems, PinnedItem, IgnoredPublication, settings} from 'contexts'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'
import {useRecoilValue} from 'recoil'
import {queryEntry, queryAll} from 'src/queries'



export const getServerSideProps: GetServerSideProps = async () => {


  const data = await request('https://arweave.net/graphql', queryAll).then(({ transactions }) =>{
      return transactions.edges
  });

  let lastCursor 
  const content = data.map(({node:{tags}, cursor}:{node:{tags:any},cursor:string})=>{
    lastCursor = cursor;
     return tags.find((c:any)=>c.name === 'Original-Content-Digest').value
  })



const entries = await Promise.all([...new Set(content)].map(async (item:any) => {
    return(await request('https://mirror-api.com/graphql', queryEntry, {
       digest: item
    }).then((data) =>
      data.entry
    ).catch(()=>{return})
    )
  }))

  const entrieFiltered = entries.filter(function( element:any ) {
   return element !== undefined;
});

  return {props:{entries:entrieFiltered, lastCursor:lastCursor}}
 
};
type Props = {
    entries:any[]
    lastCursor:string | undefined
}


const getKey = (_:any, previousPageData:any) => {
  if (previousPageData && !previousPageData.length) return null // reached the end

  return `{
		transactions(first:10, ${previousPageData ? 'after:"'+previousPageData[1]+'"' : ''}, tags: [{ name: "App-Name", values: ["MirrorXYZ"] }]) {
			edges {
				node {
					id
					tags {
						name
						value
					}
				}
        cursor
			}
		}
	}`                  
}

const fetcher = async (query:string) => {
    const data =  await request('https://arweave.net/graphql', query).then(({ transactions }) =>{
      return transactions.edges
  });

  let lastCursor

  const content = data.map(({node:{tags}, cursor}:{node:{tags:any}, cursor:string})=>{
     lastCursor = cursor
     return tags.find((c:any)=>c.name === 'Original-Content-Digest').value
  })

  const entries = await Promise.all([...new Set(content)].map(async (item:any) => {
    return(await request('https://mirror-api.com/graphql', queryEntry, {
       digest: item
    }).then((data) =>
      data.entry
    ).catch(()=>{return})
    )
  }))

  const entriesFiltered = entries.filter(function( element:any ) {
   return element !== undefined;
});

return ([entriesFiltered, lastCursor as string | undefined])


}


const Data = ({entries, lastCursor}:Props) =>{
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useOnScreen(ref, {
    threshold: 0.25,
  })
    const isVisible = !!entry?.isIntersecting

    const ignoredList = useRecoilValueAfterMount(ignoredPublication, null) //we set the items to null to prevent initial rendering with empty values and waiting for the list to load
    const pinnedList = useRecoilValueAfterMount(pinnedItems, null) //we set the items to null to prevent initial rendering with empty values and waiting for the list to load

    const appSettings = useRecoilValue(settings)

    const { data, error, isValidating, setSize } = useSWRInfinite(getKey, fetcher, {fallbackData: [[entries, lastCursor]]}) // tslint:disable-line
    

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
                        Latest&nbsp;
                    </Heading>
                    <Heading 
                    size={'h1'}
                    color={"highlight"}>
                        Mirror.xyz
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
            {data.map((page:any)=>{
              return page[0].map((entry:any)=>{
                if(ignoredList.findIndex((item:IgnoredPublication)=>entry.publication?.ensLabel === item.ensLabel || entry.author.address === item.ensLabel) === -1){
                    if(pinnedList.findIndex((item:PinnedItem)=>item.type === 'entry' && item.item.digest === entry.digest) !== -1){
                      return;
                    } else {
                        return(
                          <Article 
                          view={appSettings.view}
                          key={entry.digest+appSettings.view} entry={entry}/>
                        )
                      }
                } else {
                  return;
                }
              })
            })}
             </Box>
           )}
          
    
          <Box css={{padding:'$2 calc($4 * 4 + $1)', boxSizing:'border-box', height:'48px', transition:'$all', color:'$foregroundText'}}>
              {isValidating &&
              (<Loader size='default'/>)
              }
            </Box>
            <div ref={ref}> &nbsp;</div>
          </Box>
        </Box>
    </Layout>
    )
}

export default Data
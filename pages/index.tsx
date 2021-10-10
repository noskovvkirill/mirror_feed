import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import Article from '@/design-system/Article'
import { request, gql } from 'graphql-request';
import type { GetServerSideProps } from 'next'
import useSWRInfinite from 'swr/infinite'
import {useRef, useEffect} from 'react'
import useOnScreen from 'hooks/useOnScreen'
import Loader from '@/design-system/primitives/Loader'
//global state
import {ignoredPublication, pinnedItems, PinnedItem, IgnoredPublication, curationItems} from 'contexts'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'



const queryEntry = gql`
query Entry($digest: String!) {
  entry(digest: $digest) {
       id
        body
        digest
        timestamp
        title
        author{
          address
          displayName
        }
        publication{
          ensLabel
        }
    }
}`

const query = gql`
{
		transactions(first:20, tags: [{ name: "App-Name", values: ["MirrorXYZ"] }]) {
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
export const getServerSideProps: GetServerSideProps = async (ctx) => {



  const data = await request('https://arweave.net/graphql', query).then(({ transactions }) =>{
      return transactions.edges
  });

  let lastCursor 
  const content = data.map(({node:{tags}, cursor}:{node:{tags:any},cursor:string})=>{
    lastCursor = cursor;
     return tags.find((c:any)=>c.name === 'Original-Content-Digest').value
  })

  // console.log('data', data[0].node.tags)

const entries = await Promise.all([...new Set(content)].map(async (item:any) => {
    return(await request('https://mirror-api.com/graphql', queryEntry, {
       digest: item
    }).then((data) =>
      data.entry
    ).catch((e)=>{return})
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
		transactions(first:20, ${previousPageData ? 'after:"'+previousPageData[1]+'"' : ''}, tags: [{ name: "App-Name", values: ["MirrorXYZ"] }]) {
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
    const entry = useOnScreen(ref, {})
    const isVisible = !!entry?.isIntersecting

    const ignoredList = useRecoilValueAfterMount(ignoredPublication, null) //we set the items to null to prevent initial rendering with empty values and waiting for the list to load
    const pinnedList = useRecoilValueAfterMount(pinnedItems, null) //we set the items to null to prevent initial rendering with empty values and waiting for the list to load

    const curated = useRecoilValueAfterMount(curationItems, [])
    // const setCuratedPublications = useSetRecoilState(curationItems)

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
          {ignoredList !== null && pinnedList !== null && (
          <>
            {data.map((page:any)=>{
              return page[0].map((entry:any)=>{
                if(ignoredList.findIndex((item:IgnoredPublication)=>entry.publication?.ensLabel === item.ensLabel || entry.author.address === item.ensLabel) === -1){
                    if(pinnedList.findIndex((item:PinnedItem)=>item.entry.digest === entry.digest) !== -1){
                      return;
                    } else {

                        return(
                          <Article key={entry.digest} entry={entry}/>
                        )
      
                   
                      }

                } else {
                  return;
                }
              })
            })}
            </>
           )}
    
          <Box css={{padding:'$2 calc($4 * 4 + $1)', boxSizing:'border-box', height:'48px', transition:'$all', color:'$foregroundText'}}>
              {isValidating &&
              (<Loader size='default'/>)
              }
            </Box>

          {/* <Box css={{padding:'$2 calc($4 * 4 + $1)', boxSizing:'border-box', height:'48px', transition:'$all', color:'$foregroundText'}}>
            {isValidating && (
            <>Patience</>)}
          </Box> */}
            <div ref={ref}> &nbsp;</div>
          </Box>
        </Box>
    </Layout>
    )
}

export default Data
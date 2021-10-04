import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request, gql } from 'graphql-request';
import type { GetServerSideProps } from 'next'
import ArticlePreview from '@/design-system/ArticlePreview';
import useSWRInfinite from 'swr/infinite'
import {useRef, useEffect} from 'react'
import useOnScreen from 'hooks/useOnScreen'

//global state
import {ignoredPublication, pinnedItems, PinnedItem, IgnoredPublication, ReadingListItem} from 'contexts'
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
          displayName
          id
        }
        publication{
          ensLabel
        }
    }
 __typename
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
export const getServerSideProps: GetServerSideProps = async () => {
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
    lastCursor:string
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
	}`                    // SWR key
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

return [entriesFiltered, lastCursor]


}


const Data = ({entries, lastCursor}:Props) =>{
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useOnScreen(ref, {})
    const isVisible = !!entry?.isIntersecting

    const ignoredList = useRecoilValueAfterMount(ignoredPublication, [])
    const pinnedList = useRecoilValueAfterMount(pinnedItems, [])


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
        <Box layout='flexBoxColumn'>
          {data.map((page:any)=>{
            return page[0].map((entry:any)=>{
              if(ignoredList.findIndex((item:IgnoredPublication)=>entry.publication.ensLabel === item.ensLabel) === -1){
                  if(pinnedList.findIndex((item:PinnedItem)=>item.entry.digest === entry.digest) !== -1){
                    return;
                  } else {
                      return(
                      <ArticlePreview key={entry.digest} entry={entry}/>
                      )
                  }
              } else {
                return;
              }
            })
          })}
      
              <Box css={{padding:'$2 calc($4 * 3.5)', boxSizing:'border-box', height:'48px', transition:'$all', color:'$foregroundText'}}>
                {isValidating && (
                <>Patience</>)}
              </Box>
       
          <div ref={ref}> &nbsp;</div>
        </Box>
    </Layout>
    )
}

export default Data
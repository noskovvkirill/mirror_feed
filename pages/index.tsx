import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request, gql } from 'graphql-request';
import type { GetServerSideProps } from 'next'
import ArticlePreview from '@/design-system/ArticlePreview';
import useSWRInfinite from 'swr/infinite'
import Button from '@/design-system/primitives/Button'
import {useRef, useEffect, useCallback} from 'react'
import useOnScreen from 'hooks/useOnScreen'

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
		transactions(first:10, tags: [{ name: "App-Name", values: ["MirrorXYZ"] }]) {
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


const getKey = (pageIndex:any, previousPageData:any) => {
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

    //  useScrollPosition(({ currPos }) => {
    //   console.log(currPos.y)
    // })

    useEffect(()=>{
      if(isVisible){
         setSize((s)=>s+=1)
      }
    },[isVisible])


    const { data, error, isValidating, setSize } = useSWRInfinite(getKey, fetcher, {fallbackData: [[entries, lastCursor]]})
    if (!data) return <Layout>loading</Layout>
    return(
    <Layout>
        <Box layout='flexBoxColumn'>
        {data.map((page:any)=>{
          return page[0].map((entry:any)=>{
            return(
                <ArticlePreview key={entry.digest} entry={entry}/>
            )
          })
        })}
        {isValidating && (
            <Box css={{padding:'$2 calc($4 * 4)'}}>Patience</Box>
        )}
        <div ref={ref}> &nbsp;</div>
        </Box>
    </Layout>
    )
}

export default Data
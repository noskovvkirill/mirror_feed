import { request, gql } from 'graphql-request';
import Box from '@/design-system/primitives/Box'
import type { GetServerSideProps } from 'next'
import useSWRInfinite from 'swr/infinite'
import Article from '@/design-system/Article';

export type Entry = {
  id:string,
  digest:string,
  timestamp:number,
  author:{
      displayName:string;
  },
  publication:{
      ensLabel:string;
  }
  title:string,
  body:any
}

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

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await request('https://arweave.net/graphql', query).then(({ transactions }) =>{
      return transactions.edges
  });

  let lastCursor 
  const content = data.map(({node:{id, tags}, cursor}:{node:{id:any, tags:any},cursor:string})=>{
    lastCursor = cursor;
     return id
  })

  // console.log('data', data[0].node.tags)

const entries = await Promise.all([...new Set(content)].map(async (item:any) => {


    //issues with quering directly from arweave: author name is taken from  
    return await fetch(`https://arweave.net/${item}`)
    .then((data) =>
    data.json()
    )
    .then((body)=>{
          console.log('body', body)
    return({
        id:body.digest,
        timestamp:body.content.timestamp,
        title:body.content.title,
        body:body.content.body,
        publication:{ensLabel:body.content.publication || ''},
        author:{displayName:body.authorship.contributor} 
        
    })})
  
    .catch((e)=>{console.log(e); return})
  }))


const entriesFiltered = entries.filter(function( element:any ) {
   return element !== undefined;
});

  return {props:{entries:entriesFiltered, lastCursor:lastCursor}}
 
};
type Props = {
    entries:any[]
    lastCursor:string | undefined
}

const Try = ({entries, lastCursor}:Props) =>{
    // const { data, error, isValidating, setSize } = useSWRInfinite(getKey, fetcher, {fallbackData: [[entries, lastCursor]]}) // tslint:disable-line

    return(
        <Box>
            <>
            {[[entries]].map((page:any)=>{
              return page[0].map((entry:any)=>{
            
                        return(
                        <Article key={entry.digest} entry={entry}/>
                        )
            })})}
            </>
        </Box>
    )
}

export default Try
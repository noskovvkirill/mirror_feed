import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request, gql } from 'graphql-request';
import type { GetServerSideProps } from 'next'
import Article from '@/design-system/Article';
import {Entry} from '@/design-system/Article'
import { Current } from 'contexts';
import { useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
// const query = gql`
// query Transaction($contributor:String!){
// 		transactions(first:20, tags: [
//       { name: "App-Name", values: ["MirrorXYZ"] },
//       { name: "Contributor", values: $contributor}
//     ]) {
// 			edges {
// 				node {
// 					id
// 					tags {
// 						name
// 						value
// 					}
// 				}
//         cursor
// 			}
// 		}
// 	}`

// Publication Entries
const queryPublication = gql`
query Publication($ensLabel: String!) {
  publication(ensLabel: $ensLabel) {
       entries{
         id
         digest
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
          address
          displayName
        }
        publication{
          ensLabel
        }
    }
}`


export const getServerSideProps: GetServerSideProps = async (ctx) => {


const {  publication} = ctx.query;

// console.log('publication', publication)

// const data = await request('https://arweave.net/graphql', query).then(({ transactions }) =>{
//       return transactions.edges
//   });


const entries = await request('https://mirror-api.com/graphql', queryPublication, {
       ensLabel: publication
  }).then((data) =>data.publication.entries).catch(()=>{return})
  
  if(!entries){
    return { notFound:true}
  }

  const content = entries.map((item:any)=>item.digest)
   
  const entriesData = await Promise.all([...new Set(content)].map(async (item:any) => {
    return(await request('https://mirror-api.com/graphql', queryEntry, {
       digest: item
    }).then((data) =>
      data.entry
    ).catch((e)=>{return})
    )
  }))

    const entrieFiltered = entriesData.filter(function( element:any ) {
      return element !== undefined;
    });
    
    return {
    props:{entries:entrieFiltered},
  }
};
type Props = {
    entries:any;
}


const Data = ({entries}:Props) =>{

  const setCurrentArticle = useSetRecoilState(Current)

  useEffect(()=>{
    setCurrentArticle({
      publication:{
        ensLabel:entries[0].publication?.ensLabel || entries[0].author.displayName || entries[0].author.address
      },
      title:null,
      digest:null
    })
  },[entries])

    return(
      <Layout>
          <Box layout='flexBoxColumn'>
            {entries.length === 0 && (
              <p>There is nothing just yet</p>
            )}

              {entries.map((entry:Entry)=>{
                return(
                 <Article key={entry.digest} entry={entry} isPreview={true}/>
                )
              })}
          </Box>
      </Layout>
    )
}

export default Data
import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request, gql } from 'graphql-request';
import type { GetServerSideProps } from 'next'
import Article from '@/design-system/Article';
import type {Entry} from '@/design-system/Article'
import type {CurrentArticle} from 'contexts'
import {Current} from 'contexts'
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';

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

const { index} = ctx.query;

console.log('index', index)
const entry = await request('https://mirror-api.com/graphql', queryEntry, {
       digest: index
    }).then((data) =>data.entry).catch(()=>{return { notFound:true}})
  return {
    props:{entry:entry},
  }
};
type Props = {
    entry:Entry;
}


const Data = ({entry}:Props) =>{
  const [currentArticle, setCurrentArticle] = useRecoilState(Current)

  useEffect(()=>{
    setCurrentArticle({
      publication:{
        type: entry.publication?.ensLabel ? 'ens' : 'personal',
        ensLabel:entry.publication.ensLabel
      },
      author: entry.author.address,                                                                                          
      digest: entry.digest,
      title:entry.title
    })
  },[entry])

    return(
      <Layout>
          <Box layout='flexBoxColumn'>
            {JSON.stringify(currentArticle)}
              <Article key={entry.digest} entry={entry} isPreview={false}/>
          </Box>
      </Layout>
    )
}

export default Data
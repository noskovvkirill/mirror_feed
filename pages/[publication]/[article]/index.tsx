import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request, gql } from 'graphql-request';
import type { GetServerSideProps } from 'next'
import Article from '@/design-system/Article';
import type {Entry} from '@/design-system/Article'
import type {CurrentArticle} from 'contexts'
import {Current} from 'contexts'
import { useSetRecoilState } from 'recoil';
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

const { article, publication} = ctx.query;

console.log('article', article, 'publication', publication)
const entry = await request('https://mirror-api.com/graphql', queryEntry, {
       digest: article
    }).then((data) =>data.entry).catch(()=>{return { notFound:true}})
  return {
    props:{entry:entry},
  }
};
type Props = {
    entry:Entry;
}


const Data = ({entry}:Props) =>{
    const setCurrentArticle = useSetRecoilState(Current)

  useEffect(()=>{
    setCurrentArticle({
      publication:{
        type: entry.publication?.ensLabel ? 'ens' : 'personal',
        ensLabel:entry.publication?.ensLabel || entry.author.displayName 
      },
      author: entry.author.address,                                                                                          
      title:entry.title,
      digest: entry.digest
    })
  },[entry])

    return(
      <Layout>
          <Box layout='flexBoxColumn'>
              <Article key={entry.digest} entry={entry} isPreview={false}/>
          </Box>
      </Layout>
    )
}

export default Data
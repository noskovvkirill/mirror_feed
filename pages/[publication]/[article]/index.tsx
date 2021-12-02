import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request } from 'graphql-request';
import type { GetStaticProps } from 'next'
import Article from '@/design-system/Article';
import type {EntryType} from '@/design-system/Entry'
// import type {CurrentArticle} from 'contexts'
import {Current} from 'contexts'
import { useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import { queryEntry, queryPublication, queryPublications } from 'src/queries';
import Loader from '@/design-system/primitives/Loader'

const mirrorendpoint = process.env.NEXT_PUBLIC_MIRROR_API;

// const entries = await request('https://mirror-api.com/graphql', queryPublication, {
//         ensLabel: publication
//     }).then((data) =>data.publication.entries).catch(()=>{return})
export async function getStaticPaths() {
    const {publications} = await request(mirrorendpoint || '', queryPublications);
    const items:Array<string | { params: { [key: string]: string } }> = []
    const length = publications.slice(0,10).length
    for(let i =0; i<=length; i++){
      const publication = publications[i]
      const entries = await request('https://mirror-api.com/graphql', queryPublication, {
        ensLabel: publication.ensLabel
      }).then((data) =>data.publication.entries)
      const path:Array<string | { params: { [key: string]: string } }> = entries.map((entry:EntryType)=>{ 
        const key = publication.ensLabel
        const keyNew =  entry.digest
        return ({params: {publication:key, article:keyNew} })})
      items.push(...path)
    }
    const paths = items.flat()
    return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const {article} = ctx.params as { article:string };
  if(!article) return ({notFound:true})
  const entry = await request('https://mirror-api.com/graphql', queryEntry, {
        digest: article
      }).then((data) =>data.entry)
      .catch((e)=>{
        return { notFound:true}
      })

    return {
      props:{entry:entry},
    }
};

type Props = {
    entry:EntryType;
}


const Data = ({entry}:Props) =>{
    const setCurrentArticle = useSetRecoilState(Current)

  useEffect(()=>{
    if(entry){
    setCurrentArticle({
      publication:{
        type: entry.publication?.ensLabel ? 'ens' : 'personal',
        ensLabel:entry.publication?.ensLabel || entry.author.displayName 
      },
      author: entry.author.address,                                                                                          
      title:entry.title,
      digest: entry.digest
    })}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[entry])

  if(entry){
    return(
      <Layout>
          <Box layout='flexBoxColumn'>
              <Article key={entry.digest} entry={entry} isPreview={false}/>
          </Box>
      </Layout>
    )} else {
      return(
      <Layout>
        <Loader size='default'>Patience</Loader>
      </Layout>)
    }
}

export default Data
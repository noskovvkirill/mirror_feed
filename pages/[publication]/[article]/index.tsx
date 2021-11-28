import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request } from 'graphql-request';
import type { GetServerSideProps } from 'next'
import Article from '@/design-system/Article';
import type {EntryType} from '@/design-system/Entry'
// import type {CurrentArticle} from 'contexts'
import {Current} from 'contexts'
import { useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import { queryEntry } from 'src/queries';



export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // const { article, publication} = ctx.query;
  const { article} = ctx.query;
  const entry = await request('https://mirror-api.com/graphql', queryEntry, {
        digest: article
      }).then((data) =>data.entry).catch(()=>{return { notFound:true}})
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
    setCurrentArticle({
      publication:{
        type: entry.publication?.ensLabel ? 'ens' : 'personal',
        ensLabel:entry.publication?.ensLabel || entry.author.displayName 
      },
      author: entry.author.address,                                                                                          
      title:entry.title,
      digest: entry.digest
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
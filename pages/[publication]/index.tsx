import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request } from 'graphql-request';
import type { GetServerSideProps } from 'next'
import type { SubscribedPublication} from 'contexts';
import Article from '@/design-system/Article';
import type {Entry} from '@/design-system/Article'
import { Current, PinnedItem,pinnedItems } from 'contexts';
import { useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'
import  { User } from '@/design-system/primitives/Profile';
import { queryPersonal, queryEntry, queryPublication } from 'src/queries';
import { getContributorsListAvatars} from 'src/publication-contents'
import Contributors from '@/design-system/Contributors';
import {useRouter} from 'next/router'



export const getServerSideProps: GetServerSideProps = async (ctx) => {


const { publication, type} = ctx.query;

if(!publication) {
  return {notFound:true}
}

if(type === 'personal') {
  const entries = await request('https://arweave.net/graphql', queryPersonal, {contributor:publication}).then(({ transactions }) =>{
          return transactions.edges
  });

  const pbl:SubscribedPublication = {
    ensLabel:publication.toString(),
    type:'personal'
  }

  const profiles:User[] | SubscribedPublication[] = await getContributorsListAvatars([pbl])

  const content = entries.map(({node:{tags}}:{node:{tags:any}})=>{
     return tags.find((c:any)=>c.name === 'Original-Content-Digest').value
  })

  const entriesData = await Promise.all([...new Set(content)].map(async (item:any) => {
    return(await request('https://mirror-api.com/graphql', queryEntry, {
       digest: item
    }).then((data) =>
      data.entry
    ).catch(()=>{return})
    )
  }))

   const entrieFiltered = entriesData.filter(function( element:any ) {
      return element !== undefined;
    });
    
    return {
    props:{pbl, entries:entrieFiltered, profiles:profiles},
  }

}



const entries = await request('https://mirror-api.com/graphql', queryPublication, {
       ensLabel: publication
  }).then((data) =>data.publication.entries).catch(()=>{return})
  
  if(!entries){
    return { notFound:true}
  }

  const pbl:SubscribedPublication = {
    ensLabel:publication.toString(),
    type:'ens'
  }

  const profiles:User[] | SubscribedPublication[] = await getContributorsListAvatars([pbl])

  const content = entries.map((item:any)=>item.digest)
   
  const entriesData = await Promise.all([...new Set(content)].map(async (item:any) => {
    return(await request('https://mirror-api.com/graphql', queryEntry, {
       digest: item
    }).then((data) =>
      data.entry
    ).catch(()=>{return})
    )
  }))

    const entrieFiltered = entriesData.filter(function( element:any ) {
      return element !== undefined;
    });
    
    return {
    props:{pbl:pbl, entries:entrieFiltered, profiles:profiles},
  }
};

type Props = {
    pbl: SubscribedPublication,
    entries:any;
    profiles:User[] | SubscribedPublication[];
}


const Data = ({pbl, entries, profiles}:Props) =>{

  const setCurrentArticle = useSetRecoilState(Current)
  const pinnedList = useRecoilValueAfterMount(pinnedItems, null) //we set the items to null to prevent initial rendering with empty values and waiting for the list to load
  const router = useRouter()

  useEffect(()=>{
    setCurrentArticle({
      publication:{
        type: pbl.type || entries[0]?.publication?.ensLabel ? 'ens' : 'personal',
        ensLabel:pbl.ensLabel || entries[0]?.publication?.ensLabel || entries[0]?.author.displayName || entries[0]?.author.address
      },
      author: entries[0]?.author.address,   
      title:null,
      digest:null
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[entries])

    return(
      <Layout>
          <Box layout='flexBoxRow' css={{width:'100%', justifyContent:'space-between'}}>
            <Box layout='flexBoxColumn'>
              {entries.length === 0 && (
                <p>There is nothing just yet</p>
              )}
  
              {pinnedList !== null && (
                <>
                {entries.map((entry:Entry)=>{
                    if(pinnedList.findIndex((item:PinnedItem)=>item.type === 'entry' && item.item.digest === entry.digest) !== -1){
                      return;
                    } else {
                        return(
                        <Article key={entry.digest} entry={entry}/>
                        )
                    }
                })}
              </>
            )}
            </Box>
             <Box 
              layout='flexBoxColumn'
              css={{
              marginTop:'calc($4 + $1)',  
              padding:'$2 $4', 
              width:'fit-content',
              height:'fit-content',
              alignItems:'flex-end',
              borderRadius:'$2',
              }}>
              <Contributors data={profiles} Open={(route:string)=>router.push(route)}/>
            </Box>
          </Box>
      </Layout>
    )
}

export default Data
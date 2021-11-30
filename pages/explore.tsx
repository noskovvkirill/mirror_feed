import type { GetStaticProps } from 'next'
import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import CuratedArticle from '@/design-system/Curation/CuratedArticle'
import * as Header from '@/design-system/Feed/Header'
import Heading from '@/design-system/primitives/Heading'

import { createClient } from '@supabase/supabase-js'
import {request} from 'graphql-request'
import { queryEntry } from 'src/queries'
//state
import {pinnedItems, PinnedItem, settings} from 'contexts'
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'
import { useRecoilValue } from 'recoil'
//types
import type {SpaceTypeProfile, SpaceTop} from 'contexts/spaces'


export type TopType = {
    id:number,
    synced_at:string,
    totalStaked:number,
    topCurators:Array<SpaceTop>
}

export const getStaticProps: GetStaticProps = async () => { 
    const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
    const supabaseKey = process.env.SERVICE_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey) 

    const { data:top, error:e } = await supabase
    .from('topSync')
    .select('*')
    .order('synced_at', {ascending: false})
    .limit(1)
    .single()

    if(e){
        return({
            notFound: true
        })
    }

     const { data, error } = await supabase
    .from('top')
    .select()
    .eq('syncId', top.id)
    .order('totalStaked', {ascending: false})
    
    if(error || !data){
         return({notFound:true})
    } 
    const entries = await Promise.all(data.map(async (item:any) => {
    return(await request('https://mirror-api.com/graphql', queryEntry, {
       digest: item.cid
    }).then((data:any) =>
      ({entry:data.entry, 
        staked:item.totalStaked,
        spaces:item?.spaces && item.spaces.slice(0,3) as SpaceTypeProfile[],
        totalCurators:item?.spaces && item.spaces.length        
    })
    ).catch((e)=>{console.log(e); return})
    )
  }))

    const entrieFiltered = entries.filter(function( element:any ) {
        return element !== undefined;
    });

    return {props: {entries: entrieFiltered, top:top},  revalidate: 10}
    
}

type Props = {
    entries: any;
    top:TopType
}


const Home = ({entries, top}:Props) => {
    
    const appSettings = useRecoilValue(settings)
    const pinnedList = useRecoilValueAfterMount(pinnedItems, null) //we set the items to null to prevent initial rendering with empty values and waiting for the list to load

    return (
        <Layout>
            <Box layout='flexBoxColumn'>
            <Header.Root controls={<Header.ViewControls/>}>
             <Box layout='flexBoxColumn' css={{width:'100%'}}>
                <Box layout='flexBoxRow'>
                    <Heading 
                    size={'h1'}
                    color={"foregroundText"}>
                        Explore&nbsp;
                    </Heading>
                    <Heading 
                    size={'h1'}
                    color={"highlight"}>
                        Top in 7 days
                    </Heading>
                    </Box>
                    <Header.TopCurators top={top}/>
                </Box>
            </Header.Root>
                {entries.length === 0 && (
                    <Box>
                        Nothing is here yet. Be first to curate && stake!
                    </Box>
                )}
                <Box css={{
                    display:appSettings.view === 'card' ? 'grid' : 'list',
                    gridColumnGap:'32px',
                    height:'fit-content',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gridTemplateRows: "repeat(auto, minmax(0, 1fr))",
                    width:'$body',
                    overflow:'visible',
                }}>
                    {entries.map((entry:any)=>{
                        if(pinnedList?.findIndex((item:PinnedItem)=>item.type === 'entry' && item.item.digest === entry.entry.digest) !== -1){
                            return;
                        } else {
                        return(
                        <CuratedArticle
                            key={'my_space_item_synced'+entry.entry.id+appSettings.view}
                            view={appSettings.view}
                            isPinned={true}
                            entry={entry.entry}
                            totalSpaces={entry.totalCurators}
                            isPreview={true}
                            stacked={entry.staked}
                            spaces={entry.spaces}
                            />
                        )
                        }
                    })}
                </Box>
            </Box>
        </Layout>
    )
}

export default Home

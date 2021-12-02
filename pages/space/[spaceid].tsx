import type { GetStaticProps} from 'next'
import {request} from 'graphql-request'
import { queryEntry } from 'src/queries';
import {spaceEntries, allSpaces} from 'src/queriesFEED'
 
import { ethers } from 'ethers';
import Layout from '@/design-system/Layout'
import CuratedArticle from '@/design-system/Curation/CuratedArticle'
import Dropzone from '@/design-system/Curation/Dropzone'
import Header from '@/design-system/Curation/Header'
import { useAuth } from 'contexts/user';

import type { ParsedUrlQuery } from 'querystring'
import type {EntryType} from '@/design-system/Entry'
import type {SpaceType} from 'contexts/spaces'

const spacesAddress = process.env.NEXT_PUBLIC_SPACES_CONTRACT;
const govAddress = process.env.NEXT_PUBLIC_GOV_CONTRACT;
const endpoint = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT

interface IParams extends ParsedUrlQuery {
    spaceid: string
}

export async function getStaticPaths() {
    if(!spacesAddress) return;
    if(!endpoint) return;

      const {spaces} = await request(endpoint, allSpaces)
      const paths = spaces.map((item:any)=>{
           return ({params: { spaceid:item.tokenId }})
     })
        return { paths, fallback: 'true' }
}



export const getStaticProps: GetStaticProps = async (ctx) => {
    const {spaceid} = ctx.params as IParams
    let id = spaceid

    if(!id){
        return({notFound:true})
    }
    if(!spacesAddress) return({notFound:true});
    if(!govAddress) return({notFound:true});
    if(!endpoint) return({notFound:true});
    
    const {space} = await request(endpoint, spaceEntries, {id:spaceid})

    const myspace:SpaceType = {
        tokenId:spaceid,
        name:space.name,
        avatarURL:space.avatarURL,
        owner:space.owner,
        totalStaked:space.totalStaked,
        createdAtTimestamp:space.createdAtTimestamp
    }
    const items = space.items.map(({entry, totalStaked}:any)=>{
        return {
            cid: entry.cid,
            staked: ethers.utils.formatEther(totalStaked.toString()),
            totalStaked: ethers.utils.formatEther(entry.totalStaked.toString())
        };
    })

    const entries = await Promise.all(items.map(async (item:any) => {
        return(await request('https://mirror-api.com/graphql', queryEntry, {
        digest: item.cid
        }).then((data) => { return ({entry:data.entry, staked:item.staked, totalStaked:item.totalStaked})}
        ).catch(()=>{return undefined})
        )
    }))
    const entriesFiltered:{entry:EntryType, staked:number}[] = entries.filter(function(element):element is {entry:EntryType, staked:number} {
        return element !== undefined;
    });
    
    return {
        props: {
            entries:entriesFiltered.reverse(),
            space:myspace
        },
        revalidate: 10
    }
}

type Props = {
    space: SpaceType,
    entries:any
}

const Space = ({space, entries}:Props) => {
    const {user} = useAuth();
    return (
        <Layout>           
            <Header space={space} 
            isOwner={user?.address?.toLowerCase() === space?.owner.toLowerCase() ? true : false}/>
            {entries.map((item:any)=>{
                return(
                      <CuratedArticle
                        key={'my_space_item_synced'+item.entry.id}
                        entry={item.entry}
                        isPreview={true}
                        stacked={item.staked}
                    />
                )
            })}
        </Layout>
    )
}

export default Space
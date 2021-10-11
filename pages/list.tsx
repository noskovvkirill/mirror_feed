import Layout from '@/design-system/Layout'
import Loader from '@/design-system/primitives/Loader'
import Article from '@/design-system/Article'
import Box from '@/design-system/primitives/Box'
import { readLaterList } from 'contexts';
import type {ReadingListItem} from 'contexts'
// import type { GetServerSideProps } from 'next'
// import type {Entry} from '@/design-system/Article'
import { request } from 'graphql-request';
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount';
import {queryEntry} from 'src/queries'
import useSWR from 'swr';
import {pinnedItems} from 'contexts'
import type {PinnedItem} from 'contexts'

const fetcher = async (digest:string) => await request('https://mirror-api.com/graphql', queryEntry, {digest:digest})

const EntryList = ({digest}:{digest:string}) =>{
    const {data, error, isValidating} = useSWR(digest, fetcher)
    if(!data || isValidating) return <></>
    if(error) return <></>
    return(
        <Article entry={data.entry}/> 
    )
}

const List = () => {
    const readingList = useRecoilValueAfterMount(readLaterList, null)
    const pinnedList = useRecoilValueAfterMount(pinnedItems, null) //we set the items to null to prevent initial rendering with empty values and waiting for the list to load

    if(!readingList || !pinnedList){
        return(
            <Layout>
                <Box css={{padding:'$2 calc($4 * 4 + $1)', boxSizing:'border-box', height:'48px', transition:'$all', color:'$foregroundText'}}>
                    <Loader size='default'/>
                </Box>
            </Layout>
        )
    }
    return(
        <Layout>
            {readingList.map((item:ReadingListItem)=>{
                 if(pinnedList.findIndex((itemP:PinnedItem)=>item.entryDigest === itemP.entry.digest) !== -1){
                      return;
                    } else {
                    return <EntryList digest={item.entryDigest} key={'readinglist'+item.entryDigest}/>
                }
            })}
        </Layout>
    )
}

export default List
//types
import type {CurationList} from 'contexts'
import type {GetServerSideProps} from 'next'

//data
import {getContributorsList} from 'src/publication-contents'
import useSWR from 'swr'
import {curationItems} from 'contexts'

//state
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'
import { useSetRecoilState } from 'recoil'

//components
import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import Space from '@/design-system/Spaces'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const {index} = ctx.query
    return {
        props: {
            index
        }
    }
}


const Spaces = ({index}:{index:string}) => {
    const curated = useRecoilValueAfterMount(curationItems, null)
    const setCurated = useSetRecoilState(curationItems)
    const {data:contributors} = useSWR(
        curated?.find((i:CurationList)=>i.title === index)?.publications !== [] ? [curated?.find((i:CurationList)=>i.title === index)?.publications]  //index is extra key to avoid [] empty key for multiple queries
        : null
    , getContributorsList, {
    onErrorRetry: (error, _, __, ___, { retryCount }) => {
    if (error.status === 404 || error.status === 403) return
    if (retryCount >= 2) return}})
     
    if(curated && curated.find((i:CurationList)=>i.title === index) && contributors){
        return(
            <Layout>
                 {(curated.find((i:CurationList)=>i.title === index)?.publications && contributors) && (
                    <Space 
                    setCurated={setCurated}
                    current={curated?.find((i:CurationList)=>i.title === index)?.publications || []}
                    currentSpace={index}
                    contributors={contributors}/>   
                 )}
            </Layout>
        )
     }
     return(
         <Layout>
             <Box css={{padding:'$2 calc($4 * 4 + $1)', boxSizing:'border-box', height:'48px', transition:'$all', color:'$foregroundText'}}>
                <>Patience</>
            </Box>
         </Layout>
     )
}

export default Spaces 
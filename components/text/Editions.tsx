import Box from '@/design-system/primitives/Box'
import Button from '@/design-system/primitives/Button'
import ExternalIcon from '@/design-system/icons/External'
import {styled} from 'stitches.config'
import {request} from 'graphql-request'
import useSWR from 'swr'
import { queryEditions } from 'src/queries'
//dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


const StyledProposal = styled('div', {
    width:'100%',
    maxWidth:'640px',
    height:'fit-content',
    // minHeight:'248px',
    background:'$background',
    borderRadius:'$2',
    padding:'$2',
    boxSizing:'border-box',
    hyphens:'auto',
    overflow:'hidden',
    'h3':{
        margin:'$2 0',
    },
    'p':{
        maxWidth:'95%',
        fontSize:'$6'
    },
    margin:'$4 0',
    boxShadow:'$normal'
    // wordBreak:'break-all'
})

const StyledLabel = styled('p',{
    width:'fit-content',
    fontSize:'$6',
    borderRadius:'$round',
    padding:'$0 $2',
    backgroundColor:'$highlight',
    color:'$foreground'
})

type EditionsProps = {
    editionId:number,
    editionContractAddress:string
}

const getEditions =  async (editionId:number, editionContractAddress:string) => {
    return await request('https://mirror-api.com/graphql', queryEditions, {editionId:editionId, editionContractAddress:editionContractAddress})
    .then((data)=>data.edition)

}   


const Editions = ({editionId, editionContractAddress}:{editionId:number, editionContractAddress:string}) => {
    
    const {data, error} = useSWR([editionId, editionContractAddress],getEditions, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            if (error.status === 404) return
             if (retryCount >= 2) return
        }
    })
   

    if(!data){
       return(
            <StyledProposal>
                Loading...
            </StyledProposal>
        )
      } 

    if(error){
       return(
            <StyledProposal>
                Something went wrong...
            </StyledProposal>
        )
    } 


    return(
        <StyledProposal>
            {data.title}
           {/* {data.price}
        //    {data.title} */}
        </StyledProposal>
    )
}

export default Editions
import Box from '@/design-system/primitives/Box'
import Button from '@/design-system/primitives/Button'
import ExternalIcon from '@/design-system/icons/External'
import {styled} from 'stitches.config'
import {request} from 'graphql-request'
import useSWR from 'swr'
import { queryProposal } from 'src/queries'
//dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import { Current } from 'contexts'
import {useRecoilValue} from 'recoil'

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
    color:'$foregroundText',
})

const getProposal =  async (cid:string) => await request('https://mirror-api.com/graphql', queryProposal, {cid:cid})
.then(item=>item.proposal)


const Proposal = ({cid}:{cid:string}) => {
    
    const {data, error} = useSWR(cid, getProposal)
    const currentArticle = useRecoilValue(Current)
   

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
            {data.status === 'ENDED' 
            ? <StyledLabel>Ended {dayjs(Number(data.endDate)).fromNow()}</StyledLabel>
            : <StyledLabel>Ends in {dayjs(Number(data.endDate)).fromNow()}</StyledLabel> 
            }
            <h3>{data.title}</h3>
            <p>{data.description}</p>
         
            <Box layout='flexBoxRow' css={{alignItems:'center'}}>
                {data.status === 'ENDED' 
                ?  <Button
                onClick={()=>{
                    //should check and open different link for personal publication, but not sure how to handle it now 
                    //cause they are not open to public yet
                    window.open(`https://${currentArticle?.publication.ensLabel}.mirror.xyz/token-race/${cid}`)
                }}
                >View the results&nbsp;<ExternalIcon/></Button>
                :  <Button>Participate $${data.tokenSymbol}</Button>
                }
                <Box as='p' css={{color:'$foregroundText'}}>{data.prompt}</Box>
            </Box>
        </StyledProposal>
    )
}

export default Proposal
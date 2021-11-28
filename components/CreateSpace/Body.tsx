import {styled} from 'stitches.config'
import Heading from '@/design-system/primitives/Heading'
import Info from '@/design-system/primitives/Info'
import Box from '@/design-system/primitives/Box'

const StyledBodyContainer = styled('div', {
    display:'flex',
    flex:'1 0',
    width:'100%',
    boxSizing:'border-box',
    position:'relative',
})
const StyledBody = styled('div',{
    display:'flex',
    width:'100%',
    boxSizing:'border-box',
    justifyContent:'space-between',
    flexDirection:'row',
    alignItems:'center',
    borderRadius:'$2',
    gap:'$1',
})



interface IBody {
    isDescription?:boolean
}

const Body = ({isDescription=true}:IBody) => {
    return(
        <StyledBodyContainer>
        <StyledBody>
            <Box layout='flexBoxRow' css={{alignItems:'center',  marginBottom:'$2', }}>
                <Heading size={'h3'} color={'foregroundText'}>Your curation space.</Heading><Heading css={{whiteSpace:'nowrap'}} 
                color={'highlight'}
                size='h3'>On-chain.</Heading>   
            </Box>
            <Info>
                <p>Mint your space (NFT) & collect the best content from Mirror protocol — share it with others or save it for yourself.
                Curation happens through staking — place tokens on top of the entries. </p>   
                <p>Entries with the most tokens are featured on the Explore page along with the top curators.</p>
                <p>Staked tokens generate rewards for the authors — tokens are distributed upon withdrawal.</p>
                <p>The curator can withdraw tokens after a week from the time of last staking per entry.</p>  
            </Info> 
          
        </StyledBody>
        </StyledBodyContainer>
    )
}

export default Body
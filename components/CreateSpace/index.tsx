import Body from '@/design-system/CreateSpace/Body'
import Mint from '@/design-system/CreateSpace/Mint' 
import {StyledContent, StyledOverlay,  Root, Trigger} from '@/design-system/primitives/Dialog'
import AddIcon from '@/design-system/icons/Add'

import {useAuth} from "contexts/user"
import {useSpace} from 'contexts/spaces'
import { styled } from 'stitches.config'

import type {TransactionResponse} from '@ethersproject/abstract-provider'

const StyledTrigger = styled(Trigger, {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    background:'none',
    borderRadius:'$round',
    border:'1px solid $foreground',
    color:'$foregroundText',
    padding:'$1', 
    transition:'$background',
    cursor:'pointer',
    '&:hover':{
        color:'$background',
        backgroundColor:'$foreground'
    },
    '&[data-state="open"]':{
        color:'$background',
        backgroundColor:'$foreground'
    } 
})

const StyledContainer = styled('div', {
    display:'flex',
    flexDirection:'column'
})



const CreateSpace = ({newSpaceCallback}:{newSpaceCallback:(tx:TransactionResponse)=>void;}) => { 

   const { user, UpdateBalance } = useAuth()
   const {  GrabTestBalance,
            CreateSpace, 
            Approve
        } = useSpace()
    
    return(
        <Root>
            <StyledOverlay/>
            <StyledTrigger><AddIcon/></StyledTrigger>
            <StyledContent>
                <StyledContainer>
                    <Body isDescription={false}/>
                    <Mint
                        newSpaceCallback={newSpaceCallback}
                        allowance={{gov:user?.allowance?.gov, space:user?.allowance?.space}}
                        balance={user?.balance || 0} 
                        UpdateBalance={UpdateBalance}
                        Approve={Approve}
                        GrabTestBalance={GrabTestBalance}
                        NewSpace={(name:string, avatarURL:string)=>{return CreateSpace(name, avatarURL)}}
                    />
             
                        
                </StyledContainer>
            </StyledContent>
        </Root>
    )
}

export default CreateSpace
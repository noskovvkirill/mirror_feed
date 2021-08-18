import {styled} from "stitches.config"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const StyledTrigger = styled(DropdownMenu.Trigger,{

})

const StyledContent = styled(DropdownMenu.Content,{

})

const StyledContentItem = styled(DropdownMenu.Item,{
    
})

const Profile = () =>{
    return(
        <DropdownMenu.Root>
            <StyledTrigger>
                Login
            </StyledTrigger>
            <StyledContent>
                <StyledContentItem>Metamask</StyledContentItem>
                <StyledContentItem>WalletConnect</StyledContentItem>
            </StyledContent>
        </DropdownMenu.Root>
    )
}

export default Profile
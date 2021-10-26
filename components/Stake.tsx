import {styled} from 'stitches.config'
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect } from 'react';
import Button from '@/design-system/primitives/Button'
import Box from '@/design-system/primitives/Box'
import Input from '@/design-system/primitives/Input'

const StyledTrigger = styled(Dialog.Trigger, {

})

const StyledContent = styled(Dialog.Content, {
    padding:'$2 $4',
    border:'1px solid $foregroundBorder',
    borderRadius:'$2',
    background:'$background',
    color:'$foregroundText',
    boxSizing:'border-box',
    width:'512px',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '&:focus': { outline: 'none' },
    'p':{}
})

const StyledOverlay = styled(Dialog.Overlay, {
 backgroundColor:'$background',
  opacity:0.65,
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
  },
})

const StyledTitle = styled(Dialog.Title, {
    fontSize:'$4',
    lineHeight:'$4',
})

const StyledDescription = styled(Dialog.Description, {

})


interface IStake {
    isOpen:boolean;
    setIsOpen:(newState:boolean) => void;
}

const Stake = ({isOpen, setIsOpen}:IStake) => {

    const myBalance = 5000;
    //TODO: manage localstorage to not to show again
    useEffect(()=>{
        console.log('change is open')
    },[isOpen])

    return(
        <Dialog.Root 
        open={isOpen}
        onOpenChange={setIsOpen}
        modal={true}>
            <StyledTrigger asChild>
                <Button>Stake</Button>
            </StyledTrigger>
            <StyledOverlay/>
            <StyledContent>
                <StyledTitle>Stake the tokens</StyledTitle> 
                <StyledDescription>
                </StyledDescription>
                <Box as='form' layout='flexBoxColumn'>
                    <p>How many tokens do you want to stake?</p>
                    <Input 
                    css={{width:'100%'}}
                    type='number' min={1} step={1} max={myBalance} 
                    placeholder={'Number of $FEED tokens'}/>
                    <span>Your balance: {myBalance}$FEED</span>
                    <Box layout='flexBoxRow'>
                        <Button type='submit'>Stake</Button>
                        <Dialog.Close asChild>
                            <Button>Close</Button>
                        </Dialog.Close>
                    </Box>
                </Box>

            </StyledContent>
        </Dialog.Root>
    )
}

export default Stake
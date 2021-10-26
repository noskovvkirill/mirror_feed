import {styled} from 'stitches.config'
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect } from 'react';
import Button from '@/design-system/primitives/Button'

const StyledContent = styled(Dialog.Content, {
    padding:'$2 $4',
    border:'1px solid $foregroundBorder',
    borderRadius:'$2',
    background:'$background',
    color:'$foregroundText',
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


interface IOnAddCurated {
    isOpen:boolean;
    setIsOpen:(newState:boolean) => void;
}

const OnAddCurated = ({isOpen, setIsOpen}:IOnAddCurated) => {

    //TODO: manage localstorage to not to show again
    useEffect(()=>{
        console.log('change is open')
    },[isOpen])

    return(
        <Dialog.Root 
        open={isOpen}
        onOpenChange={setIsOpen}
        modal={true}>
            <StyledOverlay/>
            <StyledContent>
                <StyledTitle>On-chain Curation</StyledTitle> 
                <StyledDescription>
                    <p>Curation happens locally or on-chain. Local items only visible to you.
                    Synced items are visible to everyone — they are part of your curation feed.</p>
                    <p>You stake your
                    tokens <b>($FEED)</b> to the contract to curate. Once event is registered, you can unstake them.</p>
                    <p>We recommed to do a bulk &quot;stacking&quot; and &quot;unstacking&quot;. You can
                        add tokens to the multiple items at once and unstake all the tokens once you
                        have enough tokens in the contract to justify the gas. 
                    </p>
                </StyledDescription>
                <Dialog.Close asChild>
                    <Button>Close</Button>
                </Dialog.Close>
            </StyledContent>
        </Dialog.Root>
    )
}

export default OnAddCurated
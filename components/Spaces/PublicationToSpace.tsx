///component in a progress


import * as Popover from '@radix-ui/react-popover';
import {StyledContent} from '@/design-system/Spaces/SpaceAdd'
import {styled} from 'stitches.config'
import AddIcon from '@/design-system/icons/Add'

export const StyledButton = styled(Popover.Trigger, {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    background:'none',
    borderRadius:'$round',
    border:'1px solid $foreground',
    color:'$foregroundText',
    transition:'$background',
    padding:'$1', 
    height:'fit-content',
    cursor:'pointer',
    '&:hover':{
        color:'$background',
        backgroundColor:'$foreground'
    },

    '&[data-state="open"]':{
        background:'$foreground',
        border:'1px solid $foreground',
        color:'$background'
    },
    variants:{
        isHighlighted:{
            true:{
                 border:'1px solid $foregroundBronze', 
                 color:'$foregroundTextBronze', 
                '&:hover':{
                    background:'$foregroundBronze',
                    color:'$backgroundBronze'
                },
                "&:disabled": {
                    background:'$foregroundBronze',
                    color:'$backgroundBronze'
                },
            },
            false:{
                  border:'1px solid $foreground', 
                  color:'$foregroundText', 
                  '&:hover':{
                    background:'$foreground',
                    color:'$background'
                },
            }
        },
    },
    defaultVariants:{
        isHighlighted:false
    }
})

const PublicationToSpace = () => {
    return(
        <Popover.Root>
             <StyledButton 
                            isHighlighted={true}
                            onClick={(e:React.SyntheticEvent)=>{
                                // e.preventDefault()
                                e.stopPropagation()
                               
                            }}
                            css={{transform:'scale(0.8)'}}>
                                    <AddIcon/>
                </StyledButton>
            <StyledContent>
                Add to the space
            </StyledContent>
        </Popover.Root>
    )
}

export default PublicationToSpace
import Button from '@/design-system/primitives/Button'
import {styled} from 'stitches.config'
import { ReactChild,useState } from 'react'
import * as Portal from '@radix-ui/react-portal';

const StyledControl = styled(Button,{
    border:'1px solid $foreground', 
    color:'$foregroundText', 
    borderRadius:'$round', 
    padding:'$1', 
    display:'flex',
    gap:'$0',
    alignItems:'center',
    fontSize:'$6',
    lineHeight:'$6',
    variants:{
        isHighlighted:{
            true:{
                 border:'1px solid $foregroundBronze', 
                 color:'$foregroundTextBronze', 
                '&:hover':{
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
        }
    },
     defaultVariants:{
        isHighlighted:false
    }
})

const ButtonControl = ({children, label, isHighlighted, onClick}:{children:ReactChild,label:string, isHighlighted:boolean, onClick: () => void;}) => {
    const [isHover, setIsHover] = useState(false)
    // if(isHover){
    //      <Portal.Root>
    //             <StyledControl
    //         onClick={onClick}
    //         onTouchStart={()=>setIsHover(true)} 
    //         onTouchEnd={()=>setIsHover(false)}
    //         onMouseEnter={()=>setIsHover(true)}
    //         onMouseLeave={()=>setIsHover(false)}
    //         isHighlighted={isHighlighted}>
    //             {children}
    //             {isHover && (
    //                 <>
    //                 ++{label}
    //                 </>
    //             )}
    //         </StyledControl>
    //      </Portal.Root>;
    // }
    return(
        //  <Portal.Root>
            <StyledControl
            // css={{position: isHover ? 'absolute' : 'relative'}}
            onClick={onClick}
            onTouchStart={()=>setIsHover(true)} 
            onTouchEnd={()=>setIsHover(false)}
            onMouseEnter={()=>setIsHover(true)}
            onMouseLeave={()=>setIsHover(false)}
            isHighlighted={isHighlighted}>
                {children}
                {isHover && (
                    <>
                    {label}
                    </>
                )}
            </StyledControl>
        // </Portal.Root>
    )
}

export default ButtonControl
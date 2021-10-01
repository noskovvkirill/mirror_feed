import Button from '@/design-system/primitives/Button'
import {styled} from 'stitches.config'
import { ReactChild,useState } from 'react'
import * as Portal from '@radix-ui/react-portal';
import {useRef, useEffect} from 'react';

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
    const [pos, setPos] = useState({x:-99999, y:-99999})

    return(
        <>
            <StyledControl
            css={{position:'relative'}}
            onClick={onClick}
            onTouchStart={()=>setIsHover(true)} 
            onTouchEnd={()=>setIsHover(false)}
            onMouseEnter={(e)=>{
                setIsHover(true)
                 const target = e.target as HTMLElement;
                const coord = target.getBoundingClientRect()
                setPos({x:coord.x+window.scrollX, y:coord.y+window.scrollY})
            
            }}
            onMouseLeave={()=>{
                setIsHover(false)
                setPos({x:-999999, y:-999999})
            }}
            isHighlighted={isHighlighted}>
                {children}
            </StyledControl>
            {isHover && (
             <Portal.Root>
                <StyledControl
                css={{
                position:'absolute', 
                background:'$foregroundBronze',
                color:'$backgroundBronze',
                pointerEvents:'none', top:0, left:0,
                transform:`translate(${pos.x}px, ${pos.y}px)`}}
                isHighlighted={true}
                >
                    {children}
                    {label}
                </StyledControl>
            </Portal.Root>
            )}
        </>
    )
}

export default ButtonControl
import Button from '@/design-system/primitives/Button'
import {styled} from 'stitches.config'
import { ReactChild,useState } from 'react'
import * as Portal from '@radix-ui/react-portal';

const StyledControl = styled(Button,{
    border:'1px solid $foreground', 
    color:'$foregroundText', 
    //this is rude, but for some reason simple height:33px doesn't work in Safari 
    height:'auto',
    minHeight:'33px',
    maxHeight:'33px',
    borderRadius:'$round', 
    transformOrigin:'center center',
    padding:'$1', 
    display:'flex',
    gap:'$0',
    overflow:'hidden',
    alignItems:'center',
    fontSize:'$6',
    boxSizing:'border-box',
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
        selected:{
            true:{
            },
            false:{
            }
        }
    },
    compoundVariants:[{
        selected:true,
        isHighlighted:true,
        css:{
              border:'1px solid $foregroundBronze', 
              background:'$foregroundBronze',
              color:'$backgroundBronze',
              //transition changed to make it more visually pleasant when ArticlePreview appears. 
              //default transition stands out and irritating for the eye 
               transition:  "background",
               transitionTimingFunction:'ease-in-out',
               transitionDuration:'1.0s',
              '&:hover':{
                border:'1px solid $foregroundBronze', 
                background:'$foregroundBronze',
                color:'$backgroundBronze'
              }
        }
    }],
     defaultVariants:{
        isHighlighted:false,
        selected:false,
    }
})

const Control = ({children, direction, label, pos}:{
    children:ReactChild,label:string, pos:{
        x:number, y:number
    },  direction?:'right' | 'left'
}) => {


    return(
        <Portal.Root>
                <StyledControl
                css={{
                position:'absolute', 
                background:'$foregroundBronze',
                color:'$backgroundBronze',
                pointerEvents:'none', top:0, left:direction === 'right' ? 0 : '-100%',
                transform:`translate(${pos.x}px, ${pos.y}px) translateX(${direction === 'right' ? 0 : -100}%)`
            }}
                isHighlighted={true}
                >   
                {direction === 'right' && (
                    <>
                    {children}
                    {label}
                    </>
                )}
                 {direction === 'left' && (
                    <>
                    {label}
                     {children}
                    </>
                )}
                    
                </StyledControl>
         </Portal.Root>
    )
}

const ButtonControl = (
    {children, selected, 
    direction='right',
    label, isHighlighted, onClick}:{children:ReactChild,label:string, direction?:'right' | 'left',selected?:boolean, isHighlighted:boolean, onClick?: () => void;
    }) => {
    const [isHover, setIsHover] = useState(false)
    const [pos, setPos] = useState({x:-99999, y:-99999})
    
    return(
        <>
            <StyledControl
            selected={selected}
            css={{position:'relative'}}
            onClick={onClick}
            onTouchStart={()=>setIsHover(true)} 
            onTouchEnd={()=>setIsHover(false)}
            onMouseEnter={(e)=>{
                setIsHover(true)
                 const target = e.target as HTMLElement;
                 const coord = target.getBoundingClientRect()
                 if(direction === 'right'){
                 setPos({x:coord.x+window.scrollX, y:coord.y+window.scrollY})
                 } else {
                     setPos({x:coord.x+window.scrollX+coord.width, y:coord.y+window.scrollY})
                 }
            }}
            onMouseLeave={()=>{
                setIsHover(false)
                setPos({x:-999999, y:-999999})
            }}
            isHighlighted={isHighlighted}>
                {children}
            </StyledControl>
            {isHover && (
                <Control direction={direction} label={label} pos={pos}>{children}</Control>
            )}
        </>
    )
}

export default ButtonControl
import {styled} from 'stitches.config'
import { motion} from 'framer-motion'
import { forwardRef, ReactElement } from 'react';

//dayjs
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

//types
import {Entry} from '@/design-system/Article'
import {ControlsInternal} from '@/design-system/Article/Controls'
import {BodyInternal} from '@/design-system/Article/Body'

const StyledContainer = styled('div',{
    display:'flex',
    flexDirection:'row',
    padding:'$4 $2',
    minHeight:'448px',
    margin:'calc($4 * 1) 0',
    color:'$text',
    width:'100vw',
    boxSizing:'border-box',
    borderRadius:'$2',
    transition:'$background',
    variants:{
        isHighlighted:{
            true:{
                backgroundColor:'$highlightBronze',
            },
            false:{
                backgroundColor:'$background',
            }
        },
        isPreview:{
            true:{
                maxWidth:'1152px', 
            },
            false:{
                maxWidth:'100%'
            }
        }
    },
    defaultVariants:{
        isHighlighted:false,
        isPreview:true
    }
})


//framer-motion component wrapping 

const StyledContainerComponent = forwardRef(function Component (props:any, ref:any) { return(
    <StyledContainer {...props} ref={ref} />)
});


const StyledContainerMotion = motion(StyledContainerComponent)




interface Container {
    children:[
        Controls:ReactElement<ControlsInternal>,
        Body:ReactElement<BodyInternal>
    ];
    entry:Entry;
    isPreview?:boolean;
    isHover:boolean;
    isFocused:boolean;
    isReadingList:boolean;
    setIsHover:(isHover:boolean)=>void;

}




const Container = forwardRef<HTMLElement, Container>(
    function Forward({
        entry, children, 
        isPreview=true, isHover, isFocused, 
        setIsHover}, ref)  {

    return(
            <StyledContainerMotion 
            initial={!isPreview ? {transform:`translateX(-10%)`} : false}
            animate={{opacity:1, position:'relative'}}
            exit={{opacity:0, position:'absolute'}}
            layout='position'
            layoutId={`layout-${entry.digest}`} //transitions animations using framer motion
            key={`key-${entry.digest}`} //transitions animations using framer motion
            id={`preview-${entry.digest}`}
            onTouchStart={()=>setIsHover(true)} 
            onTouchEnd={()=>setIsHover(false)}
            onMouseOver={()=>{
                setIsHover(true)     
            }} //we need this because if the cursor already located in the area of the component, it doesn't highlight (there is no enter event)
            onMouseEnter={()=>{
                setIsHover(true)     
            }}
            onMouseLeave={()=>{
                setIsHover(false)
            }}
            isPreview={isPreview}
            isHighlighted={!isPreview ? true : (isHover || isFocused ) ? true : false}
            ref={ref}>
                {children}
            </StyledContainerMotion>
    )
})


export default Container
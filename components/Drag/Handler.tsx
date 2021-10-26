import DragIcon from '@/design-system/icons/Drag'
import React from 'react'
import {styled} from 'stitches.config'


const StyledHandler = styled('button', {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    padding:'$1',
    boxSizing:'border-box',
    width:'33px',
    height:'33px',
    borderRadius:'$round',
    color:'$foreground',
    transition:'$background',
    '&:hover':{
           background:'$foregroundBronze',
            border:'1px solid $foregroundBronze',
            color:'$background',
    },
    variants:{
        isActive:{
            true:{
                background:'$foregroundBronze',
                border:'1px solid $foregroundBronze',
                color:'$background',
                cursor:'grabbing'
            },
            false:{
                background:'$highlightBronze',
                color:'$foregroundTextBronze',
                border:'1px solid $foregroungBronze',
                cursor:'grab',
            }
        }
    },
    defaultVariants:{
        isActive:false
    }    
})
const Handler = (props: {
    isActive?:boolean;
    role?:string;
    tabIndex?:number;
    'aria-pressed'?:boolean | undefined;
    'aria-roledescription'?:string;
    'aria-describedby'?: string;
}) => {
    return(
         <StyledHandler 
         isActive={props.isActive}
         {...props}>
             <DragIcon/>
        </StyledHandler>
    )
}

export default Handler
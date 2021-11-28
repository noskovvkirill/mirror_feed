import { StyledImage } from "@/design-system/text/TextParsing"
import {styled} from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import type {ReactPropTypes} from 'react'
import * as Portal from '@radix-ui/react-portal';
import {useState} from 'react'
import useLockBodyScroll from 'hooks/useLockBodyScroll'

const ImageFullScreen = ({setIsFullScreen, src}: {
    src:string,
    setIsFullScreen:(newState:boolean) =>void;
}) => {
    useLockBodyScroll()
    return(
        <Portal.Root>
             <Box 
             onClick={()=>setIsFullScreen(false)}
             css={{
                 position:'fixed',
                 backgroundColor:'rgba(0,0,0, .25)',
                 display:'flex', alignItems:'center', justifyContent:'center', boxSizing:'border-box', width:'100vw', height:'100vh'}} >
                <StyledImage loading='lazy' src={src} inline={false}/>
            </Box>
        </Portal.Root>
    )
}

const StyledImageFull = (props:ReactPropTypes & {src:string}) => {
    const [isFullScreen, setIsFullScreen] = useState(false)
    if(isFullScreen){
       return(<ImageFullScreen src={props.src} setIsFullScreen={setIsFullScreen}/>
       )
    }
    return(
        <Box>
            <StyledImage loading='lazy' {...props} inline={false}/>
        </Box>
    )
}

export default StyledImageFull
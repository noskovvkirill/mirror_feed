import { StyledImage } from "@/design-system/text/TextParsing"
import {styled} from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import ButtonControl from '@/design-system/primitives/ButtonControl'
import PinIcon from '@/design-system/icons/Pin'
import UnPinIcon from '@/design-system/icons/UnPin'
import { PinnedItem, pinnedItems, PinnedItemAttachment } from "contexts"
import type {ReactPropTypes} from 'react'
import { useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'
import { useSetRecoilState } from "recoil"
import * as Portal from '@radix-ui/react-portal';
import {useState} from 'react'
import useLockBodyScroll from 'hooks/useLockBodyScroll'
const StyledMetadata = styled('div', {
    position:'absolute',
    left:0,
    top:0,
    padding:'$4 $2',
})

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
    const pinnedList = useRecoilValueAfterMount(pinnedItems, null)
    const setPinnedList = useSetRecoilState(pinnedItems)
    const [isFullScreen, setIsFullScreen] = useState(false)
    
    if(isFullScreen){
       return(<ImageFullScreen src={props.src} setIsFullScreen={setIsFullScreen}/>
       )
    }

    const Pin = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setPinnedList((prevState:PinnedItem[])=>{
            const newItem: PinnedItemAttachment={
                type:'attachment',
                id:prevState.length>0 ? prevState[prevState.length-1].id+1 : 0,
                item:{
                    mimeType:'image',
                    url:props.src
                }
            }
            return [...prevState, newItem]
            
        })
    }
    const UnPin =  (e:React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setPinnedList((prevState:PinnedItem[])=>{
                    const indexUnPin = prevState.findIndex((itemP:PinnedItem)=>{
                        if(itemP.type === 'attachment'){
                            if(itemP.item.url === props.src) return true
                        } else return false 
                })
                    const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                    return newArray
        })
    }

    if(pinnedList) {
    return(
    <Box css={{position:'relative'}} onClick={()=>setIsFullScreen(true)}>
        <StyledMetadata>
            {pinnedList.findIndex((item)=>item.type === 'attachment' && item.item.url === props.src) !== -1
            ? <ButtonControl 
            selected={true}
            isHighlighted={true}
            label='unpin image'
            onClick={UnPin}><UnPinIcon/></ButtonControl>
            :<ButtonControl 
            isHighlighted={false}
            label='pin image'
            onClick={Pin}><PinIcon/></ButtonControl>
            }
           
    </StyledMetadata>
            <StyledImage loading='lazy' {...props} inline={false}/>
    </Box>)
    } else return (
        <Box>
            <StyledImage loading='lazy' {...props} inline={false}/>
        </Box>
    )
}

export default StyledImageFull
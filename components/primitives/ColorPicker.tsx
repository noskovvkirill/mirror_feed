import { ColorPicker, Color } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import {styled} from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import {useState, useRef, useCallback} from 'react'
import {useOnClickOutside} from 'hooks/useClickOutside'

interface IColorPicker {
    color:Color, 
    setColor:any
}

const StyledPicker = styled('button', {
    border:'0',
    width:'$2',
    borderRadius:'$round',
    height:'$2'
})

const Picker = ({color, setColor}:IColorPicker) => {
    const [isOpen, setIsOpen] = useState(false)
    // const [pos, setPos] = useState({x:-9999, y:-9999})
    const ref = useRef<any>()

    const toggleOpen = useCallback(()=>setIsOpen(false), [])
    useOnClickOutside(ref, toggleOpen)

    return(
        <Box layout='flexBoxRow'>
            <StyledPicker 
            onClick={()=>{
                setIsOpen(!isOpen)
            }}
            css={{background:color.hex}}/> 
                {isOpen && (
                        <Box ref={ref} css={{position:'absolute', zIndex:'1000000000', width:'100%', height:'100%'}}>
                            <ColorPicker width={256} height={128} color={color} onChange={setColor} hideHSV dark />
                        </Box>
                )}
        </Box>
    )
}

export default Picker
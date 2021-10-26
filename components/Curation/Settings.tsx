import { useState } from "react"
import Box from '@/design-system/primitives/Box'
import ButtonControl from '@/design-system/primitives/ButtonControl'
import HideIcon from '@/design-system/icons/Hide'
import ShowIcon from '@/design-system/icons/ArrowDown'
import Stake from '@/design-system/Stake'
import {styled} from 'stitches.config'

interface ISpaceSettings {
    title:string
}

const SpaceSettings = ({title}:ISpaceSettings) => {
    const [isOpen, setIsOpen] = useState(true)
    const [isStake, setIsStake] = useState(false)
    const entries = 100
    const earned = 1000
    return(
        <Box layout='flexBoxColumn' css={{width:'100%', alignItems:'flex-end'}}>
            <Box layout='flexBoxColumn' css={{
            position:'relative',
            right:'-$1',
            width:'256px', 
            height:'fit-content',
            color:'$text',
            background:'$highlight', borderRadius:'$2', padding:'$2'}}>
                <Box layout='flexBoxRow' css={{
                    justifyContent:'space-between',
                    alignItems:'center'}}>
                    <h5>{title}</h5>
                    <ButtonControl 
                    onClick={()=>setIsOpen(!isOpen)}
                    isHighlighted={false} label={!isOpen ? 'hide' : 'show'}>
                        {isOpen  ? <HideIcon/> : <ShowIcon/>}
                    </ButtonControl>
                </Box>
                {isOpen && (
                    <>
                    <Box layout='flexBoxColumn' css={{color:'$foregroundText'}}>
                        <span>Entries: {entries}</span>
                        <span>Tokens earned: {earned}</span>
                    </Box>
                    <Stake isOpen={isStake} setIsOpen={setIsStake}/>
                    </>
                )}
            </Box>
        </Box>
    )
}

export default SpaceSettings
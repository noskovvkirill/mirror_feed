import { useState } from "react"
import Box from '@/design-system/primitives/Box'
import ButtonControl from '@/design-system/primitives/ButtonControl'
import HideIcon from '@/design-system/icons/Hide'
import ShowIcon from '@/design-system/icons/ArrowDown'
import Stake from '@/design-system/Stake'
import {styled} from 'stitches.config'

//types
import type {UserType} from 'contexts/user'
import type {SpaceType} from 'contexts/spaces'

interface ISpaceSettings {
    user:UserType;
    space:SpaceType;
}

const SpaceSettings = ({user, space}:ISpaceSettings) => {
    const [isOpen, setIsOpen] = useState(true)
    const [isStake, setIsStake] = useState(false)
    const entries = 100
    const earned = 1000
    return(
        <Box layout='flexBoxColumn' css={{width:'100%', alignItems:'flex-end'}}>
            <Box layout='flexBoxColumn' css={{
            position:'relative',
            right:'$3',
            width:'256px', 
            height:'fit-content',
            color:'$text',
            border:'1px solid $foregroundBorder',
            background:'$background', borderRadius:'$2', padding:'$2'}}>
                <Box layout='flexBoxRow' css={{
                    justifyContent:'space-between',
                    alignItems:'center'}}>
                    <Box as='h5' css={{color:'$foregroundText'}}>{space.title}</Box>
                    <ButtonControl 
                    direction={"left"}
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
                        <span>Staked: {space.totalStacked} </span>
                        <span>Timelock {space.timelock}</span>
                    </Box>
                    <Stake isOpen={isStake} setIsOpen={setIsStake}/>
                    </>
                )}
            </Box>
        </Box>
    )
}

export default SpaceSettings
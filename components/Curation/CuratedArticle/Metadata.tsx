import {styled} from 'stitches.config'
//components
import Tag from '@/design-system/primitives/Tag'
import LinkIcon from '@/design-system/icons/Link'
import Box from '@/design-system/primitives/Box'
import AddIcon from '@/design-system/icons/Add'
import DecreaseIcon from '@/design-system/icons/Decrease'
import ProfileList from '@/design-system/primitives/ProfileList'
//types
import type {EntryType} from '@/design-system/Entry'
import type {SpaceTypeProfile} from 'contexts/spaces'
//utiles
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
//
import StakeExtraTokens from '@/design-system/StakeTokens/ExtraStake'
import {useState} from 'react'

const StyledMetadata = styled('div', {
    display:'flex',
    position:'relative',
    top:'calc($1 / 2)',
    gap:'$0', 
    alignItems:'center',
    justifyContent:'space-between',
    marginBottom:"$1"
})

const StyledStakeContainer = styled('div', {
    display:'flex',
    position:'absolute',
    top:'0',
    right:'0',
    flexDirection:'row',
    alignItems:'center',
    gap:'$1'
})

const StyledStake = styled('div', {
    display:'flex',
    gap:'$1',
    padding:'$0 $2',
    alignItems:'center',
    justifyContent:'center',
    fontSize:'$6',
    borderRadius:'$2',
    // backgroundColor:'$tintBronze',
    variants:{
        isHighlighted:{
             true:{
                backgroundColor:'$foregroundTintBronze',
                color:'$foregroundTextBronze',
            },
            false:{
                  backgroundColor:'$highlight',
                  color:'$foregroundText',
            },
        }
    }
})

const StyledAdd = styled('button', {
    border:'0',
    padding:'2px $1',
    borderRadius:'$2',
    background:'$foregroundBronze',
    cursor:'pointer',
    height:'fit-content',
    margin:'0',
    position:'relative',
    // marginRight:'$2',
    '&:before':{
        content: '',
        position: 'absolute',
        width: '48px',
        height: '38px',
        top: '-6px',
        left: '-8px',
    },
    variants:{
        isHighlighted:{
             true:{
                backgroundColor:'$foregroundTintBronze',
                color:'$foregroundTextBronze',
            },
            false:{
                  backgroundColor:'$highlight',
                  color:'$foregroundText',
            },
        }
    },
    '&:hover':{
          backgroundColor:'$foregroundBronze',
          color:'$background'
    }
})

interface IMetadata {
    stacked:number;
    isPreview?:boolean;
    isHover:boolean,
    isFocused:boolean;
    entry:EntryType,
    spaces?:SpaceTypeProfile[],
    SetStakeSelected?:(entry:EntryType)=>void;
}


const Metadata = (
    {stacked, spaces, isPreview, isHover, isFocused, entry,
    SetStakeSelected,
    }:IMetadata) => {
    return(
        <StyledMetadata>
            <Box layout='flexBoxRow'>
                <Tag isHighlighted={(isHover || isFocused || !isPreview) ? true : false}>{entry.author?.displayName ? entry.author.displayName : entry.author?.address?.slice(0,8)}</Tag>
                <Tag isHighlighted={(isHover || isFocused || !isPreview) ? true : false}>{dayjs.unix(entry.timestamp).fromNow() }</Tag>
                {entry.publication?.ensLabel && (
                        <Tag isHighlighted={(isHover || isFocused) ? true : false} css={{backgroundColor:'transparent', padding:'0 $1', cursor:'pointer'}} as='a' rel="noreferrer" href={`https://${entry.publication?.ensLabel}.mirror.xyz/${entry.digest}`} target='_blank'><LinkIcon/></Tag>
                )}
                {!entry.publication?.ensLabel && (
                        <Tag isHighlighted={(isHover || isFocused) ? true : false} css={{backgroundColor:'transparent', padding:'0 $1', cursor:'pointer'}} as='a' rel="noreferrer" href={`https://mirror.xyz/${entry.author.address}/${entry.digest}`} target='_blank'><LinkIcon/></Tag>
                )}
            </Box>

            <StyledStakeContainer>
                <StyledStake isHighlighted={(isHover || isFocused || !isPreview) ? true : false}>
                    <Box css={{ fontSize:'$6'}}> {stacked}&thinsp;●</Box>
                </StyledStake>
                {spaces
                ?   <ProfileList 
                    key={entry.id}
                    size={'sm'} profiles={spaces}/>   
                :   
                <>
                    {SetStakeSelected && (
                        <Box layout='flexBoxRow' css={{gap:'$1'}}>
                            <StyledAdd 
                            onClick={()=>SetStakeSelected(entry)}
                            isHighlighted={(isHover || isFocused || !isPreview) ? true : false}>
                            <Box css={{transform:'scale(1) translateY(5%)'}}> <AddIcon/></Box>
                            </StyledAdd>
                            <StyledAdd 
                            css={{marginRight:'$2'}}
                            isHighlighted={(isHover || isFocused || !isPreview) ? true : false}>
                            <Box css={{transform:'scale(1) translateY(5%)'}}> <DecreaseIcon/></Box>
                            </StyledAdd>
                        </Box>
                    )}
        
                </>
                }
               
            </StyledStakeContainer>


            {/* <StakeExtraTokens
            
            /> */}

        </StyledMetadata>
    )
}

export default Metadata
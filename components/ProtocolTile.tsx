/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { styled, fontWeightAnimation} from 'stitches.config'
import Box from '@/design-system/primitives/Box'

export type Protocol = {
    name: string,
    totalProposals: number;
    totalVotes: number;
    uniqueVoters: number;
    icons:Icon[]
}

type Icon = {
    size: string,
    url: string
}

const StyledProtocolContainer = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '$1',
    lineHeight:'100%',
    padding: '$1',
    borderRadius: '$1',
    overflow: 'hidden',
    justifyContent:'space-between',
    cursor:'pointer',
    wordWrap:'break-word',
    wordBreak:'break-all',
    textTransform:'uppercase',
    '&:hover':{
        animation: `${fontWeightAnimation} 2s`,
        animationFillMode: 'forwards',
        color:'green',
        backgroundColor:'lightgreen',
        border:'1px solid green'
    }
})

const StyledProtocolInfo = styled('ul',{
    padding: '0',
    margin: '0',
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'row',
    flexWrap:'wrap',
    gap: '$0',
})

const StyledProtocolInfoItem = styled('li',{
    padding:'$0',
    border:'1px solid',
    borderRadius:'$1'
})

//  mapping function
// const scale = (number:number, inMin:number, inMax:number, outMin:number, outMax:number) => {
//     return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
// }
const clamp = (x:number, m:number, M:number) => Math.min(M, Math.max(x, m));
const charToColor = (text:string) => {
    const numbers = text.split('').map(char=>{
        return(char.charCodeAt(0) - 64)
    })
    const sum = numbers.reduce((acc,value)=>acc+value)
    return clamp(sum, 0, 960)
}

const ProtocolTile = ({name, totalProposals, icons, totalVotes, uniqueVoters}:Protocol) =>{
    return(
        <StyledProtocolContainer
            css={{
                backgroundColor:`hsl(${charToColor(name)}, 67%, 96%)`,
                color: `hsl(${charToColor(name)}, 75%, 57%)`,
                border: `1px solid hsl(${charToColor(name)}, 75%, 93%)`,
                fontSize:`clamp(1rem, ${totalProposals/100}vw, 4rem)`,
                width: `${clamp(totalProposals*2, 128, 768)}px`,
                height: `${clamp(totalProposals*2, 128, 768)}px`,
            }}>
            <Box layout='flexBoxRow' css={{alignItems:'center'}}>
                { icons 
                && (<img
                alt={name+'icon'}
                width='16px' height='16px' src={icons[0].url} />)}{name}
            </Box>
            <StyledProtocolInfo as="ul">
                <StyledProtocolInfoItem as="li">{totalProposals}</StyledProtocolInfoItem>
                <StyledProtocolInfoItem as="li">{totalVotes}</StyledProtocolInfoItem>
                <StyledProtocolInfoItem as="li">{uniqueVoters}</StyledProtocolInfoItem>
            </StyledProtocolInfo>
        </StyledProtocolContainer>
    )
}

export default ProtocolTile
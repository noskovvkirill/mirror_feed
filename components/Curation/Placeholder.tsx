import Box from '@/design-system/primitives/Box'
import Heading from '@/design-system/primitives/Heading'

const Placeholder = () => {
    return(
            <Box 
            layout='flexBoxRow'
            css={{
            color:'$foreground', 
            height:'100%',
            position:'relative',
            alignItems:'flex-start', 
            justifyContent:'flex-start',
            width:'100%',
            padding:'0'}}>
                <Box css={{padding:'calc($4 * 1 + $1)'}}><Heading color={'foregroundText'} size={'h5'}>Add your first item from <br/> Pinned List</Heading></Box>
                <Box css={{
                position:'absolute', 
                top:'0',
                left:'0',
                display:'flex',
                color:'$foreground',
                opacity:1,
                mixBlendMode:'multiply',
                alignItems:'center',
                justifyContent:'center',
                boxSizing:'border-box',
                zIndex:1,
                padding:'0', width:'100%', height:'100%'}}>
                    {/* <Bg/> */}
                </Box>
            </Box>
    )
}

export default Placeholder


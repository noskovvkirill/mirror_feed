import {useRef} from 'react'
import {styled} from 'stitches.config'
//components
import Box from '@/design-system/primitives/Box'

const StyledContainerPlaceholder = styled('div', {
    width:'fit-content',
    padding:'$4', 
    height:'100%', 
    alignItems:'flex-start',
    color:'$foregroundText',
    boxSizing:'border-box',
    display:'flex',
    flexDirection:'row'
})

const PlaceHolderEmptySpace = () => {
    const video = useRef<HTMLVideoElement | null>(null)
    return(
          <StyledContainerPlaceholder>
                    <Box css={{backgroundColor:'$highlight', borderRadius:'$2', width:'fit-content'}}>
                        <Box css={{width:'320px', 
                        overflow:'hidden',
                        opacity:0.75,
                        mixBlendMode:'multiply'}}>
                        <video 
                        ref={video}
                        width='100%'
                        onEnded={()=>{
                            setTimeout(()=>{
                                if(video.current) video.current.play()
                            },2000)
                        }}
                        src='/try2.mp4' autoPlay muted/>
                        </Box>
                    </Box>
                    <Box as='span' css={{maxWidth:'256px', padding:'0',textAlign:'center'}}>
                        Connect your wallet to create/open the space
                    </Box>
            </StyledContainerPlaceholder>
    )
}

export default PlaceHolderEmptySpace
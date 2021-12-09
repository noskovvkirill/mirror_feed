import {m} from 'framer-motion'
import {styled} from 'stitches.config'
import { forwardRef } from 'react';

const StyledContent = styled('div', {
    padding:'0',
    display:'flex',
    flexDirection:'column',
    // border:'1px solid $foregroundBorder',
    borderRadius:'$2',
    // overflow:'hidden',
    transformOrigin:'center',
    background:'$background',
    color:'$foregroundTextBronze',
    width:'556px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '&:focus': { outline: 'none' },
    'p':{}
})

const StyledContentComponent = forwardRef(function Component (props:any, ref:any) { return(
    <StyledContent {...props} ref={ref} />)
});


const StyledContentMotion = m(StyledContentComponent)

export default StyledContentMotion
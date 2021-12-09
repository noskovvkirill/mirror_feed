
//work in a progress

import {styled} from 'stitches.config'
import Box from "@/design-system/primitives/Box"
import {useState} from 'react'
import { createPortal } from 'react-dom'
import SearchIcon from '@/design-system/icons/Search'
import ArcIcon from '@/design-system/icons/Arc'
import PointIcon from '@/design-system/icons/Point'
import ButtonControl from '@/design-system/primitives/ButtonControl'
import useLockBodyScroll from 'hooks/useLockBodyScroll'
import { useOnClickOutside } from 'hooks/useClickOutside'
import {useRef} from 'react'
import Search from '@/design-system/Search'
import ExploreIcon from '@/design-system/icons/Explore'

const StyledPortal = styled('button', {
    width:'36px',
    height:'36px',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    border:'0',
    background:'white',
    borderRadius:'$round',
    boxSizing:'border-box'
})

const StyledLabelButton = styled('button', {
    background:'$foreground',
    color:'$text',
    border:'0',
    borderRadius:'$2',
    whiteSpace:'nowrap',
    padding:'$1 $2',
    fontSize:'$6',
    cursor:'pointer',
    transition:'$background',
    '&:hover':{
        backgroundColor:'$foregroundBronze',
        color:'$background'
    }
})

const degreeToRadian = (degree:number) => {
    const pi = Math.PI;
  return degree * (pi/180);
};

const PortalBody = ({size, pos, setIsOpen, setIsSearch}:any) => {
    const ref=useRef(null)
    useLockBodyScroll()
    useOnClickOutside(ref, ()=>setIsOpen(false))
    const step = 45

    const CalculateAngle = (index:number, rad:number, step:number) => {
        const angle = index*step;
        console.log('angle', angle)
        const a = Math.sin(degreeToRadian(angle))*rad;
        const b = Math.cos(degreeToRadian(angle))*rad;
        console.log('index', index, 'rad', rad, 'a', a, 'b', b)
        return {x:a , y:b }
    }


    return(
    <>
                   {typeof window !== 'undefined' && (
                        <>
                        {createPortal(
                            <Box 
                            ref={ref}
                            css={{
                            display:'flex',
                            zIndex:'100',
                            alignItems:'center',
                            justifyContent:'center',
                            width:size.x*2+'px',
                            height:size.y*2+'px',
                            borderRadius:'50%',
                            boxSizing:'border-box',
                            transform:'translate(-50%, -50%)',
                            color:'red', 
                            position:'absolute', top:pos.y, left:pos.x, 
                            background:'$highlight'
                            }}>
                                   <StyledPortal onClick={(e)=>{setIsOpen(false)}}>
                                        <ArcIcon/>
                                   </StyledPortal>
                                {/* {new Array(45).fill(true).map((_, index:number)=>{
                                    return(
                                          <Box key={index} css={{
                                                position:'absolute',
                                                transform:'translateX(-50%) translateY(-50%)', 
                                                transformOrigin:'center center', 
                                                top:size.y+CalculateAngle(index, size.x,5).y+'px',
                                                left:size.x+CalculateAngle(index, size.x,5).x+'px',
                                          }}>
                                                •
                                        </Box>
                                    )
                                })} */}
                              
                                    <Box layout='flexBoxRow' 
                                    css={{
                                    transform:'translateX(-50%) translateY(-50%)', 
                                    transformOrigin:'center center', 
                                    top:size.y+CalculateAngle(3, size.x, step).y+'px',
                                    left:size.x+CalculateAngle(3, size.x, step).x+'px',
                                    maxWidth:'100%', 
                                
                                        position:'absolute'}}>
                                     
                                        <ButtonControl  
                                        onClick={()=>setIsSearch(true)}
                                        isHighlighted={false} label='search'>
                                            <SearchIcon/>
                                        </ButtonControl>
                                    </Box>

                                    <ButtonControl 
                                     isHighlighted={false}
                                     label='Explore'
                                    css={{
                                    transform:'translateX(-50%) translateY(-50%)', 
                                    transformOrigin:'center center', 
                                    top:size.y+CalculateAngle(0, size.x, step).y+'px',
                                    left:size.x+CalculateAngle(0, size.x, step).x+'px',
                                    position:'absolute'}}>
                                        <ExploreIcon/>
                                    </ButtonControl>

                                    <ButtonControl 
                                        css={{
                                           transform:'translateX(-50%) translateY(-50%)', 
                                    transformOrigin:'center center', 
                                    top:size.y+CalculateAngle(1, size.x, step).y+'px',
                                    left:size.x+CalculateAngle(1, size.x, step).x+'px',
                                         
                                         maxWidth:'100%', 
                                         position:'absolute'
                                        }}
                                        isHighlighted={false}
                                        label='My Space'>
                                            LP
                                        </ButtonControl> 
                                    
                                     <ButtonControl 
                                     css={{
                                           transform:'translateX(-50%) translateY(-50%)', 
                                    transformOrigin:'center center', 
                                    top:size.y+CalculateAngle(2, size.x, step).y+'px',
                                    left:size.y+CalculateAngle(2, size.x, step).x+'px',
                                           maxWidth:'100%',
                                        position:'absolute'}}
                                        isHighlighted={false}
                                        label='My Space'>
                                            <PointIcon/>
                                    </ButtonControl>

                                   
                                 
                               

                            </Box>, 
                            document.body)}
            </>
            )}
    </>
    )
}

const Portal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [pos, setPos] = useState({x:-9999, y:-9999})
    const [size, setSize] = useState({x:0, y:0}) 
    const [isSearch, setIsSearch] = useState(false)

    return(
        <Box css={{}}>
            <StyledPortal 
            onClick={(e)=>{
                setIsOpen(!isOpen)
                 const target = e.target as HTMLElement;
                 const coord = target.getBoundingClientRect()
                //  setPos({x:coord.x+window.scrollX+coord.width, y:coord.y+window.scrollY})
                const sizeValue = coord.x>coord.y ? coord.x : coord.y
                setSize({x:sizeValue-8, y:sizeValue-8})
                setPos({x:coord.x+window.scrollX+coord.width/2, y:coord.y+window.scrollY+coord.height/2})  

            }}
           >
                <ArcIcon/>
            </StyledPortal>
                {isOpen && (
                    <PortalBody setIsSearch={setIsSearch} size={size} pos={pos} setIsOpen={setIsOpen}/>
                )}
                {isSearch && (
                        <Search setIsOpen={setIsSearch}/> 
                )}
        </Box>
    )
}

export default Portal
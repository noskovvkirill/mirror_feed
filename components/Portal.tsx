
//work in a progress

import {styled, keyframes} from 'stitches.config'
import {useState} from 'react'


import SearchIcon from '@/design-system/icons/Search'
import ArcIcon from '@/design-system/icons/Arc'
import PointIcon from '@/design-system/icons/Point'
import MainIcon from '@/design-system/icons/Main'
import ButtonControl from '@/design-system/primitives/ButtonControl'
import {useRouter} from 'next/router'
import Search from '@/design-system/Search'
import ExploreIcon from '@/design-system/icons/Explore'
import {portalState} from 'contexts'
import {useRecoilState} from 'recoil'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';



const AnimationContentDisplay = keyframes({
    '0%':{opacity:0, transform:`scale(1) `},
    '100%':{opacity:1, transform:`scale(1)`}
})


const StyledCurationButton = styled(DropdownMenu.Trigger, {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    background:'none',
    borderRadius:'$round',
    border:'1px solid $foregroundBorder',
    color:'$foregroundText',
    padding:'$1', 
    transition:'$background',
    cursor:'pointer',
    '&:hover':{
        color:'white',
        background: 'radial-gradient(50% 50% at 50% 50%, $foregroundBronze 48.96%, rgba(255,255,255,0.1) 100%)',
        fill:'white',
        'path':{
            fill:'white'
        }
    },
    variants: {
        isOpen:{
            true:{
                color:'white',
                background: 'radial-gradient(50% 50% at 50% 50%, $foregroundBronze 48.96%, rgba(255,255,255,0.1) 100%)',
                fill:'white',
                'path':{
                    fill:'white'
                }
            },
            false:{}
        }
    },
    defaultVariants:{
        isOpen:false
    }
})




const StyledContainer = styled(DropdownMenu.Content, {
    display:'flex',
    flexDirection:'column',
    zIndex:'100',
    alignItems:'center',
    justifyContent:'center',
    boxShadow:'$large',
    gap:'$1',
    boxSizing:'border-box',
    padding:'$1',
    borderRadius:'$2',
    color:'red', 
    position:'absolute',
    border:'1px solid $foregroundBorder',
    background:'$background',
    '@media (prefers-reduced-motion: no-preference)': {
        '&[data-state="open"]': {
            animationName:`${AnimationContentDisplay}`,
            animationDuration: '400ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode:'forwards',
            willChange: 'transform, opacity'
        }
    }
})





const PortalBody = ({setIsSearch, setIsOpen}:any) => {
    const router = useRouter()
    return(

                <StyledContainer 
                sideOffset={-42}>
                    <StyledCurationButton as={'button'} isOpen={true}>
                        <ArcIcon/>
                    </StyledCurationButton>
 
                    <DropdownMenu.Item
                    onSelect={()=>router.push('/')}
                    >
                        <ButtonControl 
                            isHighlighted={router.pathname==='/' ? true :false}
                            selected={router.pathname==='/' ? true :false}
                            label='Home'
                        >
                            <MainIcon/>
                        </ButtonControl>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={()=>router.push('/explore')}>
                        <ButtonControl 
                            isHighlighted={router.pathname==='/explore' ? true :false}
                            selected={router.pathname==='/explore' ? true :false}
                            label='Explore'
                        >
                            <ExploreIcon/>
                        </ButtonControl>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={()=>router.push('/my')}>
                        <ButtonControl 
                        isHighlighted={router.pathname==='/my' ? true :false}
                        selected={router.pathname==='/my' ? true :false}
                        label='My Space'>
                            <PointIcon/>
                        </ButtonControl>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={()=>{
                        setIsOpen(false)
                        //radix focuses on dropdown trigger by default
                        // it breaks the focus on the search input field 
                        setTimeout(()=>{
                            setIsSearch(true)
                        },100)
                    }}>
                        <ButtonControl  
                        isHighlighted={false} 
                        label='search'>
                            <SearchIcon/>
                        </ButtonControl>
                    </DropdownMenu.Item>
                </StyledContainer>
       
    )
}

const Portal = () => {
    const [isOpen, setIsOpen] = useRecoilState(portalState)
    const [isSearch, setIsSearch] = useState(false)
    return(
        <>
            <DropdownMenu.Root open={isOpen} onOpenChange={(open:boolean)=>setIsOpen(open)}>
                <StyledCurationButton>
                    <ArcIcon/>
                </StyledCurationButton>
                <PortalBody
                    setIsOpen={setIsOpen}
                    setIsSearch={setIsSearch}
                />
            </DropdownMenu.Root>
            {isSearch && (
                <Search setIsOpen={setIsSearch}/> 
            )}
        </>
    )
}

export default Portal
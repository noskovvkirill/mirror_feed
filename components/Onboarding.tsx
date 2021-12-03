import {styled} from 'stitches.config'
import Remove from '@/design-system/icons/Remove'
import PinnedIcon from '@/design-system/icons/Pin'
import AddIcon from '@/design-system/icons/Add'

import {useState, useEffect, useLayoutEffect, useRef} from 'react'
import Button from '@/design-system/primitives/Button'
import Box from '@/design-system/primitives/Box'
import useLockBodyScroll from 'hooks/useLockBodyScroll'
import {useRouter} from 'next/router'
// import Image from 'next/image'
import {portalState} from 'contexts'
import {useRecoilState} from 'recoil'
import {overlayShow} from 'stitches.config'
import * as Portal from '@radix-ui/react-portal';


const StyledOverlay = styled('div', {
  backgroundColor:'$background',
  opacity:0.65,
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
       animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`
  },
});

const StyledLabel = styled('div', {
    display:'inline-flex', padding:'$0', color:'$background', borderRadius:'$round', margin:'0 $0',backgroundColor:"$foregroundBronze"
})

const StyledKey = styled('span', {
    display:'inline-flex',
    padding:'0 $0',
    borderRadius:'$1',
    backgroundColor:'$highlight',
    color:'$foregroundText',
    fontSize:'$6'
})

const StyledToast = styled('div', {
    zIndex:'1000000000000000000',
    borderRadius:'$2',
    width:'calc($4 * 12)',
    position:'fixed',
    padding:'$2 $3',
    boxSizing:'border-box',
    backgroundColor:'$background',
    border:'1px solid $foreground',
    backdropFilter:'blur(2px) opacity(0.25)',
    mixBlendMode:'multiply',
    boxShadow:'$normal',
})

const StyledBody = styled('div', {
    display:'flex',
    flexDirection:'column',
    gap:'$1',
    color:'$foregroundText',
})


const StyledArrowLeft = styled('div', {
  position:'absolute',
  left:'calc(-$1 - 2px)',
  top:'50%',
  transform:'translateY(-100%)',
  width: '0',
  height: '0',
  borderTop: '10px solid transparent',
  borderRight: '10px solid $foreground',
  borderBottom:' 10px solid transparent'
})

const StyledArrowRight= styled('div', {
  position:'absolute',
  right:'calc(-$1 - 2px)',
  top:'12%',
  transform:'translateY(0%)',
  width: '0',
  height: '0',
  borderTop: '10px solid transparent',
  borderLeft: '10px solid $foreground',
  borderBottom:' 10px solid transparent'
})

const StyledArrowDown= styled('div', {
  position:'absolute',
  right:'50%',
  top:'100%',
  transform:'translateX(-50%)',
  width: '0',
  height: '0',
  borderTop: '10px solid $foreground',
  borderLeft: '10px solid transparent',
  borderRight:'10px solid transparent',
  borderBottom:' 10px solid transparent'
})

const StyledHeader = styled('section', {
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    'h5':{
        margin:'0'
    }
})

const StyledFooter= styled('section', {
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end',
    gap:'$1'
})


const CloseButton = styled('button', {
    display:'flex',
    background:'transparent',
    cursor:'pointer',
    border:'1px solid $foreground',
    transform:'scale(0.8)',
    color:'$foregroundText',
    borderRadius:'$round',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    padding:'$1',
    width:'33px',
    height:'33px',
    overflow:'hidden',
    transition:'$background',
    '&:hover':{
        color:'$background',
        backgroundColor:'$foreground',
        border:'1px solid $foreground'
    }
})

const StyledContent = styled('p', {
    margin:'0',
    marginBottom:'$1',
    fontSize:'$6',
})

// setIsPortal((fn({isPortal:boolean; })=>void)=>void)

//the reason to  separate the components is to have a bodylockscroll working only after the first step 
const Steps = ({step, setStep, setIsOnboarded, setIsPortal}:{step:number, setStep:(fn:(prevState:number) => number) => void, setIsOnboarded:(newState:boolean) => void, setIsPortal:any}) => {
    
    // const [isPortal, setIsPortal] = useRecoilState(portalState)


      useLockBodyScroll()
      useLayoutEffect(()=>{
          window.scrollTo(0,0)
      })
      if(step === 5){
        return(
             <StyledToast css={{  
            top:'calc($4 + $0)',
            right:'calc($4 * 3 + $2)',
            zIndex:100000000,
            }}>
            <StyledArrowRight/>
            <StyledBody>
                <StyledHeader>
                    <Box as='h5' css={{color:'$text'}}>Your control panel</Box>
                    <CloseButton onClick={()=>{localStorage.setItem('mirror-feed-onboarding-state-new', "true"), setIsOnboarded(true)}}><Remove/></CloseButton>
                </StyledHeader>
                <StyledContent>Login to your wallet or multisig here. Check your balance. Toggle themes settings. Find your reading list.</StyledContent>
                <StyledFooter>
                    <Button onClick={()=>setStep(prevStep=>prevStep-=1)}>Prev</Button>
                    <Button onClick={()=>{localStorage.setItem('mirror-feed-onboarding-state-new', "true"); setIsOnboarded(true)}}>Finish</Button>
                </StyledFooter>
            </StyledBody>
        </StyledToast>
        )
    }

    if(step === 4){
        return(
             <StyledToast css={{ 
            width:'calc($body / 1.8)', 
            top:'calc($5 * 4 + $2)',
            left:'calc($4 * 4)'
            }}>
            <StyledArrowDown/>
            <StyledBody>
                <StyledHeader>
                    <Box as='h5' css={{color:'$text'}}>Mirror Feed. Discovery begins</Box>
                    <CloseButton onClick={()=>{localStorage.setItem('mirror-feed-onboarding-state-new', "true"), setIsOnboarded(true)}}><Remove/></CloseButton>
                </StyledHeader>
                <StyledContent css={{maxWidth:'548px'}}>On the main page, you see <b>the newest articles</b> from Mirror.xyz contributors. <b>Explore</b> page (find it in the door) shows you only curated content.
                Save items <StyledLabel><AddIcon label={'Add Entry Icon Onboarding Example'}/></StyledLabel> to your space or add them to pinned list <StyledLabel><PinnedIcon label={'Pinned Icon Onboarding Example'}/></StyledLabel> and sort them later.</StyledContent>
                <StyledFooter>
                    <Button onClick={()=>{setStep(prevStep=>prevStep-=1)
                       setIsPortal({isPortal:true, modal:false})
                    }}>Prev</Button>
                    <Button onClick={()=>setStep(prevStep=>prevStep+=1)}>Next</Button>
                </StyledFooter>
            </StyledBody>
        </StyledToast>
        )
    }

     if(step === 3){
        return(
            <StyledToast css={{  
                top:'calc($4 * 2 + $1)',
                left:'calc($4 * 4)'
                }}>
                <StyledArrowLeft/>
                <StyledBody>
                    <StyledHeader>
                        <Box as='h5' css={{color:'$text'}}>Explore page</Box>
                        <CloseButton onClick={()=>{localStorage.setItem('mirror-feed-onboarding-state-new', "true"), setIsOnboarded(true)}}><Remove/></CloseButton>
                    </StyledHeader>
                    <StyledContent>
                       You can find the best entries in the Explore page. Curators stake their tokens to uptove their fundings. 
           
                       {/* Press <StyledKey>ALT</StyledKey> or <StyledKey>Option&thinsp;⌥</StyledKey> to open it from anywhere.  */}
                    </StyledContent>
                    <StyledFooter>
                        <Button onClick={()=>{setStep(prevStep=>prevStep-=1)
                        setIsPortal({isPortal:true, modal:false})
                        }}>Prev</Button>
                        <Button onClick={()=>{setStep(prevStep=>prevStep+=1)
                        setIsPortal({isPortal:false, modal:false})
                        }}>Next</Button>
                    </StyledFooter>
                </StyledBody>
            </StyledToast>
        )
    }

    if(step === 2){
        return(
            <StyledToast css={{  
                top:'calc(-1px + $2)',
                left:'calc($4 * 4)'
                }}>
                <StyledArrowLeft/>
                <StyledBody>
                    <StyledHeader>
                        <Box as='h5' css={{color:'$text'}}>Magical Door</Box>
                    <CloseButton onClick={()=>{localStorage.setItem('mirror-feed-onboarding-state-new', "true"), setIsOnboarded(true)}}><Remove/></CloseButton>
                    </StyledHeader>
                    <StyledContent>
                       Remember the magical door in “Howl&apos;s Castle”? This menu works the same way. You can use it to move around.
           
                       Press <StyledKey>ALT</StyledKey> or <StyledKey>Option&thinsp;⌥</StyledKey> to open it from anywhere. 
                    </StyledContent>
                    <StyledFooter>
                        <Button onClick={()=>setStep(prevStep=>prevStep-=1)}>Prev</Button>
                        <Button onClick={()=>{setStep(prevStep=>prevStep+=1);
                        setIsPortal({isPortal:true, modal:false})
                        }}>Next</Button>
                    </StyledFooter>
                </StyledBody>
            </StyledToast>
        )
    }
    return(<></>)
}

const OnBoarding = () => {
    const [isOnboarded, setIsOnboarded] = useState(true)
    const [step, setStep] = useState(1)
    const router = useRouter()
    const video = useRef<HTMLVideoElement>(null)
    const [isPortal, setIsPortal] = useRecoilState(portalState)

    useEffect(()=>{
        if(router.pathname !== '/'){
            return 
        }
        const onbooardingState = localStorage.getItem('mirror-feed-onboarding-state-new')
        if(onbooardingState || onbooardingState === "true") setIsOnboarded(true)
        if(onbooardingState === "false") setIsOnboarded(false)
        if(!onbooardingState) {
            localStorage.setItem('mirror-feed-onboarding-state-new', "false")
            setIsOnboarded(false)
        }
    },[router])


    if(isOnboarded){
        return(<></>)
    }

    if(step!==1){
        return(
            <Portal.Root>
            <Steps setIsPortal={setIsPortal} step={step} setIsOnboarded={setIsOnboarded} setStep={setStep}/>
            <StyledOverlay css={{pointerEvents:'all'}}/>
            </Portal.Root>
        )
    }
  
     return(
        <StyledToast css={{  
            width:'532px',
            height:'192px',
            bottom:'$2',
            right:'calc($4 + $4 )',
            padding:'0',
            overflow:'hidden'
            }}>
            <Box layout='flexBoxRow' css={{gap:'$0', overflow:'hidden'}}>
                <Box css={{minWidth:'192px', background:'$highlight', overflow:'hidden', boxSizing:'border-box', height:'100%', objectFit:'cover'}}>
                     <Box css={{width:'192px', 
                        overflow:'hidden',
                        opacity:0.75,
                        mixBlendMode:'multiply'
                        }}>
                        <video 
                        ref={video}
                        width='100%'
                        onEnded={()=>{
                            setTimeout(()=>{
                                if(video.current) video.current.play()
                            },2000)
                        }}
                        src='/logo-small.mp4' autoPlay muted/>
                        </Box>
                </Box>
                <StyledBody css={{padding:'$2', gap:'$1'}}>
                    <StyledHeader>
                        <Box as='h5' css={{color:'$text'}}>Welcome to MirrorFeed</Box>
                        <CloseButton onClick={()=>{localStorage.setItem('mirror-feed-onboarding-state-new', "true"), setIsOnboarded(true)}}><Remove/></CloseButton>
                    </StyledHeader>
                    <StyledContent>
                        We <b>discover, curate, and read together. <br/> The content is sourced from decentralized publishing platform Mirror.xyz.</b>
                    </StyledContent>
                    <StyledFooter css={{justifyContent:'flex-start'}}>
                        <Button onClick={()=>{setIsPortal({isPortal:true, modal:false}); setStep(prevStep=>prevStep+=1);}}>Show me around</Button>
                    </StyledFooter>
                </StyledBody>
            </Box>
        </StyledToast>
    )
}

export default OnBoarding
import {styled} from 'stitches.config'
import Remove from '@/design-system/icons/Remove'
import {useState, useEffect, useLayoutEffect} from 'react'
import Button from '@/design-system/primitives/Button'
import Box from '@/design-system/primitives/Box'
import useLockBodyScroll from 'hooks/useLockBodyScroll'
import {useRouter} from 'next/router'
import Image from 'next/image'
const StyledToast = styled('div', {
    zIndex:'100',
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

//the reason to  separate the components is to have a bodylockscroll working only after the first step 
const Steps = ({step, setStep, setIsOnboarded}:{step:number, setStep:(fn:(prevState:number) => number) => void, setIsOnboarded:(newState:boolean) => void}) => {
      useLockBodyScroll()
      useLayoutEffect(()=>{
          window.scrollTo(0,0)
      })
      if(step === 4){
        return(
             <StyledToast css={{  
            top:'calc($4 + $0)',
            right:'calc($4 * 8)'
            }}>
            <StyledArrowRight/>
            <StyledBody>
                <StyledHeader>
                    <Box as='h5' css={{color:'$text'}}>Reading List</Box>
                    <CloseButton onClick={()=>{localStorage.setItem('mirror-feed-onboarding-state', "true"), setIsOnboarded(true)}}><Remove/></CloseButton>
                </StyledHeader>
                <StyledContent>All saved items are accessible from one place.</StyledContent>
                <StyledFooter>
                    <Button onClick={()=>setStep(prevStep=>prevStep-=1)}>Prev</Button>
                    <Button onClick={()=>{localStorage.setItem('mirror-feed-onboarding-state', "true"); setIsOnboarded(true)}}>Finish</Button>
                </StyledFooter>
            </StyledBody>
        </StyledToast>
        )
    }

    if(step === 3){
        return(
             <StyledToast css={{  
            top:'calc($5 * 4 + $2)',
            left:'calc($4 * 4)'
            }}>
            <StyledArrowLeft/>
            <StyledBody>
                <StyledHeader>
                    <Box as='h5' css={{color:'$text'}}>Control Panel</Box>
                    <CloseButton onClick={()=>{localStorage.setItem('mirror-feed-onboarding-state', "true"), setIsOnboarded(true)}}><Remove/></CloseButton>
                </StyledHeader>
                <StyledContent>Add items to the reading list, pin to keep them around while you scroll, ignore publications that you don&apos;t want to see.</StyledContent>
                <StyledFooter>
                    <Button onClick={()=>setStep(prevStep=>prevStep-=1)}>Prev</Button>
                    <Button onClick={()=>setStep(prevStep=>prevStep+=1)}>Next</Button>
                </StyledFooter>
            </StyledBody>
        </StyledToast>
        )
    }

    if(step === 2){
        return(
            <StyledToast css={{  
                top:'calc($4 + $0)',
                left:'calc($4 * 4)'
                }}>
                <StyledArrowLeft/>
                <StyledBody>
                    <StyledHeader>
                        <Box as='h5' css={{color:'$text'}}>Curation Spaces</Box>
                    <CloseButton onClick={()=>{localStorage.setItem('mirror-feed-onboarding-state', "true"), setIsOnboarded(true)}}><Remove/></CloseButton>
                    </StyledHeader>
                    <StyledContent>
                        Create your personalized feed by adding favorite authors & publications to the Spaces. Click the Portal Icon to add the Space or move around.
                        <br/>
                        <br/>
                        We&apos;ve added <b>&quot;Tokenomics&quot;</b> and <b>&quot;IRL Crypto&quot;</b> for you to get an idea.
                    </StyledContent>
                    <StyledFooter>
                        <Button onClick={()=>setStep(prevStep=>prevStep-=1)}>Prev</Button>
                        <Button onClick={()=>setStep(prevStep=>prevStep+=1)}>Next</Button>
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

    useEffect(()=>{
        if(router.pathname !== '/'){
            return 
        }
        const onbooardingState = localStorage.getItem('mirror-feed-onboarding-state')
        if(onbooardingState || onbooardingState === "true") setIsOnboarded(true)
        if(onbooardingState === "false") setIsOnboarded(false)
        if(!onbooardingState) {
            localStorage.setItem('mirror-feed-onboarding-state', "false")
            setIsOnboarded(false)
        }
    },[router])


    if(isOnboarded){
        return(<></>)
    }

    if(step!==1){
        return(
            <Steps step={step} setIsOnboarded={setIsOnboarded} setStep={setStep}/>
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
                <Box css={{minWidth:'192px', background:'#EBEBEB', overflow:'hidden', boxSizing:'border-box', height:'100%', objectFit:'cover'}}>
                    <Image alt='onboarding' quality='100' src='/onboarding.png' width='192px' height='192px' layout='responsive'/>
                </Box>
                <StyledBody css={{padding:'$2', gap:'$1'}}>
                    <StyledHeader>
                        <Box as='h5' css={{color:'$text'}}>Welcome to MirrorFeed</Box>
                        <CloseButton onClick={()=>{localStorage.setItem('mirror-feed-onboarding-state', "true"), setIsOnboarded(true)}}><Remove/></CloseButton>
                    </StyledHeader>
                    <StyledContent>
                        Reading client for the decentralized publishing platform Mirror.xyz. Our focus is <b>discovery, curation, and reading experience.</b>
                    </StyledContent>
                    <StyledFooter css={{justifyContent:'flex-start'}}>
                        <Button onClick={()=>setStep(prevStep=>prevStep+=1)}>Show me around</Button>
                    </StyledFooter>
                </StyledBody>
            </Box>
        </StyledToast>
    )
}

export default OnBoarding
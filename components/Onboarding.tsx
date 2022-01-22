import { styled } from 'stitches.config'
import Remove from '@/design-system/icons/Remove'
import AddIcon from '@/design-system/icons/Add'
import Heading from '@/design-system/primitives/Heading'
import Label from '@/design-system/primitives/Label'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import Button from '@/design-system/primitives/Button'
import Box from '@/design-system/primitives/Box'
import useLockBodyScroll from 'hooks/useLockBodyScroll'
import { useRouter } from 'next/router'
// import Image from 'next/image'
import { portalState } from 'contexts'
import { useRecoilState } from 'recoil'
import { overlayShow } from 'stitches.config'


const StyledToast = styled('div', {
    zIndex: '1000000000000000000',
    width: '100%',
    padding: '$2 $3',
    boxSizing: 'border-box',
    backgroundColor: '$background',
    // backdropFilter: 'blur(4px) opacity(0.25)',
    // WebkitBackdropFilter: 'blur(100px) opacity(0.75)',
    // mixBlendMode: 'multiply',
    opacity: 0.95,
    // boxShadow: '$normal',
})

const StyledBody = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '$1',
    color: '$foregroundText',
})





const StyledHeader = styled('section', {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    'h5': {
        margin: '0'
    }
})


const CloseButton = styled('button', {
    display: 'flex',
    background: 'transparent',
    cursor: 'pointer',
    border: '1px solid $foreground',
    transform: 'scale(0.8)',
    color: '$foregroundText',
    borderRadius: '$round',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '$1',
    width: '33px',
    height: '33px',
    overflow: 'hidden',
    transition: '$background',
    '&:hover': {
        color: '$background',
        backgroundColor: '$foreground',
        border: '1px solid $foreground'
    }
})

const StyledContent = styled('p', {
    margin: '0',
    marginBottom: '$1',
    fontSize: '$6',
})

// setIsPortal((fn({isPortal:boolean; })=>void)=>void)

const OnBoarding = () => {
    const [isOnboarded, setIsOnboarded] = useState(true)
    const router = useRouter()
    const video = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (router.pathname !== '/') {
            return
        }
        const onbooardingState = localStorage.getItem('mirror-feed-onboarding-state-new')
        if (onbooardingState || onbooardingState === "true") setIsOnboarded(true)
        if (onbooardingState === "false") setIsOnboarded(false)
        if (!onbooardingState) {
            localStorage.setItem('mirror-feed-onboarding-state-new', "false")
            setIsOnboarded(false)
        }
    }, [router])


    if (isOnboarded) {
        return (<></>)
    }


    return (
        <StyledToast css={{
            position: "relative",
            display: 'flex',
            alignItems: 'flex-start',
            height: '192px',
            padding: '0',
            overflow: 'hidden',
            '@bp1': {
                display: 'none'
            }
        }}>

            <Box css={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100vw",
                height: '100%',
                backgroundImage: "linear-gradient(" +
                    "220deg," +
                    "hsl(300deg 100% 100%) 0%," +
                    "hsl(300deg 87% 35%) 17%," +
                    "hsl(300deg 76% 42%) 31%," +
                    "hsl(300deg 67% 49%) 43%," +
                    "hsl(300deg 74% 56%) 53%," +
                    "hsl(3deg 85% 61%) 61%," +
                    "hsl(12deg 97% 62%) 67%," +
                    "hsl(21deg 100% 60%) 73%," +
                    "hsl(29deg 100% 58%) 77%," +
                    "hsl(37deg 100% 54%) 81%," +
                    "hsl(44deg 100% 100%) 85%," +
                    "hsl(50deg 100% 100%) 90%," +
                    "hsl(55deg 100% 100%) 100%" +
                    ")"
            }}>

            </Box>



            <Box layout='flexBoxRow' css={{
                background: '$highlight',
                width: '100%',
                backdropFilter: 'blur(4px) opacity(0.85)',
                WebkitBackdropFilter: 'blur(100px) opacity(0.75)',
                mixBlendMode: 'multiply',
            }}>
                <Box css={{
                    maxWidth: '192px',
                    overflow: 'hidden',
                    opacity: 0.55,
                    background: '$highlight',
                    boxSizing: 'border-box',
                    height: '100%',
                    objectFit: 'cover'
                }}>
                    <video
                        ref={video}
                        width='100%'
                        onEnded={() => {
                            setTimeout(() => {
                                if (video.current) video.current.play()
                            }, 2000)
                        }}
                        src='/logo-small.mp4' autoPlay muted />
                </Box>


                <StyledBody css={{ padding: '$2', gap: '$1' }}>
                    <Heading color={'text'} size='h5'>Welcome to MirrorFeed</Heading>
                    <StyledContent>
                        We <b>discover, curate, and read together.</b> <br /> The content is sourced from <b>decentralized publishing platform Mirror.xyz.</b>
                    </StyledContent>
                </StyledBody>

                <CloseButton
                    css={{ margin: '$2' }}
                    onClick={() => { localStorage.setItem('mirror-feed-onboarding-state-new', "true"), setIsOnboarded(true) }}>
                    <Remove />
                </CloseButton>
            </Box>


        </StyledToast>
    )
}

export default OnBoarding
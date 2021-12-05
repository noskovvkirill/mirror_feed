import Box from "@/design-system/primitives/Box"
import Button from "@/design-system/primitives/Button"
import { styled, keyframes } from "stitches.config"
import ButtonPopover from "@/design-system/primitives/ButtonPopover"
import * as Tabs from '@radix-ui/react-tabs';
import Profile from '@/design-system/icons/Profile'
import React from 'react'
import { useRouter } from 'next/router'
// import {Color} from '@/design-system/Nav'
// import Image from 'next/image'
// import ColorPicker from '@/design-system/primitives/ColorPicker'
// import AdjustIcon from '@/design-system/icons/Adjust'

import { useAuth } from 'contexts/user'
import { AddressPrettyPrint } from 'src/utils'

interface ISettings {
    UpdateTheme: any,
    themes?: string[],
    theme?: string
}

const AnimationRotation = keyframes({
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
})
const AnimationContentDisplay = keyframes({
    '0%': { opacity: 0, transform: `scale(0.25)` },
    '100%': { opacity: 1, transform: `scale(1)` }
})

const AnimationContenPortal = keyframes({
    '0%': { opacity: 0.5 },
    '100%': { opacity: 1 }
})


export const StyledTabsContent = styled(Tabs.Content, {
    transition: '$all',
    gap: '$1',
    display: 'flex',
    flexDirection: 'column',
    '&[data-state="active"]': {
        animationName: AnimationContentDisplay,
        animationDuration: '400ms',
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
    }
})

export const StyledTabsList = styled(Tabs.List, {
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    gap: '$0'
})

export const StyledTabsTrigger = styled(Tabs.Trigger, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '$6',
    padding: '$0 $2',
    boxSizing: 'border-box',
    height: '33px',
    '&:focus': {
        outline: 'none'
    },
    // width:'100%',
    cursor: 'pointer',
    borderRadius: '$2',
    '&:hover': {
        color: '$foregroundTextBronze',
        background: '$highlightBronze',
    },
    '&[data-state="active"]': {
        color: '$background',
        backgroundColor: '$foregroundBronze'
    }
})



const StyledSign = styled('button', {
    display: 'flex',
    padding: '$1 $2',
    fontSize: '$6',
    transition: "$background",
    color: '$foregroundText',
    boxSizing: 'border-box',
    background: '$background',
    borderRadius: '$2',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid $foregroundBorder',
    cursor: 'pointer',
    width: '100%',
    '&:hover': {
        color: '$background',
        background: '$foregroundBronze',
        border: '1px solid $foregroundBronze'
    }
})

declare let window: any;


const Settings = ({ UpdateTheme, themes, theme }: ISettings) => {

    const { user, isLoading, Disconnect, Connect } = useAuth()
    const router = useRouter()

    if (isLoading) {
        return (
            <Box css={{
                minWidth: "33px",
                width: "33px",
                height: "33px",
                display: 'flex',
                outline: '1px solid $foreground',
                border: '3px solid $foreground',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                overflow: 'hidden',
                animation: `${AnimationRotation} 2s linear`,
                animationIterationCount: 'infinite',
                // padding:'$1', 
                objectFit: 'scale-down',
                color: '$text',
                fontSize: '$5',
                lineHeight: '$6',
                borderRadius: '$round', background: '$foreground'
            }}>
                ✸
            </Box>
        )
    }
    return (
        <ButtonPopover
            isAvatar={user?.avatarURL ? true : false}
            icon={user?.avatarURL ? <img src={user.avatarURL} width='100%' height='auto' alt='Current user avatar' /> : <Profile />} label='change' isHighlighted={true}>
            <Tabs.Root defaultValue={(user && user.isConnected) ? 'login' : 'settings'}>
                <Box layout='flexBoxRow' css={{ alignItems: 'center', boxSizing: 'border-box', padding: '$2 $2', justifyContent: 'space-between' }}>
                    <StyledTabsList css={{ boxSizing: 'border-box', color: '$foregroundText' }}>
                        <StyledTabsTrigger value='login'>{(user && !user.isConnected) ? 'Sign In' : 'Account'}</StyledTabsTrigger>
                        <StyledTabsTrigger value='settings'>Settings</StyledTabsTrigger>
                    </StyledTabsList>
                    <Box css={{
                        minWidth: "33px",
                        width: "33px",
                        height: "33px",
                        display: 'flex',
                        outline: '1px solid $foreground',
                        border: '3px solid $foreground',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        // padding:'$1',
                        objectFit: 'scale-down',
                        lineHeight: '$6',
                        borderRadius: '$round', color: '$background', background: '$foreground'
                    }}>
                        {user?.avatarURL ? <img src={user.avatarURL} width='100%' height='auto' alt='Current user avatar' /> : <Profile />}
                    </Box>
                </Box>
                <StyledTabsContent value='login' css={{ overflow: 'hidden' }}>
                    {(user && user.isConnected) && (
                        <Box layout='flexBoxColumn' css={{ padding: '0 $2 $2 $2' }}>
                            {(() => {
                                switch (user.network?.name) {
                                    case 'rinkeby':
                                        return (
                                            <Box as='section' layout='flexBoxColumn'>
                                                {/* <Box as='span' css={{fontSize:'$6', color:'$foregroundText'}}>Connected as</Box> */}
                                                <Box
                                                    layout='flexBoxRow'
                                                    css={{
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        borderRadius: '$2',
                                                        padding: '$1 $2',
                                                        whiteSpace: 'nowrap',
                                                        wordBreak: 'break-all', background: '$highlightBronze', color: '$foregroundTextBronze'
                                                    }}>
                                                    <Box as='span' css={{ whiteSpace: 'nowrap', fontSize: '$6' }}>
                                                        {user.displayName ? user.displayName : AddressPrettyPrint(user?.address || '')}
                                                    </Box>
                                                    <Box as='span' css={{ whiteSpace: 'nowrap', fontSize: '$6' }}>
                                                        {user?.balance?.toString().slice(0, 5)}&thinsp;●
                                                    </Box>
                                                </Box>
                                            </Box>
                                        )
                                    case 'homestead':
                                        return (<Box as='p' css={{ color: '$error' }}>Mainnet is not supported yet. Switch to Rinkeby</Box>)
                                    default: return (<>Unsupported network</>)
                                }

                            })()}

                            <Button tabIndex={0}
                                onClick={() => router.push('/list')}
                                css={{ width: '100%', border: '1px solid transparent' }}>Reading List</Button>
                            <Button tabIndex={0} onClick={Disconnect} css={{ width: '100%', border: '1px solid transparent' }}>Sign Out</Button>
                        </Box>
                    )}

                    {(!user || !user.isConnected) && (
                        <Box layout='flexBoxColumn' css={{ padding: '$1 $2 $4 $2' }}>
                            <StyledSign onClick={() => Connect('metamask')}>
                                Metamask <img width='auto' height='15px' src='/metamaskFox.svg' />
                            </StyledSign>
                            <StyledSign onClick={() => Connect('wc')}>WalletConnect <img width='auto' height='15px' src='/WalletConnectIcon.svg' /></StyledSign>
                            <Box
                                as='a'
                                href={'https://rainbow.me/'}
                                target='_blank'
                                css={{
                                    color: '$foregroundText',
                                    transition: '$color',
                                    '&:hover': { color: '$foregroundTextBronze' },
                                    textDecoration: 'none', paddingTop: '$1', boxSizing: 'border-box', width: '100%', textAlign: 'center', fontSize: '$6'
                                }}>I don&apos;t have a wallet</Box>
                        </Box>
                    )}


                </StyledTabsContent>
                <StyledTabsContent value='settings' css={{ boxSizing: 'border-box' }}>
                    <Box layout='flexBoxRow' css={{ alignItems: 'flex-start', padding: '0 $2', color: '$text', gap: '$2', 'span': { fontSize: '$6', color: '$foregroundText' } }}>
                        <p style={{ whiteSpace: 'nowrap', lineHeight: '100%', color: 'inherit', userSelect: 'none' }}>Select theme</p>
                        {/* <span>Custom theming is coming soon ✨</span> */}
                    </Box>
                    <Box layout='flexBoxRow' css={{ flexWrap: 'wrap', padding: '$1 $2 $4 $2' }}>
                        {themes?.map((item: string) => (
                            <Box
                                layout='flexBoxColumn'
                                css={{ color: '$foreground', width: '33px', fontSize: '$6', whiteSpace: 'break-spaces', wordBreak: 'break-all' }}
                                key={'theme' + item}>
                                <Box
                                    onClick={() => {
                                        UpdateTheme(item)
                                    }}
                                    css={{
                                        cursor: 'pointer',
                                        width: '33px',
                                        height: '33px',
                                        background: item === 'light-cream' ?
                                            `linear-gradient(0deg, #E0CEC7 50%, rgba(255, 255, 255, 1) 50%)`
                                            : item === 'dark-plain'
                                                ? `linear-gradient(0deg, #1B1B18 50%, #2E2E2B 50%)`
                                                : item === 'light-blue'
                                                    ? `linear-gradient(0deg, #3E63DD 50%, rgba(255, 255, 255, 1) 50%)`
                                                    : item === 'dark-blue'
                                                        ? `linear-gradient(0deg, #273E89 50%, #2E2E2B 50%)`
                                                        : `linear-gradient(145deg, #1B1B18 50%, rgba(255, 255, 255, 1) 50%)`, //system
                                        borderRadius: '$round',
                                        outline: item !== theme ? '1px solid $foreground' : '3px solid $foreground',
                                        '&:hover': {
                                            outline: '3px solid $foreground'
                                        }
                                    }}>


                                </Box>
                                {item}
                            </Box>
                        ))}
                    </Box>
                    {/* <p>Theme settings</p> */}
                    {/* <Box css={{width:'100%', overflow:'hidden'}}>
                        {colors && (
                            <>
                            {Object.keys(colors).map((key:string)=>{
                                return(
                                    <Box layout='flexBoxRow' key={'theme_color'+key} css={{padding:'0 $2', justifyContent:'space-between', fontSize:'$6'}}>
                                        {key} {colors[key].hex}
                                        <ColorPicker color={colors[key]} setColor={(newValue:Color)=>{dispatch({color:key, value:newValue})}}/>
                                    </Box>
                                )
                            })}
                            </>
                        )}
                    </Box> */}
                    {/* <Button onClick={UpdateTheme}>Update theme 1 </Button> */}
                </StyledTabsContent>
            </Tabs.Root>
        </ButtonPopover>

    )
}

export default Settings
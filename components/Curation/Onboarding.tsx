//components
import Box from '@/design-system/primitives/Box'
import Heading from '@/design-system/primitives/Heading'
import RemoveIcon from '@/design-system/icons/Remove'
import SyncIcon from '@/design-system/icons/Sync'
import UnSyncIcon from '@/design-system/icons/UnSync'
import AddIcon from '@/design-system/icons/Add'
//utils
import { styled } from 'stitches.config'
import { useEffect, useState, memo } from 'react'

const CloseButton = styled('button', {
    display: 'flex',
    background: 'transparent',
    cursor: 'pointer',
    border: '1px solid $foregroundBronze',
    color: '$foregroundTextBronze',
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
        backgroundColor: '$foregroundBronze',
        border: '1px solid $foregroundBronze'
    }
})

const StyledLabel = styled('div', {
    display: 'inline-flex', padding: '$0', color: '$background', borderRadius: '$round', margin: '0 $0', backgroundColor: "$foregroundBronze"
})

const OnboardingCuration = () => {
    const [isOnboarded, setIsOnboarded] = useState(true)
    useEffect(() => {
        const onbooardingState = localStorage.getItem('mirror-feed-is-onboarded-spaces')
        if (onbooardingState || onbooardingState === "true") setIsOnboarded(true)
        if (onbooardingState === "false") setIsOnboarded(false)
        if (!onbooardingState) {
            localStorage.setItem('mirror-feed-is-onboarded-spaces', "false")
            setIsOnboarded(false)
        }
    }, [])

    const handleClose = () => {
        localStorage.setItem('mirror-feed-is-onboarded-spaces', "true")
        setIsOnboarded(true)
    }

    if (isOnboarded) {
        return (<></>)
    }
    return (
        <Box
            layout='flexBoxColumn'
            css={{
                width: '$body',
                gap: '$4',
                background: '$highlightBronze',
                color: '$foregroundTextBronze',
                border: '0px solid $foregroundBorder', boxSizing: 'border-box', borderRadius: '$2', padding: '$4', margin: 'calc($4 * 2) 0 $4 0'
            }}>
            <Box layout='flexBoxRow' css={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <Heading size='h3' color={'foregroundTextBronze'}>
                    Welcome to your Space. Curation begins here.
                </Heading>
                <CloseButton onClick={handleClose}><RemoveIcon /></CloseButton>
            </Box>
            <Box layout='flexBoxRow' css={{ width: '100%', justifyContent: 'space-between' }}>
                <Box layout='flexBoxColumn' css={{ alignItems: 'flex-start' }}>
                    <Box as='ul' css={{ padding: '0 $2', margin: 0 }}>
                        <li>Add articles directly to the space when you found them by clicking <StyledLabel> <AddIcon /></StyledLabel> button</li>
                    </Box>
                    <p>All the items are stored locally before you stake the tokens on each of them. <br /> You can do that by
                        clicking <StyledLabel><SyncIcon /></StyledLabel> button. You can unstake tokens after one week<br /> by clicking <StyledLabel><UnSyncIcon /></StyledLabel>.
                        Staked tokens reward authors based on the amount & period of staking. <br />Best entries are shown on the explore page. </p>
                    <p> For the convinience, you can stake tokens for multiple items in one transaction.</p>
                </Box>
            </Box>

        </Box>
    )
}

export default memo(OnboardingCuration)
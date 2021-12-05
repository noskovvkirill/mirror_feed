//components
import { StyledContent, StyledOverlay, Root } from '@/design-system/primitives/Dialog'
import Box from '@/design-system/primitives/Box'
import Heading from '@/design-system/primitives/Heading'
import Info from '@/design-system/primitives/Info'
import Button from '@/design-system/primitives/Button'
import Label from '@/design-system/primitives/Label'
import Tag from '@/design-system/primitives/Tag'
import SettingsIcon from '@/design-system/icons/Settings'

//types
import type { TransactionResponse } from '@ethersproject/abstract-provider'
import type { CuratedItem } from '@/design-system/Curation'

//utils
import { ethers } from 'ethers'
import { styled, keyframes } from 'stitches.config'
import { useSpace } from 'contexts/spaces'
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

//state
import React, { useState } from 'react'

const StyledContainerAll = styled('div', {
    width: '100%',
    boxSizing: 'border-box',
    alignItems: 'flex-start',
    padding: '$2 $2',
    display: 'flex',
    flexDirection: 'column',
    gap: '$0',
    borderRadius: '$2',
    'span': {
        userSelect: 'none'
    },
    variants: {
        collapsed: {
            true: {
                backgroundColor: '$tint',
                cursor: 'pointer',
                color: '$foreground'
            },
            false: {
                // boxShadow:'$large',
                backgroundColor: '$highlightBronze',
                cursor: 'initial',
                color: '$foregroundTextBronze',
            }
        }
    },
    defaultVariants: {
        collapsed: 'false'
    }
})

const StyledContainerByItem = styled('div', {
    display: 'flex',
    flexDirection: 'row',
    padding: '$2', borderRadius: '$2',
    alignItems: 'center', justifyContent: 'space-between',
    variants: {
        collapsed: {
            true: {
                color: '$foregroundTextBronze',
                backgroundColor: '$highlightBronze',
                cursor: 'initial'
            },
            false: {
                color: '$foreground',
                backgroundColor: '$tint',
                cursor: 'pointer',
                '&:hover': {
                    transition: '$background',
                    backgroundColor: '$foreground',
                    color: '$background'
                },
            }
        }
    },
    defaultVariants: {
        collapsed: 'false'
    }
})

const AnimationContentDisplay = keyframes({
    '0%': { opacity: 0, transform: `scaleY(0.5) ` },
    '100%': { opacity: 1, transform: `scaleY(1)` }
})

const StyledContainerItems = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '$2',
    backgroundColor: '$highlightBronze',
    // padding:'$2 $1', 
    marginTop: '0',
    transformOrigin: 'top center',
    '@media (prefers-reduced-motion: no-preference)': {
        animationName: `${AnimationContentDisplay}`,
        animationDuration: '250ms',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards',
        willChange: 'transform, opacity'

    }
})

interface IUnstakeTokens {
    totalStaked: number,
    items: CuratedItem[],
    spaceId: number,
    spaceTitle: string,
    isOpen: boolean;
    setIsOpen: (newState: boolean) => void;
    unstakeCallback: (tx: TransactionResponse) => void;
}

const UnStakeTokens = ({
    totalStaked,
    items,
    isOpen, setIsOpen, unstakeCallback, spaceId, spaceTitle }: IUnstakeTokens) => {

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [unstakeList, setListUnstake] = useState<Array<{ cid: string, author: string, stake: number }>>([])

    const {
        BatchUnSyncFromSpace,
        Approve,
    } = useSpace()

    const UnSync = async () => {
        if (isCollapsed) {
            const tx = await BatchUnSyncFromSpace(spaceId, unstakeList)
            console.log('unsync tx', tx)
            const receipt = await tx.wait()
            console.log('your receipt', receipt)
        } else {
            const tx = await BatchUnSyncFromSpace(spaceId, items.map((item) => {
                return ({ cid: item.entry.digest, author: item.entry.author.address })
            }))
            console.log('unsync tx', tx)
            const receipt = await tx.wait()
            console.log('your receipt', receipt)
        }

    }

    return (
        <Root
            open={isOpen}
            onOpenChange={setIsOpen}
            modal={true}
        >
            <StyledOverlay />
            <StyledContent>

                <Box layout='flexBoxRow' css={{ alignItems: 'center', margin: '0 0 $4 0', justifyContent: 'space-between' }}>
                    <Box layout='flexBoxRow' css={{ alignItems: 'center', userSelect: 'none' }} ><Heading size={'h4'} color={'foregroundText'}>Unstake tokens</Heading> <Heading size={'h4'} color='highlight' >{spaceTitle}</Heading></Box>
                    <Info>
                        Unstaking tokens bla bla
                    </Info>
                </Box>

                {/* <Box layout='flexBoxRow' css={{width:'100%', position:'relative'}}>
           

                </Box> */}

                <StyledContainerAll
                    css={{ position: 'relative' }}
                    collapsed={isCollapsed}
                    onClick={() => { if (isCollapsed) setIsCollapsed(false) }}
                >

                    {isCollapsed && (
                        <Box
                            onClick={() => { if (isCollapsed) setIsCollapsed(false) }}
                            css={{
                                width: '100%', height: '100%',
                                // mixBlendMode:'multiply',
                                opacity: 0.75,
                                pointerEvents: 'all',
                                borderRadius: '$2',
                                transition: '$background',
                                '&:hover': {
                                    backgroundColor: '$tint',
                                    cursor: 'pointer'
                                },
                                position: 'absolute', left: 0, top: 0, boxSizing: 'border-box',
                                backgroundColor: 'transparent'
                            }}>
                        </Box>
                    )}
                    <span>Batch unstake all the tokens</span>
                    <Heading
                        css={{ fontFamily: 'Inter', userSelect: 'none' }}
                        size={'h2'}>{totalStaked && parseInt(ethers.utils.formatEther(totalStaked?.toString()))}</Heading>
                    <span>● Tokens staked in total</span>
                    {/* {JSON.stringify(items)} */}
                </StyledContainerAll>

                <Box layout='flexBoxColumn' css={{
                    padding: '$1 0'
                }}>

                    <StyledContainerByItem
                        collapsed={isCollapsed}
                        tabIndex={0}
                        css={{ userSelect: 'none' }}
                        onClick={() => {
                            if (!isCollapsed) { setIsCollapsed(!isCollapsed) }
                        }}>
                        Unstake tokens from selected items
                        <SettingsIcon />
                        {/* {JSON.stringify(items)} */}
                    </StyledContainerByItem>

                    {isCollapsed && (
                        <StyledContainerItems>
                            {items.map((item, index) => {
                                const isInList = unstakeList.findIndex(i => i.cid === item.entry.digest) !== -1
                                return (
                                    <Box
                                        tabIndex={0}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                if (!isInList) {
                                                    setListUnstake(list => [...list, { cid: item.entry.digest, author: item.entry.author.address, stake: item.staked }])
                                                } else {
                                                    setListUnstake(list => list.filter(i => i.cid !== item.entry.digest))
                                                }
                                            }
                                        }}
                                        onClick={() => {
                                            if (!isInList) {
                                                setListUnstake(list => [...list, { cid: item.entry.digest, author: item.entry.author.address, stake: item.staked }])
                                            } else {
                                                setListUnstake(list => list.filter(i => i.cid !== item.entry.digest))
                                            }
                                        }}

                                        layout='flexBoxColumn'
                                        css={{
                                            padding: '$2 $3',
                                            boxSizing: 'border-box',
                                            //   backgroundColor:isInList ? '$highlightBronze' : '$highlight',
                                            border: isInList ? '1px solid $foregroundTextBronze' : '1px solid transparent',
                                            color: '$foregroundTextBronze', paddingBottom: '$4', borderRadius: '$2', cursor: 'pointer'
                                        }}
                                        key={item.entry.digest}>
                                        <Box layout='flexBoxRow'>
                                            {item.lastStakeTimestamp && (
                                                <Tag isHighlighted={true}>
                                                    {dayjs.unix(parseInt(item?.lastStakeTimestamp) + 604800).fromNow()}
                                                </Tag>)}
                                            <Tag isHighlighted={true}>
                                                {item.entry.publication
                                                    ? item.entry.publication.ensLabel
                                                    : item.entry.author.displayName
                                                }
                                            </Tag>
                                            <Tag isHighlighted={true}>
                                                {item.entry.digest.slice(0, 5)}...
                                            </Tag>
                                        </Box>
                                        <Box
                                            css={{ justifyContent: 'space-between', userSelect: 'none', alignItems: 'center', display: 'flex', flexDirection: 'row' }}
                                        >
                                            <span>{item.entry.title}</span>
                                            <span>{item.staked}&thinsp;●</span>
                                        </Box>
                                    </Box>
                                )
                            })}
                        </StyledContainerItems>)}
                </Box>

                <Box layout='flexBoxRow' css={{ alignItems: 'center', padding: '$1 0', justifyContent: 'space-between' }}>
                    <Button onClick={UnSync}>Unstake</Button>
                    <Box layout='flexBoxRow'>
                        <Label size='normal'>You will receive
                            &thinsp;
                            {isCollapsed ? unstakeList?.length > 0 ? parseInt(unstakeList?.reduce((prev, current) => ({ stake: prev.stake + current.stake, author: '', cid: '' })).stake.toString()) : <>0</> : totalStaked && parseInt(ethers.utils.formatEther(totalStaked.toString()))}&thinsp;●
                        </Label>
                        {/* <Label size='normal'
                        color={(user?.balance && CalculateTotal(notsync.items.length, priceBatch, valuesPerItem, isCollapsed) >= user?.balance) ? 'error' : 'default'}
                        >Your Balance {user?.balance}&thinsp;● &nbsp;</Label>
                        <Label size='normal'>Total {CalculateTotal(notsync.items.length, priceBatch, valuesPerItem, isCollapsed)}&thinsp;●</Label> */}
                    </Box>
                </Box>
                <Box css={{ width: '100%', padding: '$1 0' }}>
                    <Label>Verify the numbers before transacting</Label>
                </Box>

            </StyledContent>
        </Root>
    )
}

export default UnStakeTokens
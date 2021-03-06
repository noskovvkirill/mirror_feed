//components
import { StyledContent, StyledOverlay, Root, Portal } from '@/design-system/primitives/Dialog'
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
import React, { useEffect, useState } from 'react'

const StyledContainerAll = styled('div', {
    // width: '100%',
    boxSizing: 'border-box',
    alignItems: 'flex-start',
    padding: '$2 $2',
    display: 'flex',
    flexDirection: 'column',
    gap: '$1',
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
    gap: '$1',
    borderRadius: '$2',
    // backgroundColor: '$highlightBronze',
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
    const [listAvailable, setListAvailable] = useState<CuratedItem[] | null>(null)
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

    useEffect(() => {
        CheckTimeToUnstake(items)
    }, [items])

    const CheckTimeToUnstake = (items: CuratedItem[]) => {
        const itemsToUnstake = items.filter((item: CuratedItem) => {
            return (!item?.lastStakeTimestamp || !dayjs.unix(parseInt(item?.lastStakeTimestamp) + 604800).isBefore(Date()).toString())
        })
        setListAvailable(itemsToUnstake)
    }

    return (
        <Root
            open={isOpen}
            onOpenChange={setIsOpen}
            modal={true}
        >
            <Portal>
                <StyledOverlay />
                <StyledContent>

                    <Box layout='flexBoxRow' css={{ alignItems: 'center', margin: '0 0 $4 0', color: '$foregroundText', justifyContent: 'space-between' }}>
                        <Box layout='flexBoxRow' css={{ alignItems: 'center', userSelect: 'none' }} ><Heading size={'h4'} color={'foregroundText'}>Unstake tokens</Heading> <Heading size={'h4'} color='highlight' >{spaceTitle}</Heading></Box>
                        <Info>
                            You can unstake tokens from your space after 7 days period.
                            Be aware, in some cases unstaking may fail due to the way time is calculated
                            on a blockchain. We are looking forward to verify it upfront in updated version.
                        </Info>
                    </Box>


                    <Box layout='flexBoxRow'
                        css={{ position: 'relative', marginBottom: '$1' }}>

                        <StyledContainerAll
                            css={{ width: '30%' }}
                            collapsed={isCollapsed}
                            onClick={() => { if (isCollapsed) setIsCollapsed(false) }}
                        >
                            <Label size='normal'>To unstake</Label>
                            <Heading
                                css={{ userSelect: 'none' }}
                                size={'h2'}>{listAvailable?.length}/{items.length}</Heading>
                            <Label size='normal'>Available</Label>

                        </StyledContainerAll>

                        <StyledContainerAll
                            collapsed={isCollapsed}

                            css={{ width: '70%' }}>
                            {isCollapsed && (
                                <Box
                                    tabIndex={0}
                                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                        const code = e.key
                                        if (code === 'Enter') {
                                            setIsCollapsed(false)
                                        }
                                    }}
                                    onClick={() => { setIsCollapsed(false) }}
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
                                css={{ userSelect: 'none' }}
                                size={'h2'}>{totalStaked && parseInt(ethers.utils.formatEther(totalStaked?.toString()))}</Heading>
                            <span>??? Tokens staked in total</span>
                        </StyledContainerAll>


                        {/* {JSON.stringify(items)} */}
                    </Box>

                    <Box layout='flexBoxColumn' css={{
                        padding: '$1 0'
                    }}>

                        <StyledContainerByItem
                            collapsed={isCollapsed}
                            tabIndex={0}
                            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                const code = e.key
                                if (code === 'Enter') {
                                    if (!isCollapsed) { setIsCollapsed(!isCollapsed) }
                                }
                            }}
                            css={{ userSelect: 'none' }}
                            onClick={() => {
                                if (!isCollapsed) { setIsCollapsed(!isCollapsed) }
                            }}>
                            Unstake tokens from selected items
                            <SettingsIcon />
                            {/* {JSON.stringify(items)} */}
                        </StyledContainerByItem>

                        {isCollapsed && (
                            <StyledContainerItems >
                                {items.map((item, index) => {
                                    const isInList = unstakeList.findIndex(i => i.cid === item.entry.digest) !== -1
                                    const isAvailable = listAvailable?.findIndex(i => i.entry.digest === item.entry.digest) !== -1
                                    return (
                                        <Box
                                            tabIndex={0}
                                            onKeyPress={(e) => {
                                                if (!isAvailable) return;
                                                if (e.key === 'Enter') {
                                                    if (!isInList) {
                                                        setListUnstake(list => [...list, { cid: item.entry.digest, author: item.entry.author.address, stake: item.staked }])
                                                    } else {
                                                        setListUnstake(list => list.filter(i => i.cid !== item.entry.digest))
                                                    }
                                                }
                                            }}
                                            onClick={() => {
                                                if (!isAvailable) return;
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
                                                backgroundColor: isInList ? '$highlightBronze' : '$tint',

                                                //   backgroundColor:isInList ? '$highlightBronze' : '$highlight',
                                                border: isInList ? '1px solid $foregroundTextBronze' : '1px solid transparent',
                                                color: isInList ? '$foregroundTextBronze' : '$foreground', paddingBottom: '$4', borderRadius: '$2', cursor: isAvailable ? 'pointer' : 'not-allowed'
                                            }}
                                            key={item.entry.digest}>
                                            <Box layout='flexBoxRow'>
                                                {item.lastStakeTimestamp && !isInList && (
                                                    <Label size='normal' css={{ color: '$foregroundTextBronze' }}>
                                                        {dayjs.unix(parseInt(item?.lastStakeTimestamp) + 604800).fromNow()}
                                                    </Label>)}
                                                {isInList && (
                                                    <>
                                                        <Tag isHighlighted={true}>
                                                            {item.entry.publication
                                                                ? item.entry.publication.ensLabel
                                                                : item.entry.author.displayName
                                                            }
                                                        </Tag>
                                                        <Tag isHighlighted={true}>
                                                            {item.entry.digest.slice(0, 5)}...
                                                        </Tag>
                                                    </>
                                                )}
                                            </Box>
                                            <Box
                                                css={{ justifyContent: 'space-between', userSelect: 'none', alignItems: 'center', display: 'flex', flexDirection: 'row' }}
                                            >
                                                <span>{item.entry.title}</span>
                                                <Label size='normal' css={{ whiteSpace: 'nowrap' }}>{item.staked}&thinsp;???</Label>
                                            </Box>
                                        </Box>
                                    )
                                })}
                            </StyledContainerItems>)}
                    </Box>

                    <Box layout='flexBoxRow' css={{ alignItems: 'center', padding: '$1 0', justifyContent: 'space-between' }}>
                        <Button
                            disabled={(unstakeList.length === 0 && listAvailable?.length === 0) ? true : false}
                            onClick={UnSync}>Unstake</Button>
                        <Box layout='flexBoxRow'>
                            <Label size='normal'>You will receive
                                &thinsp;
                                {isCollapsed ? unstakeList?.length > 0 ? parseInt(unstakeList?.reduce((prev, current) => ({ stake: prev.stake + current.stake, author: '', cid: '' })).stake.toString()) : <>0</> : listAvailable && listAvailable?.length > 0 ? parseInt(listAvailable?.reduce<any>((prev, current) => ({ staked: prev.staked + current.staked }), [{ staked: 0 }]).staked.toString()) : 0}&thinsp;???
                            </Label>
                            {/* <Label size='normal'
                        color={(user?.balance && CalculateTotal(notsync.items.length, priceBatch, valuesPerItem, isCollapsed) >= user?.balance) ? 'error' : 'default'}
                        >Your Balance {user?.balance}&thinsp;??? &nbsp;</Label>
                        <Label size='normal'>Total {CalculateTotal(notsync.items.length, priceBatch, valuesPerItem, isCollapsed)}&thinsp;???</Label> */}
                        </Box>
                    </Box>
                    <Box css={{ width: '100%', padding: '$1 0' }}>
                        <Label>Verify the numbers before transacting</Label>
                    </Box>

                </StyledContent>
            </Portal>
        </Root>
    )
}

export default UnStakeTokens
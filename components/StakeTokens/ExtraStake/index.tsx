import { styled } from 'stitches.config'
import React, { useState, useCallback } from 'react';
import { AddressPrettyPrint } from 'src/utils';

import { useSpace } from 'contexts/spaces'
import { useAuth } from 'contexts/user';

import Button from '@/design-system/primitives/Button'
import Label from '@/design-system/primitives/Label'
import Box from '@/design-system/primitives/Box'
import Loader from '@/design-system/primitives/Loader'
import Tag from '@/design-system/primitives/Tag'
import Heading from '@/design-system/primitives/Heading'
import { StyledContent, StyledOverlay, Root, Portal } from '@/design-system/primitives/Dialog'
import { StyledContainer } from '@/design-system/StakeTokens/Item'
import { StyledContainerItems } from '@/design-system/StakeTokens'

import Info from '@/design-system/primitives/Info'
import Slider from '@/design-system/primitives/Slider'

import { stakeSelectedItem } from 'contexts'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { NotificationList } from 'contexts'
import type { TransactionResponse } from '@ethersproject/abstract-provider'

interface IOnAddCurated {
    stakeCallback: (tx: TransactionResponse) => void;
}

const StyledContainerAll = styled('div', {
    width: 'fit-content',
    alignItems: 'center',
    padding: '$2 $2',
    gap: '$2',
    borderRadius: '$2',
    'span': {
        userSelect: 'none'
    },
    variants: {
        collapsed: {
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






const ExtraStake = ({ stakeCallback }: IOnAddCurated) => {

    const [isApproved, setApproved] = useState<"false" | "true" | 'loading' | 'error'>("false")
    const setNotificationList = useSetRecoilState(NotificationList)
    const [defaultValue, setDefaultValue] = useState<number>(10)
    const [priceBatch, setPriceBatch] = useState<number>(defaultValue)

    const selectedItem = useRecoilValue(stakeSelectedItem);
    const setSelectedItem = useSetRecoilState(stakeSelectedItem);

    const {
        SyncToSpace,
        Approve,
    } = useSpace()
    const { user, UpdateAllowance } = useAuth()


    const ApproveSpend = async () => {
        try {
            setApproved("loading")
            const tx: TransactionResponse = await Approve('gov')
            const receipt = await tx.wait()
            console.log('receipt tx approval', receipt)
            const res = await UpdateAllowance()
            if (typeof res !== 'string') {
                setApproved("true")
            }
        } catch (e) {
            setApproved('error')
        }
    }

    const AddStake = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (!selectedItem) {
            throw "item was not found"
        }
        const tx = await SyncToSpace(
            parseInt(selectedItem.space.tokenId),
            priceBatch,
            selectedItem.item.entry.digest,
            selectedItem?.item?.entry?.author.address
        )
        setNotificationList(prev => [...prev, { tx: tx, label: `Add extra Stake ${priceBatch} to space ${selectedItem.space.name}` }])
        stakeCallback(tx)   //callback to dropzone to remove from notsync on tx success
        setTimeout(() => {
            setSelectedItem(null)
        }, 1000)
    }

    const ChangeValueSlider = useCallback((value: number) => {
        setPriceBatch(value)
        setDefaultValue(value)
    }, [])



    return (
        <Root
            open={(selectedItem && selectedItem?.isOpen && selectedItem.type === 'stake') ? true : false}
            onOpenChange={() => {
                setSelectedItem(null)
            }}
            modal={true}>
            <Portal>
                <StyledOverlay />
                <StyledContent>
                    <Box layout='flexBoxRow' css={{ alignItems: 'center', marginBottom: '$2', justifyContent: 'space-between' }}>
                        <Box layout='flexBoxRow' css={{ alignItems: 'center', margin: '0 0 $2 0' }} >
                            <Heading size={'h4'} color={'foregroundText'}>Extra stake</Heading> <Heading size={'h4'} color='highlight' >{selectedItem?.space.name}</Heading></Box>
                        <Info>
                            Stake your tokens for the selected entries. Authors
                            a rewarded based on the amount + time
                            of stacking. You can unstake the tokens after one week.
                            All the entiries will be permanently displayed on your feed.
                        </Info>
                    </Box>

                    <Box layout='flexBoxRow' css={{ width: '100%', position: 'relative' }}>
                        <StyledContainerAll
                            collapsed={false}
                        >
                            <Slider
                                onChange={ChangeValueSlider}
                                color={'highlight'}
                                disabled={false}
                                label={'stake amount'}
                                min={0} />
                        </StyledContainerAll>
                        <StyledContainerAll
                            collapsed={false}
                            css={{ width: '100%' }}
                        >
                            <span>Add extra stake</span>
                            <Box
                                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    const code = e.key
                                    if (Number.isNaN(Number(code))) e.preventDefault();
                                }}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = parseInt(e.target.innerHTML)
                                    if (isNaN(value)) { setPriceBatch(0); return }
                                    setPriceBatch(value)
                                }}
                                suppressContentEditableWarning={true}
                                contentEditable={true}
                                css={{
                                    maxWidth: '100%',
                                    fontSize: '$2',
                                    margin: 0,
                                    outline: 'none',
                                    width: '100%',
                                    color: '$foregroundTextBronze',
                                    minWidth: '$2',
                                    border: 0,
                                    padding: '0'
                                }}

                            >{defaultValue}</Box>
                            <span>● Tokens to add</span>
                        </StyledContainerAll>
                    </Box>

                    {selectedItem && (
                        <StyledContainerItems css={{ marginTop: '$1', alignItems: 'center', justifyContent: 'space-between', display: 'flex', flexDirection: 'row' }}>
                            <StyledContainer css={{ width: '100%' }}>
                                <Box layout='flexBoxRow'>
                                    <Tag isHighlighted={true}>
                                        {selectedItem.item.entry.publication
                                            ? selectedItem.item.entry.publication.ensLabel
                                            : selectedItem.item.entry.author.displayName ? selectedItem.item.entry.author.displayName : AddressPrettyPrint(selectedItem.item.entry.author.address)
                                        }
                                    </Tag>
                                    <Tag isHighlighted={true}>
                                        {selectedItem.item.entry.digest.slice(0, 5)}...
                                    </Tag>
                                </Box>
                                <Box as='p' css={{ padding: '$1', margin: '0', width: '100%' }}>
                                    {selectedItem.item.entry.title}
                                </Box>
                            </StyledContainer>
                            <Box layout='flexBoxColumn' css={{ alignItems: 'center', width: 'fit-content', padding: '0 $2' }}>
                                <Box layout='flexBoxRow' css={{ gap: 0, width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Heading size={'h3'}
                                        css={{
                                            fontFamily: 'Inter',
                                            color: '$foregroundTextBronze',
                                            margin: '0!important',
                                            padding: '0'
                                        }}>
                                        {parseInt(selectedItem.item.staked.toString())}
                                    </Heading>
                                    <Heading size={'h3'} css={{
                                        color: '$foregroundTextBronze',
                                        fontFamily: 'Inter',
                                        margin: '0!important',
                                        padding: '0'
                                    }}>
                                        +
                                    </Heading>
                                    <Heading size={'h3'}
                                        css={{
                                            fontFamily: 'Inter',
                                            margin: '0!important',
                                            color: '$foregroundTextBronze',
                                            padding: '0'
                                        }}
                                    >
                                        {priceBatch}
                                    </Heading>
                                </Box>
                                <Box css={{ width: '100%', color: '$foregroundTextBronze', alignItems: 'center', justifyContent: 'flex-start' }} layout='flexBoxRow'>
                                    <span style={{ whiteSpace: 'nowrap' }}>●&thinsp;Staked</span>&nbsp;<span style={{ whiteSpace: 'nowrap' }}>●&thinsp;Extra</span>
                                </Box>
                            </Box>
                        </StyledContainerItems>)}




                    <Box layout='flexBoxRow' css={{ alignItems: 'center', padding: '$2 0 0 0', justifyContent: 'space-between' }}>
                        {(user?.balance && user?.balance <= priceBatch)
                            ? <Button onClick={AddStake} disabled>Add extra stake</Button>
                            : <>
                                {(user?.allowance?.gov && user?.allowance?.gov >= priceBatch
                                    && user?.balance && user?.balance >= priceBatch)
                                    ? <Button onClick={AddStake}>Add Stake</Button>
                                    :
                                    <Box layout='flexBoxRow'>
                                        <Button onClick={ApproveSpend}>
                                            {isApproved === 'false'
                                                ? <>Approve contract to spend $FEED</>
                                                : <Loader size='small' />
                                            }
                                        </Button>
                                        {isApproved === 'error' && (
                                            <Label>Something went wrong...Try to refresh the page</Label>
                                        )}
                                    </Box>
                                }
                            </>
                        }
                        <Box layout='flexBoxRow'>
                            <Label size='normal'
                                color={(user?.balance && priceBatch >= user?.balance) ? 'error' : 'default'}
                            >Your Balance {user?.balance}&thinsp;● &nbsp;</Label>
                            <Label size='normal'
                                color={(user?.balance && priceBatch >= user?.balance) ? 'error' : 'default'}
                            >Balance after {user?.balance && user.balance - priceBatch >= 0 ? user.balance - priceBatch : 0}&thinsp;● &nbsp;</Label>
                        </Box>
                    </Box>
                    <Box css={{ width: '100%', padding: '$1 0' }}>
                        <Label>Items with 0 values are automatically ignored</Label> <br />
                        <Label>Verify the values before transacting</Label>
                    </Box>

                </StyledContent>
            </Portal>
        </Root>
    )
}

export default ExtraStake
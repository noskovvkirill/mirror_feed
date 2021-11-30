//components
import {StyledContent, StyledOverlay, Root} from '@/design-system/primitives/Dialog'
import Box from '@/design-system/primitives/Box'
import Heading from '@/design-system/primitives/Heading'
import Info from '@/design-system/primitives/Info'
import Button from '@/design-system/primitives/Button'
import Label from '@/design-system/primitives/Label'
import Tag from '@/design-system/primitives/Tag'

//types
import type {TransactionResponse} from '@ethersproject/abstract-provider'
//utils
import {styled, keyframes} from 'stitches.config'
import {useSpace} from 'contexts/spaces'

//state
import React, {useState} from 'react'
import {useRecoilValue, useSetRecoilState} from 'recoil'
import {stakeSelectedItem, NotificationList} from 'contexts'
import {useAuth} from 'contexts/user'


const StyledContainerByItem = styled('div', {
    display:'flex',
    flexDirection:'row',
    padding:'$2', borderRadius:'$2',
    alignItems:'center', justifyContent:'space-between',
    variants:{
        collapsed:{
            true:{
                color:'$foregroundTextBronze',
                backgroundColor:'$highlightBronze', 
                cursor:'initial'    
            },
            false:{
                color:'$foreground',
                backgroundColor:'$tint',
                cursor:'pointer',
                '&:hover':{
                    transition:'$background',
                    backgroundColor:'$foreground',
                    color: '$background'
                },
            }
        }
    },
    defaultVariants:{
        collapsed:'false'
    }
})

const AnimationContentDisplay = keyframes({
    '0%':{opacity:0, transform:`scaleY(0.5) `},
    '100%':{opacity:1, transform:`scaleY(1)`}
})

const StyledContainerItems = styled('div', {
    display:'flex',
    flexDirection:'column',
    borderRadius:'$2',
    backgroundColor:'$highlightBronze',
    // padding:'$2 $1', 
    marginTop:'0',
    transformOrigin:'top center',
    '@media (prefers-reduced-motion: no-preference)': {
            animationName:`${AnimationContentDisplay}`,
            animationDuration: '250ms',
            animationTimingFunction: 'ease-out',
            animationFillMode:'forwards',
            willChange: 'transform, opacity'
        
    }
})

interface IUnstakeTokens {
    unstakeCallback:(tx:TransactionResponse) => void;
}

const UnStakeTokens = ({unstakeCallback}:IUnstakeTokens) => {

    // const [isApproved, setApproved] = useState< "false" | "true" | 'loading' | 'error'>("false")
    const selectedItem = useRecoilValue(stakeSelectedItem);
    const setSelectedItem = useSetRecoilState(stakeSelectedItem);
    const setNotificationList = useSetRecoilState(NotificationList)


    const {
        UnsyncFromSpace,
        // Approve,
    } = useSpace()

    const {user, UpdateAllowance} = useAuth()

//    const ApproveSpend = async () =>{
//         try{
//             setApproved("loading")
//             const tx:TransactionResponse = await Approve('gov')
//             const receipt = await tx.wait()
//             console.log('receipt tx approval', receipt)
//             const res = await UpdateAllowance()
//             if(typeof res !== 'string'){
//                 setApproved("true")
//             }
//         }  catch(e){
//             setApproved('error')
//         }
//     }

    const UnSync = async (e:React.SyntheticEvent) => {
        e.preventDefault()
        if(!selectedItem){
            throw "item was not found"
        }
        const tx = await UnsyncFromSpace(
            selectedItem.space.tokenId, 
            selectedItem.item.entry.digest,
            selectedItem?.item?.entry?.author.address
        )
        setNotificationList(prev => [...prev, {tx:tx, label:`Unstake ${selectedItem?.item?.staked} from space ${selectedItem.space.name}`}])
        unstakeCallback(tx)   //callback to dropzone to remove from notsync on tx success
        setTimeout(()=>{
                setSelectedItem(null)
        },1000)
    }  
    

    return(
        <Root
        open={(selectedItem && selectedItem?.isOpen && selectedItem.type === 'unstake') ? true :false}
        onOpenChange={()=>{
            setSelectedItem(null)
        }}
        modal={true}
        >
            <StyledOverlay/>
            <StyledContent>
                <Box layout='flexBoxRow' css={{alignItems:'center', margin:'0 0 $4 0', justifyContent:'space-between'}}>
                    <Box layout='flexBoxRow' css={{alignItems:'center', userSelect:'none'}} >
                        <Heading size={'h4'} color={'foregroundText'}>Unstake tokens</Heading> <Heading size={'h4'} color='highlight' >{selectedItem?.space.name}</Heading>             
                        </Box> 
                    <Info>
                        Unstaking tokens bla bla 
                    </Info>
                </Box>


                <Box layout='flexBoxColumn' css={{
                        padding:'$1 0'
                    }}>
                    <StyledContainerByItem    
                    collapsed={true}
                    tabIndex={-1} 
                    css={{userSelect:'none'}}
                    >
                        Unstake tokens from selected item
                    </StyledContainerByItem>

                    {selectedItem && (
                        <StyledContainerItems>
                            <Box 
                            tabIndex={0}                              
                            layout='flexBoxColumn'
                            css={{padding:'$2 $3', 
                            boxSizing:'border-box',
                            backgroundColor:'$highlightBronze',
                            color:'$foregroundTextBronze', paddingBottom:'$4', borderRadius:'$2', cursor:'pointer'}}
                            >
                                <Box layout='flexBoxRow'>
                                    <Tag isHighlighted={true}>
                                        {selectedItem.item.entry.publication 
                                        ? selectedItem.item.entry.publication.ensLabel 
                                        : selectedItem.item.entry.author.displayName
                                        }
                                    </Tag>
                                    <Tag isHighlighted={true}>
                                        {selectedItem.item.entry.digest.slice(0,5)}...
                                    </Tag>  
                                </Box>
                                <Box
                                  css={{justifyContent:'space-between', userSelect:'none', alignItems:'center', display:'flex', flexDirection:'row'}}>
                                    <span>{selectedItem.item.entry.title}</span>
                                    <span>{selectedItem.item.staked}&thinsp;●</span>
                                </Box>
                            </Box>
                        </StyledContainerItems>
                    )}
                </Box>

                <Box layout='flexBoxRow' css={{alignItems:'center', padding:'$1 0', justifyContent:'space-between'}}>
                    <Button onClick={UnSync}>Unstake</Button>
                    <Box layout='flexBoxRow'>
                        <Label size='normal'
                        color={'default'}
                        >Your Balance {user?.balance}&thinsp;● &nbsp;</Label>
                        {(selectedItem && user?.balance) && (
                            <Label size='normal'>Balance after {user?.balance-selectedItem?.item?.staked}&thinsp;●</Label>
                        )}
                    </Box>
                </Box> 
                <Box css={{width:'100%', padding:'$1 0'}}>      
                    <Label>Verify the numbers before transacting</Label>  
                </Box>
            </StyledContent>
        </Root>
    )
}

export default UnStakeTokens
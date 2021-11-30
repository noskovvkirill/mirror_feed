import {styled, keyframes} from 'stitches.config'
import React, { useState, useCallback, useEffect } from 'react';

import {useSpace} from 'contexts/spaces'
import { useAuth } from 'contexts/user';

import Button from '@/design-system/primitives/Button'
import Label from '@/design-system/primitives/Label'
import SettingsIcon from '@/design-system/icons/Settings'
import Box from '@/design-system/primitives/Box'
import Loader from '@/design-system/primitives/Loader'
import Tag from '@/design-system/primitives/Tag'
import Heading from '@/design-system/primitives/Heading'
import {StyledContent, StyledTitle, StyledOverlay, Root} from '@/design-system/primitives/Dialog'
import Info from '@/design-system/primitives/Info'
import Slider from '@/design-system/primitives/Slider'
import Item from '@/design-system/StakeTokens/Item'

import {curatedSpaceNotSync} from 'contexts'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMountFamily'
import {useSetRecoilState} from 'recoil'
import {NotificationList} from 'contexts'
import type {TransactionResponse} from '@ethersproject/abstract-provider'

interface IOnAddCurated {
    spaceId:number,
    selectedId:number,
    spaceTitle:string,
    isOpen:boolean;
    setIsOpen:(newState:boolean) => void;
    stakeCallback:(tx:TransactionResponse) => void;
}

const StyledContainerAll = styled('div', {
        width:'fit-content',
        alignItems:'center',
        padding:'$2 $2',
        gap:'$2',
        borderRadius:'$2',
        'span':{
            userSelect:'none'
        },
        variants:{
            collapsed:{
                true:{
                    backgroundColor:'$tint',
                    cursor:'pointer',
                    color:'$foreground'
                },
                false:{
                    // boxShadow:'$large',
                    backgroundColor:'$highlightBronze',
                    cursor:'initial',
                    color:'$foregroundTextBronze',
                }
            }
        },
        defaultVariants:{
            collapsed:'false'
        }
})

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

export const StyledContainerItems = styled('div', {
    display:'flex',
    flexDirection:'column',
    borderRadius:'$2',
    backgroundColor:'$highlightBronze',
    padding:'$2 $1', 
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

const CalculateTotal = (itemsLength:number, priceBatch:number, valuesPerItem:Array<number>, isCollapsed:boolean) => {
    if(isCollapsed){
        return valuesPerItem.reduce((acc, cur) => acc + cur, 0)
    } else {
        return priceBatch*itemsLength
    }
}


const StakeTokens = ({spaceId, selectedId, spaceTitle, isOpen, setIsOpen, stakeCallback }:IOnAddCurated) => {
    const notsync = useRecoilValueAfterMount(curatedSpaceNotSync, {items:[]}, selectedId)
    const setNotSync = useSetRecoilState(curatedSpaceNotSync(selectedId))
    const [isApproved, setApproved] = useState< "false" | "true" | 'loading' | 'error'>("false")
    const setNotificationList = useSetRecoilState(NotificationList)
    const [isCollapsed, setIsCollapsed] = useState(true)
    const [defaultValue, setDefaultValue] = useState<number>(10)
    const [priceBatch, setPriceBatch] = useState<number>(defaultValue)
    const [valuesPerItem, setValuesPerItem] = useState<Array<number>>(new Array(notsync.items.length).fill(10))
   

    const {
        BatchSyncToSpace,
        Approve,
    } = useSpace()
    const {user, UpdateAllowance} = useAuth()

    useEffect(() => {
        setValuesPerItem(new Array(notsync.items.length).fill(10))
    },[notsync.items])

    const ApproveSpend = async () =>{
        try{
            setApproved("loading")
            const tx:TransactionResponse = await Approve('gov')
            const receipt = await tx.wait()
            console.log('receipt tx approval', receipt)
            const res = await UpdateAllowance()
            if(typeof res !== 'string'){
                setApproved("true")
            }
        }  catch(e){
            setApproved('error')
        }
    }

    const BatchSync = async (e:React.SyntheticEvent) => {
        e.preventDefault()
        if(!isCollapsed){
            const items = notsync.items.map((item) => ({
                cid:item.item.digest,
                author:item.item.author.address
            }))
            const tx = await BatchSyncToSpace(spaceId, priceBatch, items)
            setNotificationList(prev => [...prev, {tx:tx, label:`Batch Stake ${priceBatch} to space ${spaceId}`}])
            stakeCallback(tx)   //callback to dropzone to remove from notsync on tx success
            setTimeout(()=>{
                setIsOpen(false)
            },1000)
        } else {
             const items = notsync.items.map((item) => ({
                cid:item.item.digest,
                author:item.item.author.address
            }))
            const tx = await BatchSyncToSpace(spaceId, valuesPerItem, items)
            setNotificationList(prev => [...prev, {tx:tx, label:`Batch Stake to space ${spaceId}`}])
            stakeCallback(tx)  //callback to dropzone to remove from notsync on tx success
            setTimeout(()=>{
                setIsOpen(false)
            },1000)
        }
    }

    // const Stake = async (author:string, digest:string, amount:number) => {
    //     const tx = await SyncToSpace(spaceId, amount, digest, author)
    //     setNotificationList(prev => [...prev, {tx:tx, label:`Stake ${amount} to space ${spaceId}`}])
    // }     
    
    const ChangeValueSlider = useCallback((value:number) => {
        setPriceBatch(value)
        setDefaultValue(value)
    },[])

    const ChangeValueItem = useCallback((index:number, value:number) => {
        setValuesPerItem(arr => {
             return [...arr.slice(0, index), value, ...arr.slice(index + 1)];
        })
    },[])
 
    return(
        <Root
        open={isOpen}
        onOpenChange={setIsOpen}
        modal={true}>
            <StyledOverlay/>
            <StyledContent>
                <Box layout='flexBoxRow' css={{alignItems:'center',  marginBottom:'$2', justifyContent:'space-between'}}>
                    <Box layout='flexBoxRow' css={{alignItems:'center',  margin:'0 0 $2 0'}} ><Heading size={'h4'} color={'foregroundText'}>Stake tokens</Heading> <Heading size={'h4'} color='highlight' >{spaceTitle}</Heading></Box>                     
                    <Info>
                            Stake your tokens for the selected entries. Authors 
                            a rewarded based on the amount + time 
                            of stacking. You can unstake the tokens after one week. 
                            All the entiries will be permanently displayed on your feed. 
                    </Info>
                </Box>

                <Box layout='flexBoxRow' css={{width:'100%', position:'relative'}}>
                {isCollapsed && (
                    <Box 
                    onClick={()=>{if(isCollapsed)setIsCollapsed(false)}}
                    css={{width:'100%', height:'100%', 
                    // mixBlendMode:'multiply',
                    opacity:0.75,
                    pointerEvents:'all',
                    borderRadius:'$2',
                    transition:'$background',
                    '&:hover':{
                        backgroundColor:'$tint',
                        cursor:'pointer'
                    },
                    position:'absolute', left:0, top:0, boxSizing:'border-box',
                    backgroundColor:'transparent'
                    }}>
                    </Box>
                )}
                    <StyledContainerAll
                    collapsed={isCollapsed}
                    onClick={()=>{if(isCollapsed)setIsCollapsed(false)}}>     
                        <Slider 
                        onChange={ChangeValueSlider}
                        color={'highlight'}
                        disabled={isCollapsed}
                        label={'stake amount'}
                        min={0} />   
                    </StyledContainerAll>
                    <StyledContainerAll
                    collapsed={isCollapsed}
                    css={{width:'100%'}}
                    onClick={()=>{if(isCollapsed) setIsCollapsed(false)}}>
                        <span>Batch stake tokens for all entries</span>
                        <Box 
                        onKeyPress={(e:React.KeyboardEvent<HTMLInputElement>)=> {
                        const code = e.key 
                        if (Number.isNaN(Number(code))) e.preventDefault();
                        }}
                        onInput={(e:React.ChangeEvent<HTMLInputElement>)=>{
                            const value = parseInt(e.target.innerHTML)
                            if(isNaN(value)) {setPriceBatch(0); return}
                            setPriceBatch(value)
                        }}
                        suppressContentEditableWarning={true}
                        contentEditable={!isCollapsed}
                        css={{
                        maxWidth:'100%',
                        fontSize:'$2',
                        margin:0,
                        outline:'none',
                        width:'100%',
                        color: !isCollapsed ? '$foregroundTextBronze' : '$foreground',
                        minWidth:'$2',
                        border:0, 
                        padding:'0'
                    }}
                       
                      >{defaultValue}</Box>
                        <span>● Tokens per item</span>
                    </StyledContainerAll>
                </Box>
               

            <Box layout='flexBoxColumn' css={{
                padding:'$2 0'
            }}>

             <StyledContainerByItem
             collapsed={isCollapsed}
             tabIndex={0} 
             onClick={()=>{
                 if(!isCollapsed){setIsCollapsed(!isCollapsed)}
                }}
            >
                  {notsync.items.length} items to stake  
                  <SettingsIcon/>    
             </StyledContainerByItem>

               {isCollapsed && (  
                    <StyledContainerItems>
                            {notsync?.items.map((item, index:number)=>{
                                if(item){
                                return(
                                    <Item 
                                    priceBatch={priceBatch}
                                    index={index}
                                    onChange={ChangeValueItem}
                                    key={item.item.digest}
                                    item={item}
                                    />
                                    )
                                }
                            })} 
                    </StyledContainerItems>
               )}
            </Box>
                
                <Box layout='flexBoxRow' css={{alignItems:'center', padding:'$0 0',justifyContent:'space-between'}}>
                    {(user?.balance && user?.balance <= CalculateTotal(notsync.items.length, priceBatch, valuesPerItem, isCollapsed))
                    ? <Button onClick={BatchSync} disabled>Synchronize items</Button> 
                    : <>
                         {(user?.allowance?.gov && user?.allowance?.gov>=CalculateTotal(notsync.items.length, priceBatch, valuesPerItem, isCollapsed) 
                            && user?.balance && user?.balance >= CalculateTotal(notsync.items.length, priceBatch, valuesPerItem, isCollapsed))
                            ? <Button onClick={BatchSync}>Synchronize items</Button> 
                            : 
                                <Box layout='flexBoxRow'>
                                    <Button onClick={ApproveSpend}>
                                        {isApproved === 'false'
                                        ?  <>Approve contract to spend $FEED</>
                                        :  <Loader size='small'/>
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
                        color={(user?.balance && CalculateTotal(notsync.items.length, priceBatch, valuesPerItem, isCollapsed) >= user?.balance) ? 'error' : 'default'}
                        >Your Balance {user?.balance}&thinsp;● &nbsp;</Label>
                        <Label size='normal'>Total {CalculateTotal(notsync.items.length, priceBatch, valuesPerItem, isCollapsed)}&thinsp;●</Label>
                    </Box>
                </Box> 
                <Box css={{width:'100%', padding:'$1 0'}}>      
                    <Label>Items with 0 values are automatically ignored</Label> <br/>  
                    <Label>Verify the total price before transacting</Label>  
                </Box>

            </StyledContent>
        </Root>
    )
}

export default StakeTokens
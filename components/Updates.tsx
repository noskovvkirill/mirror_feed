import useSWR from "swr"
import Box from '@/design-system/primitives/Box'
import { useEffect, useState } from "react"
import localForage from "localforage"
import { ethers, BigNumber } from 'ethers'
import {GovAbi} from 'contracts/Gov'
import {useAuth} from 'contexts/user'
// const fetcher = (url: string) => fetch(url).then(r => r.json())
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {styled} from 'stitches.config'
import Label from '@/design-system/primitives/Label'
import React from 'react'
import Button from '@/design-system/primitives/Button'
import NotificationsIcon from '@/design-system/icons/Notifications'
import { EntryType } from "@/design-system/Entry"

const StyledCurationButton = styled(DropdownMenu.Trigger, {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    background:'none',
    borderRadius:'$round',
    border:'1px solid $foregroundBorder',
    color:'$foregroundText',
    padding:'$0 $1', 
    cursor:'pointer',
    '&:hover':{
        color:'$background',
        background:'$foregroundBronze',
        border:'1px solid $foregroundBronze',
    },
     '&[data-state="open"]':{
        color:'$background',
        background:'$foregroundBronze',
        border:'1px solid $foregroundBronze',
    },
    variants: {
        isOpen:{
            true:{
                color:'white',
                background: 'radial-gradient(50% 50% at 50% 50%, $foregroundBronze 48.96%, rgba(255,255,255,0.1) 100%)',
                fill:'white',
                'path':{
                    fill:'white'
                }
            },
            false:{}
        }
    },
    defaultVariants:{
        isOpen:false
    }
})




const StyledContainer = styled(DropdownMenu.Content, {
    display:'flex',
    flexDirection:'column',
    zIndex:'100',
    alignItems:'center',
    justifyContent:'center',
    minWidth:'256px',
    boxShadow:'$large',
    gap:'$1',
    boxSizing:'border-box',
    padding:'$1',
    borderRadius:'$2',
    color:'red', 
    position:'absolute',
    border:'1px solid $foregroundBorder',
    background:'$background',
    '@media (prefers-reduced-motion: no-preference)': {
        '&[data-state="open"]': {
            // animationName:`${AnimationContentDisplay}`,
            animationDuration: '400ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode:'forwards',
            willChange: 'transform, opacity'
        }
    }
})


const Updates = () => {

    const {user} = useAuth()
    const [notifications, setNotifications] = useState<EntryType[]>([])
    const getItems = () => {
         const unreadNotifications = localStorage.getItem('mirrorUnReadNotifications')
         if(!unreadNotifications) {setNotifications([]); return}
         const notifications = JSON.parse(unreadNotifications)
         if(notifications && notifications instanceof Array) {
            setNotifications(notifications)
        }
    }

    const Remove = () => {
        localStorage.removeItem('mirrorUnReadNotifications')
        setNotifications([])
    }

    const Sync = async () => {
        if(!user) return
        let updates = []
        const unreadNotifications = localStorage.getItem('mirrorUnReadNotifications')
        if(unreadNotifications) {
            const notifications = JSON.parse(unreadNotifications)
            updates = notifications
        }
        const newLastUpdated = await user.provider?.getBlockNumber()
        const subscribtionList = await localForage.getItem('subscribtionList')
        const lastUpdated:number | string | null = await localForage.getItem('lastNotificationSync')
        if(newLastUpdated - lastUpdated <= 1) return;
        if(subscribtionList instanceof Array) {
                await Promise.all(subscribtionList.map(async (space, index:number)=>{
                try{
                    await fetch(`/api/getUpdates?spaceId=${space.space}&fromBlock=${lastUpdated ? lastUpdated.toString() : 'latest'}`)
                    .then(res => res.json())
                    .then(async ({updates:events})=>{
                        console.log('events new', events)
                        if(events?.length>0) {
                            updates.push({items:events, space:space.space, title:space.title || ''})
                        }
                    })
                    } catch(e){
                        console.log('error getting space updates')
                    }
            }))
            await localForage.setItem('lastNotificationSync', newLastUpdated)
            console.log('updating events', updates)
            localStorage.setItem('mirrorUnReadNotifications', JSON.stringify(updates))
            setNotifications(updates)
        } else {
            await localForage.setItem('lastNotificationSync', newLastUpdated)
            setNotifications(updates)
        }
    }

    useEffect(()=>{
        getItems()
        if(user?.isConnected && user.provider){
        //    Sync()
        }
    },[user])

    return(
        <DropdownMenu.Root>
            <StyledCurationButton>
               <NotificationsIcon/> 
               {/* <Label>{notifications?.length}</Label> */}
            </StyledCurationButton>
                <StyledContainer>
                    {/* <Button onClick={Remove}>
                        Remove Notifications
                    </Button> */}
                    <Box layout='flexBoxColumn'>
                        {notifications.map((space, index)=>{
                            return(
                                <Box key={'notification_SPACE'+index}> 
                                    <h5>{space.space}</h5>
                                    <h5>{space.title}</h5>
                                    {space.items.map((item, indexSpace)=>{
                                        return(<Box key={'notification'+indexSpace+index}>{item.entry.title}</Box>)
                                    })}
                                </Box>
                                )
                            })
                        }
                    </Box>
                    {notifications.length === 0 &&
                        <Box css={{color:'$text'}}>
                          Notifications are in making. Stay tuned!
                        </Box>
                    }
                </StyledContainer>
        </DropdownMenu.Root>
    )
}

export default React.memo(Updates)
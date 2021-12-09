//components
import Box from '@/design-system/primitives/Box'
import Tag from '@/design-system/primitives/Tag'
import Profile from '@/design-system/primitives/Profile'
import Button from '@/design-system/primitives/Button'
import Heading from '@/design-system/primitives/Heading'
//utils
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
//types
import type { SpaceType } from 'contexts/spaces'
//storage
import localForage from 'localforage'
import React, { useEffect, useState } from 'react'

interface IHeader {
    space: SpaceType,
    isOwner: boolean,
    children: React.ReactNode[] | React.ReactNode
}

const Header = ({ space, isOwner, children }: IHeader) => {

    const [isSubscribed, setIsSubscribed] = useState(false)
    // const Fetch = async () => {
    //          if (navigator.serviceWorker) {
    //           console.log('sending to sw')
    //             navigator.serviceWorker.controller?.postMessage({
    //                 type:'subscribe',
    //                 space:space.id
    //             });
    //       }
    // }


    //should be done in a context ... 

    useEffect(() => {
        if (localForage) {
            getSubscribed()
        }
    }, [])

    const getSubscribed = async () => {
        const subscribed = await localForage.getItem('subscribtionList')
        if (subscribed instanceof Array) {
            const item = subscribed.findIndex((item) => (item.space === space.tokenId))
            if (item !== -1) {
                setIsSubscribed(true)
            }
        }
    }

    const UnSubscribe = async () => {
        console.log('unsubscribe')
        if (localForage) {
            const subscribtionList = await localForage.getItem('subscribtionList')
            if (subscribtionList instanceof Array) {
                const index = subscribtionList.findIndex((item) => (item.space === space.tokenId))
                if (index === -1) { setIsSubscribed(false); return; }
                console.log('index unsubscribe', index, subscribtionList)
                const updatedList = [...subscribtionList.slice(0, index), ...subscribtionList.slice(index + 1)];
                localForage.setItem('subscribtionList', updatedList)
                setIsSubscribed(false)
            }
        } else {
            throw "storage was not found"
        }
    }

    const Subscribe = async () => {
        if (localForage) {
            const subscribtionList = await localForage.getItem('subscribtionList')
            if (subscribtionList instanceof Array) {
                localForage.setItem('subscribtionList', [...subscribtionList, {
                    space: space.tokenId,
                    title: space.name
                }])
                setIsSubscribed(true)
            } else {
                localForage.setItem('subscribtionList', [{
                    space: space.tokenId,
                    title: space.name
                }])
                setIsSubscribed(true)
            }
        } else {
            throw "storage was not found"
        }
    }

    return (
        <Box
            layout='flexBoxRow'
            css={{ gap: '0', alignItems: 'flex-start', padding: 'calc($4 * 3) calc($4 * 1)', paddingBottom: 'calc($4 * 1)' }}>
            <Box layout='flexBoxColumn' css={{ padding: '0 calc($4 * 2) 0 0' }}>
                {children}
            </Box>
            <Box layout='flexBoxRow' css={{ gap: '$4' }}>
                {/* <Profile 
                    size={'og'}
                    profile={{avatarURL:space.avatarURL,name:space.name}}/> */}
                <Box layout='flexBoxColumn'>
                    <Box layout='flexBoxRow'>
                        <Profile
                            size={'lg'}
                            profile={{ avatarURL: space.avatarURL, name: space.name }} />
                        &nbsp;&nbsp;
                        <Heading
                            size={'h1'}
                            color={"foregroundText"}>{space.name}&nbsp;</Heading>
                        <Heading
                            size={'h1'}
                            color={"highlight"}>
                            Space #{space.tokenId}
                        </Heading>


                    </Box>

                </Box>
            </Box>

            {!isOwner && (
                <Box layout='flexBoxRow'>
                    {isSubscribed
                        ? <Button onClick={UnSubscribe}>Unsubscribe</Button>
                        : <Button onClick={Subscribe}>
                            Subscribe for updates
                        </Button>
                    }

                </Box>
            )}



        </Box>
    )
}

export default Header
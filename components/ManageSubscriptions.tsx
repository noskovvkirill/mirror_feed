//components
import { StyledContent, StyledOverlay, Root, Trigger, Portal, Title } from '@/design-system/primitives/Dialog'
import Loader from '@/design-system/primitives/Loader'
import Profile from '@/design-system/primitives/Profile'
import Box from '@/design-system/primitives/Box'
import * as Toolbar from '@radix-ui/react-toolbar';
import Heading from '@/design-system/primitives/Heading'
import Label from '@/design-system/primitives/Label'
import SubscribeSettings from '@/design-system/Feed/Header/SubscribeSettings';
// state
import { useEffect, useState } from 'react'
import { supabase } from 'src/client'
import { useRouter } from 'next/router'

import { subscribedSpaces } from 'contexts';
import { useRecoilValueLoadable, useRecoilRefresher_UNSTABLE as useRecoilRefresher } from 'recoil';
import { useAuth } from 'contexts/user'
//types
import { SubscribedPublication } from 'contexts'
import { AddressPrettyPrint } from 'src/utils'
interface IManageSubscriptions {
    children: React.ReactNode;
}

const ManageSubscriptions = ({ children }: IManageSubscriptions) => {
    const { user } = useAuth()
    const router = useRouter()
    const subscribed = useRecoilValueLoadable(subscribedSpaces(user?.id))
    const refreshSubscribed = useRecoilRefresher(subscribedSpaces(user?.id))
    const [selected, setSelected] = useState<Array<string | null>>([null])

    const [isOpen, setIsOpen] = useState(false)

    const Unsubscribe = async (ensLabel: string): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            if (!user || !user.id) { reject('no user'); return }
            if (!user || !user.id) { return }
            const { error } = await supabase.from('user_subscriptions')
                .delete()
                .eq('type', 'PUBLICATION')
                .eq('owner', user.id)
                .eq('publication', ensLabel)
            if (error) {
                reject(error?.message)
                return;
            }
            refreshSubscribed()
            resolve()
        })
    }



    return (
        <Root
            open={isOpen}
            onOpenChange={(openState: boolean) => setIsOpen(openState)}
            modal={true}>
            <Trigger asChild>
                {children}
            </Trigger>
            <Portal>
                <StyledOverlay css={{ zIndex: 100000000000 }} />
                <StyledContent css={{ zIndex: 100000000001 }}>
                    <Title asChild>
                        <Box layout='flexBoxRow' css={{ alignItems: 'center', userSelect: 'none', margin: '0 0 $3 0', }}>
                            <Heading size={'h4'} color={'foregroundText'}>Subscriptions</Heading>
                            <Heading size={'h4'} color={'highlight'}>{(subscribed?.contents && subscribed.state === 'hasValue') ? subscribed.contents.length : 0} Items</Heading>
                        </Box>
                    </Title>
                    {subscribed.state === 'hasValue'
                        ? <Toolbar.Root orientation='vertical'><Box layout='flexBoxColumn'>
                            {subscribed.contents.length <= 0 && (
                                <Label>You don&apos;t have any subscriptions yet</Label>
                            )}
                            {subscribed.contents?.map((item: SubscribedPublication, index: number) => {
                                return (
                                    <Toolbar.Link asChild key={item.displayName + index + 'subscribed_list'}>
                                        <Box
                                            id={item.ensLabel}
                                            onFocus={() => {
                                                if (selected.indexOf(item.ensLabel) === -1) {
                                                    setSelected([...selected, item.ensLabel])
                                                }
                                            }}
                                            onBlur={() => {
                                                setSelected((prevState) => {
                                                    const index = prevState.indexOf(item.ensLabel)
                                                    if (index === -1) { return prevState }
                                                    return [...prevState.slice(0, index), ...prevState.slice(index + 1)];
                                                })
                                            }}
                                            onMouseOver={() => {
                                                if (selected.indexOf(item.ensLabel) === -1) {
                                                    setSelected([...selected, item.ensLabel])
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                if (e.target === document.activeElement) return;
                                                console.log('contains', e.target.contains(document.activeElement))
                                                if (e.target.contains(document.activeElement)) return;
                                                setSelected((prevState) => {

                                                    const index = prevState.indexOf(item.ensLabel)
                                                    if (index === -1) { return prevState }
                                                    return [...prevState.slice(0, index), ...prevState.slice(index + 1)];
                                                })
                                            }}

                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setIsOpen(false)
                                                    router.push(`/${item.ensLabel}`)
                                                }
                                            }}
                                            onClick={() => {
                                                setIsOpen(false)
                                                router.push(`/${item.ensLabel}`)
                                            }}
                                            layout='flexBoxRow' css={{
                                                overflow: 'visible',
                                                cursor: 'pointer',
                                                justifyContent: 'space-between',
                                                alignItems: 'center', padding: '$1 $2',
                                                borderRadius: '$2',
                                                '&:hover': {
                                                    backgroundColor: '$tint',
                                                },
                                                '&:active': {
                                                    backgroundColor: '$tintBronze',
                                                    color: '$foregroundTextBronze'
                                                },
                                                '&:focus': {
                                                    backgroundColor: '$highlightBronze',
                                                    outline: 'none',
                                                    color: '$foregroundTextBronze'
                                                }
                                            }}
                                        >
                                            <Box
                                                layout='flexBoxRow' css={{
                                                    gap: '$2', alignItems: 'center',

                                                }}>
                                                <Profile
                                                    size='sm'
                                                    profile={item} key={index} />
                                                <Label>{item.displayName}</Label>
                                            </Box>
                                            <Box
                                                css={{
                                                    visibility: selected.indexOf(item.ensLabel) !== -1 ? 'visible' : 'hidden',
                                                    color: 'inherit',
                                                    '&:focus': {
                                                        visibility: 'visible',
                                                    },
                                                    '&:active': {
                                                        visibility: 'visible',
                                                    },
                                                }}>
                                                <SubscribeSettings
                                                    onSelect={(parent) => {
                                                        if (selected.indexOf(parent.id) === -1) {
                                                            setSelected([...selected, item.ensLabel])
                                                        }
                                                    }}
                                                    disabled={false}
                                                    isSubscribed={true}
                                                    size='small'
                                                    Unsubscribe={() => {
                                                        return Unsubscribe(item.ensLabel)
                                                    }}

                                                />
                                            </Box>
                                        </Box>
                                    </Toolbar.Link>
                                )
                            })}

                        </Box></Toolbar.Root>
                        : <Loader size='small' />
                    }
                </StyledContent>
            </Portal>

        </Root>
    )
}

export default ManageSubscriptions
//components
import Box from '@/design-system/primitives/Box'
import NotificationsIcon from '@/design-system/icons/Notifications'
import * as Tabs from '@radix-ui/react-tabs';
import Label from '@/design-system/primitives/Label'
import Tag from '@/design-system/primitives/Tag'
import { StyledTabsList, StyledTabsTrigger, StyledTabsContent } from '@/design-system/Settings'
import ButtonPopover from "@/design-system/primitives/ButtonPopover"
import * as Switch from '@radix-ui/react-switch';
import Info from '@/design-system/primitives/Info'
import Input from '@/design-system/primitives/Input'
import EditIcon from '@/design-system/icons/RemoveCircled'
import Button from '@/design-system/primitives/Button'
import Link from 'next/link'
//state
import { useEffect, useState } from "react"
import { useAuth } from 'contexts/user'
import React from 'react'
import { supabase } from 'src/client'
import { styled } from 'stitches.config'
//utils
import { parseDate } from 'src/date'
//types
import type { EntryType } from "@/design-system/Entry"

const StyledSwitch = styled(Switch.Root, {
    all: 'unset',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '$highlightBronze',
    borderRadius: '$2',
    position: 'relative',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    '&:focus': { boxShadow: `$small` },
    '&[data-state="checked"]': { backgroundColor: '$highlight' },
});

const StyledThumb = styled(Switch.Thumb, {
    display: 'block',
    width: '50%',
    height: '33px',
    cursor: 'pointer',
    backgroundColor: '$text',
    borderRadius: '$2',
    boxShadow: '$normal',
    transition: 'transform 100ms',
    transform: 'translateX(2px)',
    willChange: 'transform',
    '&[data-state="checked"]': {
        backgroundColor: '$foregroundBronze',
        transform: 'translateX(100%)'
    },
});


const Updates = () => {

    const { user } = useAuth()
    const [emailState, setEmailState] = useState
        <"default" | "confirm" | string>
        ("default");

    const [notifications, setNotifications] = useState<EntryType[]>([])
    const [notificationSettings, setNotificationSettings] = useState<any>({
        delivery: null,
        email: null,
        areNotificationsEnabled: null,
        schedule: null
    })

    const getItems = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('user_notifications')
            .select('created_at, isSend, entry(title, publication, digest)')
            .eq('owner', user.id)
            .limit(5)
        if (!data) { return }
        setNotifications(data)
    }

    const getUserEmail = async () => {
        if (!user) return
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
        if (!data) { return }
        setNotificationSettings(data[0])
        console.log('email', data, error)
    }

    const RemoveEmail = async () => {
        if (!user) return;
        const notificationSettingsCurrent = notificationSettings
        setNotificationSettings({
            delivery: null,
            email: null,
            areNotificationsEnabled: null,
            schedule: null
        })
        const { error } = await supabase
            .from('users')
            .update({ email: null, areNotificationsEnabled: false })
            .eq('id', user.id)
            .single()

        if (error) {
            setNotificationSettings(notificationSettingsCurrent)
        }
    }

    const ChangeUserEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement & {
            email: {
                value: string
            }
        }
        const email = target.email.value
        try {
            await fetch('/api/email/generateConfirmation', {
                method: 'POST',
                body: JSON.stringify({
                    emailAddress: email,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(d => {
                    if (d.ok) {
                        return d.json()
                    } else {
                        if (d.status === 409) {
                            throw new Error('Someone else is already using this email');
                        }
                        throw new Error('Something went terribly wrong');
                    }
                })
                .then(() => {
                    setEmailState('confirm')
                })
                .catch((e) => {
                    setEmailState(e.toString())
                })

        }
        catch (e) {
            setEmailState(JSON.stringify(e))
            console.log('something went wrong setting your email', e)
        }

    }

    const ChangeNotificationType = async (newState: boolean) => {
        if (!user || !user.id) return;
        const newSchedule = newState !== true ? "DAILY" : "WEEKLY"
        setNotificationSettings((settings: any) => {
            return ({
                delivery: settings.delivery,
                email: settings.email,
                areNotificationsEnabled: settings.areNotificationsEnabled,
                schedule: newSchedule
            })
        })
        const { error } = await supabase.from('users')
            .update({ schedule: newSchedule })
            .eq('id', user.id)
        if (error) {
            setNotificationSettings((settings: any) => {
                return ({
                    delivery: settings.delivery,
                    email: settings.email,
                    areNotificationsEnabled: settings.areNotificationsEnabled,
                    schedule: newSchedule === 'DAILY' ? 'WEEKLY' : 'DAILY'
                })
            })
        }
    }

    const ChangeNotificationSchedule = async (newState: boolean) => {
        if (!user || !user.id) return;
        const delivery = newState === true ? "NIGHT" : "DAY"
        setNotificationSettings((settings: any) => {
            return ({
                delivery: delivery,
                email: settings.email,
                areNotificationsEnabled: settings.areNotificationsEnabled,
                schedule: settings.schedule
            })
        })
        const { error } = await supabase.from('users')
            .update({ delivery: delivery })
            .eq('id', user.id)
        if (error) {
            setNotificationSettings((settings: any) => {
                return ({
                    delivery: delivery === "NIGHT" ? "DAY" : "NIGHT",
                    email: settings.email,
                    areNotificationsEnabled: settings.areNotificationsEnabled,
                    schedule: settings.schedule
                })
            })
        }
    }


    useEffect(() => {
        if (user && user.id) {
            getUserEmail()
            getItems()
        }
    }, [user])

    return (
        <ButtonPopover
            icon={<NotificationsIcon />} label='change' isHighlighted={true}
        >
            {/* <StyledCurationButton> */}

            {/* <Label>{notifications?.length}</Label> */}
            {/* </StyledCurationButton> */}
            {/* <StyledContainer> */}
            <Tabs.Root defaultValue={'notifications'}>
                <Box layout='flexBoxRow' css={{ alignItems: 'center', boxSizing: 'border-box', padding: '$2 $2', justifyContent: 'space-between' }}>

                    <StyledTabsList css={{ boxSizing: 'border-box', color: '$foregroundText' }}>
                        <StyledTabsTrigger value='notifications'>Updates</StyledTabsTrigger>
                        <StyledTabsTrigger value='settings'>Settings</StyledTabsTrigger>
                    </StyledTabsList>
                    <Box css={{
                        minWidth: "33px",
                        width: "33px",
                        height: "33px",
                        display: 'flex',
                        // outline: '1px solid $foreground',
                        boxShadow: '$outline',
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
                        <NotificationsIcon />
                    </Box>
                </Box>


                <StyledTabsContent value='notifications'>
                    <Box layout='flexBoxColumn' css={{ padding: '0 $2 $2 $2', maxHeight: '256px', overflow: 'scroll' }}>
                        {notifications.map((space, index) => {
                            return (
                                <Box
                                    layout='flexBoxColumn'
                                    key={'notification' + index} css={{
                                        padding: '$1 0',
                                        paddingRight: '$4'
                                    }}>
                                    <Box layout='flexBoxRow'>
                                        <Tag css={{ height: '$3' }}>{parseDate(space?.created_at)}</Tag>
                                        <Tag css={{ height: '$3' }}>{space?.entry?.publication?.ensLabel}</Tag>
                                    </Box>

                                    <Link passHref
                                        href={`/${space?.entry?.publication?.ensLabel}/${space?.entry.digest}`}
                                    ><Label css={{
                                        color: '$foregroundText',
                                        cursor: 'pointer', '&:hover': { color: '$foregroundTextBronze' }
                                    }}>{space.entry?.title}</Label></Link>
                                </Box>
                            )
                        })
                        }
                    </Box>
                    {(notifications.length === 0 && notificationSettings?.email) &&
                        <Box css={{ padding: '0 $2 $4 $2', color: '$foregroundText' }}>
                            Nothing here just yet.
                        </Box>
                    }
                    {!notificationSettings?.email && (
                        <Box css={{ padding: '0 $2 $4 $2', color: '$foregroundText' }}>
                            Enable notifications in settings.
                        </Box>
                    )}
                </StyledTabsContent>

                {!notificationSettings?.email && (
                    <StyledTabsContent value='settings'>
                        {emailState !== 'confirm' && (
                            <Box
                                as='form'
                                onSubmit={ChangeUserEmail}
                                layout='flexBoxColumn' css={{ padding: '$1 $2 $2 $2', gap: '$1', boxSizing: 'border-box' }}>
                                <Input
                                    type='email'
                                    name='email'
                                    placeholder={'Your email'}
                                    css={{
                                        border: '0',
                                        backgroundColor: '$highlightBronze', borderRadius: '$2', padding: '$0 $1',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        color: '$foregroundTextBronze',
                                        '&::placeholder': {
                                            color: '$foregroundTextBronze'
                                        }
                                    }} />
                                <Button type='submit'>Enable notifications</Button>
                                {(emailState !== "default" && emailState !== "confirm") && (
                                    <Box><Label css={{ color: '$foregroundTextBronze' }}>{emailState.toString()}</Label></Box>
                                )}
                            </Box>)}

                        {emailState === 'confirm' && (
                            <Box layout='flexBoxColumn' css={{ padding: '$1 $2 $2 $2', gap: '$1', boxSizing: 'border-box' }}>
                                <Box>
                                    <Label css={{ color: '$foregroundTextBronze' }}>
                                        Check your inbox for email confirmation
                                    </Label>
                                </Box>
                            </Box>
                        )}

                    </StyledTabsContent>
                )}
                {notificationSettings?.email && (
                    <StyledTabsContent value='settings'>
                        <Box layout='flexBoxColumn' css={{ padding: '$1 $2 $2 $2', gap: '$2', boxSizing: 'border-box' }}>
                            <Box tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        console.log('edit email')
                                    }
                                }}
                                onClick={() => {
                                    console.log('edit email')
                                }}
                                layout='flexBoxRow' css={{
                                    backgroundColor: '$highlightBronze', borderRadius: '$2', padding: '$0 $1',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    color: '$foregroundTextBronze'
                                }}>
                                <Label css={{ color: 'inherit' }}>{notificationSettings.email}</Label>
                                <Button
                                    onClick={RemoveEmail}
                                    css={{ padding: '0', borderColor: 'transparent', color: '$foregroundTextBronze' }}><EditIcon label='edit email' /></Button>
                            </Box>
                            <Box as='section' layout='flexBoxColumn' >
                                <Box layout='flexBoxRow' css={{ color: '$foregroundText' }}>
                                    <Label css={{ color: '$foregroundText' }}>What is your preferred schedule?</Label>
                                    <Info>
                                        Digest sends you a summary of what&apos;s happening accross your subscriptions or suggests new content.<br />
                                        On demand only sends you a notification when the authors you follow publish a new entry.
                                    </Info>
                                </Box>
                                <StyledSwitch
                                    onCheckedChange={ChangeNotificationType}
                                    css={{
                                        backgroundColor: notificationSettings?.schedule !== 'WEEKLY' ? '$highlightBronze' : '$background'
                                    }}
                                    checked={notificationSettings?.schedule === 'WEEKLY' ? true : false}
                                >
                                    <Box
                                        css={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            justifyContent: 'space-around',
                                            alignItems: 'center',
                                            padding: '0 0',
                                            position: 'absolute', color: '$background', height: '100%', width: '100%', boxSizing: 'border-box', zIndex: '10000000'
                                        }}>
                                        <Box css={{
                                            textAlign: 'center',
                                            color: notificationSettings?.schedule === 'DAILY' ? '$background' : '$foregroundText'

                                        }}><Label>DAILY</Label></Box>
                                        <Box css={{
                                            textAlign: 'center',
                                        }}><Label css={{
                                            color: notificationSettings?.schedule !== 'WEEKLY' ? '$foregroundTextBronze' : '$background'

                                        }}>WEEKLY</Label></Box>
                                    </Box>
                                    <StyledThumb />
                                </StyledSwitch>
                            </Box>

                            <Box as='section' layout='flexBoxColumn' >


                                <Label css={{ color: '$foregroundText' }}>When do you want to receive the notifications?</Label>
                                <StyledSwitch
                                    css={{
                                        backgroundColor: notificationSettings?.delivery === 'DAY' ? '$highlightBronze' : '$background'
                                    }}
                                    onCheckedChange={ChangeNotificationSchedule}
                                    checked={notificationSettings?.delivery === 'DAY' ? false : true}>
                                    <Box
                                        layout='flexBoxRow'
                                        css={{
                                            pointerEvents: 'none',
                                            justifyContent: 'space-around',
                                            alignItems: 'center',
                                            padding: '0 0',
                                            position: 'absolute', color: '$background', height: '100%', width: '100%', boxSizing: 'border-box', zIndex: '10000000'
                                        }}>
                                        <Label
                                            css={{

                                            }}
                                            size='normal'>🌞</Label>
                                        <Label size='normal'>🌚</Label>
                                    </Box>
                                    <StyledThumb></StyledThumb>
                                </StyledSwitch>
                            </Box>
                        </Box>
                    </StyledTabsContent>
                )}

            </Tabs.Root>
            {/* </StyledContainer> */}

        </ButtonPopover >
    )
}

export default React.memo(Updates)
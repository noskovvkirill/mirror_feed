import * as Avatar from '@radix-ui/react-avatar';
import * as HoverCard from '@radix-ui/react-hover-card';

import Box from '@/design-system/primitives/Box'
import Image from 'next/image'
import Heading from '@/design-system/primitives/Heading'
import Button from '@/design-system/primitives/Button'
import Label from '@/design-system/primitives/Label'
import Link from 'next/link'
import Tag from '@/design-system/primitives/Tag'

//utils
import { styled } from 'stitches.config'
import { utils } from 'ethers'
//types
import type { SubscribedPublication } from 'contexts'
import type { SpaceTypeProfile, SpaceTop } from 'contexts/spaces'
import type { UserTypeProfile } from 'contexts/user'
import { AddressPrettyPrint } from 'src/utils'

export type ProfileTypes = UserTypeProfile | SubscribedPublication | SpaceTypeProfile | SpaceTop

interface IProfile {
    profile: ProfileTypes,
    size?: 'og' | 'lg' | 'md' | 'sm',
    isSelected?: boolean,
    isHover?: boolean,
}

export const StyledAvatar = styled(Avatar.Root, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
    overflow: 'hidden',
    userSelect: 'none',
    boxShadow: '$inner',
    borderRadius: '100%',
    backgroundColor: '$backgroundText',
    variants: {
        isSelected: {
            true: {
                outlineColor: '$foregroundBronze',
                outlineOffsetColor: '$foreground',
                outlineStyle: 'solid',
                outlineWidth: '3px',
            },
            false: {
                outlineStyle: 'solid',
                outlineColor: '$foreground',
                outlineOffsetColor: '$foreground',
            }
        },
        size: {
            og: {
                width: 'calc($4 * 3)',
                height: 'calc($4 * 3)',
                '&:hover': {
                    outline: '4px solid inherit',
                },
            },
            lg: {
                outlineWidth: '3px',
                width: 'calc($4 * 1.5)',
                height: 'calc($4 * 1.5)',
                '&:hover': {
                    outlineWidth: '4px',
                },
            },
            md: {
                outlineWidth: '2px',
                width: '$4',
                height: '$4',
                '&:hover': {
                    outlineWidth: '4px',
                },
            },
            sm: {
                outlineWidth: '3px',
                width: 'calc($4 * 0.8)',
                height: 'calc($4 * 0.8)',
                '&:hover': {
                    outlineWidth: '4px',
                },
            }
        }
    },
    defaultVariants: {
        size: 'md',
        isSelected: false,
    }
});

const StyledImage = styled(Avatar.Image, {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 'inherit',
});

const StyledFallback = styled(Avatar.Fallback, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$highlightBronze',
    color: '$foregroundTextBronze',
    fontSize: '$6',
    lineHeight: 1,
    fontWeight: 500,
    overflow: 'hidden',
    variants: {
        size: {
            og: {
                width: 'calc($4 * 3)',
                height: 'calc($4 * 3)',
                '&:hover': {
                    outline: '4px solid $foreground',
                },
            },
            lg: {
                outline: '3px solid $foreground',
                width: 'calc($4 * 1.5)',
                height: 'calc($4 * 1.5)',
                '&:hover': {
                    outline: '4px solid $foreground',
                },
            },
            md: {
                outline: '3px solid $foreground',
                width: '$4',
                height: '$4',
                '&:hover': {
                    outline: '4px solid $foreground',
                },
            },
            sm: {
                outline: '3px solid $foreground',
                width: 'calc($4 * 0.8)',
                height: 'calc($4 * 0.8)',
                '&:hover': {
                    outline: '4px solid $foreground',
                },
            }
        }
    },
    defaultVariants: {
        size: 'md'
    }
});

const StyledContentTooltip = styled(HoverCard.Content, {
    backgroundColor: '$background',
    border: '1px solid $foregroundBorder',
    width: '320px',
    boxSizing: 'border-box',
    color: '$foregroundText',
    fontSize: '$6',
    borderRadius: '$2',
    padding: '$2',
    position: 'relative',
    bottom: '$0',
    boxShadow: '$large',
})

const StyledTrigger = styled(HoverCard.Trigger, {
    cursor: 'pointer',
    background: 'transparent',
    border: '0px'
})

export const isUser = (x: any): x is UserTypeProfile => x && x.address;
export const isPublication = (x: any): x is SubscribedPublication => x && x.ensLabel;
export const isSpace = (x: any): x is SpaceTypeProfile => x && x.name;
export const isSpaceExpanded = (x: any): x is SpaceTop => x && x.staked;


const Profile = ({ profile, size = 'md', isSelected = false, isHover = true }: IProfile) => {
    return (
        <HoverCard.Root openDelay={!isHover ? 3000 : 500}>
            <StyledTrigger >
                <StyledAvatar size={size} isSelected={isSelected}>
                    <StyledImage
                        src={profile?.avatarURL && profile.avatarURL}
                        alt={'user avatar'}
                    />
                    <StyledFallback size={size} delayMs={600}>
                        {profile && isUser(profile) && (
                            <>
                                {profile.displayName
                                    ? <>{profile?.displayName.match(/(\b\S)?/g)?.join("")?.match(/(^\S|\S$)?/g)?.join("").toUpperCase()} </>
                                    : <>
                                        {profile.address &&
                                            <>{AddressPrettyPrint(profile.address, 4)}</>
                                        }
                                    </>
                                }
                            </>
                        )}
                        {profile && isPublication(profile) && (
                            <>
                                {profile?.ensLabel.match(/(\b\S)?/g)?.join("")?.match(/(^\S|\S$)?/g)?.join("").toUpperCase()}
                            </>
                        )}
                        {profile && isSpace(profile) && (
                            <>
                                {profile?.name?.slice(0, 9)}
                            </>
                        )
                        }
                    </StyledFallback>
                </StyledAvatar>
            </StyledTrigger>

            <StyledContentTooltip side="top">
                {isUser(profile) &&
                    <Box layout='flexBoxRow' css={{ width: '100%', gap: '$2', alignItems: 'flex-start' }}>
                        <Box layout='flexBoxRow' css={{ boxShadow: '$inner', minWidth: '64px', overflow: 'hidden', border: '1px solid $foregroundBorder', alignItems: 'center', justifyContent: 'center', borderRadius: '$round', backgroundColor: '$highlight', width: '64px', height: '64px' }}>
                            {profile.avatarURL && (
                                <Image src={profile?.avatarURL} objectFit={'cover'} alt='image' width={'64'} height={'64'} />
                            )}
                            {!profile.avatarURL && (
                                <Heading size={'h3'}>
                                    {profile.displayName
                                        ? <>{profile?.displayName.match(/(\b\S)?/g)?.join("")?.match(/(^\S|\S$)?/g)?.join("").toUpperCase()} </>
                                        : <>{profile.address &&
                                            <>{AddressPrettyPrint(profile.address, 4)}</>
                                        }
                                        </>
                                    }
                                </Heading>

                            )}
                        </Box>
                        <Box layout='flexBoxColumn' css={{ width: '100%' }}>
                            <Box layout='flexBoxRow' css={{ width: '100%', gap: '$4', overflow: 'hidden', boxSizing: 'border-box', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <Heading size={'h5'} css={{ hyphens: 'auto', overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                                    {profile.displayName
                                        ? <>{profile?.displayName} </>
                                        : <>{profile.address &&
                                            <>{AddressPrettyPrint(profile.address, 8)}&thinsp;...</>
                                        }
                                        </>
                                    }
                                </Heading>
                                <Box layout='flexBoxRow' css={{ alignItems: 'flex-start' }}>
                                    {/* <Link passHref href={`/space/${profile.displayName}`}>
                                        <Button>Open space</Button>
                                    </Link> */}
                                    <Label css={{ fontWeight: '500' }}>Publications</Label><Label css={{ borderRadius: '$round', backgroundColor: '$highlight', padding: '0 $1' }}>{profile.publications?.length || 0}</Label>
                                </Box>
                            </Box>

                            <Box as='ul' css={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '$1', listStyle: 'none', color: '$foregroundText' }}>
                                {profile.publications?.map((publication) => {
                                    return (<Tag as={'li'} key={publication.id}>{publication.ensLabel}</Tag>)
                                })}
                            </Box>
                        </Box>



                    </Box>
                }
                {isPublication(profile) &&
                    <Box>
                        {profile.ensLabel}

                    </Box>
                }
                {isSpace(profile) &&
                    <Box layout='flexBoxColumn' css={{ width: '100%', gap: '$2', alignItems: 'flex-start' }}>
                        <Box layout='flexBoxRow' css={{ justifyContent: 'space-between', width: '100%', }}>
                            <Box css={{ overflow: 'hidden', boxShadow: '$inner', border: '1px solid $foregroundBorder', borderRadius: '$round', width: '64px', height: '64px' }}>
                                <Image src={profile?.avatarURL} objectFit={'cover'} alt='image' width={'64'} height={'64'} />
                            </Box>
                            <Link passHref href={`/space/${profile.tokenId}`}>
                                <Button>Open space</Button>
                            </Link>
                        </Box>
                        {isSpaceExpanded(profile) && (
                            <Box layout='flexBoxColumn' css={{ padding: '0 0 $1 0' }}>
                                <Heading size={'h5'}>{profile?.name}</Heading>
                                <Label>{profile?.staked && profile?.staked}&thinsp;● Staked</Label>
                                <Label>{profile?.owner && AddressPrettyPrint(profile.owner)}</Label>
                            </Box>
                        )}
                    </Box>}
            </StyledContentTooltip>
        </HoverCard.Root>
    )
}

export default Profile
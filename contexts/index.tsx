import { atom, atomFamily, AtomEffect, selectorFamily } from 'recoil'
import { history } from '@/design-system/Layout'
import { EntryType } from '@/design-system/Entry'
import { queryEntry } from 'src/queries'
import { spaceEntries } from 'src/queriesFEED'
import { userSpaces as queryUserSpaces } from 'src/queriesFEED'

import { request } from 'graphql-request'
import { ethers } from 'ethers'
import { SpaceType } from 'contexts/spaces'

export type Publication = {
    type: 'personal' | 'ens',
    ensLabel: string
}
export type CurrentArticle = {
    publication: Publication | null,
    title: string | null | undefined,
    digest: string | null | undefined,
    author: string | null
}

export type IgnoredPublication = {
    ensLabel: string
}

// export type CurationList = {
//     title: string,
//     avatar?: string,
//     publications: SubscribedPublication[]
// }

export type SubscribedPublication = Publication & {
    avatarURL?: string,
    displayName: string,
}

export type PinnedItem = {
    id: number
    type: 'entry'
    item: EntryType
}




export type ReadingListItem = {
    title: string,
    entryDigest: string,
    ensLabel: string
}

export type ReadSettings = {
    columns: number,
    fontSize: number | "default",
    fontColor: string | "default",
    backgroundColor: string | "default",
    isEditions: boolean,
    isCrowdfund: boolean,
    isProposal: boolean,
    isAuction: boolean,
}

export type Notification = {
    label: string,
    tx: any,
}

export const NotificationList = atom({
    key: 'notificationList',
    default: [] as Notification[],
})


export const Current = atom({
    key: 'currentArticle',
    default: null as CurrentArticle | null,
})


//controls open/close of the navigation (aka portal)
export const portalState = atom({
    key: 'isPortal',
    default: { isPortal: false, modal: true } as { isPortal: boolean, modal?: boolean },
})


const ignoredPublicationEffect = (): AtomEffect<IgnoredPublication[]> => ({ setSelf, onSet, trigger }) => {
    const loadPersisted = () => {
        if (trigger === 'get' && typeof localStorage !== 'undefined') {
            const ignoredList = localStorage.getItem('mirror-ignored-publication')
            if (ignoredList) {
                setSelf(JSON.parse(ignoredList))
            }
        }
    }

    loadPersisted();

    onSet((newValue: IgnoredPublication[], oldValue: any) => {
        if (newValue instanceof Array) {
            localStorage.setItem('mirror-ignored-publication', JSON.stringify(newValue))
            history.push({
                label: `${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`,
                undo: () => {
                    setSelf(oldValue);
                },
            });
        }

    })
}

export const ignoredPublication = atom({
    key: 'ignoredList',
    default: [] as IgnoredPublication[],
    effects_UNSTABLE: [ignoredPublicationEffect()]
})


const pinnedItemsEffect = (): AtomEffect<PinnedItem[]> => ({ setSelf, onSet, trigger }) => {
    const loadPersisted = () => {
        if (trigger === 'get' && typeof localStorage !== 'undefined') {
            const sessionList = sessionStorage.getItem('mirror-pinned-items')
            if (sessionList) {
                setSelf(JSON.parse(sessionList))
            }
        }
    }

    loadPersisted();

    onSet((newValue: PinnedItem[], oldValue: any) => {
        if (newValue instanceof Array) {
            sessionStorage.setItem('mirror-pinned-items', JSON.stringify(newValue))
            history.push({
                label: `${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`,
                undo: () => {
                    setSelf(oldValue);
                },
            });
        }
    })
}

export const pinnedItems = atom({
    key: 'pinnedItemsList',
    default: [] as PinnedItem[],
    effects_UNSTABLE: [pinnedItemsEffect()]
})


const readLaterEffect = (): AtomEffect<ReadingListItem[]> => ({ setSelf, onSet, trigger }) => {
    const loadPersisted = () => {
        if (trigger === 'get' && typeof localStorage !== 'undefined') {
            const ignoredList = localStorage.getItem('mirror-read-later-items')
            if (ignoredList) {
                setSelf(JSON.parse(ignoredList))
            }
        }
    }

    loadPersisted();

    onSet((newValue: ReadingListItem[], oldValue: any) => {
        if (newValue instanceof Array) {
            localStorage.setItem('mirror-read-later-items', JSON.stringify(newValue))
            history.push({
                label: `${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`,
                undo: () => {
                    setSelf(oldValue);
                },
            });
        }
    })
}

export const readLaterList = atom({
    key: 'readLaterList',
    default: [] as ReadingListItem[],
    effects_UNSTABLE: [readLaterEffect()]
})



const CurrationEffect = (): AtomEffect<SubscribedPublication[]> => ({ setSelf, onSet, trigger }) => {
    const loadPersisted = () => {
        if (trigger === 'get' && typeof localStorage !== 'undefined') {
            const ignoredList = localStorage.getItem('mirror-curated-publication-items-new')
            if (ignoredList) {
                setSelf(JSON.parse(ignoredList))
            }
        }
    }
    loadPersisted();
    onSet((newValue: SubscribedPublication[], oldValue: any) => {
        if (newValue instanceof Array) {
            localStorage.setItem('mirror-curated-publication-items-new', JSON.stringify(newValue))
            history.push({
                label: `${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`,
                undo: () => {
                    setSelf(oldValue);
                },
            });
        }
    })
}

export const curationItems = atom({
    key: 'curationList',
    default: [] as SubscribedPublication[],
    effects_UNSTABLE: [CurrationEffect()]
})

export const subscribedSpaces = selectorFamily({
    key: 'userSpaces',
    get: (id: string | undefined) => async () => {
        if (!id || id === '') return []
        const { data: subscribtions } = await fetch(`/api/getSubscribtions?owner_id=${id}`).then(res => res.json())
        return subscribtions
    }
})



const SettingsEffect = (): AtomEffect<ReadSettings> => ({ setSelf, onSet, trigger }) => {
    const loadPersisted = () => {
        if (trigger === 'get' && typeof localStorage !== 'undefined') {
            const ignoredList = localStorage.getItem('mirror-read-settings')
            if (ignoredList) {
                setSelf(JSON.parse(ignoredList))
            }
        }
    }
    loadPersisted();
    onSet((newValue: ReadSettings, oldValue: any) => {
        localStorage.setItem('mirror-read-settings', JSON.stringify(newValue))
        history.push({
            label: `${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`,
            undo: () => {
                setSelf(oldValue);
            },
        });
    })
}

export const readSettingsDefault: ReadSettings = {
    columns: 1,
    fontSize: "default",
    fontColor: "default",
    backgroundColor: "default",
    isEditions: true,
    isProposal: true,
    isCrowdfund: true,
    isAuction: true
}

export const readSettings = atom({
    key: 'readSettings',
    default: readSettingsDefault as ReadSettings,
    effects_UNSTABLE: [SettingsEffect()]
})

type AppSettings = {
    view: 'card' | 'list'
}

const AppSettingsEffect = (): AtomEffect<AppSettings> => ({ setSelf, onSet, trigger }) => {
    const loadPersisted = () => {
        if (trigger === 'get' && typeof localStorage !== 'undefined') {
            const appSettings = localStorage.getItem('mirror-app-settings')
            if (appSettings) {
                setSelf(JSON.parse(appSettings))
            }
        }
    }
    loadPersisted();
    onSet((newValue: AppSettings) => {
        localStorage.setItem('mirror-app-settings', JSON.stringify(newValue))
    })
}

export const settings = atom({
    key: 'app-settings',
    default: {
        view: 'card'
    } as AppSettings,
    effects_UNSTABLE: [AppSettingsEffect()]
})

const SelectedSpaceNotSyncEffect = (): AtomEffect<number> => ({ setSelf, onSet, trigger }) => {
    const loadPersisted = () => {
        if (trigger === 'get' && typeof localStorage !== 'undefined') {
            const selected = localStorage.getItem('mirror-space-selected-last')
            if (selected && typeof selected === 'string') {
                setSelf(parseInt(selected))
            }
        }
    }
    loadPersisted();
    onSet((newValue: number) => {
        if (typeof newValue === "number") {
            localStorage.setItem('mirror-space-selected-last', newValue.toString())
        }
    })
}


export const curatedSpaceNotSyncSelected = atom({
    key: 'curatedSpaceNotSyncSelected',
    default: 0 as number,
    effects_UNSTABLE: [SelectedSpaceNotSyncEffect()]
})

export type CuratedSpaceItem = PinnedItem


export type CuratedSpaceNotSync = {
    items: CuratedSpaceItem[]
}


const CuratedSpaceNotSyncEffect = (params: any): AtomEffect<CuratedSpaceNotSync> => ({ setSelf, onSet, trigger }) => {
    const loadPersisted = () => {
        if (trigger === 'get' && typeof localStorage !== 'undefined') {
            const curatedItemsList = localStorage.getItem(`mirror-curated-space-item-not-synced-${params}`)
            if (curatedItemsList) {
                setSelf(JSON.parse(curatedItemsList))
            }
        }
    }
    loadPersisted();
    onSet((newValue: CuratedSpaceNotSync, oldValue: any) => {
        localStorage.setItem(`mirror-curated-space-item-not-synced-${params}`, JSON.stringify(newValue))
        history.push({
            label: `${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`,
            undo: () => {
                setSelf(oldValue);
            },
        });
    })
}


export const curatedSpaceNotSync = atomFamily({
    key: 'curatedSpaceNotSync',
    default: {
        items: []
    } as CuratedSpaceNotSync,
    effects_UNSTABLE: (params: any) => [CuratedSpaceNotSyncEffect(params)]
})


export type CuratedSpace = {
    title: string,
    items: CuratedSpaceItem[]
}

export const userSpaces = selectorFamily({
    key: 'userSpaces',
    get: (address: string) => async () => {
        const endpoint = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT
        if (!address || address === '') return []
        if (!endpoint) throw "graphql endpoint was not found";
        const { spaces }: { spaces: SpaceType[] } = await request(endpoint, queryUserSpaces, { owner: address })
        return spaces
    }
})

const FetchCurated = async (id: number) => {
    const endpoint = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT
    if (!endpoint) return;
    const { space } = await request(endpoint, spaceEntries, { id: id.toString() })
    const items = space.items.map(({ entry, totalStaked, lastStakeTimestamp }: any) => {
        return {
            cid: entry.cid,
            staked: ethers.utils.formatEther(totalStaked.toString()),
            totalStaked: ethers.utils.formatEther(entry.totalStaked.toString()),
            lastStakeTimestamp: lastStakeTimestamp.toString()
        };
    })

    return items
}


export const curatedSpaceSynced = selectorFamily({
    key: 'curatedSpaceSync',
    get: (address: string) => async ({ get }) => {
        const selectedSpace = get(curatedSpaceNotSyncSelected)
        const spaces = get(userSpaces(address))

        const spaceId = spaces[selectedSpace].tokenId
        const items: { cid: string, stacked: number }[] = await FetchCurated(parseInt(spaceId))
        const entries = await Promise.all(items.map(async (item: any) => {
            return (await request('https://mirror-api.com/graphql', queryEntry, {
                digest: item.cid
            }).then((data) => { return ({ entry: data.entry as EntryType, staked: item.staked as number, totalStaked: item?.totalStaked as number | undefined, lastStakeTimestamp: item?.lastStakeTimestamp as string | undefined }) }
            ).catch(() => { return undefined })
            )
        }))
        const entriesFiltered: { entry: EntryType, staked: number, totalStaked?: number, lastStakeTimestamp?: string }[] = entries.filter(function (element): element is { entry: EntryType, staked: number, totalStaked: number, lastStakeTimestamp: string } {
            return element !== undefined;
        });
        return entriesFiltered;
    }
})


type StakingSelectedItem = {
    isOpen: boolean;
    type: 'stake' | 'unstake'
    item: { entry: EntryType, staked: number };
    lastStakeTimestamp?: string;
    space: SpaceType;
}


export const stakeSelectedItem = atom({
    key: 'stakeSelectedItem',
    default: null as StakingSelectedItem | null,
})